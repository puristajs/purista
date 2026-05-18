[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createMetricContext

# Function: createMetricContext()

> **createMetricContext**\<`Definitions`\>(`definitions`, `recorder`): `PuristaMetricContext`\<`Definitions`\>

Defined in: [core/metrics/createMetricContext.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/createMetricContext.ts#L54)

Creates the typed handler-facing metric context for declared custom metrics.

## Type Parameters

### Definitions

`Definitions` *extends* `PuristaMetricDefinitions`

## Parameters

### definitions

`Definitions`

### recorder

[`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

## Returns

`PuristaMetricContext`\<`Definitions`\>

## Example

```ts
const metrics = createMetricContext(metricDefinitions, recorder)
metrics['app.orders.created'].add(1, { channel: 'web' })
```
