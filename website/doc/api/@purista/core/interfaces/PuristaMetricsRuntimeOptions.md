[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PuristaMetricsRuntimeOptions

# Interface: PuristaMetricsRuntimeOptions

Defined in: [core/metrics/types.ts:125](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L125)

Runtime metrics options consumed by PURISTA recorders.

## Example

```ts
const options: PuristaMetricsRuntimeOptions = {
  defaultAttributes: { 'purista.service.name': 'orders' },
}
```

## Properties

### defaultAttributes?

> `optional` **defaultAttributes?**: `PuristaMetricAttributes`

Defined in: [core/metrics/types.ts:128](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L128)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [core/metrics/types.ts:126](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L126)

***

### meter?

> `optional` **meter?**: `Meter`

Defined in: [core/metrics/types.ts:127](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L127)

***

### recordCustomMetrics?

> `optional` **recordCustomMetrics?**: `boolean`

Defined in: [core/metrics/types.ts:130](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L130)

***

### recordFrameworkMetrics?

> `optional` **recordFrameworkMetrics?**: `boolean`

Defined in: [core/metrics/types.ts:129](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L129)
