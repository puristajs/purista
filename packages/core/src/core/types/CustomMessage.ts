import type { EBMessageAddress } from './EBMessageAddress.js'
import type { EBMessageBase } from './EBMessageBase.js'
import type { EBMessageType } from './EBMessageType.enum.js'
import type { Prettify } from './Prettify.js'

/**
 * A custom message is a message which can be used to pass business information.
 * The producer emits the message without knowledge about any consumer.
 * The producer does not expect a response from a consumer.
 */
export type CustomMessage<Payload = unknown> = Prettify<
	{
		/** Message type musst be EBMessageType.CustomMessage */
		messageType: EBMessageType.CustomMessage
		/** the event name assigned to this custom message */
		eventName: string
		/** an optional receiver */
		receiver?: EBMessageAddress
		/** the message payload */
		payload?: Payload
	} & EBMessageBase
>
