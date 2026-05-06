[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentModelBinding

# Type Alias: AgentModelBinding\<Capabilities, Model\>

> **AgentModelBinding**\<`Capabilities`, `Model`\> = `object`

Defined in: ai/src/builder/types.ts:37

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

Defined in: ai/src/builder/types.ts:42

***

### defaults?

> `optional` **defaults**: `ModelDefaults`

Defined in: ai/src/builder/types.ts:43

***

### model

> **model**: `Model`

Defined in: ai/src/builder/types.ts:41
