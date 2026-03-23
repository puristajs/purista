[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ResolveCapability

# Type Alias: ResolveCapability\<Caps, Capability\>

> **ResolveCapability**\<`Caps`, `Capability`\> = `Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] ? `Caps`\[`number`\] *extends* `never` ? `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false` : `Capability` *extends* `Caps`\[`number`\] ? `true` : `false` : `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:280](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/builder/AgentBuilder.ts#L280)

## Type Parameters

### Caps

`Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] \| `undefined`

### Capability

`Capability` *extends* [`AgentModelCapability`](AgentModelCapability.md)
