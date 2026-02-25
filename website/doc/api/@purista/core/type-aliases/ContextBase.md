[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ContextBase

# Type Alias: ContextBase

> **ContextBase** = `object`

Defined in: [core/types/ContextBase.ts:19](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L19)

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

## Properties

### configs

> **configs**: `object`

Defined in: [core/types/ContextBase.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L41)

the config store

#### getConfig

> **getConfig**: [`ConfigGetterFunction`](ConfigGetterFunction.md)

get a config value from the config store

#### removeConfig

> **removeConfig**: [`ConfigDeleteFunction`](ConfigDeleteFunction.md)

delete a config value from the config store

#### setConfig

> **setConfig**: [`ConfigSetterFunction`](ConfigSetterFunction.md)

set a config value in the config store

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [core/types/ContextBase.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L21)

the logger instance

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)

Defined in: [core/types/ContextBase.ts:58](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L58)

***

### secrets

> **secrets**: `object`

Defined in: [core/types/ContextBase.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L32)

the secret store

#### getSecret

> **getSecret**: [`SecretGetterFunction`](SecretGetterFunction.md)

get a secret from the secret store

#### removeSecret

> **removeSecret**: [`SecretDeleteFunction`](SecretDeleteFunction.md)

delete a secret from the secret store

#### setSecret

> **setSecret**: [`SecretSetterFunction`](SecretSetterFunction.md)

set a secret in the secret store

***

### startActiveSpan()

> **startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

Defined in: [core/types/ContextBase.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L25)

wrap given function in an opentelemetry active span

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

##### opts

`SpanOptions`

##### context

`Context` | `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

#### Returns

`Promise`\<`F`\>

***

### states

> **states**: `object`

Defined in: [core/types/ContextBase.ts:50](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L50)

the state store

#### getState

> **getState**: [`StateGetterFunction`](StateGetterFunction.md)

get a state value from the state store

#### removeState

> **removeState**: [`StateDeleteFunction`](StateDeleteFunction.md)

delete a state value from the state store

#### setState

> **setState**: [`StateSetterFunction`](StateSetterFunction.md)

set a state value in the state store

***

### wrapInSpan()

> **wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

Defined in: [core/types/ContextBase.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L23)

wrap given function in an opentelemetry span

#### Type Parameters

##### F

`F`

#### Parameters

##### name

`string`

##### opts

`SpanOptions`

##### fn

(`span`) => `Promise`\<`F`\>

##### context?

`Context`

#### Returns

`Promise`\<`F`\>
