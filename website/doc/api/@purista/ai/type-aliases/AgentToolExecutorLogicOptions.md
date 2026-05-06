[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentToolExecutorLogicOptions

# Type Alias: AgentToolExecutorLogicOptions\<Context\>

> **AgentToolExecutorLogicOptions**\<`Context`\> = [`AgentExecutorBaseOptions`](AgentExecutorBaseOptions.md) & `object`

Defined in: [packages/ai/src/runtime/context.ts:323](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L323)

Advanced escape hatch for fully custom planner executor logic.

Prefer `createModelExecutor(...)` as the default worker path.

## Type Declaration

### call()

> **call**: (`input`) => `Promise`\<`unknown`\>

Custom async execution logic.

#### Parameters

##### input

###### context

`Context`

###### request

`string`

###### results

`Record`\<`string`, `unknown`\>

###### run

[`AgentRunHandle`](AgentRunHandle.md)

###### task

[`AgentPlanTask`](AgentPlanTask.md)

#### Returns

`Promise`\<`unknown`\>

### kind?

> `optional` **kind**: [`AgentPlanExecutorKind`](AgentPlanExecutorKind.md)

Optional executor kind metadata. Defaults to `custom`.

## Type Parameters

### Context

`Context`
