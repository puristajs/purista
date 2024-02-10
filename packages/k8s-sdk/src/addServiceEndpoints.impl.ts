import { posix } from 'node:path'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import type { Command, HttpExposedServiceMeta, Logger, Service } from '@purista/core'
import {
  EBMessageType,
  HandledError,
  isCommandErrorResponse,
  isHttpExposedServiceMeta,
  PuristaSpanName,
  serializeOtp,
  StatusCode,
  UnhandledError,
} from '@purista/core'
import type { Context as HonoContext, Hono } from 'hono'
import type { StatusCode as HonoStatusCode } from 'hono/utils/http-status'

/**
 *
 * @param services instance of the service to add
 * @param router the TRouter instance
 * @param logger the logger used for logging the addition
 * @param apiMountPath @default /api
 * @returns
 */
export const addServiceEndpoints = (
  services: Service | Service[] | undefined,
  app: Hono,
  logger: Logger,
  apiMountPath = '/api',
) => {
  if (!services) {
    return
  }

  const exposedServices = Array.isArray(services) ? services : [services]
  exposedServices.forEach((service) => {
    service.commandDefinitionList.forEach((definition) => {
      const metadata = definition.metadata as HttpExposedServiceMeta
      if (!isHttpExposedServiceMeta(metadata)) {
        logger.debug('...skip exposing function')
        return
      }

      const data = metadata.expose
      const serviceVersion = service.info.serviceVersion
      const method = metadata.expose.http.method
      const url = posix.join(apiMountPath || '/api', `v${serviceVersion}`, data.http.path)

      const handler = async (c: HonoContext) => {
        const parentContext = propagation.extract(context.active(), c.req.raw.headers)

        return await service
          .getTracer('PURISTA_k8s_http_server')
          .startActiveSpan(
            PuristaSpanName.KubernetesHttpRequest,
            { kind: SpanKind.SERVER },
            parentContext,
            async (span) => {
              const hostname = process.env.HOSTNAME || 'unknown'

              span.setAttribute(SemanticAttributes.HTTP_URL, c.req.url || '')
              span.setAttribute(SemanticAttributes.HTTP_METHOD, c.req.method || '')
              span.setAttribute(SemanticAttributes.HTTP_HOST, hostname)

              try {
                const queryParams: Record<string, string | undefined> = {}

                // allow only defined parameters
                if (metadata.expose.http.openApi?.query) {
                  const parsedQueries = c.req.query()
                  metadata.expose.http.openApi.query.forEach((qp) => {
                    queryParams[qp.name] = parsedQueries[qp.name]
                    if (qp.required && !parsedQueries[qp.name]) {
                      throw new HandledError(StatusCode.BadRequest, `query parameter ${qp.name} is required`)
                    }
                  })
                }

                let body
                if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
                  body = await c.req.json()
                }

                const command: Command = {
                  id: '',
                  messageType: EBMessageType.Command,
                  correlationId: '',
                  timestamp: Date.now(),
                  contentType: definition.metadata.expose.contentTypeResponse || 'application/json',
                  contentEncoding: definition.metadata.expose.contentEncodingResponse || 'utf-8',
                  otp: serializeOtp(),
                  receiver: {
                    serviceName: service.info.serviceName,
                    serviceVersion: service.info.serviceVersion,
                    serviceTarget: definition.commandName,
                  },
                  sender: {
                    serviceName: '',
                    serviceVersion: '',
                    serviceTarget: '',
                    instanceId: '',
                  },
                  payload: {
                    payload: body,
                    parameter: {
                      ...queryParams,
                      parameter: c.req.param(),
                    },
                  },
                }

                const result = await service.executeCommand(command)

                if (isCommandErrorResponse(result)) {
                  span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, result.payload.status)

                  span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: result.payload.message,
                  })

                  const response = c.json(result.payload, result.payload.status as any)
                  span.end()
                  return response
                }

                const header: Record<string, string> = {
                  'content-type': `${metadata.expose.contentTypeResponse || 'application/json'}; charset=${
                    metadata.expose.contentEncodingResponse || 'utf-8'
                  }`,
                }

                propagation.inject(context.active(), header)

                // empty response
                if (result.payload === undefined || result.payload === '') {
                  span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)
                  span.end()

                  c.status(StatusCode.NoContent)
                  Object.values(header).forEach((val) => c.header(val[0] as string, val[1]))
                  return c.body(null)
                }

                span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.OK)

                const response =
                  result.contentType !== 'application/json'
                    ? c.text(result.payload as string, StatusCode.OK, header)
                    : c.json(result.payload, StatusCode.OK, header)

                span.end()
                return response
              } catch (error) {
                const err =
                  error instanceof HandledError || error instanceof UnhandledError
                    ? error
                    : UnhandledError.fromError(error)

                logger.error({ err, ...span.spanContext() }, err.message)

                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: err.message,
                })

                span.recordException(err)

                const header: Record<string, string> = {
                  'content-type': `${metadata.expose.contentTypeResponse || 'application/json'}; charset=${
                    metadata.expose.contentEncodingResponse || 'utf-8'
                  }`,
                }

                propagation.inject(context.active(), header)

                const response = c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode, header)
                span.end()
                return response
              }
            },
          )
      }

      logger.debug({ method, url }, `adding ${url}`)
      switch (method) {
        case 'GET':
          app.get(url, handler)
          break
        case 'POST':
          app.post(url, handler)
          break
        case 'PATCH':
          app.patch(url, handler)
          break
        case 'PUT':
          app.put(url, handler)
          break
        case 'DELETE':
          app.delete(url, handler)
          break
        default:
          break
      }
    })
  })
}
