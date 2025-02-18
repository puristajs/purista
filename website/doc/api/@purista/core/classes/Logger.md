[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Logger

# Class: `abstract` Logger

Defined in: [packages/core/src/core/types/Logger.ts:22](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L22)

## Extended by

- [`DefaultLogger`](DefaultLogger.md)

## Constructors

### new Logger()

> **new Logger**(): [`Logger`](Logger.md)

#### Returns

[`Logger`](Logger.md)

## Methods

### debug()

> `abstract` **debug**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L27)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### error()

> `abstract` **error**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L25)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### fatal()

> `abstract` **fatal**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L24)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### getChildLogger()

> `abstract` **getChildLogger**(`options`): [`Logger`](Logger.md)

Defined in: [packages/core/src/core/types/Logger.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L29)

#### Parameters

##### options

[`LoggerOptions`](../type-aliases/LoggerOptions.md)

#### Returns

[`Logger`](Logger.md)

***

### info()

> `abstract` **info**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L23)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### trace()

> `abstract` **trace**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L28)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### warn()

> `abstract` **warn**(...`args`): `void`

Defined in: [packages/core/src/core/types/Logger.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L26)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`
