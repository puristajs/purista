[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / RunEvent

# Type Alias: RunEvent

> **RunEvent** = \{ `at`: `string`; `runId`: `string`; `type`: `"run.started"`; \} \| \{ `at`: `string`; `error?`: `SerializedError`; `output?`: `JsonValue`; `runId`: `string`; `type`: `"run.finished"`; \} \| \{ `agentId`: `string`; `at`: `string`; `runId`: `string`; `type`: `"agent.started"`; \} \| \{ `agentId`: `string`; `at`: `string`; `error?`: `SerializedError`; `output?`: `JsonValue`; `runId`: `string`; `type`: `"agent.finished"`; \} \| \{ `agentId`: `string`; `delta`: `string`; `runId`: `string`; `type`: `"model.delta"`; \} \| \{ `agentId`: `string`; `callId`: `string`; `input`: `JsonValue`; `runId`: `string`; `toolId`: `string`; `type`: `"tool.started"`; \} \| \{ `agentId`: `string`; `callId`: `string`; `error?`: `SerializedError`; `output?`: `JsonValue`; `runId`: `string`; `toolId`: `string`; `type`: `"tool.finished"`; \} \| \{ `agentId`: `string`; `message`: `Message`; `runId`: `string`; `type`: `"model.message"`; \} \| \{ `agentId?`: `string`; `partial`: `JsonValue`; `runId`: `string`; `type`: `"model.object.partial"`; \} \| \{ `agentId?`: `string`; `object`: `JsonValue`; `runId`: `string`; `type`: `"model.object"`; \} \| \{ `agentId?`: `string`; `count`: `number`; `dimensions?`: `number`; `runId`: `string`; `type`: `"model.embedding.completed"`; `usage?`: `TokenUsage`; \} \| \{ `agentId?`: `string`; `count`: `number`; `runId`: `string`; `topN?`: `number`; `type`: `"model.rerank.completed"`; `usage?`: `TokenUsage`; \} \| \{ `at`: `string`; `dropped`: `number`; `runId`: `string`; `type`: `"stream.overflow"`; \}

Defined in: ai/node\_modules/@purista/harness/dist/harness/defineHarness.d.ts:458

Harness streaming events emitted from `session.workflows.<id>.stream(...)`.
