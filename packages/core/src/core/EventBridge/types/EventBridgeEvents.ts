import { UnhandledError } from '../../Error/UnhandledError.impl'
import { addPrefixToObject, Prettify } from '../../types'

export enum EventBridgeEventNames {
  EventbridgeConnected = 'eventbridge-connected',
  EventbridgeConnectionError = 'eventbridge-connection-error',

  EventbridgeDisconnected = 'eventbridge-disconnected',

  EventbridgeReconnecting = 'eventbridge-reconnecting',

  EventbridgeError = 'eventbridge-error',
}

/**
 * Events which can be emitted by a event bridge
 *
 * @group Event bridge
 */
export type EventBridgeEventsBasic = {
  /** emitted when then connection to event bridge is established @event */
  [EventBridgeEventNames.EventbridgeConnected]: never

  /** emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly @event */
  [EventBridgeEventNames.EventbridgeConnectionError]: undefined | unknown | Error

  /** emitted when the connection to event bridge closed @event */
  [EventBridgeEventNames.EventbridgeDisconnected]: never

  /** emitted on retry to connect to event bridge @event */
  [EventBridgeEventNames.EventbridgeReconnecting]: never

  /** emitted on internal event bridge error @event */
  [EventBridgeEventNames.EventbridgeError]: UnhandledError | unknown
}

type CustomEvents = {
  [key: string]: unknown
}

export type EventBridgeEvents = Prettify<EventBridgeEventsBasic & addPrefixToObject<CustomEvents, 'adapter-'>>
