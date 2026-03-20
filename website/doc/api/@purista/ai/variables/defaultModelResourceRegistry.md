[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / defaultModelResourceRegistry

# Variable: defaultModelResourceRegistry

> `const` **defaultModelResourceRegistry**: [`ModelResourceRegistry`](../classes/ModelResourceRegistry.md)

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:34](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L34)

Default shared registry used by helper services and queue workers.
Applications can register additional providers (for example [AiSdkProvider](../classes/AiSdkProvider.md))
before starting the AI worker/orchestrator services.
