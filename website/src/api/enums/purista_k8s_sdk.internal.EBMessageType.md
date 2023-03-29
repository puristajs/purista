[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / EBMessageType

# Enumeration: EBMessageType

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).EBMessageType

Type of event bridge message

## Table of contents

### Enumeration Members

- [Command](purista_k8s_sdk.internal.EBMessageType.md#command)
- [CommandErrorResponse](purista_k8s_sdk.internal.EBMessageType.md#commanderrorresponse)
- [CommandSuccessResponse](purista_k8s_sdk.internal.EBMessageType.md#commandsuccessresponse)
- [CustomMessage](purista_k8s_sdk.internal.EBMessageType.md#custommessage)
- [InfoInvokeTimeout](purista_k8s_sdk.internal.EBMessageType.md#infoinvoketimeout)
- [InfoServiceDrain](purista_k8s_sdk.internal.EBMessageType.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_k8s_sdk.internal.EBMessageType.md#infoservicefunctionadded)
- [InfoServiceInit](purista_k8s_sdk.internal.EBMessageType.md#infoserviceinit)
- [InfoServiceNotReady](purista_k8s_sdk.internal.EBMessageType.md#infoservicenotready)
- [InfoServiceReady](purista_k8s_sdk.internal.EBMessageType.md#infoserviceready)
- [InfoServiceShutdown](purista_k8s_sdk.internal.EBMessageType.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_k8s_sdk.internal.EBMessageType.md#infosubscriptionerror)

## Enumeration Members

### Command

• **Command** = ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse** = ``"commandErrorResponse"``

a error response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:15

___

### CommandSuccessResponse

• **CommandSuccessResponse** = ``"commandSuccessResponse"``

a success response from receiver of a command message

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:13

___

### CustomMessage

• **CustomMessage** = ``"customMessage"``

a custom message / custom event

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:39

___

### InfoInvokeTimeout

• **InfoInvokeTimeout** = ``"infoInvokeTimeout"``

a service invoked a other function and did not get a answer within given ttl

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:35

___

### InfoServiceDrain

• **InfoServiceDrain** = ``"infoServiceDrain"``

indicates that a service is going to shut down and does no longer accept new requests

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:31

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded** = ``"infoServiceFunctionAdded"``

send when a service provides a new function

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:29

___

### InfoServiceInit

• **InfoServiceInit** = ``"infoServiceInit"``

indicates that a service is booting

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:23

___

### InfoServiceNotReady

• **InfoServiceNotReady** = ``"infoServiceNotReady"``

indicates that a service is not able to process requests (e.g. db not available)

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:27

___

### InfoServiceReady

• **InfoServiceReady** = ``"infoServiceReady"``

indicates that a service is ready

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:25

___

### InfoServiceShutdown

• **InfoServiceShutdown** = ``"infoServiceShutdown"``

last event from service before service is destroyed

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:33

___

### InfoSubscriptionError

• **InfoSubscriptionError** = ``"infoSubscriptionError"``

a subscription function is throwing

#### Defined in

packages/core/lib/core/types/EBMessageType.enum.d.ts:37
