[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder\<ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases, AgentInvokes\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:336](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L336)

## Type Parameters

### ModelAliases

`ModelAliases` *extends* `string` = `never`

### TextAliases

`TextAliases` *extends* `string` = `never`

### StreamAliases

`StreamAliases` *extends* `string` = `never`

### EmbeddingAliases

`EmbeddingAliases` *extends* `string` = `never`

### RerankAliases

`RerankAliases` *extends* `string` = `never`

### ObjectAliases

`ObjectAliases` *extends* `string` = `never`

### AgentInvokes

`AgentInvokes` *extends* [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md) = [`AgentInvokeList`](../../core/type-aliases/AgentInvokeList.md)

## Constructors

### Constructor

> **new AgentBuilder**\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>(`info`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:364](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L364)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:692](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L692)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:685](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L685)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:677](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L677)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:665](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L665)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1840](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L1840)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:641](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L641)

#### Type Parameters

##### EventName

`EventName` *extends* `string`

##### T

`T` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### eventName

`EventName`

##### schema

`T`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### canInvoke()

> **canInvoke**(`serviceName`, `serviceVersion`, `commandName`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:520](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L520)

#### Parameters

##### serviceName

`string`

##### serviceVersion

`string`

##### commandName

`string`

##### outputSchema?

[`Schema`](../../core/type-aliases/Schema.md)

##### payloadSchema?

[`Schema`](../../core/type-aliases/Schema.md)

##### parameterSchema?

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:560](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L560)

#### Type Parameters

##### Payload

`Payload` *extends* [`Schema`](../../core/type-aliases/Schema.md) = `ZodObject`\<\{ `attachments`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `conversationId`: `ZodOptional`\<`ZodString`\>; `history`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `message`: `ZodString`; \}, `$loose`\>

##### Parameter

`Parameter` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

##### SName

`SName` *extends* `string` = `string`

##### Version

`Version` *extends* `string` = `string`

#### Parameters

##### agentName

`SName`

##### agentVersion

`Version`

##### invokeConfigOrParameterSchema?

`Parameter` | `AgentInvokeConfig`\<`Payload`, `Parameter`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>

***

### defineModel()

> **defineModel**\<`Alias`, `Caps`\>(`alias`, `options?`): `AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| `ResolveCapability`\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| `ResolveCapability`\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| `ResolveCapability`\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| `ResolveCapability`\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| `ResolveCapability`\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:408](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L408)

#### Type Parameters

##### Alias

`Alias` *extends* `string`

##### Caps

`Caps` *extends* readonly [`AgentModelCapability`](../type-aliases/AgentModelCapability.md)[] \| `undefined` = `undefined`

#### Parameters

##### alias

`Alias`

##### options?

###### capabilities?

`Caps`

#### Returns

`AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| `ResolveCapability`\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| `ResolveCapability`\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| `ResolveCapability`\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| `ResolveCapability`\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| `ResolveCapability`\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`\>

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:730](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L730)

#### Parameters

##### method

`string`

##### path

`string`

##### contentTypeRequest?

`string`

##### contentEncodingRequest?

`string`

##### contentTypeResponse?

`string`

##### contentEncodingResponse?

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:782](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L782)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:469](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L469)

Configure conversation persistence.

You can either pass a full config object or use presets:
- `persistConversation('user')` defaults to full strategy with a larger frame budget
- `persistConversation('agent')` defaults to summary strategy with a smaller frame budget

##### Parameters

###### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

##### Returns

`this`

##### Example

```ts
new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .persistConversation('user')
```

#### Call Signature

> **persistConversation**(`preset`, `overrides?`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:470](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L470)

Configure conversation persistence.

You can either pass a full config object or use presets:
- `persistConversation('user')` defaults to full strategy with a larger frame budget
- `persistConversation('agent')` defaults to summary strategy with a smaller frame budget

##### Parameters

###### preset

[`AgentHistoryPreset`](../type-aliases/AgentHistoryPreset.md)

###### overrides?

`Partial`\<[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)\>

##### Returns

`this`

##### Example

```ts
new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .persistConversation('user')
```

***

### prepareCall()

> **prepareCall**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:715](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L715)

Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### prepareStep()

> **prepareStep**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:725](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L725)

Registers a step-aware hook invoked for each model call.

Use this when call options need to change across iterative refinement passes.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setCallOptionsSchema()

> **setCallOptionsSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:707](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L707)

Sets a validation schema for model call options returned by [prepareCall](#preparecall) / [prepareStep](#preparestep).

The schema is validated for every hook result before metadata is merged into model requests.

#### Parameters

##### schema

`ZodType`\<[`AgentModelCallOptions`](../type-aliases/AgentModelCallOptions.md)\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:698](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L698)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:390](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L390)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:657](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L657)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setExecutionMode()

> **setExecutionMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:489](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L489)

#### Parameters

##### mode

[`AgentExecutionMode`](../type-aliases/AgentExecutionMode.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:494](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L494)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`fn`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:790](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L790)

#### Type Parameters

##### Payload

`Payload` = `unknown`

##### Parameter

`Parameter` = `unknown`

##### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

##### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `DeclaredModelMap`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

#### Parameters

##### fn

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:673](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L673)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:516](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L516)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:506](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L506)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:511](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L511)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:481](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L481)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setSseProtocol()

> **setSseProtocol**(`protocol`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:773](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L773)

Selects the SSE wire protocol for exposed stream endpoints.

Defaults to `purista` when not set.
This setting is only relevant when `streamingMode` is `stream`.

#### Parameters

##### protocol

[`AgentSseProtocol`](../type-aliases/AgentSseProtocol.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:758](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L758)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:647](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L647)

#### Parameters

##### eventName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:652](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L652)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useConversationStore()

> **useConversationStore**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:451](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L451)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:395](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L395)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useResource()

> **useResource**(`alias`, `resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:400](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/builder/AgentBuilder.ts#L400)

#### Parameters

##### alias

`string`

##### resource

###### resourceName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>
