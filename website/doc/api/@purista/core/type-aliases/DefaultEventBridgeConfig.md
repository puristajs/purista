[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultEventBridgeConfig

# Type Alias: DefaultEventBridgeConfig

> **DefaultEventBridgeConfig** = `object`

Defined in: [DefaultEventBridge/types/DefaultEventBridgeConfig.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts#L4)

The configuration for the DefaultEventBridge.

## Properties

### emitMessagesAsEventBridgeEvents?

> `optional` **emitMessagesAsEventBridgeEvents**: `boolean`

Defined in: [DefaultEventBridge/types/DefaultEventBridgeConfig.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts#L9)

Emit messages which have an event name set as javascript events on the event bridge instance

***

### logWarnOnMessagesWithoutReceiver?

> `optional` **logWarnOnMessagesWithoutReceiver**: `boolean`

Defined in: [DefaultEventBridge/types/DefaultEventBridgeConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/DefaultEventBridgeConfig.ts#L6)

Log warnings on messages which are emitted, but could not delivered to at least one receiver
