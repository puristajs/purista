[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createStreamTestHarness

# Function: createStreamTestHarness()

> **createStreamTestHarness**\<`TServiceBuilder`, `TStreamBuilder`\>(`serviceBuilder`, `streamBuilder`, `options?`): `Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `run`: (`input`) => `Promise`\<\{ `chunks`: [`Infer`](../type-aliases/Infer.md)\<[`InferStreamBuilderConfig`](../type-aliases/InferStreamBuilderConfig.md)\<`TStreamBuilder`\>\[`"ChunkSchema"`\]\>[]; `final`: [`Infer`](../type-aliases/Infer.md)\<[`InferStreamBuilderConfig`](../type-aliases/InferStreamBuilderConfig.md)\<`TStreamBuilder`\>\[`"FinalSchema"`\]\> \| `undefined`; `frames`: `object`[]; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>

Defined in: [testing/createStreamTestHarness.ts:71](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createStreamTestHarness.ts#L71)

Boot a real service instance and execute one stream through the PURISTA runtime.

Use this helper when you want to assert emitted stream frames, final payloads,
and guard behavior.

## Type Parameters

### TServiceBuilder

`TServiceBuilder` *extends* [`ServiceBuilder`](../classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>

### TStreamBuilder

`TStreamBuilder` *extends* [`StreamDefinitionBuilder`](../classes/StreamDefinitionBuilder.md)\<`any`, `any`\>

## Parameters

### serviceBuilder

`TServiceBuilder`

### streamBuilder

`TStreamBuilder`

### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; queueBridge?: QueueBridge; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof InferStreamHarnessServiceBuilderConfig\<TServiceBuilder\>\["Resources"\] extends never ? \{ resources?: undefined \} : \{ resources: InferStreamHarnessServiceBuilderConfig\<TServiceBuilder\>\["Resources"\] \}) & (keyof InferStreamHarnessServiceBuilderConfig\<TServiceBuilder\>\["ConfigInputType"\] extends never ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: InferStreamHarnessServiceBuilderConfig\<TServiceBuilder\>\["ConfigInputType"\] \}))\[K\] \} & `object` = `...`

## Returns

`Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `run`: (`input`) => `Promise`\<\{ `chunks`: [`Infer`](../type-aliases/Infer.md)\<[`InferStreamBuilderConfig`](../type-aliases/InferStreamBuilderConfig.md)\<`TStreamBuilder`\>\[`"ChunkSchema"`\]\>[]; `final`: [`Infer`](../type-aliases/Infer.md)\<[`InferStreamBuilderConfig`](../type-aliases/InferStreamBuilderConfig.md)\<`TStreamBuilder`\>\[`"FinalSchema"`\]\> \| `undefined`; `frames`: `object`[]; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>
