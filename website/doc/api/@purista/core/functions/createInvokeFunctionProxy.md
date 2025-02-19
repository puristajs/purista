[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createInvokeFunctionProxy

# Function: createInvokeFunctionProxy()

> **createInvokeFunctionProxy**\<`TFaux`\>(`invokeOg`, `address`?, `lvl`?): `TFaux`

Defined in: [packages/core/src/core/helper/createInvokeFunctionProxy.impl.ts:16](https://github.com/puristajs/purista/blob/master/packages/core/src/core/helper/createInvokeFunctionProxy.impl.ts#L16)

Creates a proxy which allows to chain the invoke function.

## Type Parameters

• **TFaux**

## Parameters

### invokeOg

[`InvokeFunction`](../type-aliases/InvokeFunction.md)

the regular invoke function

### address?

[`EBMessageAddress`](../type-aliases/EBMessageAddress.md)

the receivers EBMessageAddress

### lvl?

`number` = `0`

counter for recursive usage

## Returns

`TFaux`

a proxy which allows to chain like serviceName.serviceVersion.fnToInvoke(payload,parameter)
