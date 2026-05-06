[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AddAgentInvoke

# Type Alias: AddAgentInvoke\<T, AgentName, ServiceVersion, PayloadSchema, ParameterSchema, OutputSchema\>

> **AddAgentInvoke**\<`T`, `AgentName`, `ServiceVersion`, `PayloadSchema`, `ParameterSchema`, `OutputSchema`\> = `SetNewTypeValue`\<`T`, `"AgentInvokes"`, `T`\[`"AgentInvokes"`\] & `Record`\<`AgentName`, `Record`\<`ServiceVersion`, [`AgentInvokeBinding`](AgentInvokeBinding.md)\<`PayloadSchema`, `ParameterSchema`, `OutputSchema`\>\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:112

## Type Parameters

### T

`T` *extends* [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

### AgentName

`AgentName` *extends* `string`

### ServiceVersion

`ServiceVersion` *extends* `string`

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)
