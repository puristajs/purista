[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentPlanExecutionContext

# Type Alias: AgentPlanExecutionContext\<Context\>

> **AgentPlanExecutionContext**\<`Context`\> = `object`

Defined in: packages/ai/src/runtime/plan.ts:46

Input passed to worker/delegate executors for each generated task.

## Type Parameters

### Context

`Context`

## Properties

### context

> **context**: `Context`

Defined in: packages/ai/src/runtime/plan.ts:47

***

### request

> **request**: `string`

Defined in: packages/ai/src/runtime/plan.ts:48

***

### results

> **results**: `Record`\<`string`, `unknown`\>

Defined in: packages/ai/src/runtime/plan.ts:51

***

### run

> **run**: [`AgentRunHandle`](AgentRunHandle.md)

Defined in: packages/ai/src/runtime/plan.ts:50

***

### task

> **task**: [`AgentPlanTask`](AgentPlanTask.md)

Defined in: packages/ai/src/runtime/plan.ts:49
