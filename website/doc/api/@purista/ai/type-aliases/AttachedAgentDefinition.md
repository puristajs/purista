[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AttachedAgentDefinition

# Type Alias: AttachedAgentDefinition\<S\>

> **AttachedAgentDefinition**\<`S`\> = [`AgentDefinition`](AgentDefinition.md)\<`S`\> & `object`

Defined in: ai/src/builder/types.ts:284

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
