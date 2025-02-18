[**@purista/core v1.11.0**](../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / EBMessageType

# Enumeration: EBMessageType

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:4](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L4)

Type of event bridge message

## Enumeration Members

### Command

> **Command**: `"command"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:11](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L11)

Command message type:
Message which is sent from a single sender to exactly one single receiver.
The sender expects a answer response from receiver within a specific time frame (ttl).
If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.

***

### CommandErrorResponse

> **CommandErrorResponse**: `"commandErrorResponse"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:17](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L17)

a error response from receiver of a command message

***

### CommandSuccessResponse

> **CommandSuccessResponse**: `"commandSuccessResponse"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:14](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L14)

a success response from receiver of a command message

***

### CustomMessage

> **CustomMessage**: `"customMessage"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:42](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L42)

a custom message / custom event

***

### InfoInvokeTimeout

> **InfoInvokeTimeout**: `"infoInvokeTimeout"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:38](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L38)

a service invoked a other function and did not get a answer within given ttl

***

### InfoServiceDrain

> **InfoServiceDrain**: `"infoServiceDrain"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:34](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L34)

indicates that a service is going to shut down and does no longer accept new requests

***

### InfoServiceFunctionAdded

> **InfoServiceFunctionAdded**: `"infoServiceFunctionAdded"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:32](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L32)

send when a service provides a new function

***

### InfoServiceInit

> **InfoServiceInit**: `"infoServiceInit"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:26](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L26)

indicates that a service is booting

***

### InfoServiceNotReady

> **InfoServiceNotReady**: `"infoServiceNotReady"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:30](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L30)

indicates that a service is not able to process requests (e.g. db not available)

***

### InfoServiceReady

> **InfoServiceReady**: `"infoServiceReady"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:28](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L28)

indicates that a service is ready

***

### InfoServiceShutdown

> **InfoServiceShutdown**: `"infoServiceShutdown"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:36](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L36)

last event from service before service is destroyed

***

### InfoSubscriptionError

> **InfoSubscriptionError**: `"infoSubscriptionError"`

Defined in: [packages/core/src/core/types/EBMessageType.enum.ts:40](https://github.com/puristajs/purista/blob/master/packages/core/src/core/types/EBMessageType.enum.ts#L40)

a subscription function is throwing
