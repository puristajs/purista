[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createTelemetryFrame

# Function: createTelemetryFrame()

> **createTelemetryFrame**(`input`): `object`

Defined in: [packages/ai/src/protocol/helpers.ts:104](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/protocol/helpers.ts#L104)

## Parameters

### input

#### activeWorkers?

`number`

#### durationMs?

`number`

#### effectiveMaxConcurrencyHint?

`number`

#### maxConcurrencyPerInstance?

`number`

#### poolId?

`string`

#### provider?

`string`

#### replicaCountHint?

`number`

#### usage?

\{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}

#### usage.completionTokens?

`number` = `...`

#### usage.costUsd?

`number` = `...`

#### usage.promptTokens?

`number` = `...`

#### usage.totalTokens?

`number` = `...`

#### waitingWorkers?

`number`

#### waitTimeMs?

`number`

## Returns

`object`

### activeWorkers

> `readonly` **activeWorkers**: `number` \| `undefined` = `input.activeWorkers`

### durationMs

> `readonly` **durationMs**: `number` \| `undefined` = `input.durationMs`

### effectiveMaxConcurrencyHint

> `readonly` **effectiveMaxConcurrencyHint**: `number` \| `undefined` = `input.effectiveMaxConcurrencyHint`

### kind

> `readonly` **kind**: `"telemetry"` = `'telemetry'`

### maxConcurrencyPerInstance

> `readonly` **maxConcurrencyPerInstance**: `number` \| `undefined` = `input.maxConcurrencyPerInstance`

### poolId

> `readonly` **poolId**: `string` \| `undefined` = `input.poolId`

### provider

> `readonly` **provider**: `string` \| `undefined` = `input.provider`

### replicaCountHint

> `readonly` **replicaCountHint**: `number` \| `undefined` = `input.replicaCountHint`

### usage

> `readonly` **usage**: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \} \| `undefined` = `input.usage`

### waitingWorkers

> `readonly` **waitingWorkers**: `number` \| `undefined` = `input.waitingWorkers`

### waitTimeMs

> `readonly` **waitTimeMs**: `number` \| `undefined` = `input.waitTimeMs`
