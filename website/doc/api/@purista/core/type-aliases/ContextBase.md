[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ContextBase

# Type Alias: ContextBase\<Metrics\>

> **ContextBase**\<`Metrics`\> = `object`

Defined in: [core/types/ContextBase.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L21)

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

## Type Parameters

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)

## Properties

### configs

> **configs**: `object`

Defined in: [core/types/ContextBase.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L45)

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

Defined in: [core/types/ContextBase.ts:23](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L23)

the logger instance

***

### metrics

> **metrics**: `PuristaMetricContext`\<`Metrics`\>

Defined in: [core/types/ContextBase.ts:25](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L25)

typed custom metrics declared on the current builder scope

***

### queue

> **queue**: [`QueueContext`](QueueContext.md)

Defined in: [core/types/ContextBase.ts:62](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L62)

***

### secrets

> **secrets**: `object`

Defined in: [core/types/ContextBase.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L36)

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

### startActiveSpan

> **startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

Defined in: [core/types/ContextBase.ts:29](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L29)

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

`Context` \| `undefined`

##### fn

(`span`) => `Promise`\<`F`\>

#### Returns

`Promise`\<`F`\>

***

### states

> **states**: `object`

Defined in: [core/types/ContextBase.ts:54](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L54)

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

### wrapInSpan

> **wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context?`) => `Promise`\<`F`\>

Defined in: [core/types/ContextBase.ts:27](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L27)

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
