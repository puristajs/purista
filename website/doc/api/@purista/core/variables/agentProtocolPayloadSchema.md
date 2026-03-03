[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/core](../README.md) / agentProtocolPayloadSchema

# Variable: agentProtocolPayloadSchema

> `const` **agentProtocolPayloadSchema**: `ZodObject`\<\{ `attachments`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `conversationId`: `ZodOptional`\<`ZodString`\>; `history`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodAny`\>\>\>; `message`: `ZodString`; \}, `$loose`\>

Defined in: core/types/agent/AgentProtocol.ts:8

The payload for an agent protocol request.
