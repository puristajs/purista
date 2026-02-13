[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/cli](../README.md) / PuristaProjectInfo

# Type Alias: PuristaProjectInfo

> **PuristaProjectInfo** = `object`

Defined in: [scanPuristaProject.ts:28](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/scanPuristaProject.ts#L28)

Information about a Purista project.

## Properties

### eventEnumFileName

> **eventEnumFileName**: `string`

Defined in: [scanPuristaProject.ts:34](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/scanPuristaProject.ts#L34)

The file name of the file that contains the event enum

***

### eventNames

> **eventNames**: `object`[]

Defined in: [scanPuristaProject.ts:32](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/scanPuristaProject.ts#L32)

List of event names and their corresponding values

#### name

> **name**: `string`

#### value

> **value**: `string`

***

### services

> **services**: [`PuristaProjectServices`](PuristaProjectServices.md)

Defined in: [scanPuristaProject.ts:30](https://github.com/puristajs/purista/blob/d4f52fc34958022c6b9693e9270946d1111d759c/packages/cli/src/api/scanPuristaProject.ts#L30)

The information about existing services
