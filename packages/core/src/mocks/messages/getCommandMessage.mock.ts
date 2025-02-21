import { getNewCorrelationId } from '../../core/helper/getNewCorrelationId.impl.js'
import { getNewEBMessageId } from '../../core/helper/getNewEBMessageId.impl.js'
import { getNewInstanceId } from '../../core/helper/getNewInstanceId.impl.js'
import { getNewTraceId } from '../../core/helper/getNewTraceId.impl.js'
import { EBMessageType } from '../../core/types/EBMessageType.enum.js'
import type { Command } from '../../core/types/commandType/Command.js'

/**
 * A function that returns a mocked command message.
 *
 * @group Unit test helper
 * */
export const getCommandMessageMock = <Payload, Parameter>(
	input?: Partial<Command<Payload, Parameter>> & {
		payload?: {
			payload?: Payload
			parameter?: Parameter
		}
	},
): Readonly<Command<Payload, Parameter>> => {
	const commandMessage: Readonly<Command<Payload, Parameter>> = Object.freeze({
		id: getNewEBMessageId(),
		timestamp: Date.now(),
		messageType: EBMessageType.Command,
		correlationId: getNewCorrelationId(),
		traceId: getNewTraceId(),
		principalId: 'mocked-principal-id',
		tenantId: 'mocked-tenant-id',
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		sender: {
			serviceName: 'mocked_sender',
			serviceVersion: '1',
			serviceTarget: 'mockedSenderFunction',
			instanceId: getNewInstanceId(),
		},
		receiver: {
			serviceName: 'mocked_receiver',
			serviceVersion: '1',
			serviceTarget: 'mockedReceiverFunction',
			instanceId: getNewInstanceId(),
		},
		payload: {
			payload: input?.payload?.payload as Payload,
			parameter: (input?.payload?.parameter ?? {}) as Parameter,
		},
		...input,
	})
	return commandMessage
}
