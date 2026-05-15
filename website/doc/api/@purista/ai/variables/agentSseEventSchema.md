[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / agentSseEventSchema

# Variable: agentSseEventSchema

> `const` **agentSseEventSchema**: `ZodObject`\<\{ `data`: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `response`: `ZodObject`\<\{ `created_at`: `ZodNumber`; `error`: `ZodOptional`\<`ZodNullable`\<`ZodObject`\<..., ...\>\>\>; `id`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `object`: `ZodLiteral`\<`"response"`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `in_progress`: `"in_progress"`; `incomplete`: `"incomplete"`; `queued`: `"queued"`; \}\>; \}, `$strip`\>; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.created"`\>; \}, `$strip`\>, `ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `response`: `ZodObject`\<\{ `created_at`: `ZodNumber`; `error`: `ZodOptional`\<`ZodNullable`\<`ZodObject`\<..., ...\>\>\>; `id`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `object`: `ZodLiteral`\<`"response"`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `in_progress`: `"in_progress"`; `incomplete`: `"incomplete"`; `queued`: `"queued"`; \}\>; \}, `$strip`\>; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.in_progress"`\>; \}, `$strip`\>, `ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `content_index`: `ZodNumber`; `delta`: `ZodString`; `output_index`: `ZodNumber`; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.output_text.delta"`\>; \}, `$strip`\>\], `"type"`\>; `event`: `ZodString`; \}, `$strip`\>

Defined in: [runtime/sseEvents.ts:170](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/runtime/sseEvents.ts#L170)

SSE chunk schema emitted by AI stream endpoints.

## Example

```json
{
  "event": "response.output_text.delta",
  "data": {
    "type": "response.output_text.delta",
    "sequence_number": 2,
    "response_id": "run_123",
    "run_id": "run_123",
    "delta": "hello"
  }
}
```
