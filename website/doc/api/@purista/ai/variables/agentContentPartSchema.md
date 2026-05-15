[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / agentContentPartSchema

# Variable: agentContentPartSchema

> `const` **agentContentPartSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `kind`: `ZodLiteral`\<`"text"`\>; `text`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `dataBase64`: `ZodString`; `kind`: `ZodLiteral`\<`"image"`\>; `mimeType`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `kind`: `ZodLiteral`\<`"image_url"`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `url`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `dataBase64`: `ZodString`; `kind`: `ZodLiteral`\<`"audio"`\>; `mimeType`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `dataBase64`: `ZodString`; `filename`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodLiteral`\<`"file"`\>; `mimeType`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `filename`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodLiteral`\<`"file_url"`\>; `mimeType`: `ZodOptional`\<`ZodString`\>; `url`: `ZodString`; \}, `$strip`\>\], `"kind"`\>

Defined in: [runtime/sseEvents.ts:18](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/runtime/sseEvents.ts#L18)

Provider-neutral multimodal content part schema used by AI outputs and
OpenAPI descriptions.

## Example

```ts
const image = agentContentPartSchema.parse({
  kind: 'image_url',
  url: 'https://example.com/image.png',
})
```
