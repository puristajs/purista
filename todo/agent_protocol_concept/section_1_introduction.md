# 1. Introduction

This document defines a protocol and system architecture for building distributed, multi-agent AI systems that are language-agnostic, broker-independent, and compatible with both REST and streaming communication models.

The protocol, inspired by standards like A2A, MCP, and CloudEvents, supports real-time LLM-based workflows, robust task orchestration, multi-tenant execution, and explainable agent behavior.

## Scope
This specification is intended for:
- AI engineers designing assistant and tool-based systems
- Infrastructure teams building agent-based service meshes
- Researchers creating interoperable AI protocol layers
- Developers implementing streaming UIs and task dispatchers

## Design Goals
- **Language-agnostic** — works across TypeScript, Python, Go, etc.
- **Broker-independent** — transport via WebSocket, SSE, Kafka, HTTP
- **LLM abstraction** — not bound to a specific model or API provider
- **REST and event parity** — supports both traditional APIs and chunked, real-time streaming
- **Conversation-first** — messages are scoped and threaded via `conversationid`
- **Partial and progressive updates** — robust handling of artifact streams
- **Traceable and observable** — structured metadata supports audit, retry, and debug flows
- **Secure and multi-tenant** — supports role isolation, access control, and context-aware routing
- **Operational telemetry** — token usage, duration, pool identifiers, and errors travel with the same schema so hosts can monitor/alert without bolting on side channels
- **Native PURISTA payload reuse** — the envelope is carried inside ordinary PURISTA command payloads/stream frames, reusing message IDs for `inReplyTo` so no EventBridge changes are required
- **Payload-agnostic transport** — the envelope can live inside any parent message (PURISTA command payload, WebSocket chunk, HTTP response) without dictating broker changes
- **Interoperable by design** — helper adapters convert frames into community protocols such as the Vercel AI SDK stream format or MCP so UIs and third parties can plug in without bespoke glue.
