[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentInvokeHelpers

# Type Alias: AgentInvokeHelpers\<AgentInvokes\>

> **AgentInvokeHelpers**\<`AgentInvokes`\> = `object`

Defined in: [packages/ai/src/runtime/context.ts:911](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L911)

## Type Parameters

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Properties

### invoke

> **invoke**: `AgentInvokes` & (`options`) => `Promise`\<[`AgentProtocolEnvelope`](AgentProtocolEnvelope.md)[]\>

Defined in: [packages/ai/src/runtime/context.ts:918](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L918)

Invokes another agent via EventBridge and returns its emitted envelopes.
Supports both direct options-based calls and typed chained access:
`context.invoke.agents.invoke({ agentName, serviceVersion, payload })`
and `context.invoke.agents.invoke.someAgent['1'].call(payload, parameter)`.

## Methods

### forward()

> **forward**(`options`): `Promise`\<`object`[]\>

Defined in: [packages/ai/src/runtime/context.ts:933](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L933)

Invokes another agent and forwards its live output into the current stream.
Defaults to forwarding assistant text, reasoning, artifacts, and errors while suppressing
synthetic outer `agent.run` tool telemetry.

#### Parameters

##### options

[`AgentForwardInvocationOptions`](AgentForwardInvocationOptions.md)

#### Returns

`Promise`\<`object`[]\>

***

### runObject()

#### Call Signature

> **runObject**\<`AgentName`, `ServiceVersion`\>(`options`): `Promise`\<`AgentInvokeOutput`\<`AgentInvokes`, `AgentName`, `ServiceVersion`\>\>

Defined in: [packages/ai/src/runtime/context.ts:937](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L937)

Invokes another agent and resolves its canonical structured `output` artifact.

##### Type Parameters

###### AgentName

`AgentName` *extends* `string`

###### ServiceVersion

`ServiceVersion` *extends* `string`

##### Parameters

###### options

[`AgentInvocationOptionsFor`](AgentInvocationOptionsFor.md)\<`AgentInvokes`, `AgentName`, `ServiceVersion`\>

##### Returns

`Promise`\<`AgentInvokeOutput`\<`AgentInvokes`, `AgentName`, `ServiceVersion`\>\>

#### Call Signature

> **runObject**\<`T`\>(`options`): `Promise`\<`T`\>

Defined in: [packages/ai/src/runtime/context.ts:940](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L940)

##### Type Parameters

###### T

`T` = `unknown`

##### Parameters

###### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

##### Returns

`Promise`\<`T`\>

***

### runText()

> **runText**(`options`): `Promise`\<`string`\>

Defined in: [packages/ai/src/runtime/context.ts:927](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L927)

Invokes another agent and extracts a best-effort assistant text output from message frames.

#### Parameters

##### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

#### Returns

`Promise`\<`string`\>

***

### stream()

> **stream**(`options`): [`AgentInvocationPipeline`](AgentInvocationPipeline.md)

Defined in: [packages/ai/src/runtime/context.ts:923](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L923)

Invokes another agent as a protocol-first stream pipeline for forwarding,
tapping, collecting, and custom writer composition.

#### Parameters

##### options

[`AgentInvocationOptions`](AgentInvocationOptions.md)

#### Returns

[`AgentInvocationPipeline`](AgentInvocationPipeline.md)
