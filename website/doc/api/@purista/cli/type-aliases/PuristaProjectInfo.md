[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaProjectInfo

# Type Alias: PuristaProjectInfo

> **PuristaProjectInfo** = `object`

Defined in: [scanPuristaProject.ts:32](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/cli/src/api/scanPuristaProject.ts#L32)

Information about a Purista project.

## Properties

### eventEnumFileName

> **eventEnumFileName**: `string`

Defined in: [scanPuristaProject.ts:38](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/cli/src/api/scanPuristaProject.ts#L38)

The file name of the file that contains the event enum

***

### eventNames

> **eventNames**: `object`[]

Defined in: [scanPuristaProject.ts:36](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/cli/src/api/scanPuristaProject.ts#L36)

List of event names and their corresponding values

#### name

> **name**: `string`

#### value

> **value**: `string`

***

### services

> **services**: [`PuristaProjectServices`](PuristaProjectServices.md)

Defined in: [scanPuristaProject.ts:34](https://github.com/puristajs/purista/blob/240dc32a05e13e75a31a2b67d91e129232f5f249/packages/cli/src/api/scanPuristaProject.ts#L34)

The information about existing services
