[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder\<ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases, AgentInvokes, SkillNames, Resources, ConfigType, ConfigInputType\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:375](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L375)

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

### ConfigType

`ConfigType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

### ConfigInputType

`ConfigInputType` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](../../core/type-aliases/EmptyObject.md)

## Constructors

### Constructor

> **new AgentBuilder**\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>(`info`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:421](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L421)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:960](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L960)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:953](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L953)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:945](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L945)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:933](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L933)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`, `Resources`, `ConfigInputType`, `ConfigType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:2168](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L2168)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`SkillNames`, `Resources`, `ConfigInputType`, `ConfigType`\>

***

### canEmit()

> **canEmit**\<`EventName`, `T`\>(`eventName`, `schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:876](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L876)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### canInvoke()

> **canInvoke**(`serviceName`, `serviceVersion`, `commandName`, `outputSchema?`, `payloadSchema?`, `parameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:747](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L747)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Payload`, `Parameter`, `SName`, `Version`\>(`agentName`, `agentVersion`, `invokeConfigOrParameterSchema?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:787](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L787)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes` & `Record`\<`SName`, `Record`\<`Version`, \{ `call`: (`payload`, `parameter?`) => [`AgentInvocation`](../../core/interfaces/AgentInvocation.md)\<\{ `history`: `any`[]; `message`: `any`; \}\>; \}\>\>, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### defineModel()

> **defineModel**\<`Alias`, `Caps`\>(`alias`, `options?`): `AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:582](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L582)

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

`AgentBuilder`\<`ModelAliases` \| `Alias`, `TextAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"text"`\> *extends* `true` ? `Alias` : `never`, `StreamAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"stream"`\> *extends* `true` ? `Alias` : `never`, `EmbeddingAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"embedding"`\> *extends* `true` ? `Alias` : `never`, `RerankAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"rerank"`\> *extends* `true` ? `Alias` : `never`, `ObjectAliases` \| [`ResolveCapability`](../type-aliases/ResolveCapability.md)\<`Caps`, `"json"`\> *extends* `true` ? `Alias` : `never`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### defineResource()

> **defineResource**\<`ResourceName`, `ResourceType`\>(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources` & `{ [K in string]: ResourceType }`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:549](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L549)

Declare that the agent requires a runtime resource passed through `getInstance(..., { resources })`.

This follows the same builder-time declaration pattern as services.

#### Type Parameters

##### ResourceName

`ResourceName` *extends* `string`

##### ResourceType

`ResourceType`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources` & `{ [K in string]: ResourceType }`, `ConfigType`, `ConfigInputType`\>

#### Example

```ts
new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .defineResource<'sandbox', SandboxExecutionResource>()
```

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:998](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L998)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### getAfterGuardHook()

> **getAfterGuardHook**(`name`): [`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`any`, `any`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:911](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L911)

#### Parameters

##### name

`string`

#### Returns

[`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`any`, `any`\>

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`any`, `any`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:896](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L896)

#### Parameters

##### name

`string`

#### Returns

[`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`any`, `any`\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1050](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L1050)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### markAsDeprecated()

> **markAsDeprecated**(): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:525](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L525)

Mark the agent endpoints as deprecated.

This mirrors the core builder behavior and propagates deprecation metadata to the underlying run command and stream.

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:696](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L696)

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

Defined in: [packages/ai/src/builder/AgentBuilder.ts:697](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L697)

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

> **prepareCall**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:983](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L983)

Registers a per-model-call hook that can inject metadata and AI SDK call options dynamically.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### prepareStep()

> **prepareStep**(`hook`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:993](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L993)

Registers a step-aware hook invoked for each model call.

Use this when call options need to change across iterative refinement passes.

#### Parameters

##### hook

[`AgentPrepareCallHook`](../type-aliases/AgentPrepareCallHook.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`hooks`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:903](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L903)

Register one or more guard hooks that run after the agent handler logic completed successfully.

