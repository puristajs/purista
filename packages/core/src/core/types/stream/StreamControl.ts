import type { CorrelationId } from '../CorrelationId.js'
import type { EBMessageAddress } from '../EBMessageAddress.js'
import type { EBMessageBase } from '../EBMessageBase.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'

export type StreamControlPayload = {
	frameType: 'cancel'
	reason?: string
}

export type StreamControl = Prettify<
	{
		messageType: EBMessageType.Stream
		correlationId: CorrelationId
		receiver: EBMessageAddress & Required<Pick<EBMessageAddress, 'instanceId'>>
		payload: StreamControlPayload
	} & EBMessageBase
>
