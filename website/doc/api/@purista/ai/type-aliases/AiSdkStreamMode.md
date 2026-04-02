[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkStreamMode

# Type Alias: AiSdkStreamMode

> **AiSdkStreamMode** = `"responses"` \| `"ui-message"`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:16](https://github.com/puristajs/purista/blob/28d9337ab7fa6d33001a8b6c36fb84bb9236b736/packages/ai/src/protocol/aiSdkStream.ts#L16)

Output mode for `toAiSdkStreamEvents`.

- `responses`: emits OpenAI Responses-style `response.*` events.
- `ui-message`: emits Vercel UI Message stream events (`start`, `text-*`, `finish`, `error`).
