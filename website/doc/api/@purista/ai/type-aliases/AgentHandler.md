[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / AgentHandler

# Type Alias: AgentHandler()\<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Output\>

> **AgentHandler**\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`, `Output`\> = (`context`) => `Promise`\<`Output`\>

Defined in: ai/src/builder/types.ts:192

## Type Parameters

### Payload

`Payload` = `unknown`

### Parameter

`Parameter` = `unknown`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### Models

`Models` *extends* `Record`\<`string`, [`AgentModelBinding`](AgentModelBinding.md)\> = `Record`\<`string`, `never`\>

### CommandTools

`CommandTools` *extends* `Record`\<`string`, [`AllowedCommandToolDefinition`](AllowedCommandToolDefinition.md)\> = `Record`\<`string`, `never`\>

### AgentTools

`AgentTools` *extends* `Record`\<`string`, [`AllowedAgentDefinition`](AllowedAgentDefinition.md)\> = `Record`\<`string`, `never`\>

### Output

`Output` = `unknown`

## Parameters

### context

[`AgentHandlerContext`](AgentHandlerContext.md)\<`Payload`, `Parameter`, `Resources`, `Models`, `CommandTools`, `AgentTools`\>

## Returns

`Promise`\<`Output`\>
