[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/base-http-bridge](../README.md) / IHttpEventBridge

# Type Alias: IHttpEventBridge

> **IHttpEventBridge** = `object` & [`EventBridgeBaseClass`](../../core/classes/EventBridgeBaseClass.md)\<[`HttpEventBridgeConfig`](HttpEventBridgeConfig.md)\>

Defined in: [base-http-bridge/src/HttpEventBridge/types/IHttpEventBridge.ts:4](https://github.com/puristajs/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/IHttpEventBridge.ts#L4)

## Type Declaration

### emitMessage()

> **emitMessage**: (`message`) => `Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

#### Parameters

##### message

`Omit`\<[`EBMessage`](../../core/type-aliases/EBMessage.md), `"id"` \| `"timestamp"` \| `"correlationId"`\>

#### Returns

`Promise`\<`Readonly`\<[`EBMessage`](../../core/type-aliases/EBMessage.md)\>\>

### isHealthy()

> **isHealthy**: () => `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>
