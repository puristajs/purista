[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createAgentPlanHelpers

# Function: createAgentPlanHelpers()

> **createAgentPlanHelpers**\<`Context`, `Models`\>(`input`): [`AgentPlanHelpers`](../type-aliases/AgentPlanHelpers.md)\<`Context`, `Models`\>

Defined in: packages/ai/src/runtime/plan.ts:392

Creates planner helpers exposed as `context.plan`.

The returned helpers implement the strict split between:
- plan generation (`generate`)
- sequential execution (`execute`)

## Type Parameters

### Context

`Context` *extends* `object`

### Models

`Models` *extends* `Record`\<`string`, \{ `generateObject?`: (...`args`) => `Promise`\<`any`\>; \}\>

## Parameters

### input

`CreateAgentPlanHelpersInput`\<`Context`, `Models`\>

## Returns

[`AgentPlanHelpers`](../type-aliases/AgentPlanHelpers.md)\<`Context`, `Models`\>
