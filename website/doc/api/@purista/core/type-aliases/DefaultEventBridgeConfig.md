[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultEventBridgeConfig

# Type Alias: DefaultEventBridgeConfig

> **DefaultEventBridgeConfig**: `object`

Defined in: [packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts#L4)

The configuration for the DefaultEventBridge.

## Type declaration

### emitMessagesAsEventBridgeEvents?

> `optional` **emitMessagesAsEventBridgeEvents**: `boolean`

Emit messages which have an event name set as javascript events on the event bridge instance

### logWarnOnMessagesWithoutReceiver?

> `optional` **logWarnOnMessagesWithoutReceiver**: `boolean`

Log warnings on messages which are emitted, but could not delivered to at least one receiver
