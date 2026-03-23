[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createCommandTestHarness

# Function: createCommandTestHarness()

> **createCommandTestHarness**\<`TServiceBuilder`, `TCommandBuilder`\>(`serviceBuilder`, `commandBuilder`, `options?`): `Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `run`: (`input`) => `Promise`\<\{ `message`: `Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}; `result`: [`Infer`](../type-aliases/Infer.md)\<[`InferCommandBuilderConfig`](../type-aliases/InferCommandBuilderConfig.md)\<`TCommandBuilder`\>\[`"OutputSchema"`\]\> \| `undefined`; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>

Defined in: testing/createCommandTestHarness.ts:39

Boot a real service instance and execute one command through the PURISTA runtime.

Use this helper when you want to test validation, guards, emits, and runtime
wiring instead of calling the command handler directly.

## Type Parameters

### TServiceBuilder

`TServiceBuilder` *extends* [`ServiceBuilder`](../classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>

### TCommandBuilder

`TCommandBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Parameters

### serviceBuilder

`TServiceBuilder`

### commandBuilder

`TCommandBuilder`

### options?

[`CreateCommandTestHarnessOptions`](../type-aliases/CreateCommandTestHarnessOptions.md)\<`TServiceBuilder`\> = `...`

## Returns

`Promise`\<\{ `destroy`: () => `Promise`\<`void`\>; `eventBridge`: [`EventBridge`](../interfaces/EventBridge.md); `run`: (`input`) => `Promise`\<\{ `message`: `Readonly`\<`Omit`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../enumerations/EBMessageType.md#commanderrorresponse); `otp?`: `string`; `payload`: \{ `data?`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../enumerations/StatusCode.md); \}; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"instanceId"`\>\> \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName?`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId?`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}; `result`: [`Infer`](../type-aliases/Infer.md)\<[`InferCommandBuilderConfig`](../type-aliases/InferCommandBuilderConfig.md)\<`TCommandBuilder`\>\[`"OutputSchema"`\]\> \| `undefined`; \}\>; `service`: [`Service`](../classes/Service.md)\<[`ServiceClassTypes`](../type-aliases/ServiceClassTypes.md)\<[`EmptyObject`](../type-aliases/EmptyObject.md), [`EmptyObject`](../type-aliases/EmptyObject.md)\>\>; `stubs`: \{ `eventBridge`: `Record`\<`string`, `SinonStub`\<`any`[], `any`\>\> \| `undefined`; \}; \}\>
