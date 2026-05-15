[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentModelBinding

# Type Alias: AgentModelBinding\<Capabilities, Model\>

> **AgentModelBinding**\<`Capabilities`, `Model`\> = `object`

Defined in: [builder/types.ts:38](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L38)

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

Defined in: [builder/types.ts:43](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L43)

***

### defaults?

> `optional` **defaults?**: `ModelDefaults`

Defined in: [builder/types.ts:44](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L44)

***

### model

> **model**: `Model`

Defined in: [builder/types.ts:42](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/builder/types.ts#L42)
