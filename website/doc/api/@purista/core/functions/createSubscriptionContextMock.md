[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / createSubscriptionContextMock

# Function: createSubscriptionContextMock()

> **createSubscriptionContextMock**\<`TBuilder`\>(`builder`, `input`): [`SubscriptionContextMockResult`](../type-aliases/SubscriptionContextMockResult.md)\<`TBuilder`\>

Defined in: [testing/createSubscriptionContextMock.ts:67](https://github.com/puristajs/purista/blob/master/packages/core/src/testing/createSubscriptionContextMock.ts#L67)

Create a typed subscription handler context mock from a subscription builder.

Use this helper when you want to execute the subscription handler directly and
assert on emits, invocations, or state/store interactions.

## Type Parameters

### TBuilder

`TBuilder` *extends* [`SubscriptionDefinitionBuilder`](../classes/SubscriptionDefinitionBuilder.md)\<`any`, `any`\>

## Parameters

### builder

`TBuilder`

### input

[`CreateSubscriptionContextMockInput`](../type-aliases/CreateSubscriptionContextMockInput.md)\<`TBuilder`\>

## Returns

[`SubscriptionContextMockResult`](../type-aliases/SubscriptionContextMockResult.md)\<`TBuilder`\>
