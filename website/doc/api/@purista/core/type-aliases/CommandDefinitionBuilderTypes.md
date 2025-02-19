[**@purista/core v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandDefinitionBuilderTypes

# Type Alias: CommandDefinitionBuilderTypes\<PayloadSchema, ParamsSchema, OutputSchema, TransformInputPayloadSchema, TransformInputParamsSchema, TransformOutputSchema, Resources, Invokes, EmitList\>

> **CommandDefinitionBuilderTypes**\<`PayloadSchema`, `ParamsSchema`, `OutputSchema`, `TransformInputPayloadSchema`, `TransformInputParamsSchema`, `TransformOutputSchema`, `Resources`, `Invokes`, `EmitList`\>: `object`

Defined in: [packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilderTypes.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilderTypes.ts#L4)

## Type Parameters

• **PayloadSchema** *extends* `Schema` = `Schema`

• **ParamsSchema** *extends* `Schema` = `Schema`

• **OutputSchema** *extends* `Schema` = `Schema`

• **TransformInputPayloadSchema** *extends* `Schema` = `Schema`

• **TransformInputParamsSchema** *extends* `Schema` = `Schema`

• **TransformOutputSchema** *extends* `Schema` = `Schema`

• **Resources** *extends* `Record`\<`string`, `any`\> = [`EmptyObject`](EmptyObject.md)

• **Invokes** *extends* [`InvokeList`](InvokeList.md) = [`InvokeList`](InvokeList.md)

• **EmitList** *extends* `Record`\<`string`, `Schema`\> = `Record`\<`string`, `Schema`\>

## Type declaration

### EmitList

> **EmitList**: `EmitList`

### Invokes

> **Invokes**: `Invokes`

### OutputSchema

> **OutputSchema**: `OutputSchema`

### ParamsSchema

> **ParamsSchema**: `ParamsSchema`

### PayloadSchema

> **PayloadSchema**: `PayloadSchema`

### Resources

> **Resources**: `Resources`

### TransformInputParamsSchema

> **TransformInputParamsSchema**: `TransformInputParamsSchema`

### TransformInputPayloadSchema

> **TransformInputPayloadSchema**: `TransformInputPayloadSchema`

### TransformOutputSchema

> **TransformOutputSchema**: `TransformOutputSchema`
