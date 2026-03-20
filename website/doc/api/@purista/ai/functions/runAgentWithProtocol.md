[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / runAgentWithProtocol

# Function: runAgentWithProtocol()

> **runAgentWithProtocol**(`context`, `runner`, `options?`): `Promise`\<`object`[]\>

Defined in: [packages/ai/src/protocol/purista.ts:101](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/protocol/purista.ts#L101)

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
