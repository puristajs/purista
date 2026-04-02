[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / StateStoreHelpers

# Type Alias: StateStoreHelpers

> **StateStoreHelpers** = `object`

Defined in: [packages/ai/src/runtime/runState.ts:7](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/runState.ts#L7)

## Properties

### getState()

> **getState**: (...`stateNames`) => `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ai/src/runtime/runState.ts:8](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/runState.ts#L8)

#### Parameters

##### stateNames

...`string`[]

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

***

### removeState()

> **removeState**: (`stateName`) => `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:10](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/runState.ts#L10)

#### Parameters

##### stateName

`string`

#### Returns

`Promise`\<`void`\>

***

### setState()

> **setState**: (`stateName`, `value`) => `Promise`\<`void`\>

Defined in: [packages/ai/src/runtime/runState.ts:9](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/runState.ts#L9)

#### Parameters

##### stateName

`string`

##### value

`unknown`

#### Returns

`Promise`\<`void`\>
