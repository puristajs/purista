[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ShutdownEntry

# Type Alias: ShutdownEntry

> **ShutdownEntry** = `object`

Defined in: [helper/types/ShutdownEntry.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/types/ShutdownEntry.ts#L4)

Entry of thing you like to shutdown gracefully

## Properties

### destroy()

> **destroy**: () => `Promise`\<`void`\>

Defined in: [helper/types/ShutdownEntry.ts:8](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/types/ShutdownEntry.ts#L8)

a async function that is called during shutdown

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [helper/types/ShutdownEntry.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/types/ShutdownEntry.ts#L6)

the name
