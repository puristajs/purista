[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / FromInvokeToOtherType

# Type Alias: FromInvokeToOtherType\<Entry, NewType\>

> **FromInvokeToOtherType**\<`Entry`, `NewType`\>: `{ [TKey in keyof Entry]: { [TKey2 in keyof Entry[TKey]]: { [TKey3 in keyof Entry[TKey][TKey2]]: NewType } } }`

Defined in: [packages/core/src/core/types/FromInvokeToOtherType.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/FromInvokeToOtherType.ts#L6)

Changes the canInvoke proxy type to given type

serviceName.ServiceVersion.FunctionName becomes type of NewType

## Type Parameters

• **Entry**

• **NewType**
