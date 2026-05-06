[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanExecutionResult

# Type Alias: AgentPlanExecutionResult\<Context, Tasks, Worker, Delegates\>

> **AgentPlanExecutionResult**\<`Context`, `Tasks`, `Worker`, `Delegates`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:166

Result returned by [AgentPlanHelpers.execute](AgentPlanHelpers.md#execute).

## Type Parameters

### Context

`Context` = `unknown`

### Tasks

`Tasks` *extends* readonly [`AgentPlanTask`](AgentPlanTask.md)[] = readonly [`AgentPlanTask`](AgentPlanTask.md)[]

### Worker

`Worker` *extends* [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\> = [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `unknown`\>

### Delegates

`Delegates` *extends* readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `any`\>[] = readonly [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`Context`, `unknown`\>[]

## Properties

### plan

> **plan**: [`AgentExecutionPlan`](AgentExecutionPlan.md)\<`Context`, `Tasks`, `Worker`, `Delegates`\>

Defined in: packages/ai/src/runtime/plan.ts:172

***

### results

> **results**: [`AgentPlanResults`](AgentPlanResults.md)\<`Tasks`, `Worker`, `Delegates`\>

Defined in: packages/ai/src/runtime/plan.ts:173

***

### run

> **run**: `Awaited`\<`ReturnType`\<[`AgentRunHandle`](AgentRunHandle.md)\[`"finishSuccess"`\]\>\>

Defined in: packages/ai/src/runtime/plan.ts:174
