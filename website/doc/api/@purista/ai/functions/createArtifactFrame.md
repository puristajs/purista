[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createArtifactFrame

# Function: createArtifactFrame()

> **createArtifactFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:66](https://github.com/puristajs/purista/blob/01c6b50dcd0391349ebdcf4da669a8637214ec33/packages/ai/src/protocol/helpers.ts#L66)

## Parameters

### input

#### artifactId

`string`

#### content

`string` \| `Record`\<`string`, `unknown`\>

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

> `readonly` **content**: `string` \| `Record`\<`string`, `unknown`\> = `input.content`

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
