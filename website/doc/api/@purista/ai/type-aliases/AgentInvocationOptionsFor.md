[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvocationOptionsFor

# Type Alias: AgentInvocationOptionsFor\<AgentInvokes, AgentName, ServiceVersion\>

> **AgentInvocationOptionsFor**\<`AgentInvokes`, `AgentName`, `ServiceVersion`\> = `Omit`\<[`AgentInvocationOptions`](AgentInvocationOptions.md), `"agentName"` \| `"serviceVersion"` \| `"outputSchema"`\> & `object`

Defined in: [packages/ai/src/runtime/context.ts:901](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L901)

## Type Declaration

### agentName

> **agentName**: `AgentName`

### outputSchema?

> `optional` **outputSchema**: `AgentInvokeOutputSchema`\<`AgentInvokes`, `AgentName`, `ServiceVersion`\>

### serviceVersion

> **serviceVersion**: `ServiceVersion`

## Type Parameters

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

### AgentName

`AgentName` *extends* `string`

### ServiceVersion

`ServiceVersion` *extends* `string`
