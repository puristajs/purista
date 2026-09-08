import type { CorrelationId } from '../CorrelationId.js'
import type { HarnessTransportEnvelope } from '../commandType/Command.js'
import type { EBMessageAddress } from '../EBMessageAddress.js'
import type { EBMessageBase } from '../EBMessageBase.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'

export type StreamOpenRequestPayload<PayloadType = unknown, ParameterType = unknown> = {
	frameType: 'open'
	payload: PayloadType
	parameter: ParameterType
}

export type StreamOpenRequest<PayloadType = unknown, ParameterType = unknown> = Prettify<
	{
		messageType: EBMessageType.Stream
		correlationId: CorrelationId
		receiver: EBMessageAddress
		payload: StreamOpenRequestPayload<PayloadType, ParameterType>
		/** @internal Framework-owned Harness metadata outside public schemas. */
		harness?: HarnessTransportEnvelope
	} & EBMessageBase
>
