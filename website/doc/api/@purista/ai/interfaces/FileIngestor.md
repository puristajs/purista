[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / FileIngestor

# Interface: FileIngestor

Defined in: [packages/ai/src/input/ingestion.ts:27](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/input/ingestion.ts#L27)

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/ai/src/input/ingestion.ts:28](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/input/ingestion.ts#L28)

## Methods

### ingest()

> **ingest**(`attachment`, `context`): `Promise`\<[`FileIngestionResult`](../type-aliases/FileIngestionResult.md)\>

Defined in: [packages/ai/src/input/ingestion.ts:30](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/input/ingestion.ts#L30)

#### Parameters

##### attachment

[`AgentAttachment`](../type-aliases/AgentAttachment.md)

##### context

[`FileIngestionContext`](../type-aliases/FileIngestionContext.md)

#### Returns

`Promise`\<[`FileIngestionResult`](../type-aliases/FileIngestionResult.md)\>

***

### supports()

> **supports**(`attachment`): `boolean`

Defined in: [packages/ai/src/input/ingestion.ts:29](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/input/ingestion.ts#L29)

#### Parameters

##### attachment

[`AgentAttachment`](../type-aliases/AgentAttachment.md)

#### Returns

`boolean`
