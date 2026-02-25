[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / configSchema

# Variable: configSchema

> `const` **configSchema**: `ZodObject`\<\{ `buildAs`: `ZodDefault`\<`ZodEnum`\<\{ `both`: `"both"`; `commonjs`: `"commonjs"`; `esm`: `"esm"`; \}\>\>; `definitionPath`: `ZodString`; `eventBridgeClient`: `ZodOptional`\<`ZodObject`\<\{ `clientName`: `ZodDefault`\<`ZodString`\>; \}, `$strip`\>\>; `httpClient`: `ZodOptional`\<`ZodObject`\<\{ `clientName`: `ZodDefault`\<`ZodString`\>; \}, `$strip`\>\>; `outputPath`: `ZodString`; `package`: `ZodOptional`\<`ZodObject`\<\{ `description`: `ZodDefault`\<`ZodString`\>; `name`: `ZodString`; `private`: `ZodDefault`\<`ZodBoolean`\>; \}, `$strip`\>\>; `version`: `ZodString`; \}, `$strip`\>

Defined in: [ClientBuilder/schema/configSchema.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/ClientBuilder/schema/configSchema.ts#L20)
