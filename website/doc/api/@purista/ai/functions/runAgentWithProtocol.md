[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / runAgentWithProtocol

# Function: runAgentWithProtocol()

> **runAgentWithProtocol**(`context`, `runner`, `options?`): `Promise`\<`object`[]\>

Defined in: [packages/ai/src/protocol/purista.ts:101](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/protocol/purista.ts#L101)

Utility used by commands and subscriptions to wrap an [AgentExecutor](../classes/AgentExecutor.md) call
so protocol envelopes (message + telemetry + errors) are emitted consistently.

## Parameters

### context

[`ContextBase`](../../core/type-aliases/ContextBase.md) & `object`

### runner

() => `Promise`\<[`AgentExecutionResult`](../type-aliases/AgentExecutionResult.md)\>

### options?

[`AgentProtocolRunOptions`](../type-aliases/AgentProtocolRunOptions.md)

## Returns

`Promise`\<`object`[]\>
