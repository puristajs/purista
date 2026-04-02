[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / DeclaredModelAliasApi

# Type Alias: DeclaredModelAliasApi\<Alias, TextAliases, StreamAliases, EmbeddingAliases, RerankAliases, ObjectAliases\>

> **DeclaredModelAliasApi**\<`Alias`, `TextAliases`, `StreamAliases`, `EmbeddingAliases`, `RerankAliases`, `ObjectAliases`\> = `Pick`\<[`ModelProvider`](../interfaces/ModelProvider.md), `"name"` \| `"capabilities"`\> & `Alias` *extends* `TextAliases` ? `object` : `Record`\<`never`, `never`\> & `Alias` *extends* `TextAliases` \| `StreamAliases` ? `object` : `Record`\<`never`, `never`\> & `Alias` *extends* `ObjectAliases` ? `object` : `Record`\<`never`, `never`\> & `Alias` *extends* `StreamAliases` ? `object` : `Record`\<`never`, `never`\> & `Alias` *extends* `EmbeddingAliases` ? `object` : `Record`\<`never`, `never`\> & `Alias` *extends* `RerankAliases` ? `object` : `Record`\<`never`, `never`\>

Defined in: [packages/ai/src/builder/AgentBuilder.ts:344](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/builder/AgentBuilder.ts#L344)

## Type Parameters

### Alias

`Alias` *extends* `string`

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
