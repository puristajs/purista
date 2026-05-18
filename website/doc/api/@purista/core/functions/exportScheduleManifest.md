[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportScheduleManifest

# Function: exportScheduleManifest()

> **exportScheduleManifest**(`options`): `Promise`\<[`ScheduleManifest`](../type-aliases/ScheduleManifest.md)\>

Defined in: [helper/enterpriseInterop.ts:424](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L424)

Export provider-neutral schedule metadata from service definitions.

## Parameters

### options

[`ExportScheduleManifestOptions`](../type-aliases/ExportScheduleManifestOptions.md)

## Returns

`Promise`\<[`ScheduleManifest`](../type-aliases/ScheduleManifest.md)\>

## Example

```ts
const manifest = await exportScheduleManifest({
  title: 'Billing schedules',
  version: '1.0.0',
  services: exportedDefinitions,
})
```
