[**@purista/mqttbridge v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getCommandHandler

# Function: getCommandHandler()

> **getCommandHandler**(`address`, `cb`, `_metadata`, `_eventBridgeConfig`): [`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)

Defined in: [mqttbridge/src/handler/getCommandHandler.impl.ts:29](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/handler/getCommandHandler.impl.ts#L29)

## Parameters

### address

[`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md)

### cb

(`message`) => `Promise`\<\{ `contentEncoding`: `"utf-8"`; `contentType`: `"application/json"`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `isHandledError`: `boolean`; `messageType`: [`CommandErrorResponse`](../../core/enumerations/EBMessageType.md#commanderrorresponse); `otp`: `string`; `payload`: \{ `data`: `unknown`; `message`: `string`; `status`: [`StatusCode`](../../core/enumerations/StatusCode.md); \}; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \} \| \{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CommandSuccessResponse`](../../core/enumerations/EBMessageType.md#commandsuccessresponse); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}\>

### \_metadata

[`CommandDefinitionMetadataBase`](../../core/type-aliases/CommandDefinitionMetadataBase.md)

### \_eventBridgeConfig

[`DefinitionEventBridgeConfig`](../../core/type-aliases/DefinitionEventBridgeConfig.md)

## Returns

[`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)
