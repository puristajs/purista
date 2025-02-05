import type { ParsedUrlQuery } from 'node:querystring'
import { parse } from 'node:querystring'

import { SpanKind, SpanStatusCode, context, propagation } from '@opentelemetry/api'
import { ATTR_URL_FULL } from '@opentelemetry/semantic-conventions'

import { ATTR_HTTP_HOST, ATTR_HTTP_METHOD, ATTR_HTTP_STATUS_CODE } from '@opentelemetry/semantic-conventions/incubating'

import type {
	Command,
	CommandErrorResponse,
	CommandSuccessResponse,
	DefinitionEventBridgeConfig,
	EBMessageAddress,
	HttpExposedServiceMeta,
} from '@purista/core'
import {
	EBMessageType,
	HandledError,
	PuristaSpanName,
	StatusCode,
	UnhandledError,
	getErrorMessageForCode,
	getTimeoutPromise,
	isCommandErrorResponse,
	serializeOtp,
} from '@purista/core'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import type { HttpEventBridge } from './HttpEventBridge.impl.js'
import type { HttpEventBridgeConfig, RouterFunction } from './types/index.js'

export const getCommandHandlerRestApi = function (
	this: HttpEventBridge<HttpEventBridgeConfig>,
	address: EBMessageAddress,
	cb: (
		message: Command,
	) => Promise<
		Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
	>,
	metadata: HttpExposedServiceMeta,
	_eventBridgeConfig: DefinitionEventBridgeConfig,
): RouterFunction {
	const handler: RouterFunction = async c => {
		const parentContext = propagation.extract(context.active(), c.req.raw.headers)

		return await this.startActiveSpan(
			PuristaSpanName.KubernetesHttpRequest,
			{ kind: SpanKind.CONSUMER },
			parentContext,
			async span => {
				const hostname = process.env.HOSTNAME ?? 'unknown'
				span.setAttribute(ATTR_URL_FULL, c.req.url || '')
				span.setAttribute(ATTR_HTTP_METHOD, c.req.method || '')
				span.setAttribute(ATTR_HTTP_HOST, hostname)

				try {
					const queryParams: ParsedUrlQuery = {}

					// allow only defined parameters
					if (metadata.expose.http.openApi?.query) {
						const parsedQueries = parse(c.req.url || '')
						for (const qp of metadata.expose.http.openApi.query) {
							queryParams[qp.name] = parsedQueries[qp.name]
							if (qp.required && !parsedQueries[qp.name]) {
								throw new HandledError(StatusCode.BadRequest, `query parameter ${qp.name} is required`)
							}
						}
					}

					let body: unknown
					if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
						const contentType = metadata.expose.contentTypeRequest ?? 'application/json'

						body = contentType.toLowerCase() === 'application/json' ? await c.req.json() : await c.req.text()
					}

					const parameter = c.req.param

					const command: Command = {
						id: '',
						messageType: EBMessageType.Command,
						correlationId: '',
						timestamp: Date.now(),
						contentType: metadata.expose.contentTypeResponse ?? 'application/json',
						contentEncoding: metadata.expose.contentEncodingResponse ?? 'utf-8',
						otp: serializeOtp(),
						receiver: {
							...address,
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
								...parameter,
							},
						},
					}

					const result = await getTimeoutPromise(cb(command), this.config.defaultCommandTimeout)

					if (isCommandErrorResponse(result)) {
						const status = result.payload.status

						span.setAttribute(ATTR_HTTP_STATUS_CODE, status)

						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: result.payload.message,
						})

						span.end()
						return c.json(result.payload, status as any)
					}

					if (result.eventName) {
						await this.emitMessage(result)
					}

					// empty response
					if (result.payload === undefined || result.payload === '') {
						const status = StatusCode.NoContent
						span.setAttribute(ATTR_HTTP_STATUS_CODE, status)

						span.end()
						return new Response(undefined, {
							status,
							statusText: getErrorMessageForCode(status),
							headers: {
								'content-type': `${metadata.expose.contentTypeResponse} || 'application/json'; charset=${
									metadata.expose.contentEncodingResponse ?? 'utf-8'
								}`,
							},
						})
					}

					span.setAttribute(ATTR_HTTP_STATUS_CODE, StatusCode.OK)

					let payload = ''
					if (typeof result.payload === 'string') {
						payload = result.payload
					} else {
						payload = JSON.stringify(result.payload)
					}

					const status = StatusCode.OK

					span.end()
					return new Response(JSON.stringify(payload), {
						status,
						statusText: getErrorMessageForCode(status),
						headers: {
							'content-type': `${metadata.expose.contentTypeResponse} || 'application/json'; charset=${
								metadata.expose.contentEncodingResponse ?? 'utf-8'
							}`,
						},
					})
				} catch (error) {
					const err =
						error instanceof HandledError || error instanceof UnhandledError ? error : UnhandledError.fromError(error)

					this.logger.error({ err }, err.message)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})

					span.recordException(err)
					const status = err.errorCode
					span.end()

					return c.json(err.getErrorResponse(), status as ContentfulStatusCode)
				}
			},
		)
	}

	return handler
}
