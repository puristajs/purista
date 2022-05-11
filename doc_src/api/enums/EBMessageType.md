[@purista/core](../README.md) / [Exports](../modules.md) / EBMessageType

# Enumeration: EBMessageType

Type of event bridge message

## Table of contents

### Enumeration members

- [Command](EBMessageType.md#command)
- [CommandErrorResponse](EBMessageType.md#commanderrorresponse)
- [CommandSuccessResponse](EBMessageType.md#commandsuccessresponse)
- [InfoServiceDrain](EBMessageType.md#infoservicedrain)
- [InfoServiceFunctionAdded](EBMessageType.md#infoservicefunctionadded)
- [InfoServiceInit](EBMessageType.md#infoserviceinit)
- [InfoServiceNotReady](EBMessageType.md#infoservicenotready)
- [InfoServiceReady](EBMessageType.md#infoserviceready)
- [InfoServiceShutdown](EBMessageType.md#infoserviceshutdown)

## Enumeration members

### Command

• **Command** = `"command"`

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

#### Defined in

[src/core/types/EBMessageType.enum.ts:11](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L11)

___

### CommandErrorResponse

• **CommandErrorResponse** = `"commandErrorResponse"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:15](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L15)

___

### CommandSuccessResponse

• **CommandSuccessResponse** = `"commandSuccessResponse"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:13](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L13)

___

### InfoServiceDrain

• **InfoServiceDrain** = `"infoServiceDrain"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:27](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L27)

___

### InfoServiceFunctionAdded

• **InfoServiceFunctionAdded** = `"infoServiceFunctionAdded"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:26](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L26)

___

### InfoServiceInit

• **InfoServiceInit** = `"infoServiceInit"`

Info message type:
Message which is sent from a single sender to unspecified receivers.
The sender does not expect any answer to this message and does not process any reply to this message.
Info messages are fire & forget broadcasting messages.

#### Defined in

[src/core/types/EBMessageType.enum.ts:23](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L23)

___

### InfoServiceNotReady

• **InfoServiceNotReady** = `"infoServiceNotReady"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:25](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L25)

___

### InfoServiceReady

• **InfoServiceReady** = `"infoServiceReady"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:24](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L24)

___

### InfoServiceShutdown

• **InfoServiceShutdown** = `"infoServiceShutdown"`

#### Defined in

[src/core/types/EBMessageType.enum.ts:28](https://github.com/sebastianwessel/purista/blob/40390cf/src/core/types/EBMessageType.enum.ts#L28)
