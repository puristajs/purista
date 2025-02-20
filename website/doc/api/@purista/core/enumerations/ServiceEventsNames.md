[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceEventsNames

# Enumeration: ServiceEventsNames

Defined in: [packages/core/src/core/types/ServiceEvents.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L11)

Events which can be emitted by a service.
Internal events are prefixed with `service-`

## Events

### CommandHandledError

> **CommandHandledError**: `"service-handled-command-error"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L36)

emitted when a command throws a HandledError

***

### CommandUnhandledError

> **CommandUnhandledError**: `"service-unhandled-command-error"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L42)

emitted when a command throws an error other than a HandledError

***

### ServiceAvailable

> **ServiceAvailable**: `"service-available"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L21)

emitted when the service is fully initialized and ready
Should be emitted by custom service class.
It is not emitted by default

***

### ServiceDrain

> **ServiceDrain**: `"service-drain"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L24)

emitted when the service is going to be stopped

***

### ServiceStarted

> **ServiceStarted**: `"service-started"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L13)

emitted when the service is started, but not fully initialized and not ready yet

***

### ServiceStopped

> **ServiceStopped**: `"service-stopped"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L27)

emitted when the service has been stopped

***

### ServiceUnavailable

> **ServiceUnavailable**: `"service-not-available"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L30)

emitted when the service is not available (for example database connection could not be established)

***

### SubscriptionHandledError

> **SubscriptionHandledError**: `"service-handled-subscription-error"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L33)

emitted when a subscription throws a HandledError

***

### SubscriptionUnhandledError

> **SubscriptionUnhandledError**: `"service-unhandled-subscription-error"`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L39)

emitted when a subscription throws an error other than a HandledError
