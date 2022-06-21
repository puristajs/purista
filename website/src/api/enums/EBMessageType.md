[PURISTA API](../README.md) / EBMessageType

# Enumeration: EBMessageType

Type of event bridge message

## Table of contents

### Enumeration Members

- [Command](EBMessageType.md#command)
- [CommandErrorResponse](EBMessageType.md#commanderrorresponse)
- [CommandSuccessResponse](EBMessageType.md#commandsuccessresponse)
- [InfoInvokeTimeout](EBMessageType.md#infoinvoketimeout)
- [InfoServiceDrain](EBMessageType.md#infoservicedrain)
- [InfoServiceFunctionAdded](EBMessageType.md#infoservicefunctionadded)
- [InfoServiceInit](EBMessageType.md#infoserviceinit)
- [InfoServiceNotReady](EBMessageType.md#infoservicenotready)
- [InfoServiceReady](EBMessageType.md#infoserviceready)
- [InfoServiceShutdown](EBMessageType.md#infoserviceshutdown)
- [InfoSubscriptionError](EBMessageType.md#infosubscriptionerror)

## Enumeration Members

### Command

• **Command**

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:11

___

### CommandErrorResponse

• **CommandErrorResponse**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:15

___

### CommandSuccessResponse

• **CommandSuccessResponse**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:13

___

### InfoInvokeTimeout

• **InfoInvokeTimeout**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:29

___

### InfoServiceDrain

• **InfoServiceDrain**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:27

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:26

___

### InfoServiceInit

• **InfoServiceInit**

Info message type:
Message which is sent from a single sender to unspecified receivers.
The sender does not expect any answer to this message and does not process any reply to this message.
Info messages are fire & forget broadcasting messages.

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:23

___

### InfoServiceNotReady

• **InfoServiceNotReady**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:25

___

### InfoServiceReady

• **InfoServiceReady**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:24

___

### InfoServiceShutdown

• **InfoServiceShutdown**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:28

___

### InfoSubscriptionError

• **InfoSubscriptionError**

#### Defined in

packages/core/src/core/types/EBMessageType.enum.ts:30
