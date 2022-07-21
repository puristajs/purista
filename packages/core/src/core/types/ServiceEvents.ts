import { TraceId } from './TraceId'

/**
 * Events which can be emitted by a service
 */
export type ServiceEvents = {
  /** emitted when then connection to event bridge is established */
  'eventbridge-connected': undefined

  /** emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly */
  'eventbridge-connection-error': undefined

  /** emitted when the connection to event bridge closed */
  'eventbridge-disconnected': undefined

  /** emitted on retry to connect to event bridge */
  'eventbridge-reconnecting': undefined

  /** emitted when the service is started, but not fully initialized and not ready yet */
  'service-start': undefined

  /** emitted when the service is fully initialized and ready */
  'service-available': undefined

  /** emitted when the service is going to be stopped */
  'service-drain': undefined

  /** emitted when the service has been stopped */
  'service-stop': undefined

  /** emitted when the service is not available (for example database connection could not be established) */
  'service-not-available': undefined

  /** emitted when a subscription throws an error other than a HandledError */
  'unhandled-subscription-error': { subscriptionName: string; error: unknown; traceId: TraceId }

  /** emitted when a function throws an error other than a HandledError */
  'unhandled-function-error': { functionName: string; error: unknown; traceId: TraceId }
}
