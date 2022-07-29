[PURISTA API - v1.3.1](../README.md) / @purista/httpserver

# Module: @purista/httpserver

## Table of contents

### Namespaces

- [internal](purista_httpserver.internal.md)

### Classes

- [HttpServerService](../classes/purista_httpserver.HttpServerService.md)

### Type Aliases

- [HttpServerConfig](purista_httpserver.md#httpserverconfig)

### Variables

- [OPENAPI\_DEFAULT\_INFO](purista_httpserver.md#openapi_default_info)
- [OPENAPI\_DEFAULT\_MOUNT\_PATH](purista_httpserver.md#openapi_default_mount_path)
- [ServiceInfo](purista_httpserver.md#serviceinfo)

### Functions

- [getDefaultConfig](purista_httpserver.md#getdefaultconfig)

## Type Aliases

### HttpServerConfig

Ƭ **HttpServerConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiMountPath?` | `string` |
| `cookieSecret?` | `string` |
| `domain` | `string` |
| `fastify` | `Partial`<`FastifyServerOptions`\> & `Partial`<`FastifyHttp2SecureOptions`<`Http2SecureServer`\>\> |
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

[httpserver/src/types/HttpServerConfig.ts:13](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/httpserver/src/types/HttpServerConfig.ts#L13)

## Variables

### OPENAPI\_DEFAULT\_INFO

• `Const` **OPENAPI\_DEFAULT\_INFO**: `InfoObject`

#### Defined in

[httpserver/src/config/defaults.config.ts:7](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/httpserver/src/config/defaults.config.ts#L7)

___

### OPENAPI\_DEFAULT\_MOUNT\_PATH

• `Const` **OPENAPI\_DEFAULT\_MOUNT\_PATH**: `string`

#### Defined in

[httpserver/src/config/defaults.config.ts:5](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/httpserver/src/config/defaults.config.ts#L5)

___

### ServiceInfo

• `Const` **ServiceInfo**: [`ServiceInfoType`](purista_httpserver.internal.md#serviceinfotype)

#### Defined in

[httpserver/src/config/ServiceInfo.ts:3](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/httpserver/src/config/ServiceInfo.ts#L3)

## Functions

### getDefaultConfig

▸ **getDefaultConfig**(): [`HttpServerConfig`](purista_httpserver.md#httpserverconfig)

#### Returns

[`HttpServerConfig`](purista_httpserver.md#httpserverconfig)

#### Defined in

[httpserver/src/config/getDefaultConfig.ts:4](https://github.com/sebastianwessel/purista/blob/81fe9e5/packages/httpserver/src/config/getDefaultConfig.ts#L4)
