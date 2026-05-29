import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
	HandledError,
	isCommandErrorResponse,
	isCommandResponse,
	isCommandSuccessResponse,
	PuristaSpanName,
	StatusCode,
	UnhandledError,
} from '@purista/core'

import { deserializeOtpFromMqtt } from '../deserializeOtpFromMqtt.impl.js'
import type { IncomingMessageFunction } from '../types/IncomingMessageFunction.js'

/**
 * Handles MQTT command responses for pending invocations.
 *
 * The handler resolves or rejects the pending invocation by correlation data or
 * message correlation id. Late responses are ignored with a warning.
 */
export const handleCommandResponse: IncomingMessageFunction = async function (message, packet) {
	const context = deserializeOtpFromMqtt(this.logger, message, packet.properties?.userProperties)
	return this.startActiveSpan(
		PuristaSpanName.EventBridgeCommandResponseReceived,
		{ kind: SpanKind.CONSUMER },
		context,
		async span => {
			const log = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: message.traceId })

			if (message.eventName) {
				span.addEvent(message.eventName)
			}

			if (!isCommandResponse(message)) {
				const err = new UnhandledError(StatusCode.InternalServerError, 'the received message is not a command')
				log.error({ err }, err.message)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				span.recordException(err)
				return
			}

			const correlationId = packet.properties?.correlationData?.toString() ?? message.correlationId

			const result = isCommandSuccessResponse(message)
				? this.pendingInvocations.resolve(correlationId, message.payload)
				: this.pendingInvocations.reject(
						correlationId,
						message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message),
					)

			if (result !== 'resolved' && result !== 'rejected') {
				if (result === 'late') {
					log.warn({ correlationId }, 'Ignoring late command response after invocation timeout')
					return
				}
				const err = new UnhandledError(
					StatusCode.InternalServerError,
					`received response with invalid correlationId ${correlationId}`,
				)
				log.error({ err }, err.message)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				span.recordException(err)
				return
			}

			if (isCommandErrorResponse(message)) {
				const error = message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message)
				log.error({ err: error }, error.message)
				span.recordException(error)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: error.message,
				})
			}
		},
	)
}
