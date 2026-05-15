[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandDefinition

# Type Alias: CommandDefinition\<S, MessagePayloadType, MessageParamsType, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, StreamInvokes, EmitList, MetadataType, QueueInvokes\>

> **CommandDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `MetadataType`, `QueueInvokes`\> = `object`

Defined in: [core/types/commandType/CommandDefinition.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L20)

The definition for a command provided by some service.

## Type Parameters

### S

`S` *extends* [`ServiceClass`](../interfaces/ServiceClass.md)

### MessagePayloadType

`MessagePayloadType`

### MessageParamsType

`MessageParamsType`

### TransformInputPayload

`TransformInputPayload`

### TransformInputParams

`TransformInputParams`

### FunctionPayloadType

`FunctionPayloadType`

### FunctionParamsType

`FunctionParamsType`

### FunctionOutputType

`FunctionOutputType`

### FinalFunctionOutputType

`FinalFunctionOutputType`

### TransformOutputHookOutput

`TransformOutputHookOutput`

### Resources

`Resources` *extends* `Record`\<`string`, `unknown`\>

### Invokes

`Invokes` *extends* [`InvokeList`](InvokeList.md)

### StreamInvokes

`StreamInvokes` *extends* [`StreamInvokeList`](StreamInvokeList.md)

### EmitList

`EmitList` *extends* `Record`\<`string`, [`Schema`](Schema.md)\>

### MetadataType

`MetadataType` *extends* [`CommandDefinitionMetadataBase`](CommandDefinitionMetadataBase.md) = [`CommandDefinitionMetadataBase`](CommandDefinitionMetadataBase.md)

### QueueInvokes

`QueueInvokes` *extends* [`QueueInvokeList`](QueueInvokeList.md) = [`QueueInvokeList`](QueueInvokeList.md)

## Properties

### call

> **call**: [`CommandFunction`](CommandFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>

Defined in: [core/types/commandType/CommandDefinition.ts:49](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L49)

the command function

***

### commandDescription

> **commandDescription**: `string`

Defined in: [core/types/commandType/CommandDefinition.ts:41](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L41)

the description of the command

***

### commandName

> **commandName**: `string`

Defined in: [core/types/commandType/CommandDefinition.ts:39](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L39)

the name of the command

***

### emitList

> **emitList**: `EmitList`

Defined in: [core/types/commandType/CommandDefinition.ts:124](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L124)

***

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

Defined in: [core/types/commandType/CommandDefinition.ts:45](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L45)

config information for event bridge

***

### eventName?

> `optional` **eventName?**: `string`

Defined in: [core/types/commandType/CommandDefinition.ts:63](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L63)

the eventName for the command response

***

### hooks

> **hooks**: `object`

Defined in: [core/types/commandType/CommandDefinition.ts:65](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L65)

hooks of command

#### afterGuard?

> `optional` **afterGuard?**: `Record`\<`string`, [`CommandAfterGuardHook`](CommandAfterGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

#### beforeGuard?

> `optional` **beforeGuard?**: `Record`\<`string`, [`CommandBeforeGuardHook`](CommandBeforeGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `StreamInvokes`, `EmitList`, `QueueInvokes`\>\>

#### transformInput?

> `optional` **transformInput?**: `object`

##### transformInput.transformFunction

> **transformFunction**: [`CommandTransformInputHook`](CommandTransformInputHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`\>

##### transformInput.transformInputSchema

> **transformInputSchema**: [`Schema`](Schema.md)

##### transformInput.transformParameterSchema

> **transformParameterSchema**: [`Schema`](Schema.md)

#### transformOutput?

> `optional` **transformOutput?**: `object`

##### transformOutput.transformFunction

> **transformFunction**: [`CommandTransformOutputHook`](CommandTransformOutputHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\>

##### transformOutput.transformOutputSchema

> **transformOutputSchema**: [`Schema`](Schema.md)

***

### invokes

> **invokes**: `Invokes`

Defined in: [core/types/commandType/CommandDefinition.ts:122](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L122)

***

### metadata

> **metadata**: `MetadataType`

Defined in: [core/types/commandType/CommandDefinition.ts:43](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L43)

the metadata of the command

***

### queueInvokes

> **queueInvokes**: `QueueInvokes`

Defined in: [core/types/commandType/CommandDefinition.ts:125](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L125)

***

### schedules?

> `optional` **schedules?**: [`ScheduleDefinition`](ScheduleDefinition.md)[]

Defined in: [core/types/commandType/CommandDefinition.ts:47](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L47)

provider-neutral schedule metadata for short command triggers

***

### streamInvokes

> **streamInvokes**: `StreamInvokes`

Defined in: [core/types/commandType/CommandDefinition.ts:123](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L123)
