[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeEventsBasic

# Type Alias: EventBridgeEventsBasic

> **EventBridgeEventsBasic** = `object`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L21)

Events which can be emitted by a event bridge

## Events

### eventbridge-connected

> **eventbridge-connected**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L23)

emitted when then connection to event bridge is established

***

### eventbridge-connection-error

> **eventbridge-connection-error**: `undefined` \| `unknown` \| `Error`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L26)

emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly

***

### eventbridge-disconnected

> **eventbridge-disconnected**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L29)

emitted when the connection to event bridge closed

***

### eventbridge-error

> **eventbridge-error**: [`UnhandledError`](../classes/UnhandledError.md) \| `unknown`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L35)

emitted on internal event bridge error

***

### eventbridge-reconnecting

> **eventbridge-reconnecting**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L32)

emitted on retry to connect to event bridge
