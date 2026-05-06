[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AddToolInvoke

# Type Alias: AddToolInvoke\<T, ServiceName, ServiceVersion, CommandName, PayloadSchema, ParameterSchema, OutputSchema\>

> **AddToolInvoke**\<`T`, `ServiceName`, `ServiceVersion`, `CommandName`, `PayloadSchema`, `ParameterSchema`, `OutputSchema`\> = `SetNewTypeValue`\<`T`, `"ToolInvokes"`, `T`\[`"ToolInvokes"`\] & `Record`\<`ServiceName`, `Record`\<`ServiceVersion`, `Record`\<`CommandName`, (`payload`, `parameter?`) => `Promise`\<[`Infer`](../../core/type-aliases/Infer.md)\<`OutputSchema`\>\>\>\>\>\>

Defined in: packages/ai/src/builder/AgentQueueBuilderTypes.ts:84

## Type Parameters

### T

`T` *extends* [`AgentQueueBuilderTypes`](AgentQueueBuilderTypes.md)

### ServiceName

`ServiceName` *extends* `string`

### ServiceVersion

`ServiceVersion` *extends* `string`

### CommandName

`CommandName` *extends* `string`

### PayloadSchema

`PayloadSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

### ParameterSchema

`ParameterSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)

### OutputSchema

`OutputSchema` *extends* [`Schema`](../../core/type-aliases/Schema.md)
