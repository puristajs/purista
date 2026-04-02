[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InvokeAgentOptions

# Type Alias: InvokeAgentOptions

> **InvokeAgentOptions** = `object`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:15](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L15)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:19](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L19)

Target agent service name.

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:21](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L21)

Target agent service version.

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:33](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L33)

Optional correlation id used for distributed trace chaining.

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/invokeAgent.ts:17](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L17)

EventBridge instance used to reach the target agent service.

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:44](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L44)

When true (default), protocol `error` envelopes emitted by the target agent
are treated as invocation failures and throw immediately.

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:25](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L25)

Optional invoke parameter metadata passed alongside payload.

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:23](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L23)

Payload delivered to the target agent run command.

***

### principalId?

> `optional` **principalId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:27](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L27)

Optional principal id forwarded for scoped memory and auditing.

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:37](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L37)

Optional session id injected into object payloads when missing.

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/invokeAgent.ts:39](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L39)

Optional live frame responder for streaming consumption.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:29](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L29)

Optional tenant id forwarded for scoped memory and auditing.

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:31](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L31)

Optional timeout passed to stream open/invoke calls.

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:35](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/runtime/invokeAgent.ts#L35)

Optional trace id used to preserve distributed tracing across agent boundaries.
