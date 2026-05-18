[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentModelBinding

# Type Alias: AgentModelBinding\<Capabilities, Model\>

> **AgentModelBinding**\<`Capabilities`, `Model`\> = `object`

Defined in: [AgentQueueBuilder/types.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L41)

Declares a model alias required by an attached PURISTA agent.

The provider is supplied at service instantiation time; this declaration is
the compile-time and startup contract for handlers and harness setup.

## Example

```ts
builder.addModel('primary', {
  model: 'gpt-4.1-mini',
  capabilities: ['object', 'tool_use'],
  defaults: { temperature: 0.2 },
})
```

## Type Parameters

### Capabilities

`Capabilities` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] = readonly [`AgentModelCapability`](AgentModelCapability.md)[]

### Model

`Model` *extends* `string` = `string`

## Properties

### capabilities

> **capabilities**: `Capabilities`

Defined in: [AgentQueueBuilder/types.ts:46](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L46)

***

### defaults?

> `optional` **defaults?**: `ModelDefaults`

Defined in: [AgentQueueBuilder/types.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L47)

***

### model

> **model**: `Model`

Defined in: [AgentQueueBuilder/types.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L45)
