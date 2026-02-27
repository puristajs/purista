[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / defineAgent

# Function: defineAgent()

> **defineAgent**(`info`): [`AgentBuilder`](../type-aliases/AgentBuilder.md)

Defined in: builder/defineAgent.ts:67

Creates a new [AgentBuilder](../type-aliases/AgentBuilder.md) with sane defaults so manifests can be described declaratively.

The builder mirrors the ergonomics of `ServiceBuilder` and command/queue builders in the rest of PURISTA,
which keeps agent orchestration aligned with the existing developer experience.

## Parameters

### info

[`AgentInfo`](../type-aliases/AgentInfo.md)

## Returns

[`AgentBuilder`](../type-aliases/AgentBuilder.md)

## Example

```ts
const agentDefinition = defineAgent({ name: 'planner' })
  .setDescription('Breaks epics into tasks')
  .setModelResource({ name: 'anthropic:claude-3-sonnet' })
  .allowTool({
    serviceName: 'roadmap',
    version: 'v1',
    commandName: 'createTask',
  })
  .setInputSchema(extendApi(z.object({ objective: z.string() }), { title: 'Planning Input' }))
  .build()
```
