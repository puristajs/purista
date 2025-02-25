[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / DefaultLogger

# Class: DefaultLogger

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L4)

## Extends

- [`Logger`](Logger.md)

## Implements

- [`ILogger`](../interfaces/ILogger.md)

## Constructors

### new DefaultLogger()

> **new DefaultLogger**(`log`): [`DefaultLogger`](DefaultLogger.md)

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:5](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L5)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L41)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L17)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L9)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:57](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L57)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:33](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L33)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L49)

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

Defined in: [packages/core/src/DefaultLogger/DefaultLogger.impl.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/DefaultLogger.impl.ts#L25)

#### Parameters

##### args

...[`LogFnParamType`](../type-aliases/LogFnParamType.md)

#### Returns

`void`

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`warn`](../interfaces/ILogger.md#warn)

#### Overrides

[`Logger`](Logger.md).[`warn`](Logger.md#warn)
