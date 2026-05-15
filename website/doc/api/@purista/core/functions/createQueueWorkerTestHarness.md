[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createQueueWorkerTestHarness

# Function: createQueueWorkerTestHarness()

> **createQueueWorkerTestHarness**\<`TServiceBuilder`\>(`serviceBuilder`, `workerBuilder`, `options?`): `Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `queueBridge`: [`QueueBridge`](../interfaces/QueueBridge.md); `run`: \<`Payload`, `Parameter`\>(`message`) => `Promise`\<\{ `ackCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `deadLetterCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `extendLeaseCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `nackCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; `queueBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>

Defined in: [testing/createQueueWorkerTestHarness.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createQueueWorkerTestHarness.ts#L27)

Boot a real service instance and execute one queue worker cycle through the
PURISTA worker runtime.

Use this helper when you want to verify queue worker guards, job controls,
and queue bridge interactions instead of calling the handler directly.

## Type Parameters

### TServiceBuilder

`TServiceBuilder` *extends* [`ServiceBuilder`](../classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>

## Parameters

### serviceBuilder

`TServiceBuilder`

### workerBuilder

[`QueueWorkerBuilder`](../classes/QueueWorkerBuilder.md)

### options?

\{ \[K in string \| number \| symbol\]: (\{ configStore?: ConfigStore; logger?: Logger; logLevel?: LogLevelName; queueBridge?: QueueBridge; queueJobStore?: QueueJobStore; secretStore?: SecretStore; spanProcessor?: SpanProcessor; stateStore?: StateStore \} & (keyof InferQueueWorkerHarnessServiceBuilderConfig\<TServiceBuilder\>\["Resources"\] extends never ? \{ resources?: undefined \} : \{ resources: InferQueueWorkerHarnessServiceBuilderConfig\<TServiceBuilder\>\["Resources"\] \}) & (keyof InferQueueWorkerHarnessServiceBuilderConfig\<TServiceBuilder\>\["ConfigInputType"\] extends never ? \{ serviceConfig?: undefined \} : \{ serviceConfig?: InferQueueWorkerHarnessServiceBuilderConfig\<TServiceBuilder\>\["ConfigInputType"\] \}))\[K\] \} & `object` = `...`

## Returns

`Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `queueBridge`: [`QueueBridge`](../interfaces/QueueBridge.md); `run`: \<`Payload`, `Parameter`\>(`message`) => `Promise`\<\{ `ackCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `deadLetterCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `extendLeaseCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; `nackCalls`: `SinonSpyCall`\<`any`[], `any`\>[]; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; `queueBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>
