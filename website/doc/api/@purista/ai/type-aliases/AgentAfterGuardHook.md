[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentAfterGuardHook

# Type Alias: AgentAfterGuardHook()\<Payload, Parameter\>

> **AgentAfterGuardHook**\<`Payload`, `Parameter`\> = (`context`, `payload`, `parameter`, `result`) => `Promise`\<`void`\> \| `void`

Defined in: packages/ai/src/types/AgentHandler.ts:11

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