#### Parameters

##### hooks

`Record`\<`string`, [`AgentAfterGuardHook`](../type-aliases/AgentAfterGuardHook.md)\<`unknown`, `unknown`\>\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`hooks`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:888](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L888)

Register one or more guard hooks that run before the agent handler logic executes.

Use before guards for request-policy concerns like auth, quota checks, or tenant validation.
Keep business logic in the handler itself.

#### Parameters

##### hooks

`Record`\<`string`, [`AgentBeforeGuardHook`](../type-aliases/AgentBeforeGuardHook.md)\<`unknown`, `unknown`\>\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setCallOptionsSchema()

> **setCallOptionsSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:975](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L975)

Sets a validation schema for model call options returned by [prepareCall](#preparecall) / [prepareStep](#preparestep).

The schema is validated for every hook result before metadata is merged into model requests.

#### Parameters

##### schema

`ZodType`\<[`AgentModelCallOptions`](../type-aliases/AgentModelCallOptions.md)\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setConfigSchema()

> **setConfigSchema**\<`T`\>(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:493](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L493)

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

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`Infer`](../../core/type-aliases/Infer.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md), [`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\> *extends* `Record`\<`string`, `unknown`\> ? [`InferIn`](../../core/type-aliases/InferIn.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`T`\>\> : [`EmptyObject`](../../core/type-aliases/EmptyObject.md)\>

#### Example

```ts
const supportAgent = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
  .setConfigSchema(z.object({ locale: z.string().default('en') }))
```

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:966](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L966)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setDefaultConfig()

> **setDefaultConfig**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:515](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L515)

Provide default values for the runtime config declared via [setConfigSchema](#setconfigschema).

These defaults are merged before validation and can still be overridden via `getInstance(..., { config })`.

#### Parameters

##### config

[`Complete`](../../core/type-aliases/Complete.md)\<`ConfigType`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:476](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L476)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:925](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L925)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setExecutionMode()

> **setExecutionMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:716](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L716)

#### Parameters

##### mode

[`AgentExecutionMode`](../type-aliases/AgentExecutionMode.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:721](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L721)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `HandlerResources`, `Models`\>(`fn`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1058](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L1058)

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

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `HandlerResources`, `Models`, `AgentInvokes`\>

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:941](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L941)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:743](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L743)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:733](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L733)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:738](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L738)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:708](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L708)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setSseProtocol()

> **setSseProtocol**(`protocol`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1041](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L1041)

Selects the SSE wire protocol for exposed stream endpoints.

Defaults to `purista` when not set.
This setting is only relevant when `streamingMode` is `stream`.

#### Parameters

##### protocol

[`AgentSseProtocol`](../type-aliases/AgentSseProtocol.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:1026](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L1026)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:915](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L915)

#### Parameters

##### eventName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:920](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L920)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### useConversationStore()

> **useConversationStore**(`config`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:635](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L635)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:566](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L566)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

***

### ~~useResource()~~

> **useResource**(`alias`, `resource`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:574](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L574)

#### Parameters

##### alias

`string`

##### resource

###### resourceName

`string`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames`, `Resources`, `ConfigType`, `ConfigInputType`\>

#### Deprecated

Use defineResource<ResourceName, ResourceType>() and provide the concrete instance via getInstance(..., { resources }).

***

### useSkills()

> **useSkills**\<`Names`\>(`skillNames`): `AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\], `Resources`, `ConfigType`, `ConfigInputType`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:640](https://github.com/puristajs/purista/blob/51cb5010c904d34b1289917309477e1c8bbd5d08/packages/ai/src/builder/AgentBuilder.ts#L640)

#### Type Parameters

##### Names

`Names` *extends* readonly `string`[]

#### Parameters

##### skillNames

`Names`

#### Returns

`AgentBuilder`\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`, `AgentInvokes`, `SkillNames` \| `Names`\[`number`\], `Resources`, `ConfigType`, `ConfigInputType`\>
