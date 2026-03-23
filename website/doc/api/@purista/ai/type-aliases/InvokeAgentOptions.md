[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / InvokeAgentOptions

# Type Alias: InvokeAgentOptions

> **InvokeAgentOptions** = `object`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:8](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L8)

## Properties

### agentName

> **agentName**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:12](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L12)

Target agent service name.

***

### agentVersion

> **agentVersion**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:14](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L14)

Target agent service version.

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:26](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L26)

Optional correlation id used for distributed trace chaining.

***

### eventBridge

> **eventBridge**: [`EventBridge`](../../core/interfaces/EventBridge.md)

Defined in: [packages/ai/src/runtime/invokeAgent.ts:10](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L10)

EventBridge instance used to reach the target agent service.

***

### failOnErrorFrame?

> `optional` **failOnErrorFrame**: `boolean`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:35](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L35)

When true (default), protocol `error` envelopes emitted by the target agent
are treated as invocation failures and throw immediately.

***

### parameter?

> `optional` **parameter**: `unknown`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:18](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L18)

Optional invoke parameter metadata passed alongside payload.

***

### payload

> **payload**: `unknown`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:16](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L16)

Payload delivered to the target agent run command.

***

### principalId?

> `optional` **principalId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:20](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L20)

Optional principal id forwarded for scoped memory and auditing.

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:28](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L28)

Optional session id injected into object payloads when missing.

***

### stream?

> `optional` **stream**: [`AgentStreamResponder`](AgentStreamResponder.md)

Defined in: [packages/ai/src/runtime/invokeAgent.ts:30](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L30)

Optional live frame responder for streaming consumption.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:22](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L22)

Optional tenant id forwarded for scoped memory and auditing.

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/ai/src/runtime/invokeAgent.ts:24](https://github.com/puristajs/purista/blob/ce29fa15493ed0d4cf00acd89702c11c1d7a2a20/packages/ai/src/runtime/invokeAgent.ts#L24)

Optional timeout passed to stream open/invoke calls.
