[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / CommandDefinitionList

# Type Alias: CommandDefinitionList\<S\>

> **CommandDefinitionList**\<`S`\>: `Promise`\<[`CommandDefinition`](CommandDefinition.md)\<`S`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, [`CommandDefinitionMetadataBase`](CommandDefinitionMetadataBase.md)\>\>[]

Defined in: [packages/core/src/core/types/commandType/CommandDefinitionList.ts:12](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/commandType/CommandDefinitionList.ts#L12)

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

## Type Parameters

• **S** *extends* [`Service`](../classes/Service.md)
