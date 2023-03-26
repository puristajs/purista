import { UnhandledError } from '../../Error/UnhandledError.impl'
import { addPrefixToObject } from '../../types'

/**
 * Events which can be emitted by a event bridge
 *
 * @group Event bridge
 */
export type EventBridgeEventsBasic = {
  /** emitted when then connection to event bridge is established @event */
  'eventbridge-connected': never

  /** emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly @event */
  'eventbridge-connection-error': undefined | unknown | Error

  /** emitted when the connection to event bridge closed @event */
  'eventbridge-disconnected': never

  /** emitted on retry to connect to event bridge @event */
  'eventbridge-reconnecting': never

  /** emitted on internal event bridge error @event */
  'eventbridge-error': UnhandledError | unknown
}

type CustomEvents = {
  [key: string]: unknown
}

export type EventBridgeEvents = EventBridgeEventsBasic & addPrefixToObject<CustomEvents, 'adapter-'>
