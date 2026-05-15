[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CreateCommandTestHarnessOptions

# Type Alias: CreateCommandTestHarnessOptions\<TServiceBuilder\>

> **CreateCommandTestHarnessOptions**\<`TServiceBuilder`\> = [`InstanceConfigType`](InstanceConfigType.md)\<[`InferCommandHarnessServiceBuilderConfig`](InferCommandHarnessServiceBuilderConfig.md)\<`TServiceBuilder`\>\> & `object`

Defined in: [testing/createCommandTestHarness.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandTestHarness.ts#L25)

## Type Declaration

### eventBridge?

> `optional` **eventBridge?**: [`EventBridge`](../interfaces/EventBridge.md)

### queueBridge?

> `optional` **queueBridge?**: [`QueueBridge`](../interfaces/QueueBridge.md)

## Type Parameters

### TServiceBuilder

`TServiceBuilder` *extends* [`ServiceBuilder`](../classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](ServiceBuilderTypes.md)\>
