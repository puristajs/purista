[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder\<ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases, AgentInvokes, SkillNames, Resources, EmitPayloads, ConfigType, ConfigInputType\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:390](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L390)

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

### Resources

`Resources` *extends* [`AgentDeclaredResourceMap`](../type-aliases/AgentDeclaredResourceMap.md) = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### EmitPayloads

`EmitPayloads` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigType

`ConfigType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInputType

`ConfigInputType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Constructors

### Constructor

> **new AgentBuilder**\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>(`info`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:445](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L445)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1097](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1097)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1090](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1090)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1082](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1082)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1070](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1070)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`, `Resources`, `ConfigInputType`, `ConfigType`, `EmitPayloads`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:2686](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L2686)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`, `Resources`, `ConfigInputType`, `ConfigType`, `EmitPayloads`\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads` & `{ [K in string]: InferIn<T> }`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:907](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L907)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads` & `{ [K in string]: InferIn<T> }`, `ConfigType`, `ConfigInputType`\>

***

### canInvoke()

> **canInvoke**(`serviceName`, `serviceVersion`, `commandName`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:776](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L776)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:816](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L816)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### defineModel()

> **defineModel**\<`Alias`, `Caps`\>(`alias`, `options?`): `AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:567](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L567)

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

`AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourceType`\>(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources` & `{ [K in string]: ResourceType }`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:544](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L544)

Declare that the agent requires a runtime resource passed through `getInstance(..., { resources })`.

This follows the same builder-time declaration pattern as services.

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourceType

`ResourceType`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources` & `{ [K in string]: ResourceType }`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

#### Example

```ts
new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .defineResource<'sandbox', SandboxExecutionResource>()
```

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1135](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1135)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### getAfterGuardHook()

> **getAfterGuardHook**(`name`): [`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`any`, `any`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1048](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1048)

#### Parameters

##### name

`string`

#### Returns

[`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`any`, `any`\>

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`any`, `any`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:994](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L994)

#### Parameters

##### name

`string`

#### Returns

[`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`any`, `any`\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1187](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1187)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:520](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L520)

Mark the agent endpoints as deprecated.

This mirrors the core builder behavior and propagates deprecation metadata to the underlying run command and stream.

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:685](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L685)

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

Defined in: [packages/ai/src/builder/AgentBuilder.ts:686](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L686)

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

> **prepareCall**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1120](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1120)

Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### prepareStep()

> **prepareStep**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1130](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1130)

Registers a step-aware hook invoked for each model call.

Use this when call options need to change across iterative refinement passes.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`hooks`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1001](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1001)

Register one or more guard hooks that run after the agent handler logic completed successfully.

#### Parameters

##### hooks

`Record`\<`string`, [`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`unknown`, `unknown`\>\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setAgentPolicy()

> **setAgentPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:722](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L722)

#### Parameters

##### policy

[`AgentPolicy`](../type-aliases/AgentPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`hooks`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:949](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L949)

Register one or more guard hooks that run before the agent handler logic executes.

Use before guards for request-policy concerns like auth, quota checks, or tenant validation.
Keep business logic in the handler itself.

#### Parameters

##### hooks

`Record`\<`string`, [`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`unknown`, `unknown`\>\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setCallOptionsSchema()

> **setCallOptionsSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1112](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1112)

Sets a validation schema for model call options returned by [prepareCall](#preparecall) / [prepareStep](#preparestep).

The schema is validated for every hook result before metadata is merged into model requests.

#### Parameters

##### schema

`ZodType`\<[`AgentModelCallOptions`](../type-aliases/AgentModelCallOptions.md)\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:487](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L487)

Declare the shape of host-provided runtime config passed through `getInstance(..., { config })`.

Use this for agent-specific configuration that varies by environment, deployment, or tenant.
Do not use it for concrete runtime dependencies like model providers or queue bridges.

#### Type Parameters

##### T

`T` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`T`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

#### Example

```ts
const supportAgent = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .setConfigSchema(z.object({ locale: z.string().default('en') }))
```

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1103](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1103)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setDefaultConfig()

> **setDefaultConfig**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:510](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L510)

Provide default values for the runtime config declared via [setConfigSchema](#setconfigschema).

These defaults are merged before validation and can still be overridden via `getInstance(..., { config })`.

#### Parameters

##### config

[`Complete`](../../core/type-aliases/Complete.md)\<`ConfigType`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:470](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L470)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1062](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1062)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setExecutionMode()

> **setExecutionMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:705](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L705)

#### Parameters

##### mode

[`AgentExecutionMode`](../type-aliases/AgentExecutionMode.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:710](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L710)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `HandlerResources`, `Models`\>(`fn`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1195](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1195)

#### Type Parameters

##### Payload

`Payload` = `unknown`

##### Parameter

`Parameter` = `unknown`

##### HandlerResources

`HandlerResources` *extends* `Record`\<`string`, `unknown`\> = `Resources`

##### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = [`DeclaredModelMap`](../type-aliases/DeclaredModelMap.md)\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\>

#### Parameters

##### fn

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `HandlerResources`, `Models`, `AgentInvokes`, `EmitPayloads`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1078](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1078)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:772](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L772)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:762](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L762)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setReflectionPolicy()

> **setReflectionPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:750](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L750)

#### Parameters

##### policy

[`ReflectionPolicy`](../type-aliases/ReflectionPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:767](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L767)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:697](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L697)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setSseProtocol()

> **setSseProtocol**(`protocol`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1178](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1178)

Selects the SSE wire protocol for exposed stream endpoints.

Defaults to `purista` when not set.
This setting is only relevant when `streamingMode` is `stream`.

#### Parameters

##### protocol

[`AgentSseProtocol`](../type-aliases/AgentSseProtocol.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1163](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1163)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1052](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1052)

#### Parameters

##### eventName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1057](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L1057)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### useConversationStore()

> **useConversationStore**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:622](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L622)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:562](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L562)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

***

### useSkills()

> **useSkills**\<`Names`\>(`skillNames`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\], `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:627](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L627)

#### Type Parameters

##### Names

`Names` *extends* readonly `string`[]

#### Parameters

##### skillNames

`Names`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\], `Resources`, `EmitPayloads`, `ConfigType`, `ConfigInputType`\>
