[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentExecutionPlan

# Type Alias: AgentExecutionPlan\<Context, Tasks, Worker, Delegates\>

> **AgentExecutionPlan**\<`Context`, `Tasks`, `Worker`, `Delegates`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:131

Executable plan with attached runtime bindings.

The runtime bindings are attached internally by `context.plan.generate(...)`.

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

### \[planRuntimeSymbol\]?

> `optional` **\[planRuntimeSymbol\]**: `AgentPlanRuntimeBindings`\<`Context`, `Worker`, `Delegates`\>

Defined in: packages/ai/src/runtime/plan.ts:140

***

### summary?

> `optional` **summary**: `string`

Defined in: packages/ai/src/runtime/plan.ts:138

***

### tasks

> **tasks**: `Tasks`

Defined in: packages/ai/src/runtime/plan.ts:139

***

### title

> **title**: `string`

Defined in: packages/ai/src/runtime/plan.ts:137
