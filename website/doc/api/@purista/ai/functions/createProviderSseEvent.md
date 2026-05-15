[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / [](../README.md) / createProviderSseEvent

# Function: createProviderSseEvent()

> **createProviderSseEvent**(`input`, `sequenceNumber`): `object`

Defined in: [runtime/sseEvents.ts:178](https://github.com/puristajs/purista/blob/f2e3a6db680e071c6caf952d6c1ae37cec6523d9/packages/ai/src/runtime/sseEvents.ts#L178)

## Parameters

### input

[`AgentRunEvent`](../type-aliases/AgentRunEvent.md)

### sequenceNumber

`number`

## Returns

`object`

### data

> **data**: \{ `agent_id?`: `string`; `response`: \{ `created_at`: `number`; `error?`: \{ `category`: `string`; `code`: `string`; `message`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `retriable`: `boolean`; \} \| `null`; `id`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `object`: `"response"`; `output?`: `unknown`; `status`: `"queued"` \| `"in_progress"` \| `"completed"` \| `"failed"` \| `"cancelled"` \| `"incomplete"`; \}; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.created"`; \} \| \{ `agent_id?`: `string`; `response`: \{ `created_at`: `number`; `error?`: \{ `category`: `string`; `code`: `string`; `message`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `retriable`: `boolean`; \} \| `null`; `id`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `object`: `"response"`; `output?`: `unknown`; `status`: `"queued"` \| `"in_progress"` \| `"completed"` \| `"failed"` \| `"cancelled"` \| `"incomplete"`; \}; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.in_progress"`; \} \| \{ `agent_id?`: `string`; `content_index`: `number`; `delta`: `string`; `output_index`: `number`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.output_text.delta"`; \} \| \{ `agent_id?`: `string`; `content_index`: `number`; `delta`: `unknown`; `output_index`: `number`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.output_json.delta"`; \} \| \{ `agent_id?`: `string`; `content_index`: `number`; `object`: `unknown`; `output_index`: `number`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.output_json.done"`; \} \| \{ `agent_id?`: `string`; `input`: `unknown`; `item_id`: `string`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `tool_name`: `string`; `type`: `"response.tool_call.started"`; \} \| \{ `agent_id?`: `string`; `error?`: \{ `category`: `string`; `code`: `string`; `message`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `retriable`: `boolean`; \}; `item_id`: `string`; `output?`: `unknown`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `tool_name`: `string`; `type`: `"response.tool_call.completed"`; \} \| \{ `agent_id?`: `string`; `count`: `number`; `dimensions?`: `number`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.model_embedding.completed"`; `usage?`: \{ `inputTokens`: `number`; `outputTokens`: `number`; `totalTokens`: `number`; \}; \} \| \{ `agent_id?`: `string`; `count`: `number`; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `top_n?`: `number`; `type`: `"response.model_rerank.completed"`; `usage?`: \{ `inputTokens`: `number`; `outputTokens`: `number`; `totalTokens`: `number`; \}; \} \| \{ `agent_id?`: `string`; `response`: \{ `created_at`: `number`; `error?`: \{ `category`: `string`; `code`: `string`; `message`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `retriable`: `boolean`; \} \| `null`; `id`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `object`: `"response"`; `output?`: `unknown`; `status`: `"queued"` \| `"in_progress"` \| `"completed"` \| `"failed"` \| `"cancelled"` \| `"incomplete"`; \}; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"response.completed"`; \} \| \{ `agent_id?`: `string`; `error`: \{ `category`: `string`; `code`: `string`; `message`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `retriable`: `boolean`; \}; `response_id`: `string`; `run_id`: `string`; `sequence_number`: `number`; `type`: `"error"`; \} = `agentProviderEventDataSchema`

### event

> **event**: `string`
