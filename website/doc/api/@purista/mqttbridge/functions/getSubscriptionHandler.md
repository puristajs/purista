[**@purista/mqttbridge v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getSubscriptionHandler

# Function: getSubscriptionHandler()

> **getSubscriptionHandler**(`_subscription`, `cb`): [`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)

Defined in: [mqttbridge/src/handler/getSubscriptionHandler.impl.ts:18](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/handler/getSubscriptionHandler.impl.ts#L18)

## Parameters

### \_subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

### cb

(`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

## Returns

[`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)
