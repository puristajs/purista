import { UnhandledError } from '../Error/UnhandledError.impl'
import { addPrefixToObject } from './addPrefixToObject'

/**
 * Events which can be emitted by a event bridge
 */
export type EventBridgeEventsBasic = {
  /** emitted when then connection to event bridge is established */
  'eventbridge-connected': never

  /** emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly */
  'eventbridge-connection-error': undefined | unknown | Error

  /** emitted when the connection to event bridge closed */
  'eventbridge-disconnected': never

  /** emitted on retry to connect to event bridge */
  'eventbridge-reconnecting': never

  /** emitted on internal event bridge error */
  'eventbridge-error': UnhandledError | unknown
}

type CustomEvents = {
  [key: string]: unknown
}

export type EventBridgeEvents = EventBridgeEventsBasic & addPrefixToObject<CustomEvents, 'adapter-'>
