[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionConsumerControlError

# Class: SubscriptionConsumerControlError

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:6

## Extends

- `Error`

## Constructors

### Constructor

> **new SubscriptionConsumerControlError**(`result`): `SubscriptionConsumerControlError`

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:11

#### Parameters

##### result

[`SubscriptionHandlerControlResult`](../type-aliases/SubscriptionHandlerControlResult.md)

#### Returns

`SubscriptionConsumerControlError`

#### Overrides

`Error.constructor`

### Constructor

> **new SubscriptionConsumerControlError**(`outcome`, `reason?`, `delayMs?`): `SubscriptionConsumerControlError`

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:12

#### Parameters

##### outcome

`"deadLetter"` | `"retry"`

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

> `readonly` `optional` **delayMs**: `number`

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:9

***

### outcome

> `readonly` **outcome**: `"deadLetter"` \| `"retry"`

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:7

***

### reason?

> `readonly` `optional` **reason**: `string`

Defined in: core/types/subscription/SubscriptionConsumerControlError.ts:8
