import { IncomingMessage, ServerResponse } from 'node:http'
import { posix } from 'node:path'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  Command,
  EBMessageType,
  HandledError,
  HttpExposedServiceMeta,
  isCommandErrorResponse,
  isHttpExposedServiceMeta,
  Logger,
  PuristaSpanName,
  serializeOtp,
  type Service,
  StatusCode,
  UnhandledError,
} from '@purista/core'
import qs, { ParsedQs } from 'qs'
import Trouter from 'trouter'

import { RouterFunction } from './getHttpServer.impl'

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
  router: Trouter,
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

      logger.debug(`adding ${url}`)

      const handler: RouterFunction = async (
        request: IncomingMessage,
        response: ServerResponse,
        parameter: Record<string, unknown>,
      ) => {
        const parentContext = propagation.extract(context.active(), request.headers)

        await service
          .getTracer('PURISTA_k8s_http_server')
          .startActiveSpan(
            PuristaSpanName.KubernetesHttpRequest,
            { kind: SpanKind.SERVER },
            parentContext,
            async (span) => {
              const hostname = process.env.HOSTNAME || 'unknown'

              span.setAttribute(SemanticAttributes.HTTP_URL, request.url || '')
              span.setAttribute(SemanticAttributes.HTTP_METHOD, request.method || '')
              span.setAttribute(SemanticAttributes.HTTP_HOST, hostname)

              try {
                const queryParams: ParsedQs = {}

                // allow only defined parameters
                if (metadata.expose.http.openApi?.query) {
                  const parsedQueries = qs.parse(request.url || '')
                  metadata.expose.http.openApi.query.forEach((qp) => {
                    queryParams[qp.name] = parsedQueries[qp.name]
                    if (qp.required && !parsedQueries[qp.name]) {
                      throw new HandledError(StatusCode.BadRequest, `query parameter ${qp.name} is required`)
                    }
                  })
                }

                let body
                if (request.method === 'POST') {
                  const buffers = []

                  for await (const chunk of request) {
                    buffers.push(chunk)
                  }

                  body = JSON.parse(Buffer.concat(buffers).toString())
                }

                const command: Command = {
                  id: '',
                  messageType: EBMessageType.Command,
                  instanceId: '',
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
                  },
                  payload: {
                    payload: body,
                    parameter: {
                      ...queryParams,
                      ...parameter,
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

                  response.statusCode = result.payload.status
                  response.setHeader('content-type', 'application/json; charset=utf-8')
                  response.write(JSON.stringify(result.payload), (err) => {
                    if (err) {
                      span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: err.message,
                      })
                      span.recordException(err)

                      logger.error({ err, ...span.spanContext() }, err.message)
                    }
                  })
                  response.end()
                  span.end()
                  return
                }

                // empty response
                if (result.payload === undefined || result.payload === '') {
                  response.statusCode = StatusCode.NoContent
                  span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)

                  response.end()
                  span.end()
                  return
                }

                span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.OK)

                let payload = ''
                if (typeof result.payload === 'string') {
                  payload = result.payload
                } else {
                  payload = JSON.stringify(result.payload)
                }

                response.statusCode = StatusCode.OK
                response.write(payload, (err) => {
                  if (err) {
                    span.setStatus({
                      code: SpanStatusCode.ERROR,
                      message: err.message,
                    })
                    span.recordException(err)
                    logger.error({ err, ...span.spanContext() }, err.message)
                  }
                })

                response.end()
                span.end()
              } catch (error) {
                const err =
                  error instanceof HandledError || error instanceof UnhandledError
                    ? error
                    : UnhandledError.fromError(error)

                logger.error({ err }, err.message)
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: err.message,
                })

                span.recordException(err)

                response.statusCode = err.errorCode
                response.setHeader('content-type', 'application/json; charset=utf-8')
                // deepcode ignore ServerLeak: <please specify a reason of ignoring this>
                response.write(JSON.stringify(err.getErrorResponse()), (err) => {
                  if (err) {
                    logger.error({ err, ...span.spanContext() }, err.message)
                  }
                })
                response.end()
                span.end()
              }
            },
          )
      }

      router.add(method, url, handler)
    })
  })
}
