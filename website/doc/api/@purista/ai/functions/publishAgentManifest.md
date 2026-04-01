[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / publishAgentManifest

# Function: publishAgentManifest()

> **publishAgentManifest**(`configSetter`, `definition`): `Promise`\<\{ `configKey`: `string`; `manifest`: [`AgentManifest`](../type-aliases/AgentManifest.md); \}\>

Defined in: [packages/ai/src/manifest/publisher.ts:14](https://github.com/puristajs/purista/blob/6e0354b1e51abc331c66c917ee95829470c9fba2/packages/ai/src/manifest/publisher.ts#L14)

Publishes a built agent manifest to a managed config store.

## Parameters

### configSetter

[`ConfigSetterFunction`](../../core/type-aliases/ConfigSetterFunction.md)

### definition

[`AgentDefinition`](../type-aliases/AgentDefinition.md)

## Returns

`Promise`\<\{ `configKey`: `string`; `manifest`: [`AgentManifest`](../type-aliases/AgentManifest.md); \}\>

## Example

```ts
const definition = new AgentBuilder({ agentName: 'planner', agentVersion: '1' }).build()
await publishAgentManifest(service.configs.setConfig.bind(service.configs), definition)
```
