[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PuristaMetricsRecorderInterface

# Interface: PuristaMetricsRecorderInterface

Defined in: [core/metrics/types.ts:143](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L143)

A provider-neutral recorder used by framework code and metric contexts.

## Example

```ts
recorder.recordFrameworkMetric('purista.command.executions', 1, {
  'purista.command.name': 'createOrder',
})
```

## Methods

### recordCustomMetric()

> **recordCustomMetric**(`name`, `definition`, `value`, `attributes?`): `void`

Defined in: [core/metrics/types.ts:145](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L145)

#### Parameters

##### name

`string`

##### definition

`PuristaMetricDefinition`\<`any`\>

##### value

`number`

##### attributes?

`PuristaMetricAttributes`

#### Returns

`void`

***

### recordFrameworkMetric()

> **recordFrameworkMetric**(`name`, `value`, `attributes?`): `void`

Defined in: [core/metrics/types.ts:144](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/types.ts#L144)

#### Parameters

##### name

`string`

##### value

`number`

##### attributes?

`PuristaMetricAttributes`

#### Returns

`void`
