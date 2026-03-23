[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder\<ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases, AgentInvokes, SkillNames\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:341](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L341)

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

### SkillNames

`SkillNames` *extends* `string` = `never`

## Constructors

### Constructor

> **new AgentBuilder**\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>(`info`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:370](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L370)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:741](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L741)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:734](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L734)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:726](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L726)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:714](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L714)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1968](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L1968)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:690](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L690)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### canInvoke()

> **canInvoke**(`serviceName`, `serviceVersion`, `commandName`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:567](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L567)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:607](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L607)

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

`Parameter` | [`AgentInvokeConfig`](../type-aliases/AgentInvokeConfig.md)\<`Payload`, `Parameter`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`\>

***

### defineModel()

> **defineModel**\<`Alias`, `Caps`\>(`alias`, `options?`): `AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:414](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L414)

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

`AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`\>

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:779](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L779)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:831](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L831)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:516](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L516)

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

Defined in: [packages/ai/src/builder/AgentBuilder.ts:517](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L517)

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

> **prepareCall**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:764](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L764)

Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### prepareStep()

> **prepareStep**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:774](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L774)

Registers a step-aware hook invoked for each model call.

Use this when call options need to change across iterative refinement passes.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setCallOptionsSchema()

> **setCallOptionsSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:756](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L756)

Sets a validation schema for model call options returned by [prepareCall](#preparecall) / [prepareStep](#preparestep).

The schema is validated for every hook result before metadata is merged into model requests.

#### Parameters

##### schema

`ZodType`\<[`AgentModelCallOptions`](../type-aliases/AgentModelCallOptions.md)\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:747](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L747)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:396](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L396)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:706](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L706)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setExecutionMode()

> **setExecutionMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:536](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L536)

#### Parameters

##### mode

[`AgentExecutionMode`](../type-aliases/AgentExecutionMode.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:541](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L541)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`fn`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:839](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L839)

#### Type Parameters

##### Payload

`Payload` = `unknown`

##### Parameter

`Parameter` = `unknown`

##### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

##### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = [`DeclaredModelMap`](../type-aliases/DeclaredModelMap.md)\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

#### Parameters

##### fn

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `AgentInvokes`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:722](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L722)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:563](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L563)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:553](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L553)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:558](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L558)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:528](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L528)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setSseProtocol()

> **setSseProtocol**(`protocol`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:822](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L822)

Selects the SSE wire protocol for exposed stream endpoints.

Defaults to `purista` when not set.
This setting is only relevant when `streamingMode` is `stream`.

#### Parameters

##### protocol

[`AgentSseProtocol`](../type-aliases/AgentSseProtocol.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:807](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L807)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:696](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L696)

#### Parameters

##### eventName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:701](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L701)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### useConversationStore()

> **useConversationStore**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:461](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L461)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:401](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L401)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### useResource()

> **useResource**(`alias`, `resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:406](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L406)

#### Parameters

##### alias

`string`

##### resource

###### resourceName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`\>

***

### useSkills()

> **useSkills**\<`Names`\>(`skillNames`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\]\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:466](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L466)

#### Type Parameters

##### Names

`Names` *extends* readonly `string`[]

#### Parameters

##### skillNames

`Names`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\]\>
