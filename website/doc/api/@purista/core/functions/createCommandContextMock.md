[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createCommandContextMock

# Function: createCommandContextMock()

> **createCommandContextMock**\<`TBuilder`\>(`builder`, `input`): [`CommandContextMockResult`](../type-aliases/CommandContextMockResult.md)\<`TBuilder`\>

Defined in: [testing/createCommandContextMock.ts:131](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createCommandContextMock.ts#L131)

Create a typed command handler context mock from a command builder.

Use this helper when you want to test command handler logic directly without
booting a full service instance.

## Type Parameters

### TBuilder

`TBuilder` *extends* [`CommandDefinitionBuilder`](../classes/CommandDefinitionBuilder.md)\<`any`, `any`\>

## Parameters

### builder

`TBuilder`

### input

[`CreateCommandContextMockInput`](../type-aliases/CreateCommandContextMockInput.md)\<`TBuilder`\>

## Returns

[`CommandContextMockResult`](../type-aliases/CommandContextMockResult.md)\<`TBuilder`\>

## Example

```ts
const { context, stubs } = createCommandContextMock(signUpCommandBuilder, {
  payload: { email: 'user@example.com' },
  parameter: {},
})

await signUp.call(service, context, { email: 'user@example.com' }, {})
expect(stubs.emit.userSignedUp.called).toBe(true)
```
