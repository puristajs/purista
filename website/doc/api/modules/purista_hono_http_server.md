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
- [HonoServiceV1Config](purista_hono_http_server.md#honoservicev1config)
- [VariablesBase](purista_hono_http_server.md#variablesbase)

### Variables

- [DEFAULT\_API\_MOUNT\_PATH](purista_hono_http_server.md#default_api_mount_path)
- [ExternalDocumentationObjectSchema](purista_hono_http_server.md#externaldocumentationobjectschema)
- [InfoObjectSchema](purista_hono_http_server.md#infoobjectschema)
- [OPENAPI\_DEFAULT\_INFO](purista_hono_http_server.md#openapi_default_info)
- [ServerObjectSchema](purista_hono_http_server.md#serverobjectschema)
- [TagObjectSchema](purista_hono_http_server.md#tagobjectschema)
- [honoServiceV1ConfigSchema](purista_hono_http_server.md#honoservicev1configschema)
- [honoV1Service](purista_hono_http_server.md#honov1service)
- [puristaVersion](purista_hono_http_server.md#puristaversion)

### Functions

- [addPathToOpenApi](purista_hono_http_server.md#addpathtoopenapi)
- [getErrorName](purista_hono_http_server.md#geterrorname)
- [getErrorResponseSchema](purista_hono_http_server.md#geterrorresponseschema)
- [getParameterDefinition](purista_hono_http_server.md#getparameterdefinition)
- [getQueryDefintion](purista_hono_http_server.md#getquerydefintion)

## Type Aliases

### BindingsBase

Ƭ **BindingsBase**: `Object`

#### Defined in

[packages/hono-http-server/src/types/BindingsBase.ts:1](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/types/BindingsBase.ts#L1)

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

[packages/hono-http-server/src/types/EndpointProtectMiddleware.ts:7](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/types/EndpointProtectMiddleware.ts#L7)

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

[packages/hono-http-server/src/types/HealthFunction.ts:3](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/types/HealthFunction.ts#L3)

___

### HonoServiceV1Config

Ƭ **HonoServiceV1Config**: `z.output`\<typeof [`honoServiceV1ConfigSchema`](purista_hono_http_server.md#honoservicev1configschema)\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:75](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L75)

___

### VariablesBase

Ƭ **VariablesBase**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `additionalParameter?` | `Record`\<`string`, `unknown`\> | Additional parameter passed to the commands |
| `instanceId?` | `string` | The instance ID |
| `principalId?` | `string` | The principal ID |
| `tenantId?` | `string` | The tenant ID |
| `traceId?` | `string` | The custom trace ID |

#### Defined in

[packages/hono-http-server/src/types/VariablesBase.ts:1](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/types/VariablesBase.ts#L1)

## Variables

### DEFAULT\_API\_MOUNT\_PATH

• `Const` **DEFAULT\_API\_MOUNT\_PATH**: ``"/api"``

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:6](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L6)

___

### ExternalDocumentationObjectSchema

• `Const` **ExternalDocumentationObjectSchema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string`  }, \{ `description?`: `string` ; `url`: `string`  }\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:14](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L14)

___

### InfoObjectSchema

• `Const` **InfoObjectSchema**: `ZodObject`\<\{ `contact`: `ZodOptional`\<`ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\> ; `name`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodOptional`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }, \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }\>\> ; `description`: `ZodDefault`\<`ZodString`\> ; `license`: `ZodOptional`\<`ZodObject`\<\{ `name`: `ZodString` ; `url`: `ZodOptional`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `name`: `string` ; `url?`: `string`  }, \{ `name`: `string` ; `url?`: `string`  }\>\> ; `termsOfService`: `ZodOptional`\<`ZodString`\> ; `title`: `ZodDefault`\<`ZodString`\> ; `version`: `ZodDefault`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  }, \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  }\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:25](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L25)

___

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `title` | `string` |
| `version` | `string` |

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:8](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L8)

___

### ServerObjectSchema

• `Const` **ServerObjectSchema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString` ; `variables`: `ZodOptional`\<`ZodAny`\>  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }, \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:45](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L45)

___

### TagObjectSchema

• `Const` **TagObjectSchema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `externalDocs`: `ZodOptional`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string`  }, \{ `description?`: `string` ; `url`: `string`  }\>\> ; `name`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }, \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:19](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L19)

___

### honoServiceV1ConfigSchema

• `Const` **honoServiceV1ConfigSchema**: `ZodObject`\<\{ `apiMountPath`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\> ; `enableDynamicRoutes`: `ZodDefault`\<`ZodBoolean`\> ; `enableHealth`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\> ; `healthFunction`: `ZodDefault`\<`ZodAny`\> ; `healthPath`: `ZodDefault`\<`ZodOptional`\<`ZodString`\>\> ; `logLevel`: `ZodOptional`\<`ZodEnum`\<[``"info"``, ``"error"``, ``"warn"``, ``"debug"``, ``"trace"``, ``"fatal"``]\>\> ; `openApi`: `ZodOptional`\<`ZodObject`\<\{ `components`: `ZodOptional`\<`ZodAny`\> ; `enabled`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\> ; `externalDocs`: `ZodOptional`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string`  }, \{ `description?`: `string` ; `url`: `string`  }\>\> ; `info`: `ZodObject`\<\{ `contact`: `ZodOptional`\<`ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\> ; `name`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodOptional`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }, \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  }\>\> ; `description`: `ZodDefault`\<`ZodString`\> ; `license`: `ZodOptional`\<`ZodObject`\<\{ `name`: `ZodString` ; `url`: `ZodOptional`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `name`: `string` ; `url?`: `string`  }, \{ `name`: `string` ; `url?`: `string`  }\>\> ; `termsOfService`: `ZodOptional`\<`ZodString`\> ; `title`: `ZodDefault`\<`ZodString`\> ; `version`: `ZodDefault`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  }, \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  }\> = InfoObjectSchema; `openapi`: `ZodDefault`\<`ZodString`\> ; `paths`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodRecord`\<`ZodString`, `ZodAny`\>\>\> ; `security`: `ZodOptional`\<`ZodArray`\<`ZodAny`, ``"many"``\>\> ; `servers`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString` ; `variables`: `ZodOptional`\<`ZodAny`\>  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }, \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }\>, ``"many"``\>\> ; `tags`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `externalDocs`: `ZodOptional`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\> ; `url`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `url`: `string`  }, \{ `description?`: `string` ; `url`: `string`  }\>\> ; `name`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }, \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }\>, ``"many"``\>\>  }, ``"strip"``, `ZodTypeAny`, \{ `components?`: `any` ; `enabled`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  } = InfoObjectSchema; `openapi`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  }, \{ `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  } = InfoObjectSchema; `openapi?`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  }\>\> ; `protectHandler`: `ZodDefault`\<`ZodAny`\> ; `services`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodType`\<[`Service`](../classes/purista_core.Service.md)\<`unknown`\>, `ZodTypeDef`, [`Service`](../classes/purista_core.Service.md)\<`unknown`\>\>, ``"many"``\>\>\> ; `traceHeaderField`: `ZodDefault`\<`ZodString`\>  }, ``"strip"``, `ZodTypeAny`, \{ `apiMountPath`: `string` ; `enableDynamicRoutes`: `boolean` ; `enableHealth`: `boolean` ; `healthFunction?`: `any` ; `healthPath`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  } = InfoObjectSchema; `openapi`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField`: `string`  }, \{ `apiMountPath?`: `string` ; `enableDynamicRoutes?`: `boolean` ; `enableHealth?`: `boolean` ; `healthFunction?`: `any` ; `healthPath?`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  } = InfoObjectSchema; `openapi?`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services?`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField?`: `string`  }\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts:50](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoServiceConfig.ts#L50)

___

### honoV1Service

• `Const` **honoV1Service**: [`ServiceBuilder`](../classes/purista_core.ServiceBuilder.md)\<\{ `apiMountPath`: `string` ; `enableDynamicRoutes`: `boolean` ; `enableHealth`: `boolean` ; `healthFunction?`: `any` ; `healthPath`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title`: `string` ; `version`: `string`  } = InfoObjectSchema; `openapi`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField`: `string`  }, \{ `apiMountPath?`: `string` ; `enableDynamicRoutes?`: `boolean` ; `enableHealth?`: `boolean` ; `healthFunction?`: `any` ; `healthPath?`: `string` ; `logLevel?`: ``"info"`` \| ``"error"`` \| ``"warn"`` \| ``"debug"`` \| ``"trace"`` \| ``"fatal"`` ; `openApi?`: \{ `components?`: `any` ; `enabled?`: `boolean` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `info`: \{ `contact?`: \{ `email?`: `string` ; `name?`: `string` ; `url?`: `string`  } ; `description?`: `string` ; `license?`: \{ `name`: `string` ; `url?`: `string`  } ; `termsOfService?`: `string` ; `title?`: `string` ; `version?`: `string`  } = InfoObjectSchema; `openapi?`: `string` ; `paths?`: `Record`\<`string`, `Record`\<`string`, `any`\>\> ; `security?`: `any`[] ; `servers?`: \{ `description?`: `string` ; `url`: `string` ; `variables?`: `any`  }[] ; `tags?`: \{ `description?`: `string` ; `externalDocs?`: \{ `description?`: `string` ; `url`: `string`  } ; `name`: `string`  }[]  } ; `protectHandler?`: `any` ; `services?`: [`Service`](../classes/purista_core.Service.md)\<`unknown`\>[] ; `traceHeaderField?`: `string`  }, `HonoServiceClass`\<[`BindingsBase`](purista_hono_http_server.md#bindingsbase), [`VariablesBase`](purista_hono_http_server.md#variablesbase)\>\>

#### Defined in

[packages/hono-http-server/src/service/hono/v1/honoV1Service.ts:16](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/service/hono/v1/honoV1Service.ts#L16)

___

### puristaVersion

• `Const` **puristaVersion**: ``"1.10.8"``

#### Defined in

[packages/hono-http-server/src/version.ts:1](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/version.ts#L1)

## Functions

### addPathToOpenApi

▸ **addPathToOpenApi**(`openApiBuilder`, `metadata`, `path`, `config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `openApiBuilder` | `OpenApiBuilder` |
| `metadata` | `Object` |
| `metadata.expose` | \{ `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & \{ `http`: \{ `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: \{ `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](purista_core.md#queryparameter)\<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |
| `path` | `string` |
| `config` | `Config` |

#### Returns

`void`

#### Defined in

[packages/hono-http-server/src/helper/addPathToOpenApi.ts:14](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/addPathToOpenApi.ts#L14)

___

### getErrorName

▸ **getErrorName**(`code`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`StatusCode`](../enums/purista_core.StatusCode.md) |

#### Returns

`string`

#### Defined in

[packages/hono-http-server/src/helper/getErrorName.ts:3](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/getErrorName.ts#L3)

___

### getErrorResponseSchema

▸ **getErrorResponseSchema**(`code`, `message`, `schema?`): `SchemaObject`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [`StatusCode`](../enums/purista_core.StatusCode.md) |
| `message` | `string` |
| `schema?` | `SchemaObject` |

#### Returns

`SchemaObject`

#### Defined in

[packages/hono-http-server/src/helper/getErrorResponseSchema.ts:55](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/getErrorResponseSchema.ts#L55)

___

### getParameterDefinition

▸ **getParameterDefinition**(`path`, `parameterschema?`): `ParameterObject`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `parameterschema?` | `SchemaObject` |

#### Returns

`ParameterObject`[]

#### Defined in

[packages/hono-http-server/src/helper/getParameterDefinition.ts:6](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/getParameterDefinition.ts#L6)

___

### getQueryDefintion

▸ **getQueryDefintion**(`queryDefinition`, `parameterschema?`): `ParameterObject`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryDefinition` | `undefined` \| [`QueryParameter`](purista_core.md#queryparameter)\<`Record`\<`string`, `unknown`\>\>[] |
| `parameterschema?` | `SchemaObject` |

#### Returns

`ParameterObject`[]

#### Defined in

[packages/hono-http-server/src/helper/getQueryDefintion.ts:5](https://github.com/puristajs/purista/blob/master/packages/hono-http-server/src/helper/getQueryDefintion.ts#L5)
