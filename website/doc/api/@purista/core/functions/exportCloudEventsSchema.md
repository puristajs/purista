[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / exportCloudEventsSchema

# Function: exportCloudEventsSchema()

> **exportCloudEventsSchema**(): `object`

Defined in: [helper/enterpriseInterop.ts:504](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/enterpriseInterop.ts#L504)

## Returns

`object`

### $schema

> **$schema**: `string` = `'https://json-schema.org/draft/2020-12/schema'`

### properties

> **properties**: `object`

#### properties.contentencoding

> **contentencoding**: `object`

#### properties.contentencoding.type

> **type**: `string` = `'string'`

#### properties.correlationid

> **correlationid**: `object`

#### properties.correlationid.type

> **type**: `string` = `'string'`

#### properties.data

> **data**: `boolean` = `true`

#### properties.datacontenttype

> **datacontenttype**: `object`

#### properties.datacontenttype.type

> **type**: `string` = `'string'`

#### properties.id

> **id**: `object`

#### properties.id.type

> **type**: `string` = `'string'`

#### properties.instanceId

> **instanceId**: `object`

#### properties.instanceId.type

> **type**: `string` = `'string'`

#### properties.principalid

> **principalid**: `object`

#### properties.principalid.type

> **type**: `string` = `'string'`

#### properties.serviceName

> **serviceName**: `object`

#### properties.serviceName.type

> **type**: `string` = `'string'`

#### properties.serviceTarget

> **serviceTarget**: `object`

#### properties.serviceTarget.type

> **type**: `string` = `'string'`

#### properties.serviceVersion

> **serviceVersion**: `object`

#### properties.serviceVersion.type

> **type**: `string` = `'string'`

#### properties.source

> **source**: `object`

#### properties.source.type

> **type**: `string` = `'string'`

#### properties.specversion

> **specversion**: `object`

#### properties.specversion.const

> **const**: `string` = `'1.0'`

#### properties.tenantid

> **tenantid**: `object`

#### properties.tenantid.type

> **type**: `string` = `'string'`

#### properties.time

> **time**: `object`

#### properties.time.format

> **format**: `string` = `'date-time'`

#### properties.time.type

> **type**: `string` = `'string'`

#### properties.traceid

> **traceid**: `object`

#### properties.traceid.type

> **type**: `string` = `'string'`

#### properties.type

> **type**: `object`

#### properties.type.type

> **type**: `string` = `'string'`

### required

> **required**: `string`[]

### title

> **title**: `string` = `'PURISTA CloudEvents Mapping'`

### type

> **type**: `string` = `'object'`
