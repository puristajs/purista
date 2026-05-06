[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / ExtractAgentModels

# Type Alias: ExtractAgentModels\<AgentDefinitions\>

> **ExtractAgentModels**\<`AgentDefinitions`\> = keyof `AgentDefinitions` *extends* `never` ? `Record`\<`string`, `never`\> : `AgentDefinitions` *extends* `object` ? `AgentDefinitions`\[`"Models"`\] *extends* `Record`\<`string`, `unknown`\> ? `AgentDefinitions`\[`"Models"`\] : `Record`\<`string`, `never`\> : `Record`\<`string`, `never`\>

Defined in: [core/types/ServiceBuilderTypes.ts:24](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/ServiceBuilderTypes.ts#L24)

## Type Parameters

### AgentDefinitions

`AgentDefinitions` *extends* `object`
