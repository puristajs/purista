import {
  EBMessageType,
  getNewTraceId,
  HandledError,
  HttpExposedServiceMeta,
  InfoServiceFunctionAdded,
  isHttpExposedServiceMeta,
  StatusCode,
  SubscriptionDefinitionBuilder,
  UnhandledError,
} from '@purista/core'
import type { FastifyReply, FastifyRequest } from 'fastify'
import posix from 'node:path/posix'
import { Methods } from 'trouter'

import { extractHeaderValue } from '../../helper'
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
      return async (request: FastifyRequest, reply: FastifyReply, params: Record<string, unknown>) => {
        try {
          const fastifyParams = request.params as Record<string, unknown>

          delete fastifyParams['*']

          const parameter = {
            ...(request.query as Record<string, unknown>),
            ...fastifyParams,
            ...params,
          }
          const traceId = extractHeaderValue(
            request.headers,
            this.config.fastify.requestIdHeader || 'x-trace-id',
            getNewTraceId(),
          )

          reply.header(this.config.fastify.requestIdHeader || 'x-trace-id', traceId)

          const principalId = request.principalId

          const response = await this.invoke(
            {
              traceId,
              receiver: message.sender,
              payload: { payload: request.body, parameter },
              principalId,
            },
            `${method}:${url}`,
          )

          const beforeResponse = this.beforeResponse.find(request.method as Methods, request.url)
          beforeResponse.handlers.forEach((hook) => {
            hook(response, request, reply, beforeResponse.params)
          })

          reply.header('content-type', contentType)
          if (response === undefined || response === '') {
            reply.statusCode = StatusCode.NoContent
          }
          reply.send(response)
        } catch (error) {
          reply.header('content-type', 'application/json; charset=utf-8')

          if (error instanceof HandledError) {
            reply.statusCode = err.errorCode
            reply.send(error.getErrorResponse())
            return
          }

          logger.error({ error }, 'handler error')
          const unhandledError = new UnhandledError()
          reply.statusCode = unhandledError.errorCode
          reply.send(unhandledError.getErrorResponse())
        }
      }
    }

    this.routes.add(method, url, getHandler())

    logger.debug({ method, url }, 'add handler')
  })
  .addMessageType(EBMessageType.InfoServiceFunctionAdded)
