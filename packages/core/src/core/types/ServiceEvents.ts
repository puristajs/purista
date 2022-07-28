import { HandledError } from '../HandledError.impl'
import { addPrefixToObject } from './addPrefixToObject'
import { TraceId } from './TraceId'

/**
 * Events which can be emitted by a service.
 * Internal events are prefixed with `service-`.
 *
 * If you like to use your own events, the event names should be prefixed with `custom-` to have propper types.
 */
export type ServiceEventsInternal = {
  /** emitted when the service is started, but not fully initialized and not ready yet */
  'service-started': undefined

  /**
   * emitted when the service is fully initialized and ready
   * Should be emitted by custom service class.
   * It is not emitted by default
   */
  'service-available': undefined

  /** emitted when the service is going to be stopped */
  'service-drain': undefined

  /** emitted when the service has been stopped */
  'service-stopped': undefined

  /** emitted when the service is not available (for example database connection could not be established) */
  'service-not-available': undefined | unknown

  /** emitted when a subscription throws a HandledError */
  'handled-subscription-error': { subscriptionName: string; error: HandledError; traceId: TraceId }

  /** emitted when a function throws a HandledError */
  'handled-function-error': { functionName: string; error: HandledError; traceId: TraceId }

  /** emitted when a subscription throws an error other than a HandledError */
  'unhandled-subscription-error': { subscriptionName: string; error: unknown; traceId: TraceId }

  /** emitted when a function throws an error other than a HandledError */
  'unhandled-function-error': { functionName: string; error: unknown; traceId: TraceId }
}

type CustomEvents = {
  [key: string]: unknown
}

export type ServiceEvents = ServiceEventsInternal & addPrefixToObject<CustomEvents, 'custom-'>
