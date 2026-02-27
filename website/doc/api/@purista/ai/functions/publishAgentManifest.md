[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / publishAgentManifest

# Function: publishAgentManifest()

> **publishAgentManifest**(`configSetter`, `definition`): `Promise`\<\{ `configKey`: `string`; `manifest`: [`AgentManifest`](../type-aliases/AgentManifest.md); \}\>

Defined in: manifest/publisher.ts:14

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
const definition = defineAgent({ name: 'planner' }).build()
await publishAgentManifest(service.configs.setConfig.bind(service.configs), definition)
```
