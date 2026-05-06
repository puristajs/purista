[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanTaskResult

# Type Alias: AgentPlanTaskResult\<Task, Worker, Delegates\>

> **AgentPlanTaskResult**\<`Task`, `Worker`, `Delegates`\> = `Task` *extends* `object` ? \[[`AgentPlanDelegateById`](AgentPlanDelegateById.md)\<`Delegates`, `DelegateId`\>\] *extends* \[`never`\] ? [`AgentPlanExecutorResult`](AgentPlanExecutorResult.md)\<`Worker`\> : [`AgentPlanExecutorResult`](AgentPlanExecutorResult.md)\<[`AgentPlanDelegateById`](AgentPlanDelegateById.md)\<`Delegates`, `DelegateId`\>\> : [`AgentPlanExecutorResult`](AgentPlanExecutorResult.md)\<`Worker`\>

Defined in: packages/ai/src/runtime/plan.ts:91

Computes the result type for a single task by looking at its delegate/worker route.

## Type Parameters

### Task

`Task` *extends* [`AgentPlanTask`](AgentPlanTask.md)

### Worker

`Worker` *extends* `AnyAgentPlanExecutor`

### Delegates

`Delegates` *extends* readonly `AnyAgentPlanExecutor`[]
