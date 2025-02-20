[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / configFullSchema

# Variable: configFullSchema

> `const` **configFullSchema**: `ZodObject`\<`extendShape`\<\{ `buildAs`: `ZodDefault`\<`ZodEnum`\<\[`"esm"`, `"commonjs"`, `"both"`\]\>\>; `definitionPath`: `ZodString`; `outputPath`: `ZodString`; `package`: `ZodOptional`\<`ZodObject`\<\{ `description`: `ZodDefault`\<`ZodString`\>; `name`: `ZodString`; `private`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}, \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}\>\>; `version`: `ZodString`; \}, \{ `eventBridgeClient`: `ZodObject`\<\{ `clientName`: `ZodDefault`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `clientName`: `string`; \}, \{ `clientName`: `string`; \}\>; `httpClient`: `ZodObject`\<\{ `clientName`: `ZodDefault`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `clientName`: `string`; \}, \{ `clientName`: `string`; \}\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `buildAs`: `"esm"` \| `"commonjs"` \| `"both"`; `definitionPath`: `string`; `eventBridgeClient`: \{ `clientName`: `string`; \}; `httpClient`: \{ `clientName`: `string`; \}; `outputPath`: `string`; `package`: \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}; `version`: `string`; \}, \{ `buildAs`: `"esm"` \| `"commonjs"` \| `"both"`; `definitionPath`: `string`; `eventBridgeClient`: \{ `clientName`: `string`; \}; `httpClient`: \{ `clientName`: `string`; \}; `outputPath`: `string`; `package`: \{ `description`: `string`; `name`: `string`; `private`: `boolean`; \}; `version`: `string`; \}\>

Defined in: [packages/core/src/ClientBuilder/schema/configSchema.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/schema/configSchema.ts#L27)
