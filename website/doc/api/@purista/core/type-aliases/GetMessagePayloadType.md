[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / GetMessagePayloadType

# Type Alias: GetMessagePayloadType\<PayloadSchema, TransformInputPayloadSchema\>

> **GetMessagePayloadType**\<`PayloadSchema`, `TransformInputPayloadSchema`\> = `TransformInputPayloadSchema` *extends* [`Schema`](Schema.md) ? [`InferIn`](InferIn.md)\<`TransformInputPayloadSchema`\> : `PayloadSchema` *extends* [`Schema`](Schema.md) ? [`InferIn`](InferIn.md)\<`PayloadSchema`\> : `unknown`

Defined in: [core/types/GetMessagePayloadType.ts:3](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/GetMessagePayloadType.ts#L3)

## Type Parameters

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](Schema.md) \| `undefined`

### TransformInputPayloadSchema

`TransformInputPayloadSchema` *extends* [`Schema`](Schema.md) \| `undefined`
