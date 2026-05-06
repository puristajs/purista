[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / ContentPart

# Type Alias: ContentPart

> **ContentPart** = \{ `kind`: `"text"`; `text`: `string`; \} \| \{ `dataBase64`: `string`; `kind`: `"image"`; `mimeType`: `string`; \} \| \{ `kind`: `"image_url"`; `mimeType?`: `string`; `url`: `string`; \} \| \{ `dataBase64`: `string`; `kind`: `"audio"`; `mimeType`: `string`; \} \| \{ `dataBase64`: `string`; `filename?`: `string`; `kind`: `"file"`; `mimeType`: `string`; \} \| \{ `filename?`: `string`; `kind`: `"file_url"`; `mimeType?`: `string`; `url`: `string`; \}

Defined in: ai/node\_modules/@purista/harness/dist/ports/model-provider.d.ts:49

Multimodal message content part.

## Type Declaration

\{ `kind`: `"text"`; `text`: `string`; \}

### kind

> **kind**: `"text"`

### text

> **text**: `string`

Plain text input content.

\{ `dataBase64`: `string`; `kind`: `"image"`; `mimeType`: `string`; \}

### dataBase64

> **dataBase64**: `string`

### kind

> **kind**: `"image"`

### mimeType

> **mimeType**: `string`

Inline image content encoded as base64 data.

\{ `kind`: `"image_url"`; `mimeType?`: `string`; `url`: `string`; \}

### kind

> **kind**: `"image_url"`

### mimeType?

> `optional` **mimeType**: `string`

### url

> **url**: `string`

Remote image reference.

\{ `dataBase64`: `string`; `kind`: `"audio"`; `mimeType`: `string`; \}

### dataBase64

> **dataBase64**: `string`

### kind

> **kind**: `"audio"`

### mimeType

> **mimeType**: `string`

Inline audio content encoded as base64 data.

\{ `dataBase64`: `string`; `filename?`: `string`; `kind`: `"file"`; `mimeType`: `string`; \}

### dataBase64

> **dataBase64**: `string`

### filename?

> `optional` **filename**: `string`

### kind

> **kind**: `"file"`

### mimeType

> **mimeType**: `string`

Inline file content encoded as base64 data.

\{ `filename?`: `string`; `kind`: `"file_url"`; `mimeType?`: `string`; `url`: `string`; \}

### filename?

> `optional` **filename**: `string`

### kind

> **kind**: `"file_url"`

### mimeType?

> `optional` **mimeType**: `string`

### url

> **url**: `string`

Remote file reference.
