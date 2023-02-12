import posix from 'node:path/posix'

import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  EBMessageType,
  HandledError,
  HttpExposedServiceMeta,
  InfoServiceFunctionAdded,
  isHttpExposedServiceMeta,
  StatusCode,
  SubscriptionDefinitionBuilder,
  UnhandledError,
} from '@purista/core'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { Methods } from 'trouter'

import { addHeaders } from '../../helper/addHeaders.impl'
import { HttpServerService } from '../../HttpServerService.impl'

export default new SubscriptionDefinitionBuilder<HttpServerService, InfoServiceFunctionAdded, HttpExposedServiceMeta>(
  'serviceCommandsToRestApi',
  'listen for InfoServiceFunctionAdded messages and adds endpoints for service functions if needed',
)
  .setFunction(async function ({ logger, message }, payload) {
    if (!isHttpExposedServiceMeta(payload)) {
      logger.debug('...skip exposing function')
      return
    }

    this.routeDefinitions.push(payload)

    const data = payload.expose
    const version = message.sender.serviceVersion
    const method = data.http.method
    const apiMountPath = this.config.apiMountPath
    const url = posix.join(apiMountPath || '/api', `v${version}`, data.http.path)

    data.http.path = url

    const contentType = data.http.contentTypeResponse || 'application/json; charset=utf-8'

    const getHandler = () => {
      return async (request: FastifyRequest, reply: FastifyReply, parameter: Record<string, unknown>) => {
        return this.startActiveSpan('handler', { kind: SpanKind.SERVER }, undefined, async (span) => {
          try {
            addHeaders(span, reply)
            const fastifyParams = request.params as Record<string, unknown>
            delete fastifyParams['*']

            const parameterExtended = {
              ...(request.query as Record<string, unknown>),
              ...fastifyParams,
              ...parameter,
            }

            const principalId = request.principalId

            const response = await this.invoke(
              {
                traceId: span.spanContext().traceId,
                receiver: message.sender,
                payload: { payload: request.body, parameter: parameterExtended },
                principalId,
              },
              `${method}:${url}`,
            )

            const beforeResponse = this.beforeResponse.find(request.method as Methods, request.url)

            for (const hook of beforeResponse.handlers) {
              await this.startActiveSpan('beforeResponseHook', { kind: SpanKind.SERVER }, undefined, async (_span) => {
                hook(response, request, reply, beforeResponse.params)
              })
            }

            reply.header('content-type', contentType)
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

            logger.error({ err, ...span.spanContext() }, 'handler error')

            reply.statusCode = unhandledError.errorCode
            reply.send(unhandledError.getErrorResponse())
          }
        })
      }
    }

    this.routes.add(method, url, getHandler())

    logger.debug({ method, url }, 'add handler')
  })
  .addMessageType(EBMessageType.InfoServiceFunctionAdded)
