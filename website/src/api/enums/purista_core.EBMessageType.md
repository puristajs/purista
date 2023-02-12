[PURISTA API - v1.4.9](../README.md) / [@purista/core](../modules/purista_core.md) / EBMessageType

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

[core/src/core/types/EBMessageType.enum.ts:11](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L11)

___

### CommandErrorResponse

• **CommandErrorResponse** = ``"commandErrorResponse"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:15](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L15)

___

### CommandSuccessResponse

• **CommandSuccessResponse** = ``"commandSuccessResponse"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:13](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L13)

___

### CustomMessage

• **CustomMessage** = ``"customMessage"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:31](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L31)

___

### InfoInvokeTimeout

• **InfoInvokeTimeout** = ``"infoInvokeTimeout"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:29](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L29)

___

### InfoServiceDrain

• **InfoServiceDrain** = ``"infoServiceDrain"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:27](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L27)

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded** = ``"infoServiceFunctionAdded"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:26](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L26)

___

### InfoServiceInit

• **InfoServiceInit** = ``"infoServiceInit"``

Info message type:
Message which is sent from a single sender to unspecified receivers.
The sender does not expect any answer to this message and does not process any reply to this message.
Info messages are fire & forget broadcasting messages.

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:23](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L23)

___

### InfoServiceNotReady

• **InfoServiceNotReady** = ``"infoServiceNotReady"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:25](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L25)

___

### InfoServiceReady

• **InfoServiceReady** = ``"infoServiceReady"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:24](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L24)

___

### InfoServiceShutdown

• **InfoServiceShutdown** = ``"infoServiceShutdown"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:28](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L28)

___

### InfoSubscriptionError

• **InfoSubscriptionError** = ``"infoSubscriptionError"``

#### Defined in

[core/src/core/types/EBMessageType.enum.ts:30](https://github.com/sebastianwessel/purista/blob/e4f9042/packages/core/src/core/types/EBMessageType.enum.ts#L30)
