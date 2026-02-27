[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createArtifactFrame

# Function: createArtifactFrame()

> **createArtifactFrame**(`input`): `object`

Defined in: protocol/helpers.ts:58

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

`"chunk"` \| `"final"`

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

> `readonly` **phase**: `"chunk"` \| `"final"`
