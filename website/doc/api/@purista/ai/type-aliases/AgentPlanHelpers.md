[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanHelpers

# Type Alias: AgentPlanHelpers\<Context, Models\>

> **AgentPlanHelpers**\<`Context`, `Models`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:188

High-level planner API exposed on `context.plan`.

## Type Parameters

### Context

`Context`

### Models

`Models` *extends* `Record`\<`string`, \{ `generateObject?`: (...`args`) => `Promise`\<`any`\>; \}\>

## Methods

### execute()

> **execute**\<`Plan`\>(`plan`): `Promise`\<[`AgentPlanExecutionResultFromPlan`](AgentPlanExecutionResultFromPlan.md)\<`Plan`\>\>

Defined in: packages/ai/src/runtime/plan.ts:204

Execute a generated plan sequentially using worker/delegate routing.

#### Type Parameters

##### Plan

`Plan` *extends* [`AgentExecutionPlan`](AgentExecutionPlan.md)\<`Context`, `any`, `any`, `any`\>

#### Parameters

##### plan

`Plan`

#### Returns

`Promise`\<[`AgentPlanExecutionResultFromPlan`](AgentPlanExecutionResultFromPlan.md)\<`Plan`\>\>

***

### generate()

> **generate**\<`Worker`, `Delegates`\>(`input`): `Promise`\<[`AgentExecutionPlan`](AgentExecutionPlan.md)\<`Context`, readonly [`AgentPlanTask`](AgentPlanTask.md)[], `Worker`, `Delegates`\>\>

Defined in: packages/ai/src/runtime/plan.ts:195

Generate a business-level sequential task plan from request + instructions.

#### Type Parameters

##### Worker

`Worker` *extends* [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\>

##### Delegates

`Delegates` *extends* readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\>[] = readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `unknown`\>[]

#### Parameters

##### input

[`AgentPlanGenerateInput`](AgentPlanGenerateInput.md)\<`Context`, `Models`, `Worker`, `Delegates`\>

#### Returns

`Promise`\<[`AgentExecutionPlan`](AgentExecutionPlan.md)\<`Context`, readonly [`AgentPlanTask`](AgentPlanTask.md)[], `Worker`, `Delegates`\>\>
