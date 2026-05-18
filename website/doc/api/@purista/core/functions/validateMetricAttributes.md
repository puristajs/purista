[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / validateMetricAttributes

# Function: validateMetricAttributes()

> **validateMetricAttributes**(`attributes?`): `object`

Defined in: [core/metrics/attributePolicy.ts:64](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/attributePolicy.ts#L64)

Normalizes metric attributes by keeping only safe scalar attributes.

## Parameters

### attributes?

`Record`\<`string`, `unknown`\>

## Returns

`object`

### attributes

> **attributes**: `PuristaMetricAttributes`

### droppedAttributeKeys

> **droppedAttributeKeys**: `string`[]

## Example

```ts
const { attributes } = validateMetricAttributes({ channel: 'web', trace_id: 'drop' })
```
