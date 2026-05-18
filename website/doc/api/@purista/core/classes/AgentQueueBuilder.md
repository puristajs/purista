[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentQueueBuilder

# Class: AgentQueueBuilder\<S\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L81)

Builds an attached PURISTA agent from normal core queue, worker, command,
stream definitions, and a provider-neutral agent manifest.

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

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:100](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L100)

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

> **addModel**\<`Alias`, `Binding`\>(`alias`, `binding`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\] & `Record`\<`Alias`, `Binding`\>, `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:189](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L189)

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

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\] & `Record`\<`Alias`, `Binding`\>, `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### addOutputSchema()

> **addOutputSchema**\<`OutputSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `OutputSchema`, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:172](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L172)

#### Type Parameters

##### OutputSchema

`OutputSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`OutputSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `OutputSchema`, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### addParameterSchema()

> **addParameterSchema**\<`ParameterSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `ParameterSchema`, `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:155](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L155)

#### Type Parameters

##### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`ParameterSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `ParameterSchema`, `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### addPayloadSchema()

> **addPayloadSchema**\<`PayloadSchema`\>(`schema`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`PayloadSchema`, `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:138](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L138)

#### Type Parameters

##### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../type-aliases/Schema.md)

#### Parameters

##### schema

`PayloadSchema`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`PayloadSchema`, `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### canInvoke()

> **canInvoke**\<`Output`, `Payload`, `Parameter`, `ServiceName`, `Version`, `CommandName`\>(`serviceName`, `serviceVersion`, `commandName`, `schemas?`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\] & `Record`\<`` `${ServiceName}.${Version}.${CommandName}` ``, [`AllowedCommandToolDefinition`](../type-aliases/AllowedCommandToolDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:217](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L217)

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

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

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\] & `Record`\<`` `${ServiceName}.${Version}.${CommandName}` ``, [`AllowedCommandToolDefinition`](../type-aliases/AllowedCommandToolDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### canInvokeAgent()

> **canInvokeAgent**\<`Output`, `Payload`, `Parameter`, `AgentName`, `Version`\>(`agentName`, `serviceVersion`, `schemas?`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\] & `Record`\<`` `${AgentName}.${Version}` ``, [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:254](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L254)

#### Type Parameters

##### Output

`Output` *extends* [`Schema`](../type-aliases/Schema.md)

##### Payload

`Payload` *extends* [`Schema`](../type-aliases/Schema.md)

##### Parameter

`Parameter` *extends* [`Schema`](../type-aliases/Schema.md)

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

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\] & `Record`\<`` `${AgentName}.${Version}` ``, [`AllowedAgentDefinition`](../type-aliases/AllowedAgentDefinition.md)\<`Output`, `Payload`, `Parameter`\>\>, `S`\[`"Execution"`\], `S`\[`"Metrics"`\]\>\>

***

### defineMetric()

> **defineMetric**\<`MetricName`, `Definition`\>(`_name`, `_definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\] & `{ [K in string]: Definition }`\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:119](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L119)

Declare a custom application metric available only in this agent handler.

#### Type Parameters

##### MetricName

`MetricName` *extends* `string`

##### Definition

`Definition` *extends* `PuristaMetricDefinition`\<`any`\>

#### Parameters

##### \_name

`MetricName`

##### \_definition

`Definition`

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `S`\[`"Execution"`\], `S`\[`"Metrics"`\] & `{ [K in string]: Definition }`\>\>

#### Example

```ts
agent.defineMetric('app.agent.escalations', {
  kind: 'counter',
  unit: '{escalation}',
  description: 'Escalated agent runs',
})
```

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `options?`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:452](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L452)

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

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:487](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L487)

#### Returns

`Promise`\<[`AttachedAgentDefinition`](../type-aliases/AttachedAgentDefinition.md)\<`S`\>\>

***

### getManifest()

