[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, CommandTools, AgentTools\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`\> = `object`

Defined in: ai/src/builder/types.ts:158

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`string`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`string`, `never`\>

## Properties

### app

> **app**: `object`

Defined in: ai/src/builder/types.ts:169

#### emit

> **emit**: `unknown`

#### message

> **message**: `unknown`

#### queue

> **queue**: `unknown`

#### resources

> **resources**: `Resources`

#### service

> **service**: `unknown`

#### stream

> **stream**: `unknown`

***

### harness

> **harness**: `object`

Defined in: ai/src/builder/types.ts:177

#### events

> **events**: `object`

##### events.emit()

> **emit**(`event`): `Promise`\<`void`\>

###### Parameters

###### event

[`RunEvent`](RunEvent.md)

###### Returns

`Promise`\<`void`\>

#### models

> **models**: `AgentHandlerModelBindings`\<`Models`\>

#### session

> **session**: [`Session`](../interfaces/Session.md)\<`any`\>

***

### identity

> **identity**: [`AgentRunIdentity`](AgentRunIdentity.md)

Defined in: ai/src/builder/types.ts:168

***

### invoke

> **invoke**: `object`

Defined in: ai/src/builder/types.ts:184

#### agents

> **agents**: `AgentInvokeMap`\<`AgentTools`\>

#### tools

> **tools**: `CommandToolInvokeMap`\<`CommandTools`\>

***

### logger

> **logger**: [`Logger`](../../core/classes/Logger.md)

Defined in: ai/src/builder/types.ts:188

***

### parameter

> **parameter**: `Parameter`

Defined in: ai/src/builder/types.ts:167

***

### payload

> **payload**: `Payload`

Defined in: ai/src/builder/types.ts:166

***

### signal

> **signal**: `AbortSignal`

Defined in: ai/src/builder/types.ts:189
