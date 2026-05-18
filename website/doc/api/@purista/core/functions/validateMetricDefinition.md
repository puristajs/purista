[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / validateMetricDefinition

# Function: validateMetricDefinition()

> **validateMetricDefinition**(`name`, `definition`, `knownMetricNames?`): `Promise`\<`void`\>

Defined in: [core/metrics/metricDefinitionSchema.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/metricDefinitionSchema.ts#L35)

Validates a custom application metric definition.

## Parameters

### name

`string`

### definition

`PuristaMetricDefinition`\<`any`\>

### knownMetricNames?

`Iterable`\<`string`\> = `[]`

## Returns

`Promise`\<`void`\>

## Example

```ts
await validateMetricDefinition('app.orders.created', {
  kind: 'counter',
  unit: '{order}',
  description: 'Created orders',
})
```
