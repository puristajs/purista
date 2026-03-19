[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / publishAgentManifest

# Function: publishAgentManifest()

> **publishAgentManifest**\<`KnowledgeAliases`\>(`configSetter`, `definition`): `Promise`\<\{ `configKey`: `string`; `manifest`: [`AgentManifest`](../type-aliases/AgentManifest.md); \}\>

Defined in: [packages/ai/src/manifest/publisher.ts:14](https://github.com/puristajs/purista/blob/12a89e5c0e7fe36c05e0697e87a03089d193d004/packages/ai/src/manifest/publisher.ts#L14)

Publishes a built agent manifest to a managed config store.

## Type Parameters

### KnowledgeAliases

`KnowledgeAliases` *extends* `string`

## Parameters

### configSetter

[`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md)

### definition

[`AgentDefinition`](../type-aliases/AgentDefinition.md)\<`KnowledgeAliases`\>

## Returns

`Promise`\<\{ `configKey`: `string`; `manifest`: [`AgentManifest`](../type-aliases/AgentManifest.md); \}\>

## Example

```ts
const definition = new AgentBuilder({ agentName: 'planner', agentVersion: '1' }).build()
await publishAgentManifest(service.configs.setConfig.bind(service.configs), definition)
```
