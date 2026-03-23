[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AiSdkStreamMode

# Type Alias: AiSdkStreamMode

> **AiSdkStreamMode** = `"responses"` \| `"ui-message"`

Defined in: [packages/ai/src/protocol/aiSdkStream.ts:16](https://github.com/puristajs/purista/blob/1dc8022a437b4fd3d9732b2d4b57646f0269cf2d/packages/ai/src/protocol/aiSdkStream.ts#L16)

Output mode for `toAiSdkStreamEvents`.

- `responses`: emits OpenAI Responses-style `response.*` events.
- `ui-message`: emits Vercel UI Message stream events (`start`, `text-*`, `finish`, `error`).
