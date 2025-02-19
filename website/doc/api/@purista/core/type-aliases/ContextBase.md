[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ContextBase

# Type Alias: ContextBase

> **ContextBase**: `object`

Defined in: [packages/core/src/core/types/ContextBase.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ContextBase.ts#L12)

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

## Type declaration

### configs

> **configs**: `object`

the config store

#### configs.getConfig

> **configs.getConfig**: [`ConfigGetterFunction`](ConfigGetterFunction.md)

get a config value from the config store

#### configs.removeConfig

> **configs.removeConfig**: [`ConfigDeleteFunction`](ConfigDeleteFunction.md)

delete a config value from the config store

#### configs.setConfig

> **configs.setConfig**: [`ConfigSetterFunction`](ConfigSetterFunction.md)

set a config value in the config store

### logger

> **logger**: [`Logger`](../classes/Logger.md)

the logger instance

### secrets

> **secrets**: `object`

the secret store

#### secrets.getSecret

> **secrets.getSecret**: [`SecretGetterFunction`](SecretGetterFunction.md)

get a secret from the secret store

#### secrets.removeSecret

> **secrets.removeSecret**: [`SecretDeleteFunction`](SecretDeleteFunction.md)

delete a secret from the secret store

#### secrets.setSecret

> **secrets.setSecret**: [`SecretSetterFunction`](SecretSetterFunction.md)

set a secret in the secret store

### startActiveSpan()

> **startActiveSpan**: \<`F`\>(`name`, `opts`, `context`, `fn`) => `Promise`\<`F`\>

wrap given function in an opentelemetry active span

#### Type Parameters

• **F**

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

### states

> **states**: `object`

the state store

#### states.getState

> **states.getState**: [`StateGetterFunction`](StateGetterFunction.md)

get a state value from the state store

#### states.removeState

> **states.removeState**: [`StateDeleteFunction`](StateDeleteFunction.md)

delete a state value from the state store

#### states.setState

> **states.setState**: [`StateSetterFunction`](StateSetterFunction.md)

set a state value in the state store

### wrapInSpan()

> **wrapInSpan**: \<`F`\>(`name`, `opts`, `fn`, `context`?) => `Promise`\<`F`\>

wrap given function in an opentelemetry span

#### Type Parameters

• **F**

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
