[**PURISTA API**](../../../README.md)

***

[PURISTA API](../../../packages.md) / [@purista/ai](../README.md) / AgentSseProtocol

# Type Alias: AgentSseProtocol

> **AgentSseProtocol** = `"purista"` \| `"ai-sdk-responses"` \| `"ai-sdk-ui-message"` \| `"ai-sdk-data"` \| `"ai-sdk-json-render"` \| `"agent2agent"` \| `"mcp"`

Defined in: [packages/ai/src/types/AgentManifest.ts:116](https://github.com/puristajs/purista/blob/a54e4eedd3278d44c6382db014435e1a5908fb6f/packages/ai/src/types/AgentManifest.ts#L116)

Controls how agent stream chunks should be serialized when the endpoint uses SSE.
- `purista`: native PURISTA stream frames (canonical source protocol)
- `ai-sdk-responses`: OpenAI Responses-style stream events
- `ai-sdk-ui-message`: Vercel AI SDK UI message stream protocol
- `ai-sdk-data`: alias for AI SDK UI message data stream protocol
- `ai-sdk-json-render`: AI SDK UI message stream with `data-spec` parts for json-render
- `agent2agent`: reference Agent-to-Agent message events
- `mcp`: reference MCP tool-result events
