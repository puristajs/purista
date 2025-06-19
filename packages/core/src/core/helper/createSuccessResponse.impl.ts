import type { Command } from '../types/commandType/Command.js'
import type { CommandSuccessResponse } from '../types/commandType/CommandSuccessResponse.js'
import { EBMessageType } from '../types/EBMessageType.enum.js'
import type { InstanceId } from '../types/InstanceId.js'
import { getNewTraceId } from './getNewTraceId.impl.js'

/**
 *
 * @param originalEBMessage
 * @param payload
 * @param eventName
 * @param contentType
 * @param contentEncoding
 * @returns
 *
 * @group Helper
 */
export const createSuccessResponse = <T>(
	instanceId: InstanceId,
	originalEBMessage: Readonly<Command>,
	payload: T,
	eventName?: string,
	contentType = 'application/json',
	contentEncoding = 'utf-8',
): Readonly<CommandSuccessResponse<T>> => {
	const successResponse: CommandSuccessResponse<T> = Object.freeze({
		id: originalEBMessage.id,
		correlationId: originalEBMessage.correlationId,
		traceId: originalEBMessage.traceId ?? getNewTraceId(),
		principalId: originalEBMessage.principalId,
		tenantId: originalEBMessage.tenantId,
		contentType,
		contentEncoding,
		timestamp: Date.now(),
		eventName,
		messageType: EBMessageType.CommandSuccessResponse,
		sender: {
			...originalEBMessage.receiver,
			instanceId,
		},
		receiver: {
			...originalEBMessage.sender,
		},
		payload,
	})

	return successResponse
}
