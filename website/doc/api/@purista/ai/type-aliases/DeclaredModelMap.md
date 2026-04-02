[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DeclaredModelMap

# Type Alias: DeclaredModelMap\<ModelAliases, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases\>

> **DeclaredModelMap**\<`ModelAliases`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\> = `{ [Alias in ModelAliases]: DeclaredModelAliasApi<Alias, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases> }`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:372](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L372)

## Type Parameters

### ModelAliases

`ModelAliases` *extends* `string`

### TextAliases

`TextAliases` *extends* `string`

### StreamAliases

`StreamAliases` *extends* `string`

### EmbeddingAliases

`EmbeddingAliases` *extends* `string`

### RerankAliases

`RerankAliases` *extends* `string`

### ObjectAliases

`ObjectAliases` *extends* `string`
