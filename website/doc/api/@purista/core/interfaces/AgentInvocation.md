[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentInvocation

# Interface: AgentInvocation\<T\>

Defined in: [core/types/agent/AgentProtocol.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/agent/AgentProtocol.ts#L46)

The agent invocation interface.

## Extends

- `AsyncIterable`\<`any`\>

## Type Parameters

### T

`T` = [`AgentProtocolResponse`](../type-aliases/AgentProtocolResponse.md)

## Methods

### final()

> **final**(): `Promise`\<`T`\>

Defined in: [core/types/agent/AgentProtocol.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/agent/AgentProtocol.ts#L50)

Returns a promise that resolves to the full, final response.

#### Returns

`Promise`\<`T`\>
