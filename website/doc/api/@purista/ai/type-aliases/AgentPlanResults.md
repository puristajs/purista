[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanResults

# Type Alias: AgentPlanResults\<Tasks, Worker, Delegates\>

> **AgentPlanResults**\<`Tasks`, `Worker`, `Delegates`\> = `{ [Task in Tasks[number] as Task["id"]]: AgentPlanTaskResult<Task, Worker, Delegates> }`

Defined in: packages/ai/src/runtime/plan.ts:107

Strongly-typed task result map for an execution plan.

When task ids/delegates are known statically, `results` becomes strongly typed
per task id. For fully dynamic planner output, this degrades to `Record<string, unknown>`.

## Type Parameters

### Tasks

`Tasks` *extends* readonly [`AgentPlanTask`](AgentPlanTask.md)[]

### Worker

`Worker` *extends* `AnyAgentPlanExecutor`

### Delegates

`Delegates` *extends* readonly `AnyAgentPlanExecutor`[]
