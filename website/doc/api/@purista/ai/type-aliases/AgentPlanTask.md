[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanTask

# Type Alias: AgentPlanTask

> **AgentPlanTask** = [`AgentRunTaskInput`](AgentRunTaskInput.md) & `object`

Defined in: packages/ai/src/runtime/plan.ts:36

Runtime task shape used during plan execution.

This extends persisted run-state task metadata with planner fields
(`instruction`, optional `delegate`) so a task can be executed deterministically.

## Type Declaration

### delegate?

> `optional` **delegate**: `string`

### id

> **id**: `string`

### instruction

> **instruction**: `string`

### title

> **title**: `string`
