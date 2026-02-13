[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / getDefaultLogLevel

# Function: getDefaultLogLevel()

> **getDefaultLogLevel**(): [`LogLevelName`](../type-aliases/LogLevelName.md)

Defined in: [DefaultLogger/getDefaultLogLevel.ts:13](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/getDefaultLogLevel.ts#L13)

Determine the default log level based on the current environment.

## Returns

[`LogLevelName`](../type-aliases/LogLevelName.md)

## Example

```ts
const level = getDefaultLogLevel()
logger.setLevel(level)
```
