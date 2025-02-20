[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ShutdownEntry

# Type Alias: ShutdownEntry

> **ShutdownEntry**: `object`

Defined in: [packages/core/src/helper/types/ShutdownEntry.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/helper/types/ShutdownEntry.ts#L4)

Entry of thing you like to shutdown gracefully

## Type declaration

### destroy()

> **destroy**: () => `Promise`\<`void`\>

a async function that is called during shutdown

#### Returns

`Promise`\<`void`\>

### name

> **name**: `string`

the name
