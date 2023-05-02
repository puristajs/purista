import type { CorrelationId } from '../CorrelationId'
import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageBase } from '../EBMessageBase'
import { EBMessageType } from '../EBMessageType.enum'
import { Prettify } from '../Prettify'

/**
 * Command is a event bridge message, which is emitted by sender to event bridge.
 * The event bridge dispatches the event to the receiver.
 * A command expects to get a response message from receiver back to sender.
 *
 * Also if there are subscriptions which are matching given command,
 * the event bridge also dispatches the command message to the subscriber(s).
 *
 * BE AWARE:
 * Subscribers should not respond with command responses if they are "silent" subscribers/listeners.
 */
export type Command<PayloadType = unknown, ParameterType = unknown> = Prettify<
  {
    messageType: EBMessageType.Command
    correlationId: CorrelationId
    sender: EBMessageAddress
    receiver: EBMessageAddress
    payload: {
      parameter: ParameterType
      payload: PayloadType
    }
  } & EBMessageBase
>
