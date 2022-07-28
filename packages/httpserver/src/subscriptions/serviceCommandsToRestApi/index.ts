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
import type { FastifyReply, FastifyRequest } from 'fastify'
import posix from 'node:path/posix'

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

    const contentType = data.http.contentType || 'application/json; charset=utf-8'

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
          const response = await this.invoke(
            {
              traceId,
              receiver: message.sender,
              payload: { payload: request.body, parameter },
            },
            `${method}:${url}`,
          )
          reply.header('content-type', contentType)

          reply.send(response)
        } catch (err) {
          reply.header('content-type', 'application/json; charset=utf-8')

          if (err instanceof HandledError || err instanceof UnhandledError) {
            reply.send(err.getErrorResponse())
          }
          reply.send(new UnhandledError().getErrorResponse())
        }
      }
    }

    this.routes.add(method, url, getHandler())

    logger.debug('add ', method, url)
  })
  .addMessageType(EBMessageType.InfoServiceFunctionAdded)
