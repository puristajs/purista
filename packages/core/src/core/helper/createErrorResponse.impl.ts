import { HandledError } from '../Error/HandledError.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { Command } from '../types/commandType/Command.js'
import type { CommandErrorResponse } from '../types/commandType/CommandErrorResponse.js'
import { EBMessageType } from '../types/EBMessageType.enum.js'
import type { InstanceId } from '../types/InstanceId.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { TraceId } from '../types/TraceId.js'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl.js'
import { getNewTraceId } from './getNewTraceId.impl.js'
import { serializeOtp } from './serializeOtp.impl.js'

/**
 * Creates a error response object based on original command
 * Toggles sender and receiver
 *
 * @param instanceId The service instance originating the response
 * @param originalEBMessage The command that triggered the error
 * @param statusCode Optional HTTP-like status to propagate
 * @param error Optional error payload
 * @returns CommandErrorResponse message object
 *
 * @group Helper
 */
export const createErrorResponse = (
	instanceId: InstanceId,
	originalEBMessage: Readonly<Command>,
	statusCode = StatusCode.InternalServerError,
	error?: unknown | string | Error | HandledError | UnhandledError,
): Readonly<Omit<CommandErrorResponse, 'instanceId'>> => {
	const message = getErrorMessageForCode(statusCode)
	const status = statusCode
	const isHandledError = error instanceof HandledError

	let errorTraceId: TraceId | undefined
	if (error instanceof HandledError || error instanceof UnhandledError) {
		errorTraceId = error.traceId
	}

	const traceId = originalEBMessage.traceId ?? errorTraceId ?? getNewTraceId()

	const errorResponse: Readonly<CommandErrorResponse> = Object.freeze({
		id: originalEBMessage.id,
		isHandledError,
		traceId,
		principalId: originalEBMessage.principalId,
		tenantId: originalEBMessage.tenantId,
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		correlationId: originalEBMessage.correlationId,
		timestamp: Date.now(),
		messageType: EBMessageType.CommandErrorResponse,
		sender: {
			...originalEBMessage.receiver,
			instanceId,
		},
		receiver: {
			...originalEBMessage.sender,
		},
		payload:
			error instanceof HandledError
				? error.getErrorResponse(traceId)
				: {
						status,
						message,
						traceId,
					},
		otp: serializeOtp(),
	})

	return errorResponse
}
