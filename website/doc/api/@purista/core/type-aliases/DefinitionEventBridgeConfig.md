[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefinitionEventBridgeConfig

# Type Alias: DefinitionEventBridgeConfig

> **DefinitionEventBridgeConfig** = `object`

Defined in: [core/types/DefinitionEventBridgeConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConfig.ts#L6)

Settings and advices for the event bridge, which are set in the command or subscription builder.
The properties are advices and hints.
It depends on the used event bridge implementation and underlaying message broker, if a specific property can be respected.

## Properties

### autoacknowledge

> **autoacknowledge**: `boolean`

Defined in: [core/types/DefinitionEventBridgeConfig.ts:18](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConfig.ts#L18)

Send the acknowledge to message broker as soon as the message arrives
- defaults to true for commands
- defaults to false for subscriptions

***

### durable

> **durable**: `boolean`

Defined in: [core/types/DefinitionEventBridgeConfig.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConfig.ts#L11)

Advise the underlaying message broker to store messages if no consumer is available.
Messages will be send as soon as the service is able to consume.

***

### shared

> **shared**: `boolean`

Defined in: [core/types/DefinitionEventBridgeConfig.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/DefinitionEventBridgeConfig.ts#L30)

If set to true, the event bridge is adviced to deliver one message to at least one consumer instance.
True is the default value.
If set to false, the event bridge is adviced to deliver one message to all consumer instances.

Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync.

In serverless environments, this flag should not have any effect

#### Default

```ts
true
```
