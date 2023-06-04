[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/base-http-bridge](../modules/purista_base_http_bridge.md) / HttpEventBridgeClient

# Interface: HttpEventBridgeClient

[@purista/base-http-bridge](../modules/purista_base_http_bridge.md).HttpEventBridgeClient

The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
This client is responsible for the communication to the sidecar service.

## Table of contents

### Properties

- [getApiPathForCommand](purista_base_http_bridge.HttpEventBridgeClient.md#getapipathforcommand)
- [getInternalPathForCommand](purista_base_http_bridge.HttpEventBridgeClient.md#getinternalpathforcommand)
- [getInternalPathForSubscription](purista_base_http_bridge.HttpEventBridgeClient.md#getinternalpathforsubscription)
- [invoke](purista_base_http_bridge.HttpEventBridgeClient.md#invoke)
- [isSidecarAvailable](purista_base_http_bridge.HttpEventBridgeClient.md#issidecaravailable)
- [sendEvent](purista_base_http_bridge.HttpEventBridgeClient.md#sendevent)

## Properties

### getApiPathForCommand

• **getApiPathForCommand**: (`addess`: `EBMessageAddress`, `metadata`: { `expose`: { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: `StatusCode`[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: `QueryParameter`<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  }  }) => `string`

#### Type declaration

▸ (`addess`, `metadata`): `string`

Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
This url is a POST endpoint and expects the payload and parameter as defined for exposing.

##### Parameters

| Name | Type |
| :------ | :------ |
| `addess` | `EBMessageAddress` |
| `metadata` | `Object` |
| `metadata.expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` \| ``"DELETE"`` ; `openApi?`: { `additionalStatusCodes?`: `StatusCode`[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: `QueryParameter`<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |

##### Returns

`string`

url path of endpoint

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L22)

___

### getInternalPathForCommand

• **getInternalPathForCommand**: (`address`: `EBMessageAddress`) => `string`

#### Type declaration

▸ (`address`): `string`

Generate the url path of the command.
This url is a POST endpoint and expects a command message as payload

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

##### Returns

`string`

url path of endpoint

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L14)

___

### getInternalPathForSubscription

• **getInternalPathForSubscription**: (`address`: `EBMessageAddress`) => `string`

#### Type declaration

▸ (`address`): `string`

Generate the url path of the subscription.
This url is a POST endpoint.
The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EBMessageAddress` |

##### Returns

`string`

url path of endpoint

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L31)

___

### invoke

• **invoke**: (`command`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `messageType`: `Command` ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: `EBMessageAddress` ; `sender`: { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } ; `timestamp`: `number` ; `traceId?`: `string`  }, `headers?`: `Record`<`string`, `string`\>, `timeout?`: `number`) => `Promise`<`CommandResponse`\>

#### Type declaration

▸ (`command`, `headers?`, `timeout?`): `Promise`<`CommandResponse`\>

Invoke a command

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | `Object` | Command |
| `command.contentEncoding` | `string` | content encoding of message payload |
| `command.contentType` | `string` | content type of message payload |
| `command.correlationId` | `string` | correlation id to know which command response referrs to which command |
| `command.eventName?` | `string` | event name for this message |
| `command.id` | `string` | global unique id of message |
| `command.messageType` | `Command` | - |
| `command.otp?` | `string` | stringified Opentelemetry parent trace id |
| `command.payload` | `Object` | - |
| `command.payload.parameter` | `unknown` | - |
| `command.payload.payload` | `unknown` | - |
| `command.principalId?` | `string` | principal id |
| `command.receiver` | `EBMessageAddress` | - |
| `command.sender` | { serviceName: string; serviceVersion: string; serviceTarget: string; instanceId: string; } | - |
| `command.timestamp` | `number` | timestamp of message creation time |
| `command.traceId?` | `string` | trace id of message |
| `headers?` | `Record`<`string`, `string`\> | optional HTTP header |
| `timeout?` | `number` | the command timeout |

##### Returns

`Promise`<`CommandResponse`\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L40)

___

### isSidecarAvailable

• **isSidecarAvailable**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Checks if the sidecar container is available to be able to send events and invoke commands

##### Returns

`Promise`<`boolean`\>

boolean

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L54)

___

### sendEvent

• **sendEvent**: (`message`: `EBMessage`, `headers?`: `Record`<`string`, `string`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`message`, `headers?`): `Promise`<`void`\>

Send a EBMessage as event to the underlaying message infrastructure.

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `EBMessage` |
| `headers?` | `Record`<`string`, `string`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/base-http-bridge/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L48)
