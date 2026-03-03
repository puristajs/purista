[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentBuilder

# Class: AgentBuilder

Defined in: [ai/src/builder/AgentBuilder.ts:74](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L74)

## Constructors

### Constructor

> **new AgentBuilder**(`info`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:86](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L86)

#### Parameters

##### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

#### Returns

`AgentBuilder`

## Methods

### addContextSchema()

> **addContextSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:223](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L223)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addOutputSchema()

> **addOutputSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:216](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L216)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addParameterSchema()

> **addParameterSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:209](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L209)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### addPayloadSchema()

> **addPayloadSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:198](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L198)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### allowTool()

> **allowTool**(`tool`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:180](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L180)

#### Parameters

##### tool

[`AllowedToolDefinition`](../type-aliases/AllowedToolDefinition.md)

#### Returns

`AgentBuilder`

***

### build()

> **build**(): [`AgentDefinition`](../type-aliases/AgentDefinition.md)

Defined in: [ai/src/builder/AgentBuilder.ts:354](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L354)

#### Returns

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

***

### defineModel()

> **defineModel**(`alias`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:123](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L123)

#### Parameters

##### alias

`string`

#### Returns

`AgentBuilder`

***

### exposeAsHttpEndpoint()

> **exposeAsHttpEndpoint**(`method`, `path`, `contentTypeRequest?`, `contentEncodingRequest?`, `contentTypeResponse?`, `contentEncodingResponse?`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:233](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L233)

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

Defined in: [ai/src/builder/AgentBuilder.ts:269](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L269)

#### Returns

`AgentBuilder`

***

### persistHistory()

> **persistHistory**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:144](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L144)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`

***

### setConcurrency()

> **setConcurrency**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:148](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L148)

#### Parameters

##### config

[`ConcurrencyConfig`](../type-aliases/ConcurrencyConfig.md)

#### Returns

`AgentBuilder`

***

### setContextSchema()

> **setContextSchema**(`schema`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:229](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L229)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setDescription()

> **setDescription**(`description`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:105](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L105)

#### Parameters

##### description

`string`

#### Returns

`AgentBuilder`

***

### setEvaluation()

> **setEvaluation**(`profile`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:190](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L190)

#### Parameters

##### profile

`Record`\<`string`, `unknown`\>

#### Returns

`AgentBuilder`

***

### setHandler()

> **setHandler**\<`Payload`, `Parameter`, `Resources`, `Models`\>(`fn`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:277](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L277)

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

Defined in: [ai/src/builder/AgentBuilder.ts:205](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L205)

#### Parameters

##### schema

[`Schema`](../../core/type-aliases/Schema.md)

#### Returns

`AgentBuilder`

***

### setKnowledge()

> **setKnowledge**(`adapters`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:175](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L175)

#### Parameters

##### adapters

[`KnowledgeAdapterConfig`](../type-aliases/KnowledgeAdapterConfig.md)[] | `undefined`

#### Returns

`AgentBuilder`

***

### setMemory()

> **setMemory**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:171](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L171)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md) | `undefined`

#### Returns

`AgentBuilder`

***

### setModelResource()

> **setModelResource**(`resource`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:161](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L161)

#### Parameters

##### resource

\{ `resourceName`: `string`; `variant?`: `string`; \} | `undefined`

#### Returns

`AgentBuilder`

***

### setRetryPolicy()

> **setRetryPolicy**(`policy`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:166](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L166)

#### Parameters

##### policy

[`RetryPolicy`](../type-aliases/RetryPolicy.md)

#### Returns

`AgentBuilder`

***

### setRuntime()

> **setRuntime**(`mode`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:153](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L153)

#### Parameters

##### mode

`string`

#### Returns

`AgentBuilder`

***

### setStreamingMode()

> **setStreamingMode**(`mode`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:261](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L261)

#### Parameters

##### mode

`"sse"` | `"chunked"` | `"buffered"`

#### Returns

`AgentBuilder`

***

### setTelemetry()

> **setTelemetry**(`config`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:185](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L185)

#### Parameters

##### config

\{ `attributes?`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \} | `undefined`

#### Returns

`AgentBuilder`

***

### useEventBridge()

> **useEventBridge**(`name`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:110](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L110)

#### Parameters

##### name

`string`

#### Returns

`AgentBuilder`

***

### useKnowledgeAdapter()

> **useKnowledgeAdapter**(`adapter`): `AgentBuilder`

Defined in: [ai/src/builder/AgentBuilder.ts:138](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L138)

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

Defined in: [ai/src/builder/AgentBuilder.ts:115](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L115)

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

Defined in: [ai/src/builder/AgentBuilder.ts:133](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/builder/AgentBuilder.ts#L133)

#### Parameters

##### config

[`AgentSessionConfig`](../type-aliases/AgentSessionConfig.md)

#### Returns

`AgentBuilder`
