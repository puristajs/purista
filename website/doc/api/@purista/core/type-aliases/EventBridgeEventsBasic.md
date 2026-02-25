[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EventBridgeEventsBasic

# Type Alias: EventBridgeEventsBasic

> **EventBridgeEventsBasic** = `object`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L26)

Events which can be emitted by a event bridge

## Events

### eventbridge-connected

> **eventbridge-connected**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L28)

emitted when then connection to event bridge is established

***

### eventbridge-connection-error

> **eventbridge-connection-error**: `undefined` \| `unknown` \| `Error`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:31](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L31)

emitted when the connection to event bridge can not be established or a connection has issues or gets closed unexpectedly

***

### eventbridge-disconnected

> **eventbridge-disconnected**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L34)

emitted when the connection to event bridge closed

***

### eventbridge-error

> **eventbridge-error**: [`UnhandledError`](../classes/UnhandledError.md) \| `unknown`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L40)

emitted on internal event bridge error

***

### eventbridge-reconnecting

> **eventbridge-reconnecting**: `never`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:37](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L37)

emitted on retry to connect to event bridge

***

### stream-closed

> **stream-closed**: \{ `sessionId`: `string`; \} \| `undefined`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L46)

emitted when a stream session is closed

***

### stream-error

> **stream-error**: `unknown`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L49)

emitted when stream handling fails

***

### stream-frame-received

> **stream-frame-received**: `unknown`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:52](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L52)

emitted when a stream frame is received

***

### stream-frame-sent

> **stream-frame-sent**: `unknown`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:55](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L55)

emitted when a stream frame is sent

***

### stream-opened

> **stream-opened**: \{ `sessionId`: `string`; \} \| `undefined`

Defined in: [core/EventBridge/types/EventBridgeEvents.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/EventBridge/types/EventBridgeEvents.ts#L43)

emitted when a stream session is opened
