[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createTelemetryFrame

# Function: createTelemetryFrame()

> **createTelemetryFrame**(`input`): `object`

Defined in: [ai/src/protocol/helpers.ts:104](https://github.com/puristajs/purista/blob/628eeaaef5a076ec8b551022566e701417e6c49c/packages/ai/src/protocol/helpers.ts#L104)

## Parameters

### input

#### durationMs?

`number`

#### poolId?

`string`

#### provider?

`string`

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

#### waitTimeMs?

`number`

## Returns

`object`

### durationMs

> `readonly` **durationMs**: `number` \| `undefined` = `input.durationMs`

### kind

> `readonly` **kind**: `"telemetry"` = `'telemetry'`

### poolId

> `readonly` **poolId**: `string` \| `undefined` = `input.poolId`

### provider

> `readonly` **provider**: `string` \| `undefined` = `input.provider`

### usage

> `readonly` **usage**: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \} \| `undefined` = `input.usage`

### waitTimeMs

> `readonly` **waitTimeMs**: `number` \| `undefined` = `input.waitTimeMs`
