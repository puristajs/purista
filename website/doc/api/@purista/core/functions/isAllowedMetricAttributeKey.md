[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / isAllowedMetricAttributeKey

# Function: isAllowedMetricAttributeKey()

> **isAllowedMetricAttributeKey**(`key`): `boolean`

Defined in: [core/metrics/attributePolicy.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/metrics/attributePolicy.ts#L39)

Checks whether a metric attribute key follows PURISTA's low-cardinality policy.

## Parameters

### key

`string`

## Returns

`boolean`

## Example

```ts
isAllowedMetricAttributeKey('purista.command.name') // true
isAllowedMetricAttributeKey('trace_id') // false
```
