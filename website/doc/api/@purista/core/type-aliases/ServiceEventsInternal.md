[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ServiceEventsInternal

# Type Alias: ServiceEventsInternal

> **ServiceEventsInternal** = `object`

Defined in: [core/types/ServiceEvents.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L54)

Events which can be emitted by a service.
Internal events are prefixed with `service-`.

Response messages, which have an event name assigned, are prefixed with `custom-`
If you like to use your own events, the event name must be prefixed with `misc-`.

## Properties

### service-available

> **service-available**: `undefined`

Defined in: [core/types/ServiceEvents.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L63)

emitted when the service is fully initialized and ready
Should be emitted by custom service class.
It is not emitted by default

***

### service-drain

> **service-drain**: `undefined`

Defined in: [core/types/ServiceEvents.ts:66](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L66)

emitted when the service is going to be stopped

***

### service-handled-command-error

> **service-handled-command-error**: `object`

Defined in: [core/types/ServiceEvents.ts:78](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L78)

emitted when a command throws a HandledError

#### commandName

> **commandName**: `string`

#### error

> **error**: [`HandledError`](../classes/HandledError.md)

#### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)

***

### service-handled-subscription-error

> **service-handled-subscription-error**: `object`

Defined in: [core/types/ServiceEvents.ts:75](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L75)

emitted when a subscription throws a HandledError

#### error

> **error**: [`HandledError`](../classes/HandledError.md)

#### subscriptionName

> **subscriptionName**: `string`

#### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)

***

### service-not-available

> **service-not-available**: `undefined` \| `unknown`

Defined in: [core/types/ServiceEvents.ts:72](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L72)

emitted when the service is not available (for example database connection could not be established)

***

### service-started

> **service-started**: `undefined`

Defined in: [core/types/ServiceEvents.ts:56](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L56)

emitted when the service is started, but not fully initialized and not ready yet

***

### service-stopped

> **service-stopped**: `undefined`

Defined in: [core/types/ServiceEvents.ts:69](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L69)

emitted when the service has been stopped

***

### service-unhandled-command-error

> **service-unhandled-command-error**: `object`

Defined in: [core/types/ServiceEvents.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L84)

emitted when a command throws an error other than a HandledError

#### commandName

> **commandName**: `string`

#### error

> **error**: `unknown`

#### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)

***

### service-unhandled-subscription-error

> **service-unhandled-subscription-error**: `object`

Defined in: [core/types/ServiceEvents.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceEvents.ts#L81)

emitted when a subscription throws an error other than a HandledError

#### error

> **error**: `unknown`

#### subscriptionName

> **subscriptionName**: `string`

#### traceId?

> `optional` **traceId**: [`TraceId`](TraceId.md)
