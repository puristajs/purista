[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, CommandTools, AgentTools\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`\> = `object`

Defined in: [builder/types.ts:198](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L198)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`never`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`never`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`never`, `never`\>

## Properties

### emit

> **emit**: `unknown`

Defined in: [builder/types.ts:212](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L212)

emit a custom message through the owning PURISTA service

***

### harness

> **harness**: `object`

Defined in: [builder/types.ts:229](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L229)

#### events

> **events**: `object`

##### events.emit()

> **emit**(`event`): `Promise`\<`void`\>

###### Parameters

###### event

`RunEvent`

###### Returns

`Promise`\<`void`\>

#### models

> **models**: `AgentHandlerModelBindings`\<`Models`\>

#### session

> **session**: `Session`\<`any`\>

***

### identity

> **identity**: [`AgentRunIdentity`](AgentRunIdentity.md)

Defined in: [builder/types.ts:208](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L208)

***

### invoke

> **invoke**: `object`

Defined in: [builder/types.ts:236](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L236)

#### agents

> **agents**: `AgentInvokeMap`\<`AgentTools`\>

#### tools

> **tools**: `CommandToolInvokeMap`\<`CommandTools`\>

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: [builder/types.ts:240](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L240)

***

### message

> **message**: `unknown`

Defined in: [builder/types.ts:210](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L210)

the original PURISTA message context

***

### parameter

> **parameter**: `Parameter`

Defined in: [builder/types.ts:207](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L207)

***

### payload

> **payload**: `Payload`

Defined in: [builder/types.ts:206](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L206)

***

### queue

> **queue**: `unknown`

Defined in: [builder/types.ts:218](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L218)

PURISTA queue helpers from the owning handler context

***

### resources

> **resources**: `Resources`

Defined in: [builder/types.ts:228](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L228)

Provides resources defined on the service builder and supplied during
service instantiation.

#### Example

```ts
const result = await context.resources.repository.findById(context.payload.id)
```

***

### service

> **service**: `unknown`

Defined in: [builder/types.ts:214](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L214)

typed PURISTA command invocation proxy when declarations are available

***

### signal

> **signal**: `AbortSignal`

Defined in: [builder/types.ts:241](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L241)

***

### stream

> **stream**: `unknown`

Defined in: [builder/types.ts:216](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L216)

typed PURISTA stream invocation proxy when declarations are available
