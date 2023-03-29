[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/core](../modules/purista_core.md) / EBMessageType

# Enumeration: EBMessageType

[@purista/core](../modules/purista_core.md).EBMessageType

Type of event bridge message

## Table of contents

### Enumeration Members

- [Command](purista_core.EBMessageType.md#command)
- [CommandErrorResponse](purista_core.EBMessageType.md#commanderrorresponse)
- [CommandSuccessResponse](purista_core.EBMessageType.md#commandsuccessresponse)
- [CustomMessage](purista_core.EBMessageType.md#custommessage)
- [InfoInvokeTimeout](purista_core.EBMessageType.md#infoinvoketimeout)
- [InfoServiceDrain](purista_core.EBMessageType.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_core.EBMessageType.md#infoservicefunctionadded)
- [InfoServiceInit](purista_core.EBMessageType.md#infoserviceinit)
- [InfoServiceNotReady](purista_core.EBMessageType.md#infoservicenotready)
- [InfoServiceReady](purista_core.EBMessageType.md#infoserviceready)
- [InfoServiceShutdown](purista_core.EBMessageType.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_core.EBMessageType.md#infosubscriptionerror)

## Enumeration Members

### Command

• **Command** = ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:11](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L11)

___

### CommandErrorResponse

• **CommandErrorResponse** = ``"commandErrorResponse"``

a error response from receiver of a command message

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:17](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L17)

___

### CommandSuccessResponse

• **CommandSuccessResponse** = ``"commandSuccessResponse"``

a success response from receiver of a command message

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:14](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L14)

___

### CustomMessage

• **CustomMessage** = ``"customMessage"``

a custom message / custom event

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:42](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L42)

___

### InfoInvokeTimeout

• **InfoInvokeTimeout** = ``"infoInvokeTimeout"``

a service invoked a other function and did not get a answer within given ttl

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:38](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L38)

___

### InfoServiceDrain

• **InfoServiceDrain** = ``"infoServiceDrain"``

indicates that a service is going to shut down and does no longer accept new requests

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:34](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L34)

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded** = ``"infoServiceFunctionAdded"``

send when a service provides a new function

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:32](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L32)

___

### InfoServiceInit

• **InfoServiceInit** = ``"infoServiceInit"``

indicates that a service is booting

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:26](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L26)

___

### InfoServiceNotReady

• **InfoServiceNotReady** = ``"infoServiceNotReady"``

indicates that a service is not able to process requests (e.g. db not available)

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:30](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L30)

___

### InfoServiceReady

• **InfoServiceReady** = ``"infoServiceReady"``

indicates that a service is ready

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:28](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L28)

___

### InfoServiceShutdown

• **InfoServiceShutdown** = ``"infoServiceShutdown"``

last event from service before service is destroyed

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:36](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L36)

___

### InfoSubscriptionError

• **InfoSubscriptionError** = ``"infoSubscriptionError"``

a subscription function is throwing

#### Defined in

[packages/core/src/core/types/EBMessageType.enum.ts:40](https://github.com/sebastianwessel/purista/blob/8c66693/packages/core/src/core/types/EBMessageType.enum.ts#L40)
