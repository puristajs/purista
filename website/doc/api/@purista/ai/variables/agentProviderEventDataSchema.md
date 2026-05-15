[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / agentProviderEventDataSchema

# Variable: agentProviderEventDataSchema

> `const` **agentProviderEventDataSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `response`: `ZodObject`\<\{ `created_at`: `ZodNumber`; `error`: `ZodOptional`\<`ZodNullable`\<`ZodObject`\<\{ `category`: `ZodString`; `code`: `ZodString`; `message`: `ZodString`; `meta`: `ZodOptional`\<...\>; `retriable`: `ZodBoolean`; \}, `$strip`\>\>\>; `id`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `object`: `ZodLiteral`\<`"response"`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `in_progress`: `"in_progress"`; `incomplete`: `"incomplete"`; `queued`: `"queued"`; \}\>; \}, `$strip`\>; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.created"`\>; \}, `$strip`\>, `ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `response`: `ZodObject`\<\{ `created_at`: `ZodNumber`; `error`: `ZodOptional`\<`ZodNullable`\<`ZodObject`\<\{ `category`: `ZodString`; `code`: `ZodString`; `message`: `ZodString`; `meta`: `ZodOptional`\<...\>; `retriable`: `ZodBoolean`; \}, `$strip`\>\>\>; `id`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `object`: `ZodLiteral`\<`"response"`\>; `output`: `ZodOptional`\<`ZodUnknown`\>; `status`: `ZodEnum`\<\{ `cancelled`: `"cancelled"`; `completed`: `"completed"`; `failed`: `"failed"`; `in_progress`: `"in_progress"`; `incomplete`: `"incomplete"`; `queued`: `"queued"`; \}\>; \}, `$strip`\>; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.in_progress"`\>; \}, `$strip`\>, `ZodObject`\<\{ `agent_id`: `ZodOptional`\<`ZodString`\>; `content_index`: `ZodNumber`; `delta`: `ZodString`; `output_index`: `ZodNumber`; `response_id`: `ZodString`; `run_id`: `ZodString`; `sequence_number`: `ZodNumber`; `type`: `ZodLiteral`\<`"response.output_text.delta"`\>; \}, `$strip`\>\], `"type"`\>

Defined in: [runtime/sseEvents.ts:91](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/runtime/sseEvents.ts#L91)

OpenAI Responses-style streaming event data for PURISTA agent streams.

The event envelope uses normal SSE `event`/`data` framing. The JSON payload
keeps the provider-familiar `type` and `sequence_number` fields so clients
can consume it like modern OpenAI/Anthropic semantic streaming events.
