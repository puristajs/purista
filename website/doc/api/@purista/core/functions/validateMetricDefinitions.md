[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / validateMetricDefinitions

# Function: validateMetricDefinitions()

> **validateMetricDefinitions**(`definitions`): `Promise`\<`void`\>

Defined in: [core/metrics/metricDefinitionSchema.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/metricDefinitionSchema.ts#L86)

Validates multiple custom metric definitions as one registry.

## Parameters

### definitions

`Record`\<`string`, `PuristaMetricDefinition`\<`any`\>\>

## Returns

`Promise`\<`void`\>

## Example

```ts
await validateMetricDefinitions({ 'app.orders.created': definition })
```
