[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EmitCustomMessageFunction

# Type Alias: EmitCustomMessageFunction()\<EmitList\>

> **EmitCustomMessageFunction**\<`EmitList`\>: \<`K`\>(`eventName`, `payload`, `contentType`?, `contentEncoding`?) => `Promise`\<`void`\>

Defined in: [packages/core/src/core/types/EmitCustomMessageFunction.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EmitCustomMessageFunction.ts#L12)

Emits the given payload as custom message with the given event name.

## Type Parameters

• **EmitList**

## Type Parameters

• **K** *extends* keyof [`EmitSchemaList`](EmitSchemaList.md)\<`EmitList`\>

## Parameters

### eventName

`K`

### payload

`EmitList`\[`K`\]

### contentType?

[`ContentType`](ContentType.md)

### contentEncoding?

`string`

## Returns

`Promise`\<`void`\>

## Example

```typescript
await emit('my-custom-event-name', { the: 'payload' })
```