> **getManifest**(): [`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:483](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L483)

#### Returns

[`AgentManifest`](../type-aliases/AgentManifest.md)\<`S`\[`"Models"`\]\>

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:469](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L469)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setExecutionPolicy()

> **setExecutionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:395](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L395)

#### Parameters

##### policy

[`AgentExecutionPolicy`](../type-aliases/AgentExecutionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setExecutionProfile()

> **setExecutionProfile**(`profile`, `options`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:410](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L410)

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

> **setHarnessAgent**(`this`, `definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessAgent"`, `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:287](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L287)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`, `S`\[`"Metrics"`\]\>\>

##### definition

`AgentDefinition`\<`any`\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessAgent"`, `S`\[`"Metrics"`\]\>\>

***

### setHarnessWorkflow()

> **setHarnessWorkflow**(`this`, `definition`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessWorkflow"`, `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:320](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L320)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`, `S`\[`"Metrics"`\]\>\>

##### definition

`WorkflowDefinition`\<`any`\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"harnessWorkflow"`, `S`\[`"Metrics"`\]\>\>

***

### setResponseMode()

> **setResponseMode**(`mode`, `options?`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:437](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L437)

Configure how a queued agent run exposes its final result contract.

Long-running response modes enqueue the agent queue and keep `jobId` and
agent `runId` as separate metadata in the generated definitions.

#### Parameters

##### mode

[`AgentResponseMode`](../type-aliases/AgentResponseMode.md)

##### options?

[`AgentResponseModeOptions`](../type-aliases/AgentResponseModeOptions.md)

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

> **setRunFunction**(`this`, `handler`): `AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"runFunction"`, `S`\[`"Metrics"`\]\>\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:353](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L353)

#### Parameters

##### this

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `undefined`, `S`\[`"Metrics"`\]\>\>

##### handler

[`AgentHandler`](../type-aliases/AgentHandler.md)\<[`InferIn`](../type-aliases/InferIn.md)\<`S`\[`"PayloadSchema"`\]\>, [`InferIn`](../type-aliases/InferIn.md)\<`S`\[`"ParameterSchema"`\]\>, `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], [`Infer`](../type-aliases/Infer.md)\<`S`\[`"OutputSchema"`\]\>, `S`\[`"Metrics"`\]\>

#### Returns

`AgentQueueBuilder`\<[`AgentQueueBuilderTypes`](../type-aliases/AgentQueueBuilderTypes.md)\<`S`\[`"PayloadSchema"`\], `S`\[`"ParameterSchema"`\], `S`\[`"OutputSchema"`\], `S`\[`"Resources"`\], `S`\[`"Models"`\], `S`\[`"CommandTools"`\], `S`\[`"AgentTools"`\], `"runFunction"`, `S`\[`"Metrics"`\]\>\>

***

### setSandboxPolicy()

> **setSandboxPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:447](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L447)

#### Parameters

##### policy

[`AgentSandboxPolicy`](../type-aliases/AgentSandboxPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSessionPolicy()

> **setSessionPolicy**(`policy`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:442](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L442)

#### Parameters

##### policy

[`AgentSessionPolicy`](../type-aliases/AgentSessionPolicy.md)

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:464](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L464)

#### Parameters

##### mode

`"stream"` \| `"aggregate"`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### setSuccessEventName()

> **setSuccessEventName**(`eventName`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:477](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L477)

#### Parameters

##### eventName

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useBuiltInTools()

> **useBuiltInTools**(`namesOrFalse`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:212](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L212)

#### Parameters

##### namesOrFalse

`false` \| readonly `BuiltinToolName`[]

#### Returns

`AgentQueueBuilder`\<`S`\>

***

### useSkills()

> **useSkills**(`names`, `resourceName?`): `AgentQueueBuilder`\<`S`\>

Defined in: [AgentQueueBuilder/AgentQueueBuilder.ts:207](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/AgentQueueBuilder.ts#L207)

#### Parameters

##### names

readonly `string`[]

##### resourceName?

`string`

#### Returns

`AgentQueueBuilder`\<`S`\>
