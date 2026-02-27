[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / createTelemetryFrame

# Function: createTelemetryFrame()

> **createTelemetryFrame**(`input`): `object`

Defined in: protocol/helpers.ts:90

## Parameters

### input

#### durationMs?

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

## Returns

`object`

### durationMs

> `readonly` **durationMs**: `number` \| `undefined` = `input.durationMs`

### kind

> `readonly` **kind**: `"telemetry"` = `'telemetry'`

### usage

> `readonly` **usage**: \{ `completionTokens?`: `number`; `costUsd?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \} \| `undefined` = `input.usage`
