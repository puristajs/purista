[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBeforeGuardHook

# Type Alias: AgentBeforeGuardHook()\<Payload, Parameter\>

> **AgentBeforeGuardHook**\<`Payload`, `Parameter`\> = (`context`, `payload`, `parameter`) => `Promise`\<`void`\> \| `void`

Defined in: packages/ai/src/types/AgentHandler.ts:5

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
