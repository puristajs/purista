[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / defaultModelResourceRegistry

# Variable: defaultModelResourceRegistry

> `const` **defaultModelResourceRegistry**: [`ModelResourceRegistry`](../classes/ModelResourceRegistry.md)

Defined in: [packages/ai/src/providers/resources/ModelResourceRegistry.ts:34](https://github.com/puristajs/purista/blob/430e29c621b412b5f21de4eb9697723299bc616e/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L34)

Default shared registry used by helper services and queue workers.
Applications can register additional providers (for example [AiSdkProvider](../classes/AiSdkProvider.md))
before starting the AI worker/orchestrator services.
