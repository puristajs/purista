[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / puristaConfigSchema

# Variable: puristaConfigSchema

> `const` **puristaConfigSchema**: `ZodObject`\<\{ `$schema`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\>; `agentPath`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\>; `eventBridge`: `ZodDefault`\<`ZodEnum`\<\{ `amqp`: `"amqp"`; `dapr`: `"dapr"`; `default`: `"default"`; `mqtt`: `"mqtt"`; `nats`: `"nats"`; \}\>\>; `eventConvention`: `ZodDefault`\<`ZodEnum`\<\{ `camel`: `"camel"`; `constantCase`: `"constantCase"`; `dotCase`: `"dotCase"`; `kebab`: `"kebab"`; `pascal`: `"pascal"`; `pascalSnake`: `"pascalSnake"`; `pathCase`: `"pathCase"`; `snake`: `"snake"`; `trainCase`: `"trainCase"`; \}\>\>; `fileConvention`: `ZodDefault`\<`ZodEnum`\<\{ `camel`: `"camel"`; `kebab`: `"kebab"`; `pascal`: `"pascal"`; `pascalSnake`: `"pascalSnake"`; `snake`: `"snake"`; \}\>\>; `formatter`: `ZodDefault`\<`ZodEnum`\<\{ `biome`: `"biome"`; `none`: `"none"`; `prettier`: `"prettier"`; \}\>\>; `linter`: `ZodDefault`\<`ZodEnum`\<\{ `biome`: `"biome"`; `eslint`: `"eslint"`; `none`: `"none"`; \}\>\>; `runtime`: `ZodDefault`\<`ZodEnum`\<\{ `bun`: `"bun"`; `node`: `"node"`; \}\>\>; `servicePath`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [loadPuristaConfig.ts:8](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/cli/src/api/loadPuristaConfig.ts#L8)

Schema of the purista.json configuration file.
