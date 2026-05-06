[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanExecutionResultFromPlan

# Type Alias: AgentPlanExecutionResultFromPlan\<Plan\>

> **AgentPlanExecutionResultFromPlan**\<`Plan`\> = `Plan` *extends* [`AgentExecutionPlan`](AgentExecutionPlan.md)\<infer Context, infer Tasks, infer Worker, infer Delegates\> ? [`AgentPlanExecutionResult`](AgentPlanExecutionResult.md)\<`Context`, `Tasks`, `Worker`, `Delegates`\> : `never`

Defined in: packages/ai/src/runtime/plan.ts:180

Convenience helper to compute an execution result type directly from a plan type.

## Type Parameters

### Plan

`Plan` *extends* [`AgentExecutionPlan`](AgentExecutionPlan.md)\<`any`, `any`, `any`, `any`\>
