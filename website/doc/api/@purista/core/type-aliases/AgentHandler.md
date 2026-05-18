[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / AgentHandler

# Type Alias: AgentHandler\<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Output, Metrics\>

> **AgentHandler**\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Output`, `Metrics`\> = (`context`) => `Promise`\<`Output`\>

Defined in: [AgentQueueBuilder/types.ts:250](https://github.com/puristajs/purista/blob/master/packages/core/src/AgentQueueBuilder/types.ts#L250)

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`never`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`never`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`never`, `never`\>

### Output

`Output` = `unknown`

### Metrics

`Metrics` *extends* `PuristaMetricDefinitions` = [`EmptyObject`](EmptyObject.md)

## Parameters

### context

[`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Metrics`\>

## Returns

`Promise`\<`Output`\>
