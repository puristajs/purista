[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder\<KnowledgeAliases, ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases, AgentInvokes\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:339](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L339)

## Type Parameters

### KnowledgeAliases

`KnowledgeAliases` *extends* `string` = `never`

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

> **new AgentBuilder**\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>(`info`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:374](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L374)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:755](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L755)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:748](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L748)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:740](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L740)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:728](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L728)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`KnowledgeAliases`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1903](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L1903)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`KnowledgeAliases`\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:704](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L704)

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

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### canInvoke()

> **canInvoke**(`serviceName`, `serviceVersion`, `commandName`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:581](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L581)

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

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:621](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L621)

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

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>\>

***

### defineModel()

> **defineModel**\<`Alias`, `Caps`\>(`alias`, `options?`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases` \| `Alias`, `TextAliases` \| `ResolveCapability`\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| `ResolveCapability`\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| `ResolveCapability`\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| `ResolveCapability`\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| `ResolveCapability`\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:418](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L418)

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

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases` \| `Alias`, `TextAliases` \| `ResolveCapability`\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| `ResolveCapability`\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| `ResolveCapability`\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| `ResolveCapability`\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| `ResolveCapability`\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`\>

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:793](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L793)

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

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:845](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L845)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:525](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L525)

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

Defined in: [packages/ai/src/builder/AgentBuilder.ts:526](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L526)

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

> **prepareCall**(`hook`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:778](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L778)

Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### prepareStep()

> **prepareStep**(`hook`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:788](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L788)

Registers a step-aware hook invoked for each model call.

Use this when call options need to change across iterative refinement passes.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setCallOptionsSchema()

> **setCallOptionsSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:770](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L770)

Sets a validation schema for model call options returned by [prepareCall](#preparecall) / [prepareStep](#preparestep).

The schema is validated for every hook result before metadata is merged into model requests.

#### Parameters

##### schema

`ZodType`\<[`AgentModelCallOptions`](../type-aliases/AgentModelCallOptions.md)\>

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:761](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L761)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:400](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L400)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:720](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L720)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setExecutionMode()

> **setExecutionMode**(`mode`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:545](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L545)

#### Parameters

##### mode

[`AgentExecutionMode`](../type-aliases/AgentExecutionMode.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:550](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L550)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`fn`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:853](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L853)

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

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `KnowledgeAliases`, `AgentInvokes`\>

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:736](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L736)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setKnowledge()

> **setKnowledge**(`adapters`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:576](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L576)

#### Parameters

##### adapters

[`KnowledgeAdapterConfig`](../type-aliases/KnowledgeAdapterConfig.md)[] | `undefined`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:572](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L572)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:562](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L562)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:567](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L567)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:537](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L537)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setSseProtocol()

> **setSseProtocol**(`protocol`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:836](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L836)

Selects the SSE wire protocol for exposed stream endpoints.

Defaults to `purista` when not set.
This setting is only relevant when `streamingMode` is `stream`.

#### Parameters

##### protocol

[`AgentSseProtocol`](../type-aliases/AgentSseProtocol.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:821](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L821)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:710](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L710)

#### Parameters

##### eventName

`string`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:715](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L715)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useConversationStore()

> **useConversationStore**(`config`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:463](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L463)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:405](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L405)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

***

### useKnowledgeAdapter()

#### Call Signature

> **useKnowledgeAdapter**\<`Alias`\>(`adapterName`, `options?`): `AgentBuilder`\<`KnowledgeAliases` \| `Alias`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:468](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L468)

##### Type Parameters

###### Alias

`Alias` *extends* `string`

##### Parameters

###### adapterName

`Alias`

###### options?

`Record`\<`string`, `unknown`\>

##### Returns

`AgentBuilder`\<`KnowledgeAliases` \| `Alias`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

#### Call Signature

> **useKnowledgeAdapter**\<`Adapter`\>(`adapter`): `AgentBuilder`\<`KnowledgeAliases` \| `Adapter`\[`"adapterName"`\], `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:480](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L480)

##### Type Parameters

###### Adapter

`Adapter` *extends* `object`

##### Parameters

###### adapter

`Adapter`

##### Returns

`AgentBuilder`\<`KnowledgeAliases` \| `Adapter`\[`"adapterName"`\], `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

***

### useResource()

> **useResource**(`alias`, `resource`): `AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:410](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/builder/AgentBuilder.ts#L410)

#### Parameters

##### alias

`string`

##### resource

###### resourceName

`string`

#### Returns

`AgentBuilder`\<`KnowledgeAliases`, `ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`\>
