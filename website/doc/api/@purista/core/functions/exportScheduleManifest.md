[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportScheduleManifest

# Function: exportScheduleManifest()

> **exportScheduleManifest**(`options`): `Promise`\<\{ `schedules`: `JsonRecord`[]; `title`: `string` \| `undefined`; `version`: `string`; \}\>

Defined in: [helper/enterpriseInterop.ts:336](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L336)

Export provider-neutral schedule metadata from service definitions.

## Parameters

### options

[`ExportScheduleManifestOptions`](../type-aliases/ExportScheduleManifestOptions.md)

## Returns

`Promise`\<\{ `schedules`: `JsonRecord`[]; `title`: `string` \| `undefined`; `version`: `string`; \}\>

## Example

```ts
const manifest = await exportScheduleManifest({
  title: 'Billing schedules',
  version: '1.0.0',
  services: exportedDefinitions,
})
```
