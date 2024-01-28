[PURISTA API](../README.md) / [Modules](../modules.md) / @purista/hono-http-server

# Module: @purista/hono-http-server

Package for using a Hono as webserver.

Minimal example:

**`Example`**

```typescript
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

// create and init our eventbridge
const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// add your service
const pingService = pingV1Service.getInstance(eventBridge)
await pingService.start()

const honoService = honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    services: [pingService]
  }
})
await honoService.start()

const _serverInstance = serve({
  fetch: honoService.app.fetch,
  port: 3000,
})

```

## Table of contents

### Enumerations

- [ServiceEvent](../enums/purista_hono_http_server.ServiceEvent.md)

### Type Aliases

- [BindingsBase](purista_hono_http_server.md#bindingsbase)
- [EndpointProtectMiddleware](purista_hono_http_server.md#endpointprotectmiddleware)
- [HealthFunction](purista_hono_http_server.md#healthfunction)
- [VariablesBase](purista_hono_http_server.md#variablesbase)

### Variables

- [honoV1Service](purista_hono_http_server.md#honov1service)

## Type Aliases

### BindingsBase

Ƭ **BindingsBase**: `Object`

#### Defined in

[packages/hono-http-server/src/types/BindingsBase.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/hono-http-server/src/types/BindingsBase.ts#L1)

___

### EndpointProtectMiddleware

Ƭ **EndpointProtectMiddleware**\<`T`, `Bindings`, `Variables`\>: (`this`: `T`, `c`: `Context`\<\{ `Bindings`: `Bindings` ; `Variables`: `Variables`  }\>, `next`: `Next`) => `Promise`\<`void` \| `Response`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Service`](../classes/purista_core.Service.md) |
| `Bindings` | extends [`BindingsBase`](purista_hono_http_server.md#bindingsbase) = [`BindingsBase`](purista_hono_http_server.md#bindingsbase) |
| `Variables` | extends [`VariablesBase`](purista_hono_http_server.md#variablesbase) = [`VariablesBase`](purista_hono_http_server.md#variablesbase) |

#### Type declaration

▸ (`this`, `c`, `next`): `Promise`\<`void` \| `Response`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |
| `c` | `Context`\<\{ `Bindings`: `Bindings` ; `Variables`: `Variables`  }\> |
| `next` | `Next` |

##### Returns

`Promise`\<`void` \| `Response`\>

#### Defined in

[packages/hono-http-server/src/types/EndpointProtectMiddleware.ts:7](https://github.com/sebastianwessel/purista/blob/master/packages/hono-http-server/src/types/EndpointProtectMiddleware.ts#L7)

___

### HealthFunction

Ƭ **HealthFunction**\<`T`\>: (`this`: `T`) => `Promise`\<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Service`](../classes/purista_core.Service.md) |

#### Type declaration

▸ (`this`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |

##### Returns

`Promise`\<`void`\>

#### Defined in

[packages/hono-http-server/src/types/HealthFunction.ts:3](https://github.com/sebastianwessel/purista/blob/master/packages/hono-http-server/src/types/HealthFunction.ts#L3)

___

### VariablesBase

Ƭ **VariablesBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `additionalParameter?` | `Record`\<`string`, `unknown`\> |
| `principalId?` | `string` |
| `tenantId?` | `string` |
| `traceId?` | `string` |

#### Defined in

[packages/hono-http-server/src/types/VariablesBase.ts:1](https://github.com/sebastianwessel/purista/blob/master/packages/hono-http-server/src/types/VariablesBase.ts#L1)

## Variables

### honoV1Service

• `Const` **honoV1Service**: [`ServiceBuilder`](../classes/purista_core.ServiceBuilder.md)\<\{ `apiMountPath`: `string` ; `enableHealth`: `boolean` ; `healthFunction?`: `any` ; `healthPath`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  } = InfoObjectSchema; `openapi`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField`: `string`  }, \{ `apiMountPath?`: `string` ; `enableHealth?`: `boolean` ; `healthFunction?`: `any` ; `healthPath?`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  } = InfoObjectSchema; `openapi?`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services?`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField?`: `string`  }, `HonoServiceClass`\<[`BindingsBase`](purista_hono_http_server.md#bindingsbase), [`VariablesBase`](purista_hono_http_server.md#variablesbase)\>\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoV1Service.ts:13](https://github.com/sebastianwessel/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoV1Service.ts#L13)
