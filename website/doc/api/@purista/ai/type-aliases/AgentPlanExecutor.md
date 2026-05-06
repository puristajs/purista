[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanExecutor

# Type Alias: AgentPlanExecutor\<Context, TResult\>

> **AgentPlanExecutor**\<`Context`, `TResult`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:65

Reusable callable endpoint used by the planner runtime.

- `worker` is required and handles non-delegated tasks.
- `delegates` are optional and selected by task `delegate`.

## Type Parameters

### Context

`Context`

### TResult

`TResult` = `unknown`

## Properties

### description

> **description**: `string`

Defined in: packages/ai/src/runtime/plan.ts:67

***

### id

> **id**: `string`

Defined in: packages/ai/src/runtime/plan.ts:66

***

### kind?

> `optional` **kind**: [`AgentPlanExecutorKind`](AgentPlanExecutorKind.md)

Defined in: packages/ai/src/runtime/plan.ts:68

## Methods

### call()

> **call**(`input`): `Promise`\<`TResult`\>

Defined in: packages/ai/src/runtime/plan.ts:69

#### Parameters

##### input

[`AgentPlanExecutionContext`](AgentPlanExecutionContext.md)\<`Context`\>

#### Returns

`Promise`\<`TResult`\>
