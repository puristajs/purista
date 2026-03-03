[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentInvokeList

# Type Alias: AgentInvokeList

> **AgentInvokeList** = `Record`\<`string`, `Record`\<`string`, \{ `call?`: (`payload`, `parameter?`) => [`AgentInvocation`](../interfaces/AgentInvocation.md)\<[`AgentProtocolResponse`](AgentProtocolResponse.md)\>; `parameterSchema?`: [`Schema`](Schema.md); \}\>\>

Defined in: core/types/agent/AgentInvokeList.ts:9

The list of agents which can be invoked by a command, subscription or stream.
