[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelEmbeddings

# Type Alias: ModelEmbeddings\<Models\>

> **ModelEmbeddings**\<`Models`\> = `{ [Alias in keyof Models as Models[Alias] extends { embed: (args: unknown[]) => unknown } ? Alias : never]: { name: string; embed: any; embedMany?: any } }`

Defined in: [packages/ai/src/runtime/context.ts:860](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L860)

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>
