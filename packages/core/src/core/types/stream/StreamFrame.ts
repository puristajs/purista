import type { CorrelationId } from '../CorrelationId.js'
import type { EBMessageBase } from '../EBMessageBase.js'
import type { EBMessageSenderAddress } from '../EBMessageSenderAddress.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'
import type { StreamErrorPayload } from './StreamErrorPayload.js'
import type { StreamFrameType } from './StreamFrameType.js'

export type StreamFramePayload<Chunk = unknown, Final = unknown> = {
	frameType: Exclude<StreamFrameType, 'open'>
	sequence: number
	chunk?: Chunk
	final?: Final
	error?: StreamErrorPayload
	reason?: string
}

export type StreamFrame<Chunk = unknown, Final = unknown> = Prettify<
	{
		messageType: EBMessageType.Stream
		correlationId: CorrelationId
		receiver: EBMessageSenderAddress
		payload: StreamFramePayload<Chunk, Final>
	} & EBMessageBase
>
