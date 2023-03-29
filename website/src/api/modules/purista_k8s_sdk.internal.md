[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](purista_k8s_sdk.md) / internal

# Namespace: internal

[@purista/k8s-sdk](purista_k8s_sdk.md).internal

## Table of contents

### Enumerations

- [EBMessageType](../enums/purista_k8s_sdk.internal.EBMessageType.md)
- [StatusCode](../enums/purista_k8s_sdk.internal.StatusCode.md)

### Enumeration Members

- [Command](purista_k8s_sdk.internal.md#command)
- [CommandErrorResponse](purista_k8s_sdk.internal.md#commanderrorresponse)
- [CommandSuccessResponse](purista_k8s_sdk.internal.md#commandsuccessresponse)
- [CustomMessage](purista_k8s_sdk.internal.md#custommessage)
- [InfoInvokeTimeout](purista_k8s_sdk.internal.md#infoinvoketimeout)
- [InfoServiceDrain](purista_k8s_sdk.internal.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_k8s_sdk.internal.md#infoservicefunctionadded)
- [InfoServiceInit](purista_k8s_sdk.internal.md#infoserviceinit)
- [InfoServiceNotReady](purista_k8s_sdk.internal.md#infoservicenotready)
- [InfoServiceReady](purista_k8s_sdk.internal.md#infoserviceready)
- [InfoServiceShutdown](purista_k8s_sdk.internal.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_k8s_sdk.internal.md#infosubscriptionerror)

### Classes

- [GenericEventEmitter](../classes/purista_k8s_sdk.internal.GenericEventEmitter.md)
- [HandledError](../classes/purista_k8s_sdk.internal.HandledError.md)
- [Logger](../classes/purista_k8s_sdk.internal.Logger.md)

### Service

- [Service](../classes/purista_k8s_sdk.internal.Service.md)
- [ServiceBaseClass](../classes/purista_k8s_sdk.internal.ServiceBaseClass.md)
- [ServiceClass](../interfaces/purista_k8s_sdk.internal.ServiceClass.md)
- [ServiceConstructorInput](purista_k8s_sdk.internal.md#serviceconstructorinput)
- [ServiceEventsInternal](purista_k8s_sdk.internal.md#serviceeventsinternal)

### Store

- [ConfigStore](../interfaces/purista_k8s_sdk.internal.ConfigStore.md)
- [SecretStore](../interfaces/purista_k8s_sdk.internal.SecretStore.md)
- [StateStore](../interfaces/purista_k8s_sdk.internal.StateStore.md)
- [ConfigDeleteFunction](purista_k8s_sdk.internal.md#configdeletefunction)
- [ConfigGetterFunction](purista_k8s_sdk.internal.md#configgetterfunction)
- [ConfigSetterFunction](purista_k8s_sdk.internal.md#configsetterfunction)
- [SecretDeleteFunction](purista_k8s_sdk.internal.md#secretdeletefunction)
- [SecretGetterFunction](purista_k8s_sdk.internal.md#secretgetterfunction)
- [SecretSetterFunction](purista_k8s_sdk.internal.md#secretsetterfunction)
- [StateDeleteFunction](purista_k8s_sdk.internal.md#statedeletefunction)
- [StateGetterFunction](purista_k8s_sdk.internal.md#stategetterfunction)
- [StateSetterFunction](purista_k8s_sdk.internal.md#statesetterfunction)

### Event bridge

- [EventBridge](../interfaces/purista_k8s_sdk.internal.EventBridge.md)

### Interfaces

- [IEmitter](../interfaces/purista_k8s_sdk.internal.IEmitter.md)

### Type Aliases

- [Command](purista_k8s_sdk.internal.md#command-1)
- [CommandDefinitionList](purista_k8s_sdk.internal.md#commanddefinitionlist)
- [CommandDefinitionMetadataBase](purista_k8s_sdk.internal.md#commanddefinitionmetadatabase)
- [ContentType](purista_k8s_sdk.internal.md#contenttype)
- [ContextBase](purista_k8s_sdk.internal.md#contextbase)
- [CorrelationId](purista_k8s_sdk.internal.md#correlationid)
- [CustomEvents](purista_k8s_sdk.internal.md#customevents)
- [CustomMessage](purista_k8s_sdk.internal.md#custommessage-1)
- [DefinitionEventBridgeConfig](purista_k8s_sdk.internal.md#definitioneventbridgeconfig)
- [EBMessage](purista_k8s_sdk.internal.md#ebmessage)
- [EBMessageAddress](purista_k8s_sdk.internal.md#ebmessageaddress)
- [EBMessageBase](purista_k8s_sdk.internal.md#ebmessagebase)
- [EBMessageId](purista_k8s_sdk.internal.md#ebmessageid)
- [EmitCustomMessageFunction](purista_k8s_sdk.internal.md#emitcustommessagefunction)
- [ErrorResponsePayload](purista_k8s_sdk.internal.md#errorresponsepayload)
- [EventKey](purista_k8s_sdk.internal.md#eventkey)
- [EventMap](purista_k8s_sdk.internal.md#eventmap)
- [EventReceiver](purista_k8s_sdk.internal.md#eventreceiver)
- [InfoInvokeTimeout](purista_k8s_sdk.internal.md#infoinvoketimeout-1)
- [InfoMessage](purista_k8s_sdk.internal.md#infomessage)
- [InfoMessageType](purista_k8s_sdk.internal.md#infomessagetype)
- [InfoServiceBase](purista_k8s_sdk.internal.md#infoservicebase)
- [InfoServiceDrain](purista_k8s_sdk.internal.md#infoservicedrain-1)
- [InfoServiceFunctionAdded](purista_k8s_sdk.internal.md#infoservicefunctionadded-1)
- [InfoServiceInit](purista_k8s_sdk.internal.md#infoserviceinit-1)
- [InfoServiceNotReady](purista_k8s_sdk.internal.md#infoservicenotready-1)
- [InfoServiceReady](purista_k8s_sdk.internal.md#infoserviceready-1)
- [InfoServiceShutdown](purista_k8s_sdk.internal.md#infoserviceshutdown-1)
- [InfoSubscriptionError](purista_k8s_sdk.internal.md#infosubscriptionerror-1)
- [InstanceId](purista_k8s_sdk.internal.md#instanceid)
- [InvokeFunction](purista_k8s_sdk.internal.md#invokefunction)
- [LogFnParamType](purista_k8s_sdk.internal.md#logfnparamtype)
- [LoggerOptions](purista_k8s_sdk.internal.md#loggeroptions)
- [PrincipalId](purista_k8s_sdk.internal.md#principalid)
- [ServiceEvents](purista_k8s_sdk.internal.md#serviceevents)
- [ServiceInfoType](purista_k8s_sdk.internal.md#serviceinfotype)
- [SubscriptionDefinitionList](purista_k8s_sdk.internal.md#subscriptiondefinitionlist)
- [SubscriptionDefinitionMetadataBase](purista_k8s_sdk.internal.md#subscriptiondefinitionmetadatabase)
- [TraceId](purista_k8s_sdk.internal.md#traceid)
- [addPrefixToObject](purista_k8s_sdk.internal.md#addprefixtoobject)

### Command

- [CommandAfterGuardHook](purista_k8s_sdk.internal.md#commandafterguardhook)
- [CommandBeforeGuardHook](purista_k8s_sdk.internal.md#commandbeforeguardhook)
- [CommandDefinition](purista_k8s_sdk.internal.md#commanddefinition)
- [CommandErrorResponse](purista_k8s_sdk.internal.md#commanderrorresponse-1)
- [CommandFunction](purista_k8s_sdk.internal.md#commandfunction)
- [CommandFunctionContext](purista_k8s_sdk.internal.md#commandfunctioncontext)
- [CommandFunctionContextEnhancements](purista_k8s_sdk.internal.md#commandfunctioncontextenhancements)
- [CommandResponse](purista_k8s_sdk.internal.md#commandresponse)
- [CommandSuccessResponse](purista_k8s_sdk.internal.md#commandsuccessresponse-1)
- [CommandTransformFunctionContext](purista_k8s_sdk.internal.md#commandtransformfunctioncontext)
- [CommandTransformInputHook](purista_k8s_sdk.internal.md#commandtransforminputhook)
- [CommandTransformOutputHook](purista_k8s_sdk.internal.md#commandtransformoutputhook)

### Subscription

- [Subscription](purista_k8s_sdk.internal.md#subscription)
- [SubscriptionAfterGuardHook](purista_k8s_sdk.internal.md#subscriptionafterguardhook)
- [SubscriptionBeforeGuardHook](purista_k8s_sdk.internal.md#subscriptionbeforeguardhook)
- [SubscriptionDefinition](purista_k8s_sdk.internal.md#subscriptiondefinition)
- [SubscriptionFunction](purista_k8s_sdk.internal.md#subscriptionfunction)
- [SubscriptionFunctionContext](purista_k8s_sdk.internal.md#subscriptionfunctioncontext)
- [SubscriptionFunctionContextEnhancements](purista_k8s_sdk.internal.md#subscriptionfunctioncontextenhancements)
- [SubscriptionTransformFunctionContext](purista_k8s_sdk.internal.md#subscriptiontransformfunctioncontext)
- [SubscriptionTransformInputHook](purista_k8s_sdk.internal.md#subscriptiontransforminputhook)
- [SubscriptionTransformOutputHook](purista_k8s_sdk.internal.md#subscriptiontransformoutputhook)

## Enumeration Members

### Command

• **Command**: ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse**: ``"commandErrorResponse"``

a error response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:15

___

### CommandSuccessResponse

• **CommandSuccessResponse**: ``"commandSuccessResponse"``

a success response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:13

___

### CustomMessage

• **CustomMessage**: ``"customMessage"``

a custom message / custom event

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:39

___

### InfoInvokeTimeout

• **InfoInvokeTimeout**: ``"infoInvokeTimeout"``

a service invoked a other function and did not get a answer within given ttl

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:35

___

### InfoServiceDrain

• **InfoServiceDrain**: ``"infoServiceDrain"``

indicates that a service is going to shut down and does no longer accept new requests

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:31

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded**: ``"infoServiceFunctionAdded"``

send when a service provides a new function

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:29

___

### InfoServiceInit

• **InfoServiceInit**: ``"infoServiceInit"``

indicates that a service is booting

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:23

___

### InfoServiceNotReady

• **InfoServiceNotReady**: ``"infoServiceNotReady"``

indicates that a service is not able to process requests (e.g. db not available)

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:27

___

### InfoServiceReady

• **InfoServiceReady**: ``"infoServiceReady"``

indicates that a service is ready

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:25

___

### InfoServiceShutdown

• **InfoServiceShutdown**: ``"infoServiceShutdown"``

last event from service before service is destroyed

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:33

___

### InfoSubscriptionError

• **InfoSubscriptionError**: ``"infoSubscriptionError"``

a subscription function is throwing

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:37

## Service

• **Service**<`ConfigType`\>: `Object`

Base class for all services.
This class provides base functions to work with the event bridge, logging and so on

Every service should extend this class and should not directly access the eventbridge or other service

```typescript
class MyService extends Service {

  async start() {
    await super.start()
    // your custom implementation
  }

  async destroy() {
    // your custom implementation
   await super.destroy()
  }
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

#### Defined in

packages/core/lib/core/Service/Service.impl.d.ts:26

• **ServiceBaseClass**: `Object`

Class which contains basic functions that are not directly related to

- handling of messages
- handling of commands
- handling of subscriptions

#### Defined in

packages/core/lib/core/Service/ServiceBaseClass/ServiceBaseClass.impl.d.ts:17

• **ServiceClass**<`ConfigType`\>: `Object`

The ServiceClass interface

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ConfigType` | `unknown` \| `undefined` |

#### Defined in

packages/core/lib/core/types/ServiceClass.d.ts:9

### ServiceConstructorInput

Ƭ **ServiceConstructorInput**<`ConfigType`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `ConfigType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandDefinitionList` | [`CommandDefinitionList`](purista_k8s_sdk.internal.md#commanddefinitionlist)<`any`\> | the list of command definitions for this service |
| `config` | `ConfigType` | the service specific config |
| `configStore?` | [`ConfigStore`](../interfaces/purista_k8s_sdk.internal.ConfigStore.md) | the config store instance |
| `eventBridge` | [`EventBridge`](../interfaces/purista_k8s_sdk.internal.EventBridge.md) | the eventBridge instance |
| `info` | [`ServiceInfoType`](purista_k8s_sdk.internal.md#serviceinfotype) | the service info with name, version and description of service |
| `logger` | [`Logger`](../classes/purista_k8s_sdk.internal.Logger.md) | the logger instance |
| `secretStore?` | [`SecretStore`](../interfaces/purista_k8s_sdk.internal.SecretStore.md) | the secret store instance |
| `spanProcessor?` | `SpanProcessor` | the opentelemetry span processor instance |
| `stateStore?` | [`StateStore`](../interfaces/purista_k8s_sdk.internal.StateStore.md) | the state store instance |
| `subscriptionDefinitionList` | [`SubscriptionDefinitionList`](purista_k8s_sdk.internal.md#subscriptiondefinitionlist)<`any`\> | the list of subscription definitions for this service |

#### Defined in

packages/core/lib/core/types/ServiceConstructorInput.d.ts:13

___

### ServiceEventsInternal

Ƭ **ServiceEventsInternal**: `Object`

Events which can be emitted by a service.
Internal events are prefixed with `service-`.

Response messages, which have an event name assigned, are prefixed with `custom-`
If you like to use your own events, the event name must be prefixed with `misc-`.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `service-available` | `undefined` | emitted when the service is fully initialized and ready Should be emitted by custom service class. It is not emitted by default |
| `service-drain` | `undefined` | emitted when the service is going to be stopped |
| `service-handled-command-error` | { `commandName`: `string` ; `error`: [`HandledError`](../classes/purista_k8s_sdk.internal.HandledError.md) ; `traceId`: [`TraceId`](purista_k8s_sdk.internal.md#traceid)  } | emitted when a command throws a HandledError |
| `service-handled-command-error.commandName` | `string` | - |
| `service-handled-command-error.error` | [`HandledError`](../classes/purista_k8s_sdk.internal.HandledError.md) | - |
| `service-handled-command-error.traceId` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | - |
| `service-handled-subscription-error` | { `error`: [`HandledError`](../classes/purista_k8s_sdk.internal.HandledError.md) ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_k8s_sdk.internal.md#traceid)  } | emitted when a subscription throws a HandledError |
| `service-handled-subscription-error.error` | [`HandledError`](../classes/purista_k8s_sdk.internal.HandledError.md) | - |
| `service-handled-subscription-error.subscriptionName` | `string` | - |
| `service-handled-subscription-error.traceId` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | - |
| `service-not-available` | `undefined` \| `unknown` | emitted when the service is not available (for example database connection could not be established) |
| `service-started` | `undefined` | emitted when the service is started, but not fully initialized and not ready yet |
| `service-stopped` | `undefined` | emitted when the service has been stopped |
| `service-unhandled-command-error` | { `commandName`: `string` ; `error`: `unknown` ; `traceId`: [`TraceId`](purista_k8s_sdk.internal.md#traceid)  } | emitted when a command throws an error other than a HandledError |
| `service-unhandled-command-error.commandName` | `string` | - |
| `service-unhandled-command-error.error` | `unknown` | - |
| `service-unhandled-command-error.traceId` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | - |
| `service-unhandled-subscription-error` | { `error`: `unknown` ; `subscriptionName`: `string` ; `traceId`: [`TraceId`](purista_k8s_sdk.internal.md#traceid)  } | emitted when a subscription throws an error other than a HandledError |
| `service-unhandled-subscription-error.error` | `unknown` | - |
| `service-unhandled-subscription-error.subscriptionName` | `string` | - |
| `service-unhandled-subscription-error.traceId` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | - |

#### Defined in

packages/core/lib/core/types/ServiceEvents.d.ts:44

## Store

• **ConfigStore**: `Object`

Interface definition for config store adapters

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigStore.d.ts:9

• **SecretStore**: `Object`

Interface definition for a secret store implementation

#### Defined in

packages/core/lib/core/SecretStore/types/SecretStore.d.ts:8

• **StateStore**: `Object`

Interface definition for state store implementations

#### Defined in

packages/core/lib/core/StateStore/types/StateStore.d.ts:9

### ConfigDeleteFunction

Ƭ **ConfigDeleteFunction**: (`configName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`configName`): `Promise`<`void`\>

delete a config value from the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `configName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigDeleteFunction.d.ts:2

___

### ConfigGetterFunction

Ƭ **ConfigGetterFunction**: (...`configNames`: `string`[]) => `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Type declaration

▸ (`...configNames`): `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

get a config value from the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...configNames` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigGetterFunction.d.ts:2

___

### ConfigSetterFunction

Ƭ **ConfigSetterFunction**: (`secretName`: `string`, `secretValue`: `unknown`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a config value in the config store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `unknown` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/ConfigStore/types/ConfigSetterFunction.d.ts:2

___

### SecretDeleteFunction

Ƭ **SecretDeleteFunction**: (`secretName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`): `Promise`<`void`\>

delete a secret from the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretDeleteFunction.d.ts:2

___

### SecretGetterFunction

Ƭ **SecretGetterFunction**: (...`secretName`: `string`[]) => `Promise`<`Record`<`string`, `string` \| `undefined`\>\>

#### Type declaration

▸ (`...secretName`): `Promise`<`Record`<`string`, `string` \| `undefined`\>\>

get a secret from the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...secretName` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `string` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretGetterFunction.d.ts:2

___

### SecretSetterFunction

Ƭ **SecretSetterFunction**: (`secretName`: `string`, `secretValue`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a secret in the secret store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/SecretStore/types/SecretSetterFunction.d.ts:2

___

### StateDeleteFunction

Ƭ **StateDeleteFunction**: (`stateName`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`stateName`): `Promise`<`void`\>

delete a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateDeleteFunction.d.ts:2

___

### StateGetterFunction

Ƭ **StateGetterFunction**: (...`stateNames`: `string`[]) => `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Type declaration

▸ (`...stateNames`): `Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

get a state value from the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `...stateNames` | `string`[] |

##### Returns

`Promise`<`Record`<`string`, `unknown` \| `undefined`\>\>

#### Defined in

packages/core/lib/core/StateStore/types/StateGetterFunction.d.ts:2

___

### StateSetterFunction

Ƭ **StateSetterFunction**: (`secretName`: `string`, `secretValue`: `unknown`) => `Promise`<`void`\>

#### Type declaration

▸ (`secretName`, `secretValue`): `Promise`<`void`\>

set a state value in the state store

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretName` | `string` |
| `secretValue` | `unknown` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/StateStore/types/StateSetterFunction.d.ts:2

## Type Aliases

### Command

Ƭ **Command**<`PayloadType`, `ParameterType`\>: { `correlationId`: [`CorrelationId`](purista_k8s_sdk.internal.md#correlationid) ; `messageType`: [`Command`](../enums/purista_k8s_sdk.internal.EBMessageType.md#command) ; `payload`: { `parameter`: `ParameterType` ; `payload`: `PayloadType`  } ; `receiver`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_k8s_sdk.internal.md#ebmessagebase)

Command is a event bridge message, which is emitted by sender to event bridge.
The event bridge dispatches the event to the receiver.
A command expects to get a response message from receiver back to sender.

Also if there are subscriptions which are matching given command,
the event bridge also dispatches the command message to the subscriber(s).

BE AWARE:
Subscribers should not respond with command responses if they are "silent" subscribers/listeners.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/Command.d.ts:16

___

### CommandDefinitionList

Ƭ **CommandDefinitionList**<`ServiceClassType`\>: [`CommandDefinition`](purista_k8s_sdk.internal.md#commanddefinition)<`ServiceClassType`, [`CommandDefinitionMetadataBase`](purista_k8s_sdk.internal.md#commanddefinitionmetadatabase), `any`, `any`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinitionList.d.ts:11

___

### CommandDefinitionMetadataBase

Ƭ **CommandDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_k8s_sdk.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_k8s_sdk.internal.md#contenttype) ; `deprecated?`: `boolean` ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) |
| `expose.deprecated?` | `boolean` |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinitionMetadataBase.d.ts:3

___

### ContentType

Ƭ **ContentType**: ``"application/json"`` \| ``"application/javascript"`` \| ``"text/csv"`` \| ``"text/css"`` \| ``"text/html"`` \| ``"text/javascript"`` \| ``"text/markdown"`` \| ``"text/plain"`` \| ``"text/xml"`` \| `string`

List of content types for message payloads.
If the content type is other than `application/json`, the message payload must be a string.
It is up to the implementation to extract the content type from the original message and to convert or transform data.

#### Defined in

packages/core/lib/core/types/ContentType.d.ts:6

___

### ContextBase

Ƭ **ContextBase**: `Object`

The ContextBase provides is a basic type.
Each context for command function, subscription function and all Hooks and transformers will have at least the properties of this type.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `configs` | { `getConfig`: [`ConfigGetterFunction`](purista_k8s_sdk.internal.md#configgetterfunction) ; `removeConfig`: [`ConfigDeleteFunction`](purista_k8s_sdk.internal.md#configdeletefunction) ; `setConfig`: [`ConfigSetterFunction`](purista_k8s_sdk.internal.md#configsetterfunction)  } | the config store |
| `configs.getConfig` | [`ConfigGetterFunction`](purista_k8s_sdk.internal.md#configgetterfunction) | get a config value from the config store |
| `configs.removeConfig` | [`ConfigDeleteFunction`](purista_k8s_sdk.internal.md#configdeletefunction) | delete a config value from the config store |
| `configs.setConfig` | [`ConfigSetterFunction`](purista_k8s_sdk.internal.md#configsetterfunction) | set a config value in the config store |
| `logger` | [`Logger`](../classes/purista_k8s_sdk.internal.Logger.md) | the logger instance |
| `secrets` | { `getSecret`: [`SecretGetterFunction`](purista_k8s_sdk.internal.md#secretgetterfunction) ; `removeSecret`: [`SecretDeleteFunction`](purista_k8s_sdk.internal.md#secretdeletefunction) ; `setSecret`: [`SecretSetterFunction`](purista_k8s_sdk.internal.md#secretsetterfunction)  } | the secret store |
| `secrets.getSecret` | [`SecretGetterFunction`](purista_k8s_sdk.internal.md#secretgetterfunction) | get a secret from the secret store |
| `secrets.removeSecret` | [`SecretDeleteFunction`](purista_k8s_sdk.internal.md#secretdeletefunction) | delete a secret from the secret store |
| `secrets.setSecret` | [`SecretSetterFunction`](purista_k8s_sdk.internal.md#secretsetterfunction) | set a secret in the secret store |
| `startActiveSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `context`: `Context` \| `undefined`, `fn`: (`span`: `Span`) => `Promise`<`F`\>) => `Promise`<`F`\> | wrap given function in an opentelemetry active span |
| `states` | { `getState`: [`StateGetterFunction`](purista_k8s_sdk.internal.md#stategetterfunction) ; `removeState`: [`StateDeleteFunction`](purista_k8s_sdk.internal.md#statedeletefunction) ; `setState`: [`StateSetterFunction`](purista_k8s_sdk.internal.md#statesetterfunction)  } | the state store |
| `states.getState` | [`StateGetterFunction`](purista_k8s_sdk.internal.md#stategetterfunction) | get a state value from the state store |
| `states.removeState` | [`StateDeleteFunction`](purista_k8s_sdk.internal.md#statedeletefunction) | delete a state value from the state store |
| `states.setState` | [`StateSetterFunction`](purista_k8s_sdk.internal.md#statesetterfunction) | set a state value in the state store |
| `wrapInSpan` | <F\>(`name`: `string`, `opts`: `SpanOptions`, `fn`: (`span`: `Span`) => `Promise`<`F`\>, `context?`: `Context`) => `Promise`<`F`\> | wrap given function in an opentelemetry span |

#### Defined in

packages/core/lib/core/types/ContextBase.d.ts:10

___

### CorrelationId

Ƭ **CorrelationId**: `string`

the correlation id links the command invocation message with the command response message

#### Defined in

packages/core/lib/core/types/CorrelationId.d.ts:2

___

### CustomEvents

Ƭ **CustomEvents**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

packages/core/lib/core/types/ServiceEvents.d.ts:84

___

### CustomMessage

Ƭ **CustomMessage**<`Payload`\>: { `eventName`: `string` ; `messageType`: [`CustomMessage`](../enums/purista_k8s_sdk.internal.EBMessageType.md#custommessage) ; `payload?`: `Payload` ; `receiver?`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_k8s_sdk.internal.md#ebmessagebase)

A custom message is a message which can be used to pass business information.
The producer emits the message without knowledge about any consumer.
The producer does not expect a response from a consumer.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

#### Defined in

packages/core/lib/core/types/CustomMessage.d.ts:9

___

### DefinitionEventBridgeConfig

Ƭ **DefinitionEventBridgeConfig**: `Object`

Settings and advices for the event bridge, which are set in the command or subscription builder.
The properties are advices and hints.
It depends on the used event bridge implementation and underlaying message broker, if a specific property can be respected.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoacknowledge?` | `boolean` | Send the acknowledge to message broker as soon as the message arrives - defaults to true for commands - defaults to false for subscriptions |
| `durable?` | `boolean` | Advise the underlaying message broker to store messages if no consumer is available. Messages will be send as soon as the service is able to consume. |
| `shared?` | `boolean` | If set to true, the event bridge is adviced to deliver one message to at least one consumer instance. True is the default value. If set to false, the event bridge is adviced to deliver one message to all consumer instances. Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync. In serverless environments, this flag should not have any effect **`Default`** true |

#### Defined in

packages/core/lib/core/types/DefinitionEventBridgeConfig.d.ts:6

___

### EBMessage

Ƭ **EBMessage**: [`Command`](purista_k8s_sdk.internal.md#command-1) \| [`CommandResponse`](purista_k8s_sdk.internal.md#commandresponse) \| [`InfoMessage`](purista_k8s_sdk.internal.md#infomessage) \| [`CustomMessage`](purista_k8s_sdk.internal.md#custommessage-1)

EBMessage is some message which is handled by the event bridge.

#### Defined in

packages/core/lib/core/types/EBMessage.d.ts:7

___

### EBMessageAddress

Ƭ **EBMessageAddress**: `Object`

A event bridge message address describes the sender or receiver of a message.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceName` | `string` | the name of the service |
| `serviceTarget` | `string` | the name of the command or subscription |
| `serviceVersion` | `string` | the version of the service |

#### Defined in

packages/core/lib/core/types/EBMessageAddress.d.ts:4

___

### EBMessageBase

Ƭ **EBMessageBase**: `Object`

Default fields which are part of any purista message

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentEncoding` | `string` | content encoding of message payload |
| `contentType` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) | content type of message payload |
| `correlationId?` | [`CorrelationId`](purista_k8s_sdk.internal.md#correlationid) | correlation id to know which command response referrs to which command |
| `eventName?` | `string` | event name for this message |
| `id` | [`EBMessageId`](purista_k8s_sdk.internal.md#ebmessageid) | global unique id of message |
| `instanceId` | [`InstanceId`](purista_k8s_sdk.internal.md#instanceid) | instance id of eventbridge which was creating the message |
| `otp?` | `string` | stringified Opentelemetry parent trace id |
| `principalId?` | [`PrincipalId`](purista_k8s_sdk.internal.md#principalid) | principal id |
| `timestamp` | `number` | timestamp of message creation time |
| `traceId?` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | trace id of message |

#### Defined in

packages/core/lib/core/types/EBMessageBase.d.ts:10

___

### EBMessageId

Ƭ **EBMessageId**: `string`

Unique id of the event bridge message

#### Defined in

packages/core/lib/core/types/EBMessageId.d.ts:4

___

### EmitCustomMessageFunction

Ƭ **EmitCustomMessageFunction**: <Payload\>(`eventName`: `string`, `payload?`: `Payload`, `contentType?`: [`ContentType`](purista_k8s_sdk.internal.md#contenttype), `contentEncoding?`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ <`Payload`\>(`eventName`, `payload?`, `contentType?`, `contentEncoding?`): `Promise`<`void`\>

Emits the given payload as custom message with the given event name.

**`Example`**

```typescript
await emit('my-custom-event-name', { the: 'payload' })
```

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Payload` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `payload?` | `Payload` |
| `contentType?` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) |
| `contentEncoding?` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/EmitCustomMessageFunction.d.ts:9

___

### ErrorResponsePayload

Ƭ **ErrorResponsePayload**: `Object`

Error message payload

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | addition data |
| `message` | `string` | a human readable error message |
| `status` | [`StatusCode`](../enums/purista_k8s_sdk.internal.StatusCode.md) | the error status code |
| `traceId?` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) | the trace if of the request |

#### Defined in

packages/core/lib/core/types/ErrorResponsePayload.d.ts:6

___

### EventKey

Ƭ **EventKey**<`T`\>: `string` & keyof `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](purista_k8s_sdk.internal.md#eventmap) |

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:2

___

### EventMap

Ƭ **EventMap**: `Record`<`string`, `any`\>

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:1

___

### EventReceiver

Ƭ **EventReceiver**<`T`\>: (`parameter`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`parameter`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parameter` | `T` |

##### Returns

`void`

#### Defined in

packages/core/lib/core/types/GenericEventEmitter.d.ts:3

___

### InfoInvokeTimeout

Ƭ **InfoInvokeTimeout**: { `messageType`: [`InfoInvokeTimeout`](purista_k8s_sdk.internal.md#infoinvoketimeout)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoInvokeTimeout.d.ts:20

___

### InfoMessage

Ƭ **InfoMessage**: [`InfoServiceDrain`](purista_k8s_sdk.internal.md#infoservicedrain-1) \| [`InfoServiceFunctionAdded`](purista_k8s_sdk.internal.md#infoservicefunctionadded-1) \| [`InfoServiceInit`](purista_k8s_sdk.internal.md#infoserviceinit-1) \| [`InfoServiceNotReady`](purista_k8s_sdk.internal.md#infoservicenotready-1) \| [`InfoServiceReady`](purista_k8s_sdk.internal.md#infoserviceready-1) \| [`InfoServiceShutdown`](purista_k8s_sdk.internal.md#infoserviceshutdown-1) \| [`InfoInvokeTimeout`](purista_k8s_sdk.internal.md#infoinvoketimeout-1) \| [`InfoSubscriptionError`](purista_k8s_sdk.internal.md#infosubscriptionerror-1)

#### Defined in

packages/core/lib/core/types/infoType/InfoMessage.d.ts:10

___

### InfoMessageType

Ƭ **InfoMessageType**: [`InfoServiceDrain`](purista_k8s_sdk.internal.md#infoservicedrain) \| [`InfoServiceFunctionAdded`](purista_k8s_sdk.internal.md#infoservicefunctionadded) \| [`InfoServiceInit`](purista_k8s_sdk.internal.md#infoserviceinit) \| [`InfoServiceNotReady`](purista_k8s_sdk.internal.md#infoservicenotready) \| [`InfoServiceReady`](purista_k8s_sdk.internal.md#infoserviceready) \| [`InfoServiceShutdown`](purista_k8s_sdk.internal.md#infoserviceshutdown) \| [`InfoInvokeTimeout`](purista_k8s_sdk.internal.md#infoinvoketimeout) \| [`InfoSubscriptionError`](purista_k8s_sdk.internal.md#infosubscriptionerror)

#### Defined in

packages/core/lib/core/types/infoType/InfoMessage.d.ts:11

___

### InfoServiceBase

Ƭ **InfoServiceBase**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `payload?`: `unknown` ; `sender`: { `serviceName`: `string` ; `serviceTarget`: `string` ; `serviceVersion`: `string`  }  } & [`EBMessageBase`](purista_k8s_sdk.internal.md#ebmessagebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceBase.d.ts:2

___

### InfoServiceDrain

Ƭ **InfoServiceDrain**: { `messageType`: [`InfoServiceDrain`](purista_k8s_sdk.internal.md#infoservicedrain)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceDrain.d.ts:3

___

### InfoServiceFunctionAdded

Ƭ **InfoServiceFunctionAdded**: { `messageType`: [`InfoServiceFunctionAdded`](purista_k8s_sdk.internal.md#infoservicefunctionadded)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceFunctionAdded.d.ts:3

___

### InfoServiceInit

Ƭ **InfoServiceInit**: { `messageType`: [`InfoServiceInit`](purista_k8s_sdk.internal.md#infoserviceinit)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceInit.d.ts:3

___

### InfoServiceNotReady

Ƭ **InfoServiceNotReady**: { `messageType`: [`InfoServiceNotReady`](purista_k8s_sdk.internal.md#infoservicenotready)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceNotReady.d.ts:3

___

### InfoServiceReady

Ƭ **InfoServiceReady**: { `messageType`: [`InfoServiceReady`](purista_k8s_sdk.internal.md#infoserviceready)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceReady.d.ts:3

___

### InfoServiceShutdown

Ƭ **InfoServiceShutdown**: { `messageType`: [`InfoServiceShutdown`](purista_k8s_sdk.internal.md#infoserviceshutdown)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoServiceShutdown.d.ts:3

___

### InfoSubscriptionError

Ƭ **InfoSubscriptionError**: { `messageType`: [`InfoSubscriptionError`](purista_k8s_sdk.internal.md#infosubscriptionerror)  } & [`InfoServiceBase`](purista_k8s_sdk.internal.md#infoservicebase)

#### Defined in

packages/core/lib/core/types/infoType/InfoSubscriptionError.d.ts:3

___

### InstanceId

Ƭ **InstanceId**: `string`

the instance id of the event bridge

#### Defined in

packages/core/lib/core/types/InstanceId.d.ts:2

___

### InvokeFunction

Ƭ **InvokeFunction**: <InvokeResponseType, PayloadType, ParameterType\>(`address`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress), `payload`: `PayloadType`, `parameter`: `ParameterType`) => `Promise`<`InvokeResponseType`\>

#### Type declaration

▸ <`InvokeResponseType`, `PayloadType`, `ParameterType`\>(`address`, `payload`, `parameter`): `Promise`<`InvokeResponseType`\>

Invokes a command and returns the result.
It is recommended to validate the result against a schema which only contains the data you actually need.

**`Example`**

```typescript

const address: EBMessageAddress = {
  serviceName: 'name-of-service-to-invoke',
  serviceVersion: '1',
  serviceTarget: 'command-name-to-invoke',
}

const inputPayload = { my: 'input' }
const inputParameter = { search: 'for_me' }

const result = await invoke<MyResultType>(address, inputPayload inputParameter )

##### Type parameters

| Name | Type |
| :------ | :------ |
| `InvokeResponseType` | `unknown` |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) |
| `payload` | `PayloadType` |
| `parameter` | `ParameterType` |

##### Returns

`Promise`<`InvokeResponseType`\>

#### Defined in

packages/core/lib/core/types/InvokeFunction.d.ts:19

___

### LogFnParamType

Ƭ **LogFnParamType**: [`unknown`, string?, ...any] \| [`string`, ...any]

#### Defined in

packages/core/lib/core/types/Logger.d.ts:15

___

### LoggerOptions

Ƭ **LoggerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hostname?` | `string` |
| `instanceId?` | [`InstanceId`](purista_k8s_sdk.internal.md#instanceid) |
| `name?` | `string` |
| `principalId?` | [`PrincipalId`](purista_k8s_sdk.internal.md#principalid) |
| `puristaVersion?` | `string` |
| `serviceName?` | `string` |
| `serviceTarget?` | `string` |
| `serviceVersion?` | `string` |
| `traceId?` | [`TraceId`](purista_k8s_sdk.internal.md#traceid) |

#### Defined in

packages/core/lib/core/types/Logger.d.ts:4

___

### PrincipalId

Ƭ **PrincipalId**: `string`

the principal id

#### Defined in

packages/core/lib/core/types/PrincipalId.d.ts:2

___

### ServiceEvents

Ƭ **ServiceEvents**: [`ServiceEventsInternal`](purista_k8s_sdk.internal.md#serviceeventsinternal) & [`addPrefixToObject`](purista_k8s_sdk.internal.md#addprefixtoobject)<[`CustomEvents`](purista_k8s_sdk.internal.md#customevents), ``"custom-"``\> & [`addPrefixToObject`](purista_k8s_sdk.internal.md#addprefixtoobject)<[`CustomEvents`](purista_k8s_sdk.internal.md#customevents), ``"misc-"``\>

ServiceEvents are plain javascript events sent by the service.
There are three types:
- technical events when a services starts, stops, an error occurs and so on are prefixed with `service-`
- response messages, which have a event name assigned, are prefixed with `custom-`
- additional events, free defined by developer are prefixed with `misc-`

#### Defined in

packages/core/lib/core/types/ServiceEvents.d.ts:94

___

### ServiceInfoType

Ƭ **ServiceInfoType**: `Object`

General service information

#### Type declaration

| Name | Type |
| :------ | :------ |
| `serviceDescription` | `string` |
| `serviceName` | `string` |
| `serviceVersion` | `string` |

#### Defined in

packages/core/lib/core/types/infoType/ServiceInfoType.d.ts:4

___

### SubscriptionDefinitionList

Ƭ **SubscriptionDefinitionList**<`ServiceClassType`\>: [`SubscriptionDefinition`](purista_k8s_sdk.internal.md#subscriptiondefinition)<`ServiceClassType`, `any`, `any`, `any`, `any`\>[]

Helper type for creating list of service commands to be passed as input to service class

```typescript
export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinitionList.d.ts:10

___

### SubscriptionDefinitionMetadataBase

Ƭ **SubscriptionDefinitionMetadataBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expose` | { `contentEncodingRequest?`: `string` ; `contentEncodingResponse?`: `string` ; `contentTypeRequest?`: [`ContentType`](purista_k8s_sdk.internal.md#contenttype) ; `contentTypeResponse?`: [`ContentType`](purista_k8s_sdk.internal.md#contenttype) ; `inputPayload?`: `SchemaObject` ; `outputPayload?`: `SchemaObject` ; `parameter?`: `SchemaObject`  } |
| `expose.contentEncodingRequest?` | `string` |
| `expose.contentEncodingResponse?` | `string` |
| `expose.contentTypeRequest?` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) |
| `expose.contentTypeResponse?` | [`ContentType`](purista_k8s_sdk.internal.md#contenttype) |
| `expose.inputPayload?` | `SchemaObject` |
| `expose.outputPayload?` | `SchemaObject` |
| `expose.parameter?` | `SchemaObject` |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinitionMetadataBase.d.ts:3

___

### TraceId

Ƭ **TraceId**: `string`

The trace id which will be passed through all commands, invocations and subscriptions

#### Defined in

packages/core/lib/core/types/TraceId.d.ts:4

___

### addPrefixToObject

Ƭ **addPrefixToObject**<`T`, `P`\>: { [K in keyof T as K extends string ? \`${P}${K}\` : never]: T[K] }

Helper for better typescript type.
All keys of given object must start with the given prefix. Otherwise Typescript will complain.

```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `string` |

#### Defined in

packages/core/lib/core/types/addPrefixToObject.d.ts:7

## Command

### CommandAfterGuardHook

Ƭ **CommandAfterGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `result`: `Readonly`<`FunctionResultType`\>, `input`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionResultType` | `unknown` |
| `FunctionPayloadType` | `unknown` |
| `FunctionParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `input`, `parameter`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `result` | `Readonly`<`FunctionResultType`\> |
| `input` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandAfterGuardHook.d.ts:9

___

### CommandBeforeGuardHook

Ƭ **CommandBeforeGuardHook**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandBeforeGuardHook.d.ts:10

___

### CommandDefinition

Ƭ **CommandDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a command provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MetadataType` | [`CommandDefinitionMetadataBase`](purista_k8s_sdk.internal.md#commanddefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`CommandFunction`](purista_k8s_sdk.internal.md#commandfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> | the command function |
| `commandDescription` | `string` | the description of the command |
| `commandName` | `string` | the name of the command |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_k8s_sdk.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the eventName for the command response |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`CommandAfterGuardHook`](purista_k8s_sdk.internal.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`CommandBeforeGuardHook`](purista_k8s_sdk.internal.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`CommandTransformInputHook`](purista_k8s_sdk.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`CommandTransformOutputHook`](purista_k8s_sdk.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of command |
| `hooks.afterGuard?` | `Record`<`string`, [`CommandAfterGuardHook`](purista_k8s_sdk.internal.md#commandafterguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`CommandBeforeGuardHook`](purista_k8s_sdk.internal.md#commandbeforeguardhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`CommandTransformInputHook`](purista_k8s_sdk.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`CommandTransformInputHook`](purista_k8s_sdk.internal.md#commandtransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`CommandTransformOutputHook`](purista_k8s_sdk.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`CommandTransformOutputHook`](purista_k8s_sdk.internal.md#commandtransformoutputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `FunctionParamsType`, `unknown`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `metadata` | `MetadataType` | the metadata of the command |

#### Defined in

packages/core/lib/core/types/commandType/CommandDefinition.d.ts:15

___

### CommandErrorResponse

Ƭ **CommandErrorResponse**: { `contentEncoding`: ``"utf-8"`` ; `contentType`: ``"application/json"`` ; `correlationId`: [`CorrelationId`](purista_k8s_sdk.internal.md#correlationid) ; `isHandledError`: `boolean` ; `messageType`: [`CommandErrorResponse`](../enums/purista_k8s_sdk.internal.EBMessageType.md#commanderrorresponse) ; `payload`: { `data?`: `unknown` ; `message`: `string` ; `status`: [`StatusCode`](../enums/purista_k8s_sdk.internal.StatusCode.md)  } ; `receiver`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_k8s_sdk.internal.md#ebmessagebase)

CommandErrorResponse is a response to a specific previously received command which indicates some failure.

#### Defined in

packages/core/lib/core/types/commandType/CommandErrorResponse.d.ts:11

___

### CommandFunction

Ƭ **CommandFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`FunctionResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandFunctionContext`](purista_k8s_sdk.internal.md#commandfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandFunction.d.ts:8

___

### CommandFunctionContext

Ƭ **CommandFunctionContext**<`MessagePayloadType`, `MessageParamsType`\>: [`ContextBase`](purista_k8s_sdk.internal.md#contextbase) & [`CommandFunctionContextEnhancements`](purista_k8s_sdk.internal.md#commandfunctioncontextenhancements)<`MessagePayloadType`, `MessageParamsType`\>

The command function context which will be passed into command function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandFunctionContext.d.ts:43

___

### CommandFunctionContextEnhancements

Ƭ **CommandFunctionContextEnhancements**<`MessagePayloadType`, `MessageParamsType`\>: `Object`

It provides the original command message with types for payload and parameter.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emit` | [`EmitCustomMessageFunction`](purista_k8s_sdk.internal.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_k8s_sdk.internal.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) |
| `message` | `Readonly`<[`Command`](purista_k8s_sdk.internal.md#command-1)<`MessagePayloadType`, `MessageParamsType`\>\> | the original message |

#### Defined in

packages/core/lib/core/types/commandType/CommandFunctionContext.d.ts:14

___

### CommandResponse

Ƭ **CommandResponse**<`T`\>: [`CommandSuccessResponse`](purista_k8s_sdk.internal.md#commandsuccessresponse-1)<`T`\> \| [`CommandErrorResponse`](purista_k8s_sdk.internal.md#commanderrorresponse-1)

CommandResponse is a response to a specific previously received command which can be either a success or failure

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandResponse.d.ts:8

___

### CommandSuccessResponse

Ƭ **CommandSuccessResponse**<`PayloadType`\>: { `correlationId`: [`CorrelationId`](purista_k8s_sdk.internal.md#correlationid) ; `messageType`: [`CommandSuccessResponse`](purista_k8s_sdk.internal.md#commandsuccessresponse) ; `payload`: `PayloadType` ; `receiver`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) ; `sender`: [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress)  } & [`EBMessageBase`](purista_k8s_sdk.internal.md#ebmessagebase)

CommandSuccessResponse is a response to a specific previously received command.
It indicates that the command was executed successfully and contains the result payload

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |

#### Defined in

packages/core/lib/core/types/commandType/CommandSuccessResponse.d.ts:11

___

### CommandTransformFunctionContext

Ƭ **CommandTransformFunctionContext**<`PayloadType`, `ParameterType`\>: [`ContextBase`](purista_k8s_sdk.internal.md#contextbase) & { `message`: `Readonly`<[`Command`](purista_k8s_sdk.internal.md#command-1)<`PayloadType`, `ParameterType`\>\>  }

#### Type parameters

| Name |
| :------ |
| `PayloadType` |
| `ParameterType` |

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformFunctionContext.d.ts:6

___

### CommandTransformInputHook

Ƭ **CommandTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_k8s_sdk.internal.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\>, `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

The command transform gets the raw message payload and parameter input, which is validated against the transform input schemas.
The command transform function is called before guard hooks and before the actual command function.

It should throw HandledError or return an object with the transformed payload and parameter.
The type of returned payload and parameter must match the command function input for payload and parameter

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandTransformFunctionContext`](purista_k8s_sdk.internal.md#commandtransformfunctioncontext)<`PayloadInput`, `ParamsInput`\> |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformInputHook.d.ts:11

___

### CommandTransformOutputHook

Ƭ **CommandTransformOutputHook**<`ServiceClassType`, `MessagePayloadType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`CommandTransformFunctionContext`](purista_k8s_sdk.internal.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\>, `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `MessagePayloadType` | `MessagePayloadType` |
| `MessageResultType` | `MessageResultType` |
| `MessageParamsType` | `MessageParamsType` |
| `ResponseOutput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`ResponseOutput`\>

This transform hook is executed after function output validation and AfterGuardHooks.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`CommandTransformFunctionContext`](purista_k8s_sdk.internal.md#commandtransformfunctioncontext)<`MessagePayloadType`, `MessageParamsType`\> |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

packages/core/lib/core/types/commandType/CommandTransformOutputHook.d.ts:6

## Subscription

### Subscription

Ƭ **Subscription**<`PayloadType`, `ParameterType`\>: `Object`

A subscription managed by the event bridge

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | `unknown` |
| `ParameterType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitEventName?` | `string` | the event name to be used for custom message if the subscriptions returns a result |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_k8s_sdk.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | the event name to subscribe for |
| `instanceId?` | [`InstanceId`](purista_k8s_sdk.internal.md#instanceid) | the principal id |
| `messageType?` | [`EBMessageType`](../enums/purista_k8s_sdk.internal.EBMessageType.md) | the message type |
| `payload?` | { `parameter?`: `ParameterType` ; `payload?`: `PayloadType`  } | the message payload |
| `payload.parameter?` | `ParameterType` | - |
| `payload.payload?` | `PayloadType` | - |
| `principalId?` | [`PrincipalId`](purista_k8s_sdk.internal.md#principalid) | the principal id |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the consumer address of the message |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | the producer address of the message |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriber` | [`EBMessageAddress`](purista_k8s_sdk.internal.md#ebmessageaddress) | the address of the subscription (service name, version and subscription name) |

#### Defined in

packages/core/lib/core/types/subscription/Subscription.d.ts:11

___

### SubscriptionAfterGuardHook

Ƭ **SubscriptionAfterGuardHook**<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadOutputType`, `FunctionParameterType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext), `result`: `Readonly`<`FunctionResultType`\>, `payload`: `Readonly`<`FunctionPayloadOutputType`\>, `parameter`: `Readonly`<`FunctionParameterType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `FunctionResultType` | `unknown` |
| `FunctionPayloadOutputType` | `unknown` |
| `FunctionParameterType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `result`, `payload`, `parameter`): `Promise`<`void`\>

Definition of after guard hook functions.
This guard is called after function successfully returns and after output validation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext) |
| `result` | `Readonly`<`FunctionResultType`\> |
| `payload` | `Readonly`<`FunctionPayloadOutputType`\> |
| `parameter` | `Readonly`<`FunctionParameterType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionAfterGuardHook.d.ts:9

___

### SubscriptionBeforeGuardHook

Ƭ **SubscriptionBeforeGuardHook**<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `FunctionPayloadType` | `unknown` |
| `FunctionParamsType` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`void`\>

Guard is called after command function input validation and before executing the command function.
The guard is usefull to separate for example auth checks from business logic.
It should throw HandledError or return void.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionBeforeGuardHook.d.ts:10

___

### SubscriptionDefinition

Ƭ **SubscriptionDefinition**<`ServiceClassType`, `MetadataType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: `Object`

The definition for a subscription provided by some service.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) = [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MetadataType` | [`SubscriptionDefinitionMetadataBase`](purista_k8s_sdk.internal.md#subscriptiondefinitionmetadatabase) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `MessageResultType` | `unknown` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `MessageResultType` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`SubscriptionFunction`](purista_k8s_sdk.internal.md#subscriptionfunction)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `MessagePayloadType`, `MessageParamsType`, `MessageResultType`\> | the subscription function |
| `emitEventName?` | `string` | event name to be used for custom message if the subscription functions returns value |
| `eventBridgeConfig` | [`DefinitionEventBridgeConfig`](purista_k8s_sdk.internal.md#definitioneventbridgeconfig) | config information for event bridge |
| `eventName?` | `string` | filter forevent name |
| `hooks` | { `afterGuard?`: `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_k8s_sdk.internal.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `beforeGuard?`: `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_k8s_sdk.internal.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> ; `transformInput?`: { `transformFunction`: [`SubscriptionTransformInputHook`](purista_k8s_sdk.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } ; `transformOutput?`: { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_k8s_sdk.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  }  } | hooks of subscription |
| `hooks.afterGuard?` | `Record`<`string`, [`SubscriptionAfterGuardHook`](purista_k8s_sdk.internal.md#subscriptionafterguardhook)<`ServiceClassType`, `FunctionResultType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.beforeGuard?` | `Record`<`string`, [`SubscriptionBeforeGuardHook`](purista_k8s_sdk.internal.md#subscriptionbeforeguardhook)<`ServiceClassType`, `FunctionPayloadType`, `FunctionParamsType`\>\> | - |
| `hooks.transformInput?` | { `transformFunction`: [`SubscriptionTransformInputHook`](purista_k8s_sdk.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> ; `transformInputSchema`: `z.ZodType` ; `transformParameterSchema`: `z.ZodType`  } | - |
| `hooks.transformInput.transformFunction` | [`SubscriptionTransformInputHook`](purista_k8s_sdk.internal.md#subscriptiontransforminputhook)<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`\> | - |
| `hooks.transformInput.transformInputSchema` | `z.ZodType` | - |
| `hooks.transformInput.transformParameterSchema` | `z.ZodType` | - |
| `hooks.transformOutput?` | { `transformFunction`: [`SubscriptionTransformOutputHook`](purista_k8s_sdk.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> ; `transformOutputSchema`: `z.ZodType`  } | - |
| `hooks.transformOutput.transformFunction` | [`SubscriptionTransformOutputHook`](purista_k8s_sdk.internal.md#subscriptiontransformoutputhook)<`ServiceClassType`, `FunctionResultType`, `FunctionParamsType`, `any`\> | - |
| `hooks.transformOutput.transformOutputSchema` | `z.ZodType` | - |
| `instanceId?` | [`InstanceId`](purista_k8s_sdk.internal.md#instanceid) | filter for instance id |
| `messageType?` | [`EBMessageType`](../enums/purista_k8s_sdk.internal.EBMessageType.md) | filter for message type |
| `metadata` | `MetadataType` | the metadata of the subscription |
| `principalId?` | [`PrincipalId`](purista_k8s_sdk.internal.md#principalid) | filter for principal id |
| `receiver?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages consumed by given receiver |
| `receiver.serviceName?` | `string` | - |
| `receiver.serviceTarget?` | `string` | - |
| `receiver.serviceVersion?` | `string` | - |
| `sender?` | { `serviceName?`: `string` ; `serviceTarget?`: `string` ; `serviceVersion?`: `string`  } | filter for messages produced by given sender |
| `sender.serviceName?` | `string` | - |
| `sender.serviceTarget?` | `string` | - |
| `sender.serviceVersion?` | `string` | - |
| `subscriptionDescription` | `string` | the description of the subscription |
| `subscriptionName` | `string` | the name of the subscription |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionDefinition.d.ts:18

___

### SubscriptionFunction

Ƭ **SubscriptionFunction**<`ServiceClassType`, `MessagePayloadType`, `MessageParamsType`, `FunctionPayloadType`, `FunctionParamsType`, `FunctionResultType`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext), `payload`: `Readonly`<`FunctionPayloadType`\>, `parameter`: `Readonly`<`FunctionParamsType`\>) => `Promise`<`FunctionResultType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | extends [`ServiceClass`](../interfaces/purista_k8s_sdk.internal.ServiceClass.md) |
| `MessagePayloadType` | `unknown` |
| `MessageParamsType` | `undefined` |
| `FunctionPayloadType` | `MessagePayloadType` |
| `FunctionParamsType` | `MessageParamsType` |
| `FunctionResultType` | `undefined` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`FunctionResultType`\>

CommandFunction is a function which will be triggered when a matching event bridge message is received by the service

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionFunctionContext`](purista_k8s_sdk.internal.md#subscriptionfunctioncontext) |
| `payload` | `Readonly`<`FunctionPayloadType`\> |
| `parameter` | `Readonly`<`FunctionParamsType`\> |

##### Returns

`Promise`<`FunctionResultType`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunction.d.ts:8

___

### SubscriptionFunctionContext

Ƭ **SubscriptionFunctionContext**: [`ContextBase`](purista_k8s_sdk.internal.md#contextbase) & [`SubscriptionFunctionContextEnhancements`](purista_k8s_sdk.internal.md#subscriptionfunctioncontextenhancements)

The subscription function context which will be passed into subscription function.

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunctionContext.d.ts:43

___

### SubscriptionFunctionContextEnhancements

Ƭ **SubscriptionFunctionContextEnhancements**: `Object`

It provides the original command message.
Also, the methods:

- `emit` which allows to emit custom events to the event bridge
- `invoke` which allows to call other commands

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `emit` | [`EmitCustomMessageFunction`](purista_k8s_sdk.internal.md#emitcustommessagefunction) | emit a custom message |
| `invoke` | [`InvokeFunction`](purista_k8s_sdk.internal.md#invokefunction) | Invokes a command and returns the result. It is recommended to validate the result against a schema which only contains the data you actually need. **`Example`** ```typescript const address: EBMessageAddress = { serviceName: 'name-of-service-to-invoke', serviceVersion: '1', serviceTarget: 'command-name-to-invoke', } const inputPayload = { my: 'input' } const inputParameter = { search: 'for_me' } const result = await invoke<MyResultType>(address, inputPayload inputParameter ) |
| `message` | `Readonly`<[`EBMessage`](purista_k8s_sdk.internal.md#ebmessage)\> | the original message |

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionFunctionContext.d.ts:14

___

### SubscriptionTransformFunctionContext

Ƭ **SubscriptionTransformFunctionContext**: [`ContextBase`](purista_k8s_sdk.internal.md#contextbase) & { `message`: `Readonly`<[`EBMessage`](purista_k8s_sdk.internal.md#ebmessage)\>  }

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformFunctionContext.d.ts:6

___

### SubscriptionTransformInputHook

Ƭ **SubscriptionTransformInputHook**<`ServiceClassType`, `PayloadOutput`, `ParamsOutput`, `PayloadInput`, `ParamsInput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_k8s_sdk.internal.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`PayloadInput`\>, `parameter`: `Readonly`<`ParamsInput`\>) => `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `PayloadOutput` | `unknown` |
| `ParamsOutput` | `unknown` |
| `PayloadInput` | `unknown` |
| `ParamsInput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionTransformFunctionContext`](purista_k8s_sdk.internal.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`PayloadInput`\> |
| `parameter` | `Readonly`<`ParamsInput`\> |

##### Returns

`Promise`<{ `parameter`: `Readonly`<`ParamsOutput`\> ; `payload`: `Readonly`<`PayloadOutput`\>  }\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformInputHook.d.ts:5

___

### SubscriptionTransformOutputHook

Ƭ **SubscriptionTransformOutputHook**<`ServiceClassType`, `MessageResultType`, `MessageParamsType`, `ResponseOutput`\>: (`this`: `ServiceClassType`, `context`: [`SubscriptionTransformFunctionContext`](purista_k8s_sdk.internal.md#subscriptiontransformfunctioncontext), `payload`: `Readonly`<`MessageResultType`\>, `parameter`: `Readonly`<`MessageParamsType`\>) => `Promise`<`ResponseOutput`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ServiceClassType` | `ServiceClassType` |
| `MessageResultType` | `unknown` |
| `MessageParamsType` | `unknown` |
| `ResponseOutput` | `unknown` |

#### Type declaration

▸ (`this`, `context`, `payload`, `parameter`): `Promise`<`ResponseOutput`\>

This transform hook is executed after function output validation and AfterGuardHooks.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ServiceClassType` |
| `context` | [`SubscriptionTransformFunctionContext`](purista_k8s_sdk.internal.md#subscriptiontransformfunctioncontext) |
| `payload` | `Readonly`<`MessageResultType`\> |
| `parameter` | `Readonly`<`MessageParamsType`\> |

##### Returns

`Promise`<`ResponseOutput`\>

#### Defined in

packages/core/lib/core/types/subscription/SubscriptionTransformOutputHook.d.ts:7
