[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionConsumerControlError

# Class: SubscriptionConsumerControlError

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L6)

## Extends

- `Error`

## Constructors

### Constructor

> **new SubscriptionConsumerControlError**(`result`): `SubscriptionConsumerControlError`

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L11)

#### Parameters

##### result

[`SubscriptionHandlerControlResult`](../type-aliases/SubscriptionHandlerControlResult.md)

#### Returns

`SubscriptionConsumerControlError`

#### Overrides

`Error.constructor`

### Constructor

> **new SubscriptionConsumerControlError**(`outcome`, `reason?`, `delayMs?`): `SubscriptionConsumerControlError`

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L12)

#### Parameters

##### outcome

`"retry"` \| `"deadLetter"` \| `"drop"` \| `"stop-consumer"`

##### reason?

`string`

##### delayMs?

`number`

#### Returns

`SubscriptionConsumerControlError`

#### Overrides

`Error.constructor`

## Properties

### delayMs?

> `readonly` `optional` **delayMs?**: `number`

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L9)

***

### outcome

> `readonly` **outcome**: `"retry"` \| `"deadLetter"` \| `"drop"` \| `"stop-consumer"`

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L7)

***

### reason?

> `readonly` `optional` **reason?**: `string`

Defined in: [core/types/subscription/SubscriptionConsumerControlError.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionConsumerControlError.ts#L8)
