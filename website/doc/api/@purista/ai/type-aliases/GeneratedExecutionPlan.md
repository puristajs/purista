[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / GeneratedExecutionPlan

# Type Alias: GeneratedExecutionPlan

> **GeneratedExecutionPlan** = `z.infer`\<*typeof* [`generatedExecutionPlanSchema`](../variables/generatedExecutionPlanSchema.md)\>

Defined in: packages/ai/src/runtime/plan.ts:28

Canonical planner output schema used by context.plan.generate.

The planner produces business-level sequential tasks only. Routing to worker/delegates
is resolved at execution time via [AgentExecutionPlan](AgentExecutionPlan.md).
