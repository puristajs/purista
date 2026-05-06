[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createArtifactFrame

# Function: createArtifactFrame()

> **createArtifactFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:67](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/protocol/helpers.ts#L67)

## Parameters

### input

#### artifactId

`string`

#### content

[`JsonValue`](../type-aliases/JsonValue.md)

#### lastChunk?

`boolean`

#### mimeType?

`string`

#### phase?

`"final"` \| `"chunk"`

#### sequence?

`number`

#### total?

`number`

## Returns

`object`

### artifactId

> `readonly` **artifactId**: `string` = `input.artifactId`

### content

> `readonly` **content**: [`JsonValue`](../type-aliases/JsonValue.md)

### kind

> `readonly` **kind**: `"artifact"` = `'artifact'`

### lastChunk

> `readonly` **lastChunk**: `boolean` \| `undefined` = `input.lastChunk`

### mimeType

> `readonly` **mimeType**: `string` \| `undefined` = `input.mimeType`

### phase

> `readonly` **phase**: `"final"` \| `"chunk"`

### sequence

> `readonly` **sequence**: `number` \| `undefined` = `input.sequence`

### total

> `readonly` **total**: `number` \| `undefined` = `input.total`
