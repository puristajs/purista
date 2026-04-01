[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / PassthroughImageFileIngestor

# Class: PassthroughImageFileIngestor

Defined in: [packages/ai/src/input/ingestion.ts:33](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/ingestion.ts#L33)

## Implements

- [`FileIngestor`](../interfaces/FileIngestor.md)

## Constructors

### Constructor

> **new PassthroughImageFileIngestor**(): `PassthroughImageFileIngestor`

#### Returns

`PassthroughImageFileIngestor`

## Properties

### name

> `readonly` **name**: `"passthrough-image"` = `'passthrough-image'`

Defined in: [packages/ai/src/input/ingestion.ts:34](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/ingestion.ts#L34)

#### Implementation of

[`FileIngestor`](../interfaces/FileIngestor.md).[`name`](../interfaces/FileIngestor.md#name)

## Methods

### ingest()

> **ingest**(`attachment`): `Promise`\<[`FileIngestionResult`](../type-aliases/FileIngestionResult.md)\>

Defined in: [packages/ai/src/input/ingestion.ts:40](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/ingestion.ts#L40)

#### Parameters

##### attachment

[`AgentAttachment`](../type-aliases/AgentAttachment.md)

#### Returns

`Promise`\<[`FileIngestionResult`](../type-aliases/FileIngestionResult.md)\>

#### Implementation of

[`FileIngestor`](../interfaces/FileIngestor.md).[`ingest`](../interfaces/FileIngestor.md#ingest)

***

### supports()

> **supports**(`attachment`): `boolean`

Defined in: [packages/ai/src/input/ingestion.ts:36](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/input/ingestion.ts#L36)

#### Parameters

##### attachment

[`AgentAttachment`](../type-aliases/AgentAttachment.md)

#### Returns

`boolean`

#### Implementation of

[`FileIngestor`](../interfaces/FileIngestor.md).[`supports`](../interfaces/FileIngestor.md#supports)
