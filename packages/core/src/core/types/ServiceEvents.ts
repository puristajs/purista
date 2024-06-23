import type { HandledError } from '../Error/HandledError.impl.js'
import type { TraceId } from './TraceId.js'
import type { addPrefixToObject } from './addPrefixToObject.js'

/**
 * Events which can be emitted by a service.
 * Internal events are prefixed with `service-`
 *
 * @group Service
 */
export enum ServiceEventsNames {
	/** emitted when the service is started, but not fully initialized and not ready yet @event */
	ServiceStarted = 'service-started',

	/**
	 * emitted when the service is fully initialized and ready
	 * Should be emitted by custom service class.
	 * It is not emitted by default
	 * @event
	 */
	ServiceAvailable = 'service-available',

	/** emitted when the service is going to be stopped @event */
	ServiceDrain = 'service-drain',

	/** emitted when the service has been stopped @event */
	ServiceStopped = 'service-stopped',

	/** emitted when the service is not available (for example database connection could not be established) @event */
	ServiceUnavailable = 'service-not-available',

	/** emitted when a subscription throws a HandledError @event */
	SubscriptionHandledError = 'service-handled-subscription-error',

	/** emitted when a command throws a HandledError @event */
	CommandHandledError = 'service-handled-command-error',

	/** emitted when a subscription throws an error other than a HandledError @event */
	SubscriptionUnhandledError = 'service-unhandled-subscription-error',

	/** emitted when a command throws an error other than a HandledError @event */
	CommandUnhandledError = 'service-unhandled-command-error',
}

/**
 * Events which can be emitted by a service.
 * Internal events are prefixed with `service-`.
 *
 * Response messages, which have an event name assigned, are prefixed with `custom-`
 * If you like to use your own events, the event name must be prefixed with `misc-`.
 *
 * @group Service
 */
export type ServiceEventsInternal = {
	/** emitted when the service is started, but not fully initialized and not ready yet */
	[ServiceEventsNames.ServiceStarted]: undefined

	/**
	 * emitted when the service is fully initialized and ready
	 * Should be emitted by custom service class.
	 * It is not emitted by default
	 */
	[ServiceEventsNames.ServiceAvailable]: undefined

	/** emitted when the service is going to be stopped */
	[ServiceEventsNames.ServiceDrain]: undefined

	/** emitted when the service has been stopped */
	[ServiceEventsNames.ServiceStopped]: undefined

	/** emitted when the service is not available (for example database connection could not be established) */
	[ServiceEventsNames.ServiceUnavailable]: undefined | unknown

	/** emitted when a subscription throws a HandledError */
	[ServiceEventsNames.SubscriptionHandledError]: { subscriptionName: string; error: HandledError; traceId?: TraceId }

	/** emitted when a command throws a HandledError */
	[ServiceEventsNames.CommandHandledError]: { commandName: string; error: HandledError; traceId?: TraceId }

	/** emitted when a subscription throws an error other than a HandledError */
	[ServiceEventsNames.SubscriptionUnhandledError]: { subscriptionName: string; error: unknown; traceId?: TraceId }

	/** emitted when a command throws an error other than a HandledError */
	[ServiceEventsNames.CommandUnhandledError]: { commandName: string; error: unknown; traceId?: TraceId }
}

type CustomEvents = {
	[key: string]: unknown
}

/**
 * ServiceEvents are plain javascript events sent by the service.
 * There are three types:
 * - technical events when a services starts, stops, an error occurs and so on are prefixed with `service-`
 * - response messages, which have a event name assigned, are prefixed with `custom-`
 * - additional events, free defined by developer are prefixed with `misc-`
 */
export type ServiceEvents = ServiceEventsInternal &
	addPrefixToObject<CustomEvents, 'custom-'> &
	addPrefixToObject<CustomEvents, 'misc-'>
