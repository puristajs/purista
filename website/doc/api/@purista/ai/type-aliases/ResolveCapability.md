[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ResolveCapability

# Type Alias: ResolveCapability\<Caps, Capability\>

> **ResolveCapability**\<`Caps`, `Capability`\> = `Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] ? `Caps`\[`number`\] *extends* `never` ? `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false` : `Capability` *extends* `Caps`\[`number`\] ? `true` : `false` : `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:329](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/builder/AgentBuilder.ts#L329)

## Type Parameters

### Caps

`Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] \| `undefined`

### Capability

`Capability` *extends* [`AgentModelCapability`](AgentModelCapability.md)
