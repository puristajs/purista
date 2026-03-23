[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / InstanceConfigType

# Type Alias: InstanceConfigType\<S\>

> **InstanceConfigType**\<`S`\> = [`Prettify`](Prettify.md)\<`object` & keyof `S`\[`"Resources"`\] *extends* [`NeverObject`](NeverObject.md) ? `object` : `object` & keyof `S`\[`"ConfigInputType"`\] *extends* [`NeverObject`](NeverObject.md) ? `object` : `object`\>

Defined in: [ServiceBuilder/ServiceBuilder.impl.ts:59](https://github.com/puristajs/purista/blob/master/packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts#L59)

## Type Parameters

### S

`S` *extends* [`ServiceBuilderTypes`](ServiceBuilderTypes.md)
