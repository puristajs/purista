[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InvokeFunction

# Type Alias: InvokeFunction()

> **InvokeFunction**: \<`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`address`, `payload`, `parameter`) => `Promise`\<`InvokeResponseType`\>

Defined in: [packages/core/src/core/types/InvokeFunction.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/InvokeFunction.ts#L23)

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

## Type Parameters

• **InvokeResponseType** = `unknown`

• **PayloadType** = `unknown`

• **ParameterType** *extends* [`EmptyObject`](EmptyObject.md) = [`EmptyObject`](EmptyObject.md)

## Parameters

### address

[`EBMessageAddress`](EBMessageAddress.md)

### payload

`PayloadType`

### parameter

`ParameterType`

## Returns

`Promise`\<`InvokeResponseType`\>

## Example

```typescript

const address: EBMessageAddress = {
  serviceName: 'name-of-service-to-invoke',
  serviceVersion: '1',
  serviceTarget: 'command-name-to-invoke',
}

const inputPayload = { my: 'input' }
const inputParameter = { search: 'for_me' }

const result = await invoke<MyResultType>(address, inputPayload inputParameter )
```
