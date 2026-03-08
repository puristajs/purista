[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceOptions

# Type Alias: AgentInstanceOptions

> **AgentInstanceOptions** = `object`

Defined in: [ai/src/types/AgentDefinition.ts:37](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L37)

## Properties

### config?

> `optional` **config**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentDefinition.ts:55](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L55)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:42](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L42)

***

### knowledgeAdapters?

> `optional` **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:46](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L46)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/types/AgentDefinition.ts:38](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L38)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:48](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L48)

***

### poolConfig?

> `optional` **poolConfig**: `object`

Defined in: [ai/src/types/AgentDefinition.ts:51](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L51)

#### maxConcurrencyPerInstance?

> `optional` **maxConcurrencyPerInstance**: `number`

#### poolId?

> `optional` **poolId**: `string`

***

### poolManager?

> `optional` **poolManager**: [`PoolManager`](../classes/PoolManager.md)

Defined in: [ai/src/types/AgentDefinition.ts:47](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L47)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [ai/src/types/AgentDefinition.ts:44](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L44)

***

### ~~resources?~~

> `optional` **resources**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentDefinition.ts:50](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L50)

#### Deprecated

use `models`

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:41](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L41)

***

### sessionStore?

> `optional` **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:45](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L45)

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [ai/src/types/AgentDefinition.ts:39](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L39)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:43](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L43)

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [ai/src/types/AgentDefinition.ts:40](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/types/AgentDefinition.ts#L40)
