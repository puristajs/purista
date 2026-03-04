[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder

Defined in: [ai/src/builder/AgentBuilder.ts:99](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L99)

## Constructors

### Constructor

> **new AgentBuilder**(`info`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:112](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L112)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:265](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L265)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:258](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L258)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:251](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L251)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:240](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L240)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### allowTool()

> **allowTool**(`tool`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:222](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L222)

#### Parameters

##### tool

[`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)

#### Returns

`AgentBuilder`

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)

Defined in: [ai/src/builder/AgentBuilder.ts:450](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L450)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

***

### defineModel()

> **defineModel**(`alias`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:149](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L149)

#### Parameters

##### alias

`string`

#### Returns

`AgentBuilder`

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:275](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L275)

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

`AgentBuilder`

***

### makeEndpointPublic()

> **makeEndpointPublic**(): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:311](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L311)

#### Returns

`AgentBuilder`

***

### persistConversation()

#### Call Signature

> **persistConversation**(`config`): `this`

Defined in: [ai/src/builder/AgentBuilder.ts:183](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L183)

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

Defined in: [ai/src/builder/AgentBuilder.ts:184](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L184)

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

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:271](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L271)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:131](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L131)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:232](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L232)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`fn`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:319](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L319)

#### Type Parameters

##### Payload

`Payload` = `unknown`

##### Parameter

`Parameter` = `unknown`

##### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

##### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\> = `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>

#### Parameters

##### fn

[`AgentHandler`](../type-aliases/AgentHandler.md)\<`Payload`, `Parameter`, `Resources`, `Models`\>

#### Returns

`AgentBuilder`

***

### setInputSchema()

> **setInputSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:247](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L247)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setKnowledge()

> **setKnowledge**(`adapters`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:217](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L217)

#### Parameters

##### adapters

[`KnowledgeAdapterConfig`](../type-aliases/KnowledgeAdapterConfig.md)[] | `undefined`

#### Returns

`AgentBuilder`

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:213](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L213)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:203](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L203)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:208](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L208)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:195](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L195)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:303](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L303)

#### Parameters

##### mode

`"sse"` | `"chunked"` | `"buffered"`

#### Returns

`AgentBuilder`

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:227](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L227)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:136](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L136)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`

***

### useKnowledgeAdapter()

> **useKnowledgeAdapter**(`adapter`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:164](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L164)

#### Parameters

##### adapter

###### adapterName

`string`

###### options?

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`

***

### useResource()

> **useResource**(`alias`, `resource`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:141](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L141)

#### Parameters

##### alias

`string`

##### resource

###### resourceName

`string`

#### Returns

`AgentBuilder`

***

### useSessionStore()

> **useSessionStore**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:159](https://github.com/puristajs/purista/blob/7988debc1eccfdec7e3fa06b061b5907d3f2eb40/packages/ai/src/builder/AgentBuilder.ts#L159)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`
