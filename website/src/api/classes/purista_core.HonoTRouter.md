[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HonoTRouter

# Class: HonoTRouter<T\>

[@purista/core](../modules/purista_core.md).HonoTRouter

## Type parameters

| Name |
| :------ |
| `T` |

## Implements

- `Router`<`T`\>

## Table of contents

### Constructors

- [constructor](purista_core.HonoTRouter.md#constructor)

### Properties

- [name](purista_core.HonoTRouter.md#name)
- [router](purista_core.HonoTRouter.md#router)

### Methods

- [add](purista_core.HonoTRouter.md#add)
- [match](purista_core.HonoTRouter.md#match)

## Constructors

### constructor

• **new HonoTRouter**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[helper/HonoTRouter.ts:9](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/HonoTRouter.ts#L9)

## Properties

### name

• **name**: `string` = `'Trouter'`

#### Implementation of

Router.name

#### Defined in

[helper/HonoTRouter.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/HonoTRouter.ts#L7)

___

### router

• **router**: `default`<`T`\>

#### Defined in

[helper/HonoTRouter.ts:5](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/HonoTRouter.ts#L5)

## Methods

### add

▸ **add**(`method`, `path`, `handler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |
| `handler` | `T` |

#### Returns

`void`

#### Implementation of

Router.add

#### Defined in

[helper/HonoTRouter.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/HonoTRouter.ts#L13)

___

### match

▸ **match**(`method`, `path`): ``null`` \| `Result`<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |

#### Returns

``null`` \| `Result`<`T`\>

#### Implementation of

Router.match

#### Defined in

[helper/HonoTRouter.ts:17](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/helper/HonoTRouter.ts#L17)
