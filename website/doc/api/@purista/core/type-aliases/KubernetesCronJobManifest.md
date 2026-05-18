[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / KubernetesCronJobManifest

# Type Alias: KubernetesCronJobManifest

> **KubernetesCronJobManifest** = `object`

Defined in: [helper/enterpriseInterop.ts:90](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L90)

## Properties

### apiVersion

> **apiVersion**: `"batch/v1"`

Defined in: [helper/enterpriseInterop.ts:91](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L91)

***

### kind

> **kind**: `"CronJob"`

Defined in: [helper/enterpriseInterop.ts:92](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L92)

***

### metadata

> **metadata**: `object`

Defined in: [helper/enterpriseInterop.ts:93](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L93)

#### annotations

> **annotations**: `Record`\<`string`, `string`\>

#### labels?

> `optional` **labels?**: `Record`\<`string`, `string`\>

#### name

> **name**: `string`

#### namespace?

> `optional` **namespace?**: `string`

***

### spec

> **spec**: [`JsonRecord`](JsonRecord.md) & `object`

Defined in: [helper/enterpriseInterop.ts:99](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L99)

#### Type Declaration

##### concurrencyPolicy?

> `optional` **concurrencyPolicy?**: `"Allow"` \| `"Forbid"` \| `"Replace"`

##### jobTemplate

> **jobTemplate**: `object`

###### jobTemplate.spec

> **spec**: `object`

###### jobTemplate.spec.template

> **template**: `object`

###### jobTemplate.spec.template.spec

> **spec**: `object`

###### jobTemplate.spec.template.spec.containers

> **containers**: [`JsonRecord`](JsonRecord.md)[]

###### jobTemplate.spec.template.spec.restartPolicy

> **restartPolicy**: `"Never"` \| `"OnFailure"`

##### schedule

> **schedule**: `string`

##### suspend?

> `optional` **suspend?**: `boolean`

##### timeZone?

> `optional` **timeZone?**: `string`
