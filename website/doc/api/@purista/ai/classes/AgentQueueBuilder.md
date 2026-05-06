[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentQueueBuilder

# Class: AgentQueueBuilder\<S\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:54](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L54)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:71](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L71)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:126](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L126)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:110](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L110)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:94](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L94)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:78](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L78)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:153](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L153)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:189](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L189)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:337](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L337)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:372](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L372)

#### Returns

`Promise`\<[`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`S`\>\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:368](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L368)

#### Returns

[`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:354](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L354)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:322](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L322)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setHarnessAgent()

> **setHarnessAgent**(`this`, `definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessAgent"`\>\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:221](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L221)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:252](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L252)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`\>\>

##### definition

`WorkflowDefinition`\<`any`\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessWorkflow"`\>\>

***

### setRunFunction()

> **setRunFunction**(`this`, `handler`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"runFunction"`\>\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:283](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L283)

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

Defined in: [ai/src/builder/AgentQueueBuilder.ts:332](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L332)

#### Parameters

##### policy

[`AgentSandboxPolicy`](../type-aliases/AgentSandboxPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSessionPolicy()

> **setSessionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:327](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L327)

#### Parameters

##### policy

[`AgentSessionPolicy`](../type-aliases/AgentSessionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:349](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L349)

#### Parameters

##### mode

`"stream"` | `"aggregate"`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:362](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L362)

#### Parameters

##### eventName

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useBuiltInTools()

> **useBuiltInTools**(`namesOrFalse`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:148](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L148)

#### Parameters

##### namesOrFalse

`false` | readonly `BuiltinToolName`[]

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useSkills()

> **useSkills**(`names`, `resourceName?`): `AgentQueueBuilder`\<`S`\>

Defined in: [ai/src/builder/AgentQueueBuilder.ts:143](https://github.com/puristajs/purista/blob/8c08324bf0ba639acf59c53779ee90a07cf82be5/packages/ai/src/builder/AgentQueueBuilder.ts#L143)

#### Parameters

##### names

readonly `string`[]

##### resourceName?

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>
