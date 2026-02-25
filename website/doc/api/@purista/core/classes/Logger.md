[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / Logger

# Abstract Class: Logger

Defined in: [core/types/Logger.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L23)

## Extended by

- [`DefaultLogger`](DefaultLogger.md)

## Constructors

### Constructor

> **new Logger**(): `Logger`

#### Returns

`Logger`

## Methods

### debug()

> `abstract` **debug**(...`args`): `void`

Defined in: [core/types/Logger.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L28)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### error()

> `abstract` **error**(...`args`): `void`

Defined in: [core/types/Logger.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L26)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### fatal()

> `abstract` **fatal**(...`args`): `void`

Defined in: [core/types/Logger.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L25)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### getChildLogger()

> `abstract` **getChildLogger**(`options`): `Logger`

Defined in: [core/types/Logger.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L30)

#### Parameters

##### options

[`LoggerOptions`](../type-aliases/LoggerOptions.md)

#### Returns

`Logger`

***

### info()

> `abstract` **info**(...`args`): `void`

Defined in: [core/types/Logger.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L24)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### trace()

> `abstract` **trace**(...`args`): `void`

Defined in: [core/types/Logger.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L29)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

***

### warn()

> `abstract` **warn**(...`args`): `void`

Defined in: [core/types/Logger.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/Logger.ts#L27)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`
