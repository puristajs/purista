[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeEventsBasic

# Type Alias: EventBridgeEventsBasic

> **EventBridgeEventsBasic**: `object`

Defined in: [packages/core/src/core/EventBridge/types/EventBridgeEvents.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L20)

Events which can be emitted by a event bridge

## Type declaration

### eventbridge-connected

> **eventbridge-connected**: `never`

emitted when then connection to event bridge is established

### eventbridge-connection-error

> **eventbridge-connection-error**: `undefined` \| `unknown` \| `Error`

emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly

### eventbridge-disconnected

> **eventbridge-disconnected**: `never`

emitted when the connection to event bridge closed

### eventbridge-error

> **eventbridge-error**: [`UnhandledError`](../classes/UnhandledError.md) \| `unknown`

emitted on internal event bridge error

### eventbridge-reconnecting

> **eventbridge-reconnecting**: `never`

emitted on retry to connect to event bridge
