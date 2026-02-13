[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / initLogger

# Function: initLogger()

> **initLogger**(`level?`, `opt?`): [`Logger`](../classes/Logger.md)

Defined in: [DefaultLogger/initLogger.impl.ts:21](https://github.com/puristajs/purista/blob/master/packages/core/src/DefaultLogger/initLogger.impl.ts#L21)

Create a new logger instance using pino.

## Parameters

### level?

[`LogLevelName`](../type-aliases/LogLevelName.md) = `...`

### opt?

`LoggerOptions`\<`never`, `boolean`\>

Optional pino configuration.

## Returns

[`Logger`](../classes/Logger.md)

## Example

```ts
const logger = initLogger('debug')
logger.info('logger ready')
```
