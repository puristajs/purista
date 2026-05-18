[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ExportKubernetesCronJobsOptions

# Type Alias: ExportKubernetesCronJobsOptions

> **ExportKubernetesCronJobsOptions** = `object`

Defined in: [helper/enterpriseInterop.ts:80](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L80)

## Properties

### annotations?

> `optional` **annotations?**: `Record`\<`string`, `string`\>

Defined in: [helper/enterpriseInterop.ts:86](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L86)

***

### labels?

> `optional` **labels?**: `Record`\<`string`, `string`\>

Defined in: [helper/enterpriseInterop.ts:85](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L85)

***

### manifest?

> `optional` **manifest?**: [`ScheduleManifest`](ScheduleManifest.md)

Defined in: [helper/enterpriseInterop.ts:82](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L82)

***

### namespace?

> `optional` **namespace?**: `string`

Defined in: [helper/enterpriseInterop.ts:84](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L84)

***

### restartPolicy?

> `optional` **restartPolicy?**: `"Never"` \| `"OnFailure"`

Defined in: [helper/enterpriseInterop.ts:87](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L87)

***

### services?

> `optional` **services?**: [`ServiceContractInput`](ServiceContractInput.md)

Defined in: [helper/enterpriseInterop.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L81)

***

### trigger

> **trigger**: [`KubernetesCronJobTriggerTemplate`](KubernetesCronJobTriggerTemplate.md)

Defined in: [helper/enterpriseInterop.ts:83](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L83)
