[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceEventsInternal

# Type Alias: ServiceEventsInternal

> **ServiceEventsInternal**: `object`

Defined in: [packages/core/src/core/types/ServiceEvents.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L54)

Events which can be emitted by a service.
Internal events are prefixed with `service-`.

Response messages, which have an event name assigned, are prefixed with `custom-`
If you like to use your own events, the event name must be prefixed with `misc-`.

## Type declaration

### service-available

> **service-available**: `undefined`

emitted when the service is fully initialized and ready
Should be emitted by custom service class.
It is not emitted by default

### service-drain

> **service-drain**: `undefined`

emitted when the service is going to be stopped

### service-handled-command-error

> **service-handled-command-error**: `object`

emitted when a command throws a HandledError

#### service-handled-command-error.commandName

> **service-handled-command-error.commandName**: `string`

#### service-handled-command-error.error

> **service-handled-command-error.error**: [`HandledError`](../classes/HandledError.md)

#### service-handled-command-error.traceId?

> `optional` **service-handled-command-error.traceId**: [`TraceId`](TraceId.md)

### service-handled-subscription-error

> **service-handled-subscription-error**: `object`

emitted when a subscription throws a HandledError

#### service-handled-subscription-error.error

> **service-handled-subscription-error.error**: [`HandledError`](../classes/HandledError.md)

#### service-handled-subscription-error.subscriptionName

> **service-handled-subscription-error.subscriptionName**: `string`

#### service-handled-subscription-error.traceId?

> `optional` **service-handled-subscription-error.traceId**: [`TraceId`](TraceId.md)

### service-not-available

> **service-not-available**: `undefined` \| `unknown`

emitted when the service is not available (for example database connection could not be established)

### service-started

> **service-started**: `undefined`

emitted when the service is started, but not fully initialized and not ready yet

### service-stopped

> **service-stopped**: `undefined`

emitted when the service has been stopped

### service-unhandled-command-error

> **service-unhandled-command-error**: `object`

emitted when a command throws an error other than a HandledError

#### service-unhandled-command-error.commandName

> **service-unhandled-command-error.commandName**: `string`

#### service-unhandled-command-error.error

> **service-unhandled-command-error.error**: `unknown`

#### service-unhandled-command-error.traceId?

> `optional` **service-unhandled-command-error.traceId**: [`TraceId`](TraceId.md)

### service-unhandled-subscription-error

> **service-unhandled-subscription-error**: `object`

emitted when a subscription throws an error other than a HandledError

#### service-unhandled-subscription-error.error

> **service-unhandled-subscription-error.error**: `unknown`

#### service-unhandled-subscription-error.subscriptionName

> **service-unhandled-subscription-error.subscriptionName**: `string`

#### service-unhandled-subscription-error.traceId?

> `optional` **service-unhandled-subscription-error.traceId**: [`TraceId`](TraceId.md)
