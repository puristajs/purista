[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AttachedAgentDefinition

# Type Alias: AttachedAgentDefinition\<S\>

> **AttachedAgentDefinition**\<`S`\> = [`AgentDefinition`](AgentDefinition.md)\<`S`\> & `object`

Defined in: [AgentQueueBuilder/types.ts:353](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L353)

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
