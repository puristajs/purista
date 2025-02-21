import { getNewCorrelationId } from '../../core/helper/getNewCorrelationId.impl.js'
import { getNewEBMessageId } from '../../core/helper/getNewEBMessageId.impl.js'
import { getNewInstanceId } from '../../core/helper/getNewInstanceId.impl.js'
import { getNewTraceId } from '../../core/helper/getNewTraceId.impl.js'
import type { CustomMessage } from '../../core/types/CustomMessage.js'
import { EBMessageType } from '../../core/types/EBMessageType.enum.js'

/**
 * A function that returns a mocked custom message.
 *
 * @group Unit test helper
 * */
export const getCustomMessageMessageMock = <PayloadType>(
	eventName: string,
	payload: PayloadType,
	input?: Partial<CustomMessage<PayloadType>>,
): Readonly<CustomMessage<PayloadType>> => {
	const customMessage: Readonly<CustomMessage<PayloadType>> = Object.freeze({
		id: getNewEBMessageId(),
		timestamp: Date.now(),
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		messageType: EBMessageType.CustomMessage,
		correlationId: getNewCorrelationId(),
		traceId: getNewTraceId(),
		principalId: 'mocked-principal-id',
		tenantId: 'mocked-tenant-id',
		eventName,
		sender: {
			serviceName: 'mocked_sender',
			serviceVersion: '1',
			serviceTarget: 'mockedSenderFunction',
			instanceId: getNewInstanceId(),
		},
		...input,
		payload,
	})
	return customMessage
}
