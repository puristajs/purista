[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InstanceConfigType

# Type Alias: InstanceConfigType\<S\>

> **InstanceConfigType**\<`S`\> = [`Prettify`](Prettify.md)\<`object` & keyof `S`\[`"Resources"`\] *extends* `never` ? `object` : `object` & keyof `S`\[`"ConfigInputType"`\] *extends* `never` ? `object` : `object`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:81](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L81)

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](ServiceBuilderTypes.md)\<`any`, `any`, `any`, `any`, `any`\>
