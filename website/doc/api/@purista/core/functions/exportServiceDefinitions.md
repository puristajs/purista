[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportServiceDefinitions

# Function: exportServiceDefinitions()

> **exportServiceDefinitions**(`serviceBuilders`): `Promise`\<[`FullDefinition`](../type-aliases/FullDefinition.md)\>

Defined in: [helper/exportServiceDefinitions.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/exportServiceDefinitions.ts#L59)

Exports the service definitions.
Includes the information about commands and subscriptions.

The output can be saved as JSON string in a file.

## Parameters

### serviceBuilders

[`ServiceBuilder`](../classes/ServiceBuilder.md)\<[`ServiceBuilderTypes`](../type-aliases/ServiceBuilderTypes.md)\>[]

## Returns

`Promise`\<[`FullDefinition`](../type-aliases/FullDefinition.md)\>
