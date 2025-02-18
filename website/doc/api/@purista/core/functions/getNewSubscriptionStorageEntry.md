[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getNewSubscriptionStorageEntry

# Function: getNewSubscriptionStorageEntry()

> **getNewSubscriptionStorageEntry**(`subscription`, `cb`): [`SubscriptionStorageEntry`](../type-aliases/SubscriptionStorageEntry.md)

Defined in: [packages/core/src/DefaultEventBridge/getNewSubscriptionStorageEntry.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/getNewSubscriptionStorageEntry.impl.ts#L4)

## Parameters

### subscription

[`Subscription`](../type-aliases/Subscription.md)

### cb

(`message`) => `Promise`\<`undefined` \| `Omit`\<\{ `contentEncoding`: `string`; `contentType`: `string`; `correlationId`: `string`; `eventName`: `string`; `id`: `string`; `messageType`: [`CustomMessage`](../enumerations/EBMessageType.md#custommessage); `otp`: `string`; `payload`: `unknown`; `principalId`: `string`; `receiver`: [`EBMessageAddress`](../type-aliases/EBMessageAddress.md); `sender`: \{ `instanceId`: `string`; `serviceName`: `string`; `serviceTarget`: `string`; `serviceVersion`: `string`; \}; `tenantId`: `string`; `timestamp`: `number`; `traceId`: `string`; \}, `"id"` \| `"timestamp"`\>\>

## Returns

[`SubscriptionStorageEntry`](../type-aliases/SubscriptionStorageEntry.md)
