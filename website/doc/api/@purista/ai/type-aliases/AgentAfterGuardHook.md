[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentAfterGuardHook

# Type Alias: AgentAfterGuardHook()\<Payload, Parameter\>

> **AgentAfterGuardHook**\<`Payload`, `Parameter`\> = (`context`, `payload`, `parameter`, `result`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:95](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/builder/AgentBuilder.ts#L95)

Guard hook that runs after the agent handler completes successfully.

Use after-guards for cheap audit or policy side effects. Keep them small and
deterministic, just like command and stream guard hooks in core builders.

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

## Parameters

### context

[`CommandFunctionContext`](../../core/type-aliases/CommandFunctionContext.md) | [`StreamFunctionContext`](../../core/type-aliases/StreamFunctionContext.md)

### payload

`Payload`

### parameter

`Parameter`

### result

[`AgentHandlerResult`](AgentHandlerResult.md)

## Returns

`Promise`\<`void`\> \| `void`
