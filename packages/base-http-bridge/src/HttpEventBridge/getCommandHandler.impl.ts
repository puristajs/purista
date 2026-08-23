// file deepcode ignore ServerLeak: <please specify a reason of ignoring this>

import { context, propagation, SpanKind } from '@opentelemetry/api'
import {
	ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_RESPONSE_STATUS_CODE,
	ATTR_SERVER_ADDRESS,
	ATTR_URL_FULL,
} from '@opentelemetry/semantic-conventions'

import type {
	Command,
	CommandErrorResponse,
	CommandSuccessResponse,
	DefinitionEventBridgeConfig,
	EBMessageAddress,
	HttpExposedServiceMeta,
} from '@purista/core/adapter'
import {
	getTimeoutPromise,
	HandledError,
	PuristaSpanName,
	StatusCode,
	serializeOtp,
	throwIfNotValidMessage,
	UnhandledError,
} from '@purista/core/adapter'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

import { parseCloudEventData } from './parseCloudEventData.impl.js'
import type { IHttpEventBridge } from './types/IHttpEventBridge.js'
import type { RouterFunction } from './types/RouterFunction.js'

/**
 * Creates the internal command route handler for full PURISTA command envelopes.
 *
 * The handler accepts POST requests only, optionally unwraps CloudEvents, runs
 * the registered command callback with the bridge timeout, and returns the full
 * command response envelope.
 */
export const getCommandHandler = function (
	this: IHttpEventBridge,
	_address: EBMessageAddress,
	cb: (
		message: Command,
	) => Promise<
		Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
	>,
	_metadata: HttpExposedServiceMeta,
	_eventBridgeConfig: DefinitionEventBridgeConfig,
	wrappedInCloudEvent = false,
): RouterFunction {
	const handler: RouterFunction = async c => {
		const parentContext = propagation.extract(context.active(), c.req.raw.headers)

		this.logger.info({ headers: c.req.raw.headers }, 'command handler headers')

		return await this.startActiveSpan(
			PuristaSpanName.EventBridgeCommandReceived,
			{ kind: SpanKind.CONSUMER },
			parentContext,
			async span => {
				const hostname = process.env.HOSTNAME ?? 'unknown'
				span.setAttribute(ATTR_URL_FULL, c.req.url || '')
				span.setAttribute(ATTR_HTTP_REQUEST_METHOD, c.req.method || '')
				span.setAttribute(ATTR_SERVER_ADDRESS, hostname)

				try {
					if (c.req.method !== 'POST') {
						throw new UnhandledError(StatusCode.MethodNotAllowed, `Unsupported method ${c.req.method}`)
					}

					let message: Command

					if (wrappedInCloudEvent) {
						const body = await c.req.text()
						const headers = [...c.req.raw.headers.entries()].reduce((prev: Record<string, string>, val) => {
							// biome-ignore lint/performance/noAccumulatingSpread: ok here
							return { ...prev, [val[0]]: val[1] }
						}, {})

						message = parseCloudEventData<Command>({ headers, body })
					} else {
						try {
							message = await c.req.json()
						} catch (error) {
							throw HandledError.fromError(error, StatusCode.BadRequest, 'payload must be a parsable json')
						}
					}

					throwIfNotValidMessage(message)

					message.otp = serializeOtp()

					const msg = await getTimeoutPromise(cb(message), this.config.defaultCommandTimeout)

					if (msg.eventName) {
						await this.emitMessage(msg)
					}

					// empty response
					if (msg.payload === undefined || msg.payload === null || msg.payload === '') {
						const status = StatusCode.NoContent

						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, status)

						c.status(status)
						return c.body(null)
					}

					const status = StatusCode.OK
					return c.json(msg, status as ContentfulStatusCode)
				} catch (error) {
					const err = error instanceof UnhandledError ? error : UnhandledError.fromError(error)
					span.recordException(err)
					this.logger.error({ err }, err.message)

					return c.json(err.getErrorResponse(), err.errorCode as ContentfulStatusCode)
				}
			},
		)
	}

	return handler
}
