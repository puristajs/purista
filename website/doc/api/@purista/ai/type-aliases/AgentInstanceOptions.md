[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInstanceOptions

# Type Alias: AgentInstanceOptions

> **AgentInstanceOptions** = `object`

Defined in: [ai/src/types/AgentDefinition.ts:36](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L36)

## Properties

### config?

> `optional` **config**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentDefinition.ts:50](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L50)

***

### configStore?

> `optional` **configStore**: [`ConfigStore`](../../core/interfaces/ConfigStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:41](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L41)

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [ai/src/types/AgentDefinition.ts:37](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L37)

***

### knowledgeAdapters?

> `optional` **knowledgeAdapters**: `Record`\<`string`, [`KnowledgeAdapter`](../interfaces/KnowledgeAdapter.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:45](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L45)

***

### logger?

> `optional` **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [ai/src/types/AgentDefinition.ts:38](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L38)

***

### models?

> `optional` **models**: `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

Defined in: [ai/src/types/AgentDefinition.ts:47](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L47)

***

### poolManager?

> `optional` **poolManager**: [`PoolManager`](../classes/PoolManager.md)

Defined in: [ai/src/types/AgentDefinition.ts:46](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L46)

***

### queueBridge?

> `optional` **queueBridge**: [`QueueBridge`](../../core/interfaces/QueueBridge.md)

Defined in: [ai/src/types/AgentDefinition.ts:43](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L43)

***

### ~~resources?~~

> `optional` **resources**: `Record`\<`string`, `unknown`\>

Defined in: [ai/src/types/AgentDefinition.ts:49](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L49)

#### Deprecated

use `models`

***

### secretStore?

> `optional` **secretStore**: [`SecretStore`](../../core/interfaces/SecretStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:40](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L40)

***

### sessionStore?

> `optional` **sessionStore**: [`SessionStore`](../interfaces/SessionStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:44](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L44)

***

### spanProcessor?

> `optional` **spanProcessor**: `SpanProcessor`

Defined in: [ai/src/types/AgentDefinition.ts:39](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L39)

***

### stateStore?

> `optional` **stateStore**: [`StateStore`](../../core/interfaces/StateStore.md)

Defined in: [ai/src/types/AgentDefinition.ts:42](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/types/AgentDefinition.ts#L42)
