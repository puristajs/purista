[**@purista/hono-http-server v2.0.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/hono-http-server](../README.md) / EndpointProtectMiddleware

# Type Alias: EndpointProtectMiddleware()\<T, Bindings, Variables\>

> **EndpointProtectMiddleware**\<`T`, `Bindings`, `Variables`\>: (`this`, `c`, `next`) => `Promise`\<`void` \| `Response`\>

Defined in: [packages/hono-http-server/src/types/EndpointProtectMiddleware.ts:7](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/types/EndpointProtectMiddleware.ts#L7)

## Type Parameters

• **T** *extends* [`Service`](../../core/classes/Service.md)

• **Bindings** *extends* [`BindingsBase`](BindingsBase.md) = [`BindingsBase`](BindingsBase.md)

• **Variables** *extends* [`VariablesBase`](VariablesBase.md) = [`VariablesBase`](VariablesBase.md)

## Parameters

### this

`T`

### c

`Context`\<\{ `Bindings`: `Bindings`; `Variables`: `Variables`; \}\>

### next

`Next`

## Returns

`Promise`\<`void` \| `Response`\>
