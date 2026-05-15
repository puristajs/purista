[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / QueueTransformHook

# Type Alias: QueueTransformHook\<S, Payload, Params, Resources\>

> **QueueTransformHook**\<`S`, `Payload`, `Params`, `Resources`\> = (`this`, `context`, `payload`, `parameter`) => `Promise`\<\{ `parameter?`: `Params`; `payload`: `Payload`; \}\>

Defined in: [core/types/queue/QueueTransformHook.ts:9](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/queue/QueueTransformHook.ts#L9)

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md) = [`ServiceClass`](../interfaces/ServiceClass.md)

### Payload

`Payload` = `unknown`

### Params

`Params` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = [`EmptyObject`](EmptyObject.md)

## Parameters

### this

`S`

### context

[`QueueTransformContext`](QueueTransformContext.md)\<`Resources`\>

### payload

`Readonly`\<`Payload`\>

### parameter

`Readonly`\<`Params` \| `undefined`\>

## Returns

`Promise`\<\{ `parameter?`: `Params`; `payload`: `Payload`; \}\>
