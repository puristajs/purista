[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentHandlerContext

# Type Alias: AgentHandlerContext\<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Metrics\>

> **AgentHandlerContext**\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Metrics`\> = `object`

Defined in: [AgentQueueBuilder/types.ts:201](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L201)

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

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)

## Properties

### emit

> **emit**: `unknown`

Defined in: [AgentQueueBuilder/types.ts:216](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L216)

emit a custom message through the owning PURISTA service

***

### harness

> **harness**: `object`

Defined in: [AgentQueueBuilder/types.ts:235](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L235)

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

Defined in: [AgentQueueBuilder/types.ts:212](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L212)

***

### invoke

> **invoke**: `object`

Defined in: [AgentQueueBuilder/types.ts:242](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L242)

#### agents

> **agents**: `AgentInvokeMap`\<`AgentTools`\>

#### tools

> **tools**: `CommandToolInvokeMap`\<`CommandTools`\>

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [AgentQueueBuilder/types.ts:246](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L246)

***

### message

> **message**: `unknown`

Defined in: [AgentQueueBuilder/types.ts:214](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L214)

the original PURISTA message context

***

### metrics

> **metrics**: `PuristaMetricContext`\<`Metrics`\>

Defined in: [AgentQueueBuilder/types.ts:234](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L234)

typed custom metrics declared on the service and this agent builder

***

### parameter

> **parameter**: `Parameter`

Defined in: [AgentQueueBuilder/types.ts:211](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L211)

***

### payload

> **payload**: `Payload`

Defined in: [AgentQueueBuilder/types.ts:210](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L210)

***

### queue

> **queue**: `unknown`

Defined in: [AgentQueueBuilder/types.ts:222](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L222)

PURISTA queue helpers from the owning handler context

***

### resources

> **resources**: `Resources`

Defined in: [AgentQueueBuilder/types.ts:232](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L232)

Provides resources defined on the service builder and supplied during
service instantiation.

#### Example

```ts
const result = await context.resources.repository.findById(context.payload.id)
```

***

### service

> **service**: `unknown`

Defined in: [AgentQueueBuilder/types.ts:218](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L218)

typed PURISTA command invocation proxy when declarations are available

***

### signal

> **signal**: `AbortSignal`

Defined in: [AgentQueueBuilder/types.ts:247](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L247)

***

### stream

> **stream**: `unknown`

Defined in: [AgentQueueBuilder/types.ts:220](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L220)

typed PURISTA stream invocation proxy when declarations are available
