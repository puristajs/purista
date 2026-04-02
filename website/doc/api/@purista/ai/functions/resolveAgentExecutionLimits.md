[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / resolveAgentExecutionLimits

# Function: resolveAgentExecutionLimits()

> **resolveAgentExecutionLimits**(`policy`, `reflectionPolicy`, `executionPolicy`, `profileName?`): `object`

Defined in: [packages/ai/src/runtime/policy.ts:91](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/runtime/policy.ts#L91)

## Parameters

### policy

[`AgentPolicy`](../type-aliases/AgentPolicy.md) | `undefined`

### reflectionPolicy

[`ReflectionPolicy`](../type-aliases/ReflectionPolicy.md) | `undefined`

### executionPolicy

\{ `maxModelSteps?`: `number`; `maxToolCalls?`: `number`; \} | `undefined`

### profileName?

`string`

## Returns

`object`

### maxModelSteps

> **maxModelSteps**: `number` \| `undefined`

### maxToolCalls

> **maxToolCalls**: `number` \| `undefined`

### profile

> **profile**: [`ResolvedAgentQualityProfile`](../type-aliases/ResolvedAgentQualityProfile.md)
