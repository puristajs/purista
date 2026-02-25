import { posix } from 'node:path'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { ATTR_HTTP_RESPONSE_STATUS_CODE } from '@opentelemetry/semantic-conventions'
import {
	convertToSnakeCase,
	EBMessageType,
	HandledError,
	isHttpExposedServiceMeta,
	QueueEnqueueResult,
	StatusCode,
	UnhandledError,
} from '@purista/core'
import type { HttpExposedServiceMeta } from '@purista/core'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Methods } from 'trouter'

import { httpServerV1ServiceBuilder } from '../../httpServerV1ServiceBuilder.js'
import { addHeaders } from './helper/addHeaders.impl.js'

const assertAsyncHttpResult = (result: unknown): QueueEnqueueResult => {
	if (!result || typeof result !== 'object') {
		throw new UnhandledError(StatusCode.InternalServerError, 'Async endpoint must return queue enqueue result')
	}
	const candidate = result as Partial<QueueEnqueueResult>
	if (typeof candidate.jobId !== 'string' || typeof candidate.queueName !== 'string') {
		throw new UnhandledError(StatusCode.InternalServerError, 'Async endpoint must return queue enqueue result')
	}
	return {
		jobId: candidate.jobId,
		queueName: candidate.queueName,
		scheduledAt: candidate.scheduledAt,
	}
}

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

		const httpMetadata = payload as HttpExposedServiceMeta
		const data = httpMetadata.expose
		const version = message.sender.serviceVersion
		const serviceName = message.sender.serviceName
		const method = data.http.method
		const apiMountPath = this.config.apiMountPath
		const url = posix.join(apiMountPath ?? '/api', `v${version}`, data.http.path)

		data.http.path = url

		if (data.http.openApi) {
			data.http.openApi.operationId = convertToSnakeCase(`${serviceName}_v${version}_${data.http.openApi.operationId}`)
		}

		const requestContentType = data.contentTypeRequest ?? 'application/json'
		const requestContentEncoding = data.contentEncodingRequest ?? 'utf-8'
		const responseContentType = data.contentTypeResponse ?? 'application/json'
		const responseContentEncoding = data.contentEncodingResponse ?? 'utf-8'
		const isStreamEndpoint = responseContentType.toLowerCase() === 'text/event-stream'

		const getHandler = () => {
			return async (request: FastifyRequest, reply: FastifyReply, parameter: Record<string, unknown>) => {
				const parentContext = propagation.extract(context.active(), request.headers)

				return this.startActiveSpan('handler', { kind: SpanKind.SERVER }, parentContext, async span => {
					try {
						addHeaders(span, reply)
						const fastifyParams = request.params as Record<string, unknown>
						fastifyParams['*'] = undefined

						const queryParams: Record<string, unknown> = {}

						// only allow defined query parameters and check if they are required
						const queries = request.query as Record<string, unknown>
						if (data.http.openApi?.query) {
							for (const qp of data.http.openApi.query) {
								const queryName = String(qp.name)
								const queryValue = queries[queryName]
								queryParams[queryName] = queryValue
								if (qp.required && (queryValue === undefined || queryValue === null || queryValue === '')) {
									throw new HandledError(StatusCode.BadRequest, `query parameter ${qp.name} is required`)
								}
							}
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

						if (isStreamEndpoint) {
							const streamHandle = await this.openStream(
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
									contentType: requestContentType,
									contentEncoding: requestContentEncoding,
								},
								`${method}:${url}`,
							)

							reply.hijack()
							reply.raw.setHeader('content-type', `${responseContentType}; charset=${responseContentEncoding}`)
							reply.raw.setHeader('cache-control', 'no-cache, no-transform')
							reply.raw.setHeader('connection', 'keep-alive')

							const abortStream = async () => {
								await streamHandle.cancel('client disconnected')
							}
							request.raw.once('close', () => {
								void abortStream()
							})

							for await (const frame of streamHandle) {
								reply.raw.write(`event: ${frame.payload.frameType}\n`)
								reply.raw.write(`data: ${JSON.stringify(frame.payload)}\n\n`)
							}
							reply.raw.end()
							return
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
								contentType: requestContentType,
								contentEncoding: requestContentEncoding,
							},
							`${method}:${url}`,
						)

						const beforeResponse = this.beforeResponse.find(request.method as Methods, request.url)
						let responsePayload: unknown = response
						let statusCode = StatusCode.OK

						const httpMode = (data.http as { mode?: 'sync' | 'async' }).mode ?? 'sync'

						if (httpMode === 'async') {
							const job = assertAsyncHttpResult(response)
							responsePayload = {
								jobId: job.jobId,
								queue: job.queueName,
								queueName: job.queueName,
								scheduledAt: job.scheduledAt,
							}
							statusCode = StatusCode.Accepted
						} else if (response === undefined || response === null || response === '') {
							statusCode = StatusCode.NoContent
						}

						for (const hook of beforeResponse.handlers) {
							await this.startActiveSpan('beforeResponseHook', { kind: SpanKind.SERVER }, undefined, async _span => {
								hook(responsePayload, request, reply, beforeResponse.params)
							})
						}

						reply.header('content-type', `${responseContentType}; charset=${responseContentEncoding}`)
						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, statusCode)

						if (statusCode === StatusCode.NoContent) {
							reply.statusCode = StatusCode.NoContent
							reply.send()
							return
						}

						reply.statusCode = statusCode
						reply.send(responsePayload)
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
						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, unhandledError.errorCode)

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
