[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/mqttbridge](../README.md) / getSubscriptionHandler

# Function: getSubscriptionHandler()

> **getSubscriptionHandler**(`_subscription`, `cb`): [`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)

Defined in: [mqttbridge/src/handler/getSubscriptionHandler.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/mqttbridge/src/handler/getSubscriptionHandler.impl.ts#L17)

## Parameters

### \_subscription

[`Subscription`](../../core/type-aliases/Subscription.md)

### cb

(`message`) => `Promise`\<`Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId?`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../../core/enumerations/EBMessageType.md#custommessage); `otp?`: `string`; `payload?`: `unknown`; `principalId?`: `string`; `receiver?`: [`EBMessageAddress`](../../core/type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId?`: `string`; `timestamp`: `number`; `traceId?`: `string`; \}, `"id"` \| `"timestamp"`\> \| `undefined`\>

## Returns

[`IncomingMessageFunction`](../type-aliases/IncomingMessageFunction.md)
