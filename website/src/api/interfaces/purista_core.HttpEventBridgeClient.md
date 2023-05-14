[PURISTA API](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / HttpEventBridgeClient

# Interface: HttpEventBridgeClient

[@purista/core](../modules/purista_core.md).HttpEventBridgeClient

The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
This client is responsible for the communication to the sidecar service.

## Table of contents

### Properties

- [getApiPathForCommand](purista_core.HttpEventBridgeClient.md#getapipathforcommand)
- [getInternalPathForCommand](purista_core.HttpEventBridgeClient.md#getinternalpathforcommand)
- [getInternalPathForSubscription](purista_core.HttpEventBridgeClient.md#getinternalpathforsubscription)
- [invoke](purista_core.HttpEventBridgeClient.md#invoke)
- [isSidecarAvailable](purista_core.HttpEventBridgeClient.md#issidecaravailable)
- [sendEvent](purista_core.HttpEventBridgeClient.md#sendevent)

## Properties

### getApiPathForCommand

• **getApiPathForCommand**: (`addess`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress), `metadata`: { `expose`: { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"DELETE"`` \| ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  }  }) => `string`

#### Type declaration

▸ (`addess`, `metadata`): `string`

Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
This url is a POST endpoint and expects the payload and parameter as defined for exposing.

##### Parameters

| Name | Type |
| :------ | :------ |
| `addess` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |
| `metadata` | `Object` |
| `metadata.expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: `string` ; `contentTypeResponse?`: `string` ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } & { `http`: { `method`: ``"DELETE"`` \| ``"GET"`` \| ``"POST"`` \| ``"PATCH"`` \| ``"PUT"`` ; `openApi?`: { `additionalStatusCodes?`: [`StatusCode`](../enums/purista_core.StatusCode.md)[] ; `description`: `string` ; `isSecure`: `boolean` ; `operationId?`: `string` ; `query?`: [`QueryParameter`](../modules/purista_core.md#queryparameter)<{}\>[] ; `summary`: `string` ; `tags?`: `string`[]  } ; `path`: `string`  }  } |

##### Returns

`string`

url path of endpoint

#### Defined in

[HttpEventBridge/types/HttpEventBridgeClient.ts:22](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L22)

___

### getInternalPathForCommand

• **getInternalPathForCommand**: (`address`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress)) => `string`

#### Type declaration

▸ (`address`): `string`

Generate the url path of the command.
This url is a POST endpoint and expects a command message as payload

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

##### Returns

`string`

url path of endpoint

#### Defined in

[HttpEventBridge/types/HttpEventBridgeClient.ts:14](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L14)

___

### getInternalPathForSubscription

• **getInternalPathForSubscription**: (`address`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress)) => `string`

#### Type declaration

▸ (`address`): `string`

Generate the url path of the subscription.
This url is a POST endpoint.
The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) |

##### Returns

`string`

url path of endpoint

#### Defined in

[HttpEventBridge/types/HttpEventBridgeClient.ts:31](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L31)

___

### invoke

• **invoke**: (`command`: { `contentEncoding`: `string` ; `contentType`: `string` ; `correlationId`: `string` ; `eventName?`: `string` ; `id`: `string` ; `instanceId`: `string` ; `messageType`: [`Command`](../enums/purista_core.EBMessageType.md#command) ; `otp?`: `string` ; `payload`: { `parameter`: `unknown` ; `payload`: `unknown`  } ; `principalId?`: `string` ; `receiver`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) ; `timestamp`: `number` ; `traceId?`: `string`  }, `headers?`: `Record`<`string`, `string`\>, `timeout?`: `number`) => `Promise`<[`CommandResponse`](../modules/purista_core.md#commandresponse)\>

#### Type declaration

▸ (`command`, `headers?`, `timeout?`): `Promise`<[`CommandResponse`](../modules/purista_core.md#commandresponse)\>

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
| `command.instanceId` | `string` | instance id of eventbridge which was creating the message |
| `command.messageType` | [`Command`](../enums/purista_core.EBMessageType.md#command) | - |
| `command.otp?` | `string` | stringified Opentelemetry parent trace id |
| `command.payload` | `Object` | - |
| `command.payload.parameter` | `unknown` | - |
| `command.payload.payload` | `unknown` | - |
| `command.principalId?` | `string` | principal id |
| `command.receiver` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | - |
| `command.sender` | [`EBMessageAddress`](../modules/purista_core.md#ebmessageaddress) | - |
| `command.timestamp` | `number` | timestamp of message creation time |
| `command.traceId?` | `string` | trace id of message |
| `headers?` | `Record`<`string`, `string`\> | optional HTTP header |
| `timeout?` | `number` | the command timeout |

##### Returns

`Promise`<[`CommandResponse`](../modules/purista_core.md#commandresponse)\>

#### Defined in

[HttpEventBridge/types/HttpEventBridgeClient.ts:40](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L40)

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

[HttpEventBridge/types/HttpEventBridgeClient.ts:54](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L54)

___

### sendEvent

• **sendEvent**: (`message`: [`EBMessage`](../modules/purista_core.md#ebmessage), `headers?`: `Record`<`string`, `string`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`message`, `headers?`): `Promise`<`void`\>

Send a EBMessage as event to the underlaying message infrastructure.

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`EBMessage`](../modules/purista_core.md#ebmessage) |
| `headers?` | `Record`<`string`, `string`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[HttpEventBridge/types/HttpEventBridgeClient.ts:48](https://github.com/sebastianwessel/purista/blob/master/packages/core/src/HttpEventBridge/types/HttpEventBridgeClient.ts#L48)
