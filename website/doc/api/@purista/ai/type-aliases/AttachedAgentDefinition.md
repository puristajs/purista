[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AttachedAgentDefinition

# Type Alias: AttachedAgentDefinition\<S\>

> **AttachedAgentDefinition**\<`S`\> = [`AgentDefinition`](AgentDefinition.md)\<`S`\> & `object`

Defined in: [builder/types.ts:342](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L342)

## Type Declaration

### command

> **command**: `AttachedCoreDefinition` & `object`

#### Type Declaration

##### commandName

> **commandName**: `string`

### queue

> **queue**: `AttachedCoreDefinition` & `object`

#### Type Declaration

##### queueName

> **queueName**: `string`

### stream

> **stream**: `AttachedCoreDefinition` & `object`

#### Type Declaration

##### streamName

> **streamName**: `string`

### worker

> **worker**: `AttachedCoreDefinition` & `object`

#### Type Declaration

##### name

> **name**: `string`

##### queueName

> **queueName**: `string`

## Type Parameters

### S

`S` *extends* `AnyAgentQueueBuilderTypes` = [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)
