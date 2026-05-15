[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / PendigInvocation

# Type Alias: PendigInvocation

> **PendigInvocation** = `object`

Defined in: [DefaultEventBridge/types/PendingInvocations.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/PendingInvocations.ts#L4)

## Methods

### reject()

> **reject**(`error`): `void`

Defined in: [DefaultEventBridge/types/PendingInvocations.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/PendingInvocations.ts#L6)

#### Parameters

##### error

[`HandledError`](../classes/HandledError.md) \| [`UnhandledError`](../classes/UnhandledError.md)

#### Returns

`void`

***

### resolve()

> **resolve**(`responsePayload`): `void`

Defined in: [DefaultEventBridge/types/PendingInvocations.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultEventBridge/types/PendingInvocations.ts#L5)

#### Parameters

##### responsePayload

`unknown`

#### Returns

`void`
