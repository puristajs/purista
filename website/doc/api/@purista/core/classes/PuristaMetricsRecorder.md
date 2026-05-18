[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PuristaMetricsRecorder

# Class: PuristaMetricsRecorder

Defined in: [core/metrics/PuristaMetricsRecorder.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/PuristaMetricsRecorder.ts#L34)

OpenTelemetry API backed PURISTA metrics recorder.

The recorder depends only on `@opentelemetry/api`. Applications provide the
actual MeterProvider and exporters at runtime.

## Example

```ts
const recorder = new PuristaMetricsRecorder({
  defaultAttributes: { 'purista.service.name': 'orders' },
})
recorder.recordFrameworkMetric('purista.command.executions', 1, {
  'purista.command.name': 'createOrder',
})
```

## Implements

- [`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md)

## Constructors

### Constructor

> **new PuristaMetricsRecorder**(`options?`): `PuristaMetricsRecorder`

Defined in: [core/metrics/PuristaMetricsRecorder.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/PuristaMetricsRecorder.ts#L42)

#### Parameters

##### options?

[`PuristaMetricsRuntimeOptions`](../interfaces/PuristaMetricsRuntimeOptions.md) = `{}`

#### Returns

`PuristaMetricsRecorder`

## Methods

### recordCustomMetric()

> **recordCustomMetric**(`name`, `definition`, `value`, `attributes?`): `void`

Defined in: [core/metrics/PuristaMetricsRecorder.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/PuristaMetricsRecorder.ts#L63)

#### Parameters

##### name

`string`

##### definition

`PuristaMetricDefinition`\<`any`\>

##### value

`number`

##### attributes?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

#### Returns

`void`

#### Implementation of

[`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md).[`recordCustomMetric`](../interfaces/PuristaMetricsRecorderInterface.md#recordcustommetric)

***

### recordFrameworkMetric()

> **recordFrameworkMetric**(`name`, `value`, `attributes?`): `void`

Defined in: [core/metrics/PuristaMetricsRecorder.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/PuristaMetricsRecorder.ts#L50)

#### Parameters

##### name

`string`

##### value

`number`

##### attributes?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

#### Returns

`void`

#### Implementation of

[`PuristaMetricsRecorderInterface`](../interfaces/PuristaMetricsRecorderInterface.md).[`recordFrameworkMetric`](../interfaces/PuristaMetricsRecorderInterface.md#recordframeworkmetric)
