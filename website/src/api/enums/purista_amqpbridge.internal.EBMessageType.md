[PURISTA API - v1.4.9](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / EBMessageType

# Enumeration: EBMessageType

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).EBMessageType

Type of event bridge message

## Table of contents

### Enumeration Members

- [Command](purista_amqpbridge.internal.EBMessageType.md#command)
- [CommandErrorResponse](purista_amqpbridge.internal.EBMessageType.md#commanderrorresponse)
- [CommandSuccessResponse](purista_amqpbridge.internal.EBMessageType.md#commandsuccessresponse)
- [CustomMessage](purista_amqpbridge.internal.EBMessageType.md#custommessage)
- [InfoInvokeTimeout](purista_amqpbridge.internal.EBMessageType.md#infoinvoketimeout)
- [InfoServiceDrain](purista_amqpbridge.internal.EBMessageType.md#infoservicedrain)
- [InfoServiceFunctionAdded](purista_amqpbridge.internal.EBMessageType.md#infoservicefunctionadded)
- [InfoServiceInit](purista_amqpbridge.internal.EBMessageType.md#infoserviceinit)
- [InfoServiceNotReady](purista_amqpbridge.internal.EBMessageType.md#infoservicenotready)
- [InfoServiceReady](purista_amqpbridge.internal.EBMessageType.md#infoserviceready)
- [InfoServiceShutdown](purista_amqpbridge.internal.EBMessageType.md#infoserviceshutdown)
- [InfoSubscriptionError](purista_amqpbridge.internal.EBMessageType.md#infosubscriptionerror)

## Enumeration Members

### Command

• **Command** = ``"command"``

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse** = ``"commandErrorResponse"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:13

___

### CommandSuccessResponse

• **CommandSuccessResponse** = ``"commandSuccessResponse"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:12

___

### CustomMessage

• **CustomMessage** = ``"customMessage"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:28

___

### InfoInvokeTimeout

• **InfoInvokeTimeout** = ``"infoInvokeTimeout"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:26

___

### InfoServiceDrain

• **InfoServiceDrain** = ``"infoServiceDrain"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:24

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded** = ``"infoServiceFunctionAdded"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:23

___

### InfoServiceInit

• **InfoServiceInit** = ``"infoServiceInit"``

Info message type:
Message which is sent from a single sender to unspecified receivers.
The sender does not expect any answer to this message and does not process any reply to this message.
Info messages are fire & forget broadcasting messages.

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:20

___

### InfoServiceNotReady

• **InfoServiceNotReady** = ``"infoServiceNotReady"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:22

___

### InfoServiceReady

• **InfoServiceReady** = ``"infoServiceReady"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:21

___

### InfoServiceShutdown

• **InfoServiceShutdown** = ``"infoServiceShutdown"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:25

___

### InfoSubscriptionError

• **InfoSubscriptionError** = ``"infoSubscriptionError"``

#### Defined in

core/lib/core/types/EBMessageType.enum.d.ts:27
