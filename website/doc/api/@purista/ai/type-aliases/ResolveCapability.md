[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / ResolveCapability

# Type Alias: ResolveCapability\<Caps, Capability\>

> **ResolveCapability**\<`Caps`, `Capability`\> = `Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] ? `Caps`\[`number`\] *extends* `never` ? `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false` : `Capability` *extends* `Caps`\[`number`\] ? `true` : `false` : `Capability` *extends* `"text"` \| `"stream"` ? `true` : `false`

Defined in: [packages/ai/src/builder/AgentBuilder.ts:261](https://github.com/puristajs/purista/blob/4404dd96f5462503c1bc6e1de335782a5a892137/packages/ai/src/builder/AgentBuilder.ts#L261)

## Type Parameters

### Caps

`Caps` *extends* readonly [`AgentModelCapability`](AgentModelCapability.md)[] \| `undefined`

### Capability

`Capability` *extends* [`AgentModelCapability`](AgentModelCapability.md)
