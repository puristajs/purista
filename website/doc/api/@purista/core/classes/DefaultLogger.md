[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultLogger

# Class: DefaultLogger

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:6](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L6)

## Extends

- [`Logger`](Logger.md)

## Implements

- [`ILogger`](../interfaces/ILogger.md)

## Constructors

### new DefaultLogger()

> **new DefaultLogger**(`log`): [`DefaultLogger`](DefaultLogger.md)

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:7](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L7)

#### Parameters

##### log

`Logger`

#### Returns

[`DefaultLogger`](DefaultLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

## Methods

### debug()

> **debug**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L43)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`debug`](../interfaces/ILogger.md#debug)

#### Overrides

[`Logger`](Logger.md).[`debug`](Logger.md#debug)

***

### error()

> **error**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L19)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`error`](../interfaces/ILogger.md#error)

#### Overrides

[`Logger`](Logger.md).[`error`](Logger.md#error)

***

### fatal()

> **fatal**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L11)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`fatal`](../interfaces/ILogger.md#fatal)

#### Overrides

[`Logger`](Logger.md).[`fatal`](Logger.md#fatal)

***

### getChildLogger()

> **getChildLogger**(`options`): [`Logger`](Logger.md)

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L59)

#### Parameters

##### options

[`LoggerOptions`](../type-aliases/LoggerOptions.md)

#### Returns

[`Logger`](Logger.md)

#### Overrides

[`Logger`](Logger.md).[`getChildLogger`](Logger.md#getchildlogger)

***

### info()

> **info**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:35](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L35)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`info`](../interfaces/ILogger.md#info)

#### Overrides

[`Logger`](Logger.md).[`info`](Logger.md#info)

***

### trace()

> **trace**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:51](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L51)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`trace`](../interfaces/ILogger.md#trace)

#### Overrides

[`Logger`](Logger.md).[`trace`](Logger.md#trace)

***

### warn()

> **warn**(...`args`): `void`

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L27)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`warn`](../interfaces/ILogger.md#warn)

#### Overrides

[`Logger`](Logger.md).[`warn`](Logger.md#warn)
