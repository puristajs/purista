[**@purista/core v2.0.5**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SubscriptionDefinitionList

# Type Alias: SubscriptionDefinitionList\<ServiceClassType\>

> **SubscriptionDefinitionList**\<`ServiceClassType`\>: `Promise`\<[`SubscriptionDefinition`](SubscriptionDefinition.md)\<`ServiceClassType`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>\>[]

Defined in: [packages/core/src/core/types/subscription/SubscriptionDefinitionList.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/subscription/SubscriptionDefinitionList.ts#L11)

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

## Type Parameters

• **ServiceClassType** *extends* [`Service`](../classes/Service.md)
