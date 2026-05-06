[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentQueueBuilder

# Class: AgentQueueBuilder\<T\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:131

## Type Parameters

### T

`T` *extends* [`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md) = [`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)

## Constructors

### Constructor

> **new AgentQueueBuilder**\<`T`\>(`input`, `serviceVersion?`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:170

#### Parameters

##### input

[`AgentQueueBuilderInput`](../type-aliases/AgentQueueBuilderInput.md)

##### serviceVersion?

`string`

#### Returns

`AgentQueueBuilder`\<`T`\>

## Methods

### addModel()

> **addModel**\<`Alias`, `Capabilities`\>(`alias`, `config?`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"Models"`, `T`\[`"Models"`\] & `Record`\<`Alias`, [`ModelProviderForCapabilities`](../type-aliases/ModelProviderForCapabilities.md)\<`Capabilities`\>\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:218

#### Type Parameters

##### Alias

`Alias` *extends* `string`

##### Capabilities

`Capabilities` *extends* readonly [`AgentModelCapability`](../type-aliases/AgentModelCapability.md)[] = readonly \[`"text"`, `"object"`, `"object-stream"`, `"text-stream"`\]

#### Parameters

##### alias

`Alias`

##### config?

[`AgentModelConfig`](../type-aliases/AgentModelConfig.md)\<`Capabilities`\>

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"Models"`, `T`\[`"Models"`\] & `Record`\<`Alias`, [`ModelProviderForCapabilities`](../type-aliases/ModelProviderForCapabilities.md)\<`Capabilities`\>\>\>\>

***

### addOutputSchema()

> **addOutputSchema**\<`OutputSchema`\>(`schema`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"OutputSchema"`, `OutputSchema`\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:211

#### Type Parameters

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`OutputSchema`

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"OutputSchema"`, `OutputSchema`\>\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParameterSchema`\>(`schema`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"ParameterSchema"`, `ParameterSchema`\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:203

#### Type Parameters

##### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`ParameterSchema`

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"ParameterSchema"`, `ParameterSchema`\>\>

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`schema`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"PayloadSchema"`, `PayloadSchema`\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:195

#### Type Parameters

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`PayloadSchema`

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"PayloadSchema"`, `PayloadSchema`\>\>

***

### addQueryParameters()

> **addQueryParameters**(`params`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:413

#### Parameters

##### params

[`QueryParameter`](../../core/type-aliases/QueryParameter.md)[]

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### canEmit()

> **canEmit**(`eventName`, `schema`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:333

#### Parameters

##### eventName

`string`

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### canInvoke()

> **canInvoke**\<`ServiceName`, `ServiceVersion`, `CommandName`, `OutputSchema`, `PayloadSchema`, `ParameterSchema`\>(`serviceName`, `serviceVersion`, `commandName`, `_outputSchema?`, `_payloadSchema?`, `_parameterSchema?`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"ToolInvokes"`, `T`\[`"ToolInvokes"`\] & `Record`\<`ServiceName`, `Record`\<`ServiceVersion`, `Record`\<`CommandName`, (`payload`, `parameter?`) => `Promise`\<[`Infer`](../../core/type-aliases/Infer.md)\<`OutputSchema`\>\>\>\>\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:267

#### Type Parameters

##### ServiceName

`ServiceName` *extends* `string`

##### ServiceVersion

`ServiceVersion` *extends* `string`

##### CommandName

`CommandName` *extends* `string`

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

##### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### serviceName

`ServiceName`

##### serviceVersion

`ServiceVersion`

##### commandName

`CommandName`

##### \_outputSchema?

`OutputSchema`

##### \_payloadSchema?

`PayloadSchema`

##### \_parameterSchema?

`ParameterSchema`

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"ToolInvokes"`, `T`\[`"ToolInvokes"`\] & `Record`\<`ServiceName`, `Record`\<`ServiceVersion`, `Record`\<`CommandName`, (`payload`, `parameter?`) => `Promise`\<[`Infer`](../../core/type-aliases/Infer.md)\<`OutputSchema`\>\>\>\>\>\>\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`AgentName`, `ServiceVersion`, `PayloadSchema`, `ParameterSchema`, `OutputSchema`\>(`agentName`, `serviceVersionOrConfig?`, `invokeConfig?`): `AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"AgentInvokes"`, `T`\[`"AgentInvokes"`\] & `Record`\<`AgentName`, `Record`\<`ServiceVersion`, [`AgentInvokeBinding`](../type-aliases/AgentInvokeBinding.md)\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`\>\>\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:294

#### Type Parameters

##### AgentName

`AgentName` *extends* `string`

##### ServiceVersion

`ServiceVersion` *extends* `string` = `"1"`

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

##### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md) = [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### agentName

`AgentName`

##### serviceVersionOrConfig?

`ServiceVersion` | \{ `outputSchema?`: `OutputSchema`; `parameterSchema?`: `ParameterSchema`; `payloadSchema?`: `PayloadSchema`; `serviceVersion?`: `ServiceVersion`; \}

##### invokeConfig?

###### outputSchema?

`OutputSchema`

###### parameterSchema?

`ParameterSchema`

###### payloadSchema?

`PayloadSchema`

#### Returns

`AgentQueueBuilder`\<`SetNewTypeValue`\<`T`, `"AgentInvokes"`, `T`\[`"AgentInvokes"`\] & `Record`\<`AgentName`, `Record`\<`ServiceVersion`, [`AgentInvokeBinding`](../type-aliases/AgentInvokeBinding.md)\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`\>\>\>\>\>

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `requestContentType?`, `requestEncoding?`, `responseContentType?`, `responseEncoding?`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:371

#### Parameters

##### method

[`SupportedHttpMethod`](../../core/type-aliases/SupportedHttpMethod.md)

##### path

`string`

##### requestContentType?

`string`

##### requestEncoding?

`string`

##### responseContentType?

`string`

##### responseEncoding?

`string`

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### getAfterGuardHook()

> **getAfterGuardHook**(`name`): [`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:437

#### Parameters

##### name

`string`

#### Returns

[`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)

***

### getBeforeGuardHook()

> **getBeforeGuardHook**(`name`): [`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:433

#### Parameters

##### name

`string`

#### Returns

[`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`AgentQueueDefinitionResult`](../type-aliases/AgentQueueDefinitionResult.md)\<`T`\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:446

#### Returns

`Promise`\<[`AgentQueueDefinitionResult`](../type-aliases/AgentQueueDefinitionResult.md)\<`T`\>\>

***

### getInstance()

> **getInstance**(`eventBridge`, `options?`): `Promise`\<[`AgentInstance`](AgentInstance.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"PayloadSchema"`\]\>, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"ParameterSchema"`\]\>, `T`\[`"Resources"`\], `T`\[`"Models"`\], `T`\[`"AgentInvokes"`\], `T`\[`"EmitPayloads"`\], `T`\[`"ToolInvokes"`\]\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:534

#### Parameters

##### eventBridge

[`EventBridge`](../../core/interfaces/EventBridge.md)

##### options?

[`AgentInstanceOptions`](../type-aliases/AgentInstanceOptions.md)\<`string`, `Record`\<`string`, `unknown`\>\>

#### Returns

`Promise`\<[`AgentInstance`](AgentInstance.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"PayloadSchema"`\]\>, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"ParameterSchema"`\]\>, `T`\[`"Resources"`\], `T`\[`"Models"`\], `T`\[`"AgentInvokes"`\], `T`\[`"EmitPayloads"`\], `T`\[`"ToolInvokes"`\]\>\>

***

### getManifest()

> **getManifest**(): `Promise`\<[`AgentManifestConfig`](../type-aliases/AgentManifestConfig.md)\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:530

#### Returns

`Promise`\<[`AgentManifestConfig`](../type-aliases/AgentManifestConfig.md)\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:407

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setAfterGuardHooks()

> **setAfterGuardHooks**(`hooks`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:428

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerAfterGuardHook`](../../core/type-aliases/QueueWorkerAfterGuardHook.md)\>

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setAgentFunction()

> **setAgentFunction**(`fn`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:251

#### Parameters

##### fn

[`AgentHandler`](../type-aliases/AgentHandler.md)\<[`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"PayloadSchema"`\]\>, [`Infer`](../../core/type-aliases/Infer.md)\<`T`\[`"ParameterSchema"`\]\>, `T`\[`"Resources"`\], `T`\[`"Models"`\], `T`\[`"AgentInvokes"`\], `T`\[`"EmitPayloads"`\], `T`\[`"ToolInvokes"`\]\>

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setBeforeGuardHooks()

> **setBeforeGuardHooks**(`hooks`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:423

#### Parameters

##### hooks

`Record`\<`string`, [`QueueWorkerBeforeGuardHook`](../../core/type-aliases/QueueWorkerBeforeGuardHook.md)\>

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:226

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setMaxParallelHandlers()

> **setMaxParallelHandlers**(`count`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:441

#### Parameters

##### count

`number`

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setSandboxPolicy()

> **setSandboxPolicy**(`policy`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:246

Declare the sandbox policy for this agent.

Runtime provisioning still happens through `getInstance(..., { ai: { sandbox } })`
and `context.runtime.sandbox`; the manifest only describes the intended mode
and default reuse scope.

#### Parameters

##### policy

###### mode

`"optional"` \| `"required"` \| `"disabled"` = `...`

###### scope

`"conversation"` \| `"shared-project-user"` \| `"agent-run"` \| `"agent-instance"` \| `"runtime-instance"` = `AgentSandboxScopeKindSchema`

#### Returns

`AgentQueueBuilder`\<`T`\>

#### Example

```ts
builder.setSandboxPolicy({
  mode: 'optional',
  scope: 'conversation',
})
```

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:393

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setStreamProtocolAdapter()

> **setStreamProtocolAdapter**(`protocol`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:398

#### Parameters

##### protocol

[`AgentStreamProtocolAdapterId`](../type-aliases/AgentStreamProtocolAdapterId.md)

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentQueueBuilder`\<`T`\>

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:418

#### Parameters

##### eventName

`string`

#### Returns

`AgentQueueBuilder`\<`T`\>

***

### fromServiceBuilder()

> `static` **fromServiceBuilder**(`serviceBuilder`, `agentName`, `description?`, `successEventName?`): `AgentQueueBuilder`

Defined in: packages/ai/src/builder/AgentQueueBuilder.impl.ts:179

#### Parameters

##### serviceBuilder

###### info

\{ `serviceName`: `string`; `serviceVersion`: `string`; \}

###### info.serviceName

`string`

###### info.serviceVersion

`string`

##### agentName

`string`

##### description?

`string`

##### successEventName?

`string`

#### Returns

`AgentQueueBuilder`
