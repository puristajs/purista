[PURISTA API - v1.4.9](../README.md) / @purista/httpserver

# Module: @purista/httpserver

## Table of contents

### Namespaces

- [internal](purista_httpserver.internal.md)

### Classes

- [HttpServerService](../classes/purista_httpserver.HttpServerService.md)

### Type Aliases

- [BeforeResponseHook](purista_httpserver.md#beforeresponsehook)
- [HttpServerConfig](purista_httpserver.md#httpserverconfig)

### Variables

- [OPENAPI\_DEFAULT\_INFO](purista_httpserver.md#openapi_default_info)
- [OPENAPI\_DEFAULT\_MOUNT\_PATH](purista_httpserver.md#openapi_default_mount_path)
- [ServiceInfo](purista_httpserver.md#serviceinfo)

### Functions

- [getDefaultConfig](purista_httpserver.md#getdefaultconfig)

## Type Aliases

### BeforeResponseHook

Ƭ **BeforeResponseHook**: <T\>(`payload`: `T`, `request`: `FastifyRequest`, `reply`: `FastifyReply`, `parameter`: `Record`<`string`, `unknown`\>) => `void`

#### Type declaration

▸ <`T`\>(`payload`, `request`, `reply`, `parameter`): `void`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `T` |
| `request` | `FastifyRequest` |
| `reply` | `FastifyReply` |
| `parameter` | `Record`<`string`, `unknown`\> |

##### Returns

`void`

#### Defined in

[httpserver/src/types/BeforeResponseHook.ts:3](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/types/BeforeResponseHook.ts#L3)

___

### HttpServerConfig

Ƭ **HttpServerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `compressOptions?` | `FastifyCompressOptions` |
| `cookieSecret?` | `string` |
| `corsOptions?` | `FastifyCorsOptions` |
| `domain` | `string` |
| `enableCompress?` | `boolean` |
| `enableCors?` | `boolean` |
| `enableHelmet?` | `boolean` |
| `fastify` | `Partial`<`FastifyServerOptions`\> & `Partial`<`FastifyHttp2SecureOptions`<`Http2SecureServer`\>\> |
| `helmetOptions?` | `FastifyHelmetOptions` |
| `host?` | `string` |
| `logLevel?` | [`LogLevelName`](purista_httpserver.internal.md#loglevelname) |
| `openApi?` | { `components?`: `ComponentsObject` ; `enabled?`: `boolean` ; `externalDocs?`: `ExternalDocumentationObject` ; `info`: `InfoObject` ; `path?`: `string` ; `security?`: `SecurityRequirementObject`[] ; `servers?`: `ServerObject`[] ; `tags?`: `TagObject`[]  } |
| `openApi.components?` | `ComponentsObject` |
| `openApi.enabled?` | `boolean` |
| `openApi.externalDocs?` | `ExternalDocumentationObject` |
| `openApi.info` | `InfoObject` |
| `openApi.path?` | `string` |
| `openApi.security?` | `SecurityRequirementObject`[] |
| `openApi.servers?` | `ServerObject`[] |
| `openApi.tags?` | `TagObject`[] |
| `port` | `number` |
| `uploadDir?` | `string` |

#### Defined in

[httpserver/src/types/HttpServerConfig.ts:16](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/types/HttpServerConfig.ts#L16)

## Variables

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `InfoObject`

#### Defined in

[httpserver/src/config/defaults.config.ts:7](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/config/defaults.config.ts#L7)

___

### OPENAPI\_DEFAULT\_MOUNT\_PATH

• `Const` **OPENAPI\_DEFAULT\_MOUNT\_PATH**: `string`

#### Defined in

[httpserver/src/config/defaults.config.ts:5](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/config/defaults.config.ts#L5)

___

### ServiceInfo

• `Const` **ServiceInfo**: [`ServiceInfoType`](purista_httpserver.internal.md#serviceinfotype)

#### Defined in

[httpserver/src/config/ServiceInfo.ts:3](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/config/ServiceInfo.ts#L3)

## Functions

### getDefaultConfig

▸ **getDefaultConfig**(): [`HttpServerConfig`](purista_httpserver.md#httpserverconfig)

#### Returns

[`HttpServerConfig`](purista_httpserver.md#httpserverconfig)

#### Defined in

[httpserver/src/config/getDefaultConfig.ts:4](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/httpserver/src/config/getDefaultConfig.ts#L4)
