[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / defaultModelResourceRegistry

# Variable: defaultModelResourceRegistry

> `const` **defaultModelResourceRegistry**: [`ModelResourceRegistry`](../classes/ModelResourceRegistry.md)

Defined in: [ai/src/providers/resources/ModelResourceRegistry.ts:39](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/providers/resources/ModelResourceRegistry.ts#L39)

Default shared registry used by helper services and queue workers.
Applications can register additional providers (for example [AiSdkProvider](../classes/AiSdkProvider.md))
before starting the AI worker/orchestrator services.
