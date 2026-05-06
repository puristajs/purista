[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ModelRerankers

# Type Alias: ModelRerankers\<Models\>

> **ModelRerankers**\<`Models`\> = `{ [Alias in keyof Models as Models[Alias] extends { rerank: (args: unknown[]) => unknown } ? Alias : never]: { name: string; rerank: any } }`

Defined in: [packages/ai/src/runtime/context.ts:868](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/context.ts#L868)

## Type Parameters

### Models

`Models` *extends* `Record`\<`string`, [`ModelProvider`](../interfaces/ModelProvider.md)\>
