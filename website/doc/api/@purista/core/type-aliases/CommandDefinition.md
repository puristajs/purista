[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandDefinition

# Type Alias: CommandDefinition\<S, MessagePayloadType, MessageParamsType, TransformInputPayload, TransformInputParams, FunctionPayloadType, FunctionParamsType, FunctionOutputType, FinalFunctionOutputType, TransformOutputHookOutput, Resources, Invokes, EmitList, MetadataType\>

> **CommandDefinition**\<`S`, `MessagePayloadType`, `MessageParamsType`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `FinalFunctionOutputType`, `TransformOutputHookOutput`, `Resources`, `Invokes`, `EmitList`, `MetadataType`\>: `object`

Defined in: [packages/core/src/core/types/commandType/CommandDefinition.ts:20](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinition.ts#L20)

The definition for a command provided by some service.

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)

• **MessagePayloadType**

• **MessageParamsType**

• **TransformInputPayload**

• **TransformInputParams**

• **FunctionPayloadType**

• **FunctionParamsType**

• **FunctionOutputType**

• **FinalFunctionOutputType**

• **TransformOutputHookOutput**

• **Resources** *extends* `Record`\<`string`, `any`\>

• **Invokes** *extends* [`InvokeList`](InvokeList.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\>

• **MetadataType** *extends* [`CommandDefinitionMetadataBase`](CommandDefinitionMetadataBase.md) = [`CommandDefinitionMetadataBase`](CommandDefinitionMetadataBase.md)

## Type declaration

### call

> **call**: [`CommandFunction`](CommandFunction.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>

the command function

### commandDescription

> **commandDescription**: `string`

the description of the command

### commandName

> **commandName**: `string`

the name of the command

### emitList

> **emitList**: [`FromEmitToOtherType`](FromEmitToOtherType.md)\<`EmitList`, `SchemaObject`\>

### eventBridgeConfig

> **eventBridgeConfig**: [`DefinitionEventBridgeConfig`](DefinitionEventBridgeConfig.md)

config information for event bridge

### eventName?

> `optional` **eventName**: `string`

the eventName for the command response

### hooks

> **hooks**: `object`

hooks of command

#### hooks.afterGuard?

> `optional` **hooks.afterGuard**: `Record`\<`string`, [`CommandAfterGuardHook`](CommandAfterGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionOutputType`, `Resources`, `Invokes`, `EmitList`\>\>

#### hooks.beforeGuard?

> `optional` **hooks.beforeGuard**: `Record`\<`string`, [`CommandBeforeGuardHook`](CommandBeforeGuardHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `Resources`, `Invokes`, `EmitList`\>\>

#### hooks.transformInput?

> `optional` **hooks.transformInput**: `object`

#### hooks.transformInput.transformFunction

> **hooks.transformInput.transformFunction**: [`CommandTransformInputHook`](CommandTransformInputHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `TransformInputPayload`, `TransformInputParams`, `FunctionPayloadType`, `FunctionParamsType`\>

#### hooks.transformInput.transformInputSchema

> **hooks.transformInput.transformInputSchema**: `Schema`

#### hooks.transformInput.transformParameterSchema

> **hooks.transformInput.transformParameterSchema**: `Schema`

#### hooks.transformOutput?

> `optional` **hooks.transformOutput**: `object`

#### hooks.transformOutput.transformFunction

> **hooks.transformOutput.transformFunction**: [`CommandTransformOutputHook`](CommandTransformOutputHook.md)\<`S`, `MessagePayloadType`, `MessageParamsType`, `FinalFunctionOutputType`, `FunctionParamsType`, `TransformOutputHookOutput`\>

#### hooks.transformOutput.transformOutputSchema

> **hooks.transformOutput.transformOutputSchema**: `Schema`

### invokes

> **invokes**: [`FromInvokeToOtherType`](FromInvokeToOtherType.md)\<`Invokes`, \{ `outputSchema`: `SchemaObject`; `parameterSchema`: `SchemaObject`; `payloadSchema`: `SchemaObject`; \}\>

### metadata

> **metadata**: `MetadataType`

the metadata of the command
