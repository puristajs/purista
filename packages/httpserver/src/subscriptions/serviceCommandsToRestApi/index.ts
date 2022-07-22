import {
  EBMessageType,
  getNewTraceId,
  HandledError,
  HttpExposedServiceMeta,
  InfoServiceFunctionAdded,
  isHttpExposedServiceMeta,
  SubscriptionDefinitionBuilder,
  UnhandledError,
} from '@purista/core'
import type { RouteHandlerMethod } from 'fastify'
import posix from 'node:path/posix'

import { extractHeaderValue } from '../../helper'
import { HttpServerService } from '../../HttpServerService.impl'

export default new SubscriptionDefinitionBuilder<HttpServerService, InfoServiceFunctionAdded, HttpExposedServiceMeta>(
  'serviceCommandsToRestApi',
  'listen for InfoServiceFunctionAdded messages and adds endpoints for service functions if needed',
  async function ({ logger, message }, payload) {
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

    const contentType = data.http.contentType || 'application/json; charset=utf-8'

    const getHandler = (): RouteHandlerMethod => {
      const handler: RouteHandlerMethod = async (request, reply) => {
        try {
          const parameter = {
            ...(request.query as Record<string, unknown>),
            ...(request.params as Record<string, unknown>),
          }
          const traceId = extractHeaderValue(
            request.headers,
            this.config.fastify.requestIdHeader || 'x-trace-id',
            getNewTraceId(),
          )
          const response = await this.invoke(
            {
              traceId,
              receiver: message.sender,
              payload: { payload: request.body, parameter },
            },
            `${method}:${url}`,
          )
          reply.header('content-type', contentType)

          return response
        } catch (err) {
          reply.header('content-type', 'application/json; charset=utf-8')

          if (err instanceof HandledError || err instanceof UnhandledError) {
            return err.getErrorResponse()
          }
          return new UnhandledError().getErrorResponse()
        }
      }

      return handler
    }

    this.server?.route({
      method,
      url,
      handler: getHandler(),
    })

    logger.debug('add ', method, url)
  },
).addMessageType(EBMessageType.InfoServiceFunctionAdded)
