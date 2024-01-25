import { posix } from 'node:path'

import type { Context } from '@opentelemetry/api'
import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  convertToSnakeCase,
  EBMessageType,
  getNewTraceId,
  HandledError,
  isHttpExposedServiceMeta,
  StatusCode,
  UnhandledError,
} from '@purista/core'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Methods } from 'trouter'

import { httpServerV1ServiceBuilder } from '../../httpServerV1ServiceBuilder.js'
import { addHeaders } from './helper/index.js'

export const serviceCommandsToRestApiSubscriptionBuilder = httpServerV1ServiceBuilder
  .getSubscriptionBuilder(
    'serviceCommandsToRestApi',
    'listens for InfoMessages and adds endpoints for commands if they are configured to be exposed as http endpoint',
  )
  .adviceDurable(false)
  .adviceAutoacknowledgeMessage()
  .filterForMessageType(EBMessageType.InfoServiceFunctionAdded)
  .receiveMessageOnEveryInstance()
  .setSubscriptionFunction(async function ({ logger, message }, payload) {
    if (!isHttpExposedServiceMeta(payload)) {
      logger.debug('...skip exposing function')
      return
    }

    this.routeDefinitions.push(payload)

    const data = payload.expose
    const version = message.sender.serviceVersion
    const serviceName = message.sender.serviceName
    const method = data.http.method
    const apiMountPath = this.config.apiMountPath
    const url = posix.join(apiMountPath || '/api', `v${version}`, data.http.path)

    data.http.path = url

    if (data.http.openApi) {
      data.http.openApi.operationId = convertToSnakeCase(`${serviceName}_v${version}_${data.http.openApi.operationId}`)
    }

    const contentType = data.contentTypeResponse || 'application/json'
    const contentEncoding = data.contentEncodingResponse || 'utf-8'

    const getHandler = () => {
      return async (request: FastifyRequest, reply: FastifyReply, parameter: Record<string, unknown>) => {
        let parentContext: Context | undefined

        if (request.headers['traceparent']) {
          let traceparent: string
          if (Array.isArray(request.headers['traceparent'])) {
            traceparent = request.headers['traceparent'][0] as string
          } else {
            traceparent = request.headers['traceparent']
          }

          if (traceparent.trim().length) {
            parentContext = propagation.extract(context.active(), request.headers)
          }
        }

        return this.startActiveSpan('handler', { kind: SpanKind.SERVER }, parentContext, async (span) => {
          try {
            addHeaders(span, reply)
            const fastifyParams = request.params as Record<string, unknown>
            delete fastifyParams['*']

            const queryParams: Record<string, unknown> = {}

            // only allow defined query parameters and check if they are required
            const queries = request.query as Record<string, unknown>
            if (data.http.openApi?.query) {
              data.http.openApi.query.forEach((qp) => {
                queryParams[qp.name] = queries[qp.name]
                if (qp.required && !queries[qp.name]) {
                  throw new HandledError(StatusCode.BadRequest, `query parameter ${qp.name} is required`)
                }
              })
            }

            const parameterExtended = {
              ...queryParams,
              ...fastifyParams,
              ...parameter,
            }

            const principalId = request.principalId
            const tenantId = request.tenantId

            let traceId: string | undefined

            const headerTraceId = request.headers[this.config.traceHeaderField]
            if (Array.isArray(headerTraceId)) {
              traceId = headerTraceId[0]
            } else {
              traceId = headerTraceId
            }

            const response = await this.invoke(
              {
                traceId,
                receiver: {
                  serviceName: message.sender.serviceName,
                  serviceVersion: message.sender.serviceVersion,
                  serviceTarget: message.sender.serviceTarget,
                },
                payload: { payload: request.body, parameter: parameterExtended },
                principalId,
                tenantId,
                contentType,
                contentEncoding,
              },
              `${method}:${url}`,
            )

            const beforeResponse = this.beforeResponse.find(request.method as Methods, request.url)

            for (const hook of beforeResponse.handlers) {
              await this.startActiveSpan('beforeResponseHook', { kind: SpanKind.SERVER }, undefined, async (_span) => {
                hook(response, request, reply, beforeResponse.params)
              })
            }

            reply.header('content-type', `${contentType}; charset=${contentEncoding}`)
            if (response === undefined || response === '') {
              span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)
              reply.statusCode = StatusCode.NoContent
            }

            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.OK)

            reply.send(response)
          } catch (err) {
            reply.header('content-type', 'application/json; charset=utf-8')

            if (err instanceof HandledError) {
              reply.statusCode = err.errorCode
              reply.send(err.getErrorResponse())
              return
            }
            const unhandledError = new UnhandledError()

            span.recordException(err as Error)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: (err as Error).message,
            })
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, unhandledError.errorCode)

            logger.error({ err, ...span.spanContext() }, 'unhandled error')

            reply.statusCode = unhandledError.errorCode
            reply.send(unhandledError.getErrorResponse())
          }
        })
      }
    }

    this.routes.add(method, url, getHandler())

    logger.debug({ method, url }, 'add handler')
  })
