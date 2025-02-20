[**@purista/hono-http-server v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/hono-http-server](../README.md) / InfoObjectSchema

# Variable: InfoObjectSchema

> `const` **InfoObjectSchema**: `ZodObject`\<\{ `contact`: `ZodOptional`\<`ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `name`: `ZodOptional`\<`ZodString`\>; `url`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `email`: `string`; `name`: `string`; `url`: `string`; \}, \{ `email`: `string`; `name`: `string`; `url`: `string`; \}\>\>; `description`: `ZodDefault`\<`ZodString`\>; `license`: `ZodOptional`\<`ZodObject`\<\{ `name`: `ZodString`; `url`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `name`: `string`; `url`: `string`; \}, \{ `name`: `string`; `url`: `string`; \}\>\>; `termsOfService`: `ZodOptional`\<`ZodString`\>; `title`: `ZodDefault`\<`ZodString`\>; `version`: `ZodDefault`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `contact`: \{ `email`: `string`; `name`: `string`; `url`: `string`; \}; `description`: `string`; `license`: \{ `name`: `string`; `url`: `string`; \}; `termsOfService`: `string`; `title`: `string`; `version`: `string`; \}, \{ `contact`: \{ `email`: `string`; `name`: `string`; `url`: `string`; \}; `description`: `string`; `license`: \{ `name`: `string`; `url`: `string`; \}; `termsOfService`: `string`; `title`: `string`; `version`: `string`; \}\>

Defined in: [packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:25](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L25)
