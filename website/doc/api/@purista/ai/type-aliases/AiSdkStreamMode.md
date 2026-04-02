[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkStreamMode

# Type Alias: AiSdkStreamMode

> **AiSdkStreamMode** = `"responses"` \| `"ui-message"`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:16](https://github.com/puristajs/purista/blob/22fd555ef1ada6d421f1292a01620a9b2b527601/packages/ai/src/protocol/aiSdkStream.ts#L16)

Output mode for `toAiSdkStreamEvents`.

- `responses`: emits OpenAI Responses-style `response.*` events.
- `ui-message`: emits Vercel UI Message stream events (`start`, `text-*`, `finish`, `error`).
