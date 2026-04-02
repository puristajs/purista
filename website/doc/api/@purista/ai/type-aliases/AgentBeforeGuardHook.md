[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBeforeGuardHook

# Type Alias: AgentBeforeGuardHook()\<Payload, Parameter\>

> **AgentBeforeGuardHook**\<`Payload`, `Parameter`\> = (`context`, `payload`, `parameter`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:83](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/builder/AgentBuilder.ts#L83)

Guard hook that runs before the agent handler executes.

Use before-guards for short request policy checks such as auth, quota, or
lightweight validation that is more specific than payload schema validation.

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

## Returns

`Promise`\<`void`\> \| `void`
