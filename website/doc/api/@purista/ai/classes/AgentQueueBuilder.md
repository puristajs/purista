[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentQueueBuilder

# Class: AgentQueueBuilder\<S\>

Defined in: [builder/AgentQueueBuilder.ts:76](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L76)

Builds an attached PURISTA agent from normal core queue, worker, command, and
stream definitions plus an AI manifest consumed by `@purista/ai`.

## Example

```ts
const triage = service
  .getAgentQueueBuilder('supportTriage', 'Classifies tickets')
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setRunFunction(async context => ({ priority: 'high' }))
```

## Type Parameters

### S

`S` *extends* `AnyAgentQueueBuilderTypes` = [`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)

## Constructors

### Constructor

> **new AgentQueueBuilder**\<`S`\>(`serviceName`, `serviceVersion`, `agentName`, `description`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:95](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L95)

#### Parameters

##### serviceName

`string`

##### serviceVersion

`string`

##### agentName

`string`

##### description

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>

## Methods

### addModel()

> **addModel**\<`Alias`, `Binding`\>(`alias`, `binding`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\] & `Record`\<`Alias`, `Binding`\>, `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:150](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L150)

#### Type Parameters

##### Alias

`Alias` *extends* `string`

##### Binding

`Binding` *extends* [`AgentModelBinding`](../type-aliases/AgentModelBinding.md)

#### Parameters

##### alias

`Alias`

##### binding

`Binding`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\] & `Record`\<`Alias`, `Binding`\>, `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

***

### addOutputSchema()

> **addOutputSchema**\<`OutputSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `OutputSchema`, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:134](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L134)

#### Type Parameters

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`OutputSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `OutputSchema`, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParameterSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `ParameterSchema`, `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:118](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L118)

#### Type Parameters

##### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`ParameterSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `ParameterSchema`, `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`PayloadSchema`, `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:102](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L102)

#### Type Parameters

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

#### Parameters

##### schema

`PayloadSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`PayloadSchema`, `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `ServiceName`, `Version`, `CommandName`\>(`serviceName`, `serviceVersion`, `commandName`, `schemas?`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\] & `Record`\<`` `${ServiceName}.${Version}.${CommandName}` ``, [`AllowedCommandToolDefinition`](../type-aliases/AllowedCommandToolDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:177](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L177)

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### ServiceName

`ServiceName` *extends* `string`

##### Version

`Version` *extends* `string`

##### CommandName

`CommandName` *extends* `string`

#### Parameters

##### serviceName

`ServiceName`

##### serviceVersion

`Version`

##### commandName

`CommandName`

##### schemas?

###### outputSchema?

`Output`

###### parameterSchema?

`Parameter`

###### payloadSchema?

`Payload`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\] & `Record`\<`` `${ServiceName}.${Version}.${CommandName}` ``, [`AllowedCommandToolDefinition`](../type-aliases/AllowedCommandToolDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"AgentTools"`\], `S`\[`"Execution"`\]\>\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Output`, `Payload`, `Parameter`, `AgentName`, `Version`\>(`agentName`, `serviceVersion`, `schemas?`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\] & `Record`\<`` `${AgentName}.${Version}` ``, [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"Execution"`\]\>\>

Defined in: [builder/AgentQueueBuilder.ts:213](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L213)

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../../core/type-aliases/Schema.md)

##### AgentName

`AgentName` *extends* `string`

##### Version

`Version` *extends* `string`

#### Parameters

##### agentName

`AgentName`

##### serviceVersion

`Version`

##### schemas?

###### outputSchema?

`Output`

###### parameterSchema?

`Parameter`

###### payloadSchema?

`Payload`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\] & `Record`\<`` `${AgentName}.${Version}` ``, [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"Execution"`\]\>\>

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `options?`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:403](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L403)

#### Parameters

##### method

`SupportedHttpMethod`

##### path

`string`

##### options?

`Omit`\<[`AgentHttpExposure`](../type-aliases/AgentHttpExposure.md), `"method"` \| `"path"`\>

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### getDefinition()

> **getDefinition**(): `Promise`\<[`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`S`\>\>

Defined in: [builder/AgentQueueBuilder.ts:438](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L438)

#### Returns

`Promise`\<[`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`S`\>\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: [builder/AgentQueueBuilder.ts:434](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L434)

#### Returns

[`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:420](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L420)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:346](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L346)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setExecutionProfile()

> **setExecutionProfile**(`profile`, `options`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:361](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L361)

Apply a core queue execution profile to the generated agent queue.

#### Parameters

##### profile

`"longRunning"`

##### options

###### maxRuntimeMs

`number`

###### strict?

`boolean`

#### Returns

`AgentQueueBuilder`\<`S`\>

#### Example

```ts
agent.setExecutionProfile('longRunning', {
  maxRuntimeMs: 30 * 60_000,
})
```

***

### setHarnessAgent()

> **setHarnessAgent**(`this`, `definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessAgent"`\>\>

Defined in: [builder/AgentQueueBuilder.ts:245](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L245)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`\>\>

##### definition

`AgentDefinition`\<`any`\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessAgent"`\>\>

***

### setHarnessWorkflow()

> **setHarnessWorkflow**(`this`, `definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessWorkflow"`\>\>

Defined in: [builder/AgentQueueBuilder.ts:276](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L276)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`\>\>

##### definition

`WorkflowDefinition`\<`any`\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessWorkflow"`\>\>

***

### setResponseMode()

> **setResponseMode**(`mode`, `options?`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:388](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L388)

Configure how a queued agent run exposes its final result contract.

Long-running response modes enqueue the agent queue and keep `jobId` and
agent `runId` as separate metadata in the generated definitions.

#### Parameters

##### mode

`AgentResponseMode`

##### options?

`AgentResponseModeOptions`

#### Returns

`AgentQueueBuilder`\<`S`\>

#### Example

```ts
agent.setResponseMode('accepted', {
  resultPolicy: 'state-and-event',
})
```

***

### setRunFunction()

> **setRunFunction**(`this`, `handler`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"runFunction"`\>\>

Defined in: [builder/AgentQueueBuilder.ts:307](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L307)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`\>\>

##### handler

[`AgentHandler`](../type-aliases/AgentHandler.md)\<[`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"PayloadSchema"`\]\>, [`InferIn`](../../core/type-aliases/InferIn.md)\<`S`\[`"ParameterSchema"`\]\>, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], [`Infer`](../../core/type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"runFunction"`\>\>

***

### setSandboxPolicy()

> **setSandboxPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:398](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L398)

#### Parameters

##### policy

[`AgentSandboxPolicy`](../type-aliases/AgentSandboxPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSessionPolicy()

> **setSessionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:393](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L393)

#### Parameters

##### policy

[`AgentSessionPolicy`](../type-aliases/AgentSessionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:415](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L415)

#### Parameters

##### mode

`"stream"` \| `"aggregate"`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:428](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L428)

#### Parameters

##### eventName

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useBuiltInTools()

> **useBuiltInTools**(`namesOrFalse`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:172](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L172)

#### Parameters

##### namesOrFalse

`false` \| readonly `BuiltinToolName`[]

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useSkills()

> **useSkills**(`names`, `resourceName?`): `AgentQueueBuilder`\<`S`\>

Defined in: [builder/AgentQueueBuilder.ts:167](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/AgentQueueBuilder.ts#L167)

#### Parameters

##### names

readonly `string`[]

##### resourceName?

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>
