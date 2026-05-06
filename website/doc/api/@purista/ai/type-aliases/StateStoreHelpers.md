[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / StateStoreHelpers

# Type Alias: StateStoreHelpers

> **StateStoreHelpers** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:17](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L17)

## Properties

### getState()

> **getState**: (...`stateNames`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ai/src/runtime/runState.ts:18](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L18)

#### Parameters

##### stateNames

...`string`[]

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

***

### removeState()

> **removeState**: (`stateName`) => `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:20](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L20)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### setState()

> **setState**: (`stateName`, `value`) => `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:19](https://github.com/puristajs/purista/blob/9cd53c1e49bdea4c772d707ebf60458f2dc7435f/packages/ai/src/runtime/runState.ts#L19)

#### Parameters

##### stateName

`string`

##### value

`unknown`

#### Returns

`Promise`\<`void`\>
