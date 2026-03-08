[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentRuntimeDependencies

# Type Alias: AgentRuntimeDependencies

> **AgentRuntimeDependencies** = `object`

Defined in: [ai/src/runtime/AgentInstance.ts:41](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L41)

## Properties

### config?

> `optional` **config**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/runtime/AgentInstance.ts:58](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L58)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [ai/src/runtime/AgentInstance.ts:46](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L46)

***

### knowledgeAdapters?

> `optional` **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)\>

Defined in: [ai/src/runtime/AgentInstance.ts:50](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L50)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/runtime/AgentInstance.ts:42](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L42)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [ai/src/runtime/AgentInstance.ts:52](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L52)

***

### poolConfig?

> `optional` **poolConfig**: `object`

Defined in: [ai/src/runtime/AgentInstance.ts:54](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L54)

#### maxConcurrencyPerInstance?

> `optional` **maxConcurrencyPerInstance**: `number`

#### poolId?

> `optional` **poolId**: `string`

***

### poolManager?

> `optional` **poolManager**: [`PoolManager`](../classes/PoolManager.md)

Defined in: [ai/src/runtime/AgentInstance.ts:51](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L51)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [ai/src/runtime/AgentInstance.ts:48](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L48)

***

### resources?

> `optional` **resources**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/runtime/AgentInstance.ts:53](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L53)

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [ai/src/runtime/AgentInstance.ts:45](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L45)

***

### sessionStore?

> `optional` **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/runtime/AgentInstance.ts:49](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L49)

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [ai/src/runtime/AgentInstance.ts:43](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L43)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [ai/src/runtime/AgentInstance.ts:47](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L47)

***

### tracer?

> `optional` **tracer**: `Tracer`

Defined in: [ai/src/runtime/AgentInstance.ts:44](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/runtime/AgentInstance.ts#L44)
