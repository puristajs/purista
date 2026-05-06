[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanExecutorResult

# Type Alias: AgentPlanExecutorResult\<TExecutor\>

> **AgentPlanExecutorResult**\<`TExecutor`\> = `TExecutor` *extends* [`AgentPlanExecutor`](AgentPlanExecutor.md)\<`any`, infer TResult\> ? `TResult` : `unknown`

Defined in: packages/ai/src/runtime/plan.ts:77

Extracts the async result type produced by a planner executor.

## Type Parameters

### TExecutor

`TExecutor` *extends* `AnyAgentPlanExecutor`
