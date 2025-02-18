[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / SecretGetterFunction

# Type Alias: SecretGetterFunction()

> **SecretGetterFunction**: \<`SecretNames`\>(...`secretNames`) => `Promise`\<[`ObjectWithKeysFromStringArray`](ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>

Defined in: [packages/core/src/core/SecretStore/types/SecretGetterFunction.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/SecretStore/types/SecretGetterFunction.ts#L4)

get a secret from the secret store

## Type Parameters

• **SecretNames** *extends* `string`[]

## Parameters

### secretNames

...`SecretNames`

## Returns

`Promise`\<[`ObjectWithKeysFromStringArray`](ObjectWithKeysFromStringArray.md)\<`SecretNames`, `string` \| `undefined`\>\>
