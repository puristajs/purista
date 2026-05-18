[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportRuntimeCapabilities

# Function: exportRuntimeCapabilities()

> **exportRuntimeCapabilities**(`options`): `object`

Defined in: [helper/enterpriseInterop.ts:381](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L381)

Export a normalized runtime capability report from bridge declarations.

Definition-only mode is pure data transformation. Runtime inspection can pass
already-instantiated adapter capability objects without requiring this helper
to connect to infrastructure.

## Parameters

### options

[`ExportRuntimeCapabilitiesOptions`](../type-aliases/ExportRuntimeCapabilitiesOptions.md)

## Returns

`object`

### eventBridge

> **eventBridge**: \{ `capabilities`: [`EventBridgeCapabilities`](../type-aliases/EventBridgeCapabilities.md) \| `undefined`; `name`: `string`; \} \| `undefined`

### mode

> **mode**: [`RuntimeCapabilityReportMode`](../type-aliases/RuntimeCapabilityReportMode.md)

### queueBridge

> **queueBridge**: \{ `capabilities`: [`QueueBridgeCapabilities`](../type-aliases/QueueBridgeCapabilities.md) \| `undefined`; `idempotency`: \{ `enforced`: `boolean`; `exactlyOnce`: `boolean`; \} \| `undefined`; `longRunning`: \{ `leaseExtension`: `boolean`; `leaseInspection`: `boolean`; `strictStartupValidation`: `boolean`; \} \| `undefined`; `name`: `string`; `resultPolicies`: \{ `event`: `boolean`; `state`: `boolean`; `stateAndEvent`: `boolean`; \} \| `undefined`; \} \| `undefined`

### version

> **version**: `string` = `'1.0.0'`
