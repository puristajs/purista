# 2. System Architecture Models

## 2.1. Request Routing Strategies

In multi-agent systems, different architectural models dictate how user input is routed and processed by agents. The EggAI protocol supports multiple routing paradigms:

### Triage / Hand-Over

A triage or dispatcher agent classifies incoming user messages and transfers the entire conversation to a specialized agent that owns the task. Key characteristics:

* Delegation of full conversation context.
* Conversation ID remains stable but ownership changes.
* Suitable for systems with clearly defined agent domains.
* Requires robust context handoff and threading support (`inreplyto`, `role`).

### Hierarchical (Assistant/Tool Pattern)

A single agent acts as a persistent interface to the user, handling all responses directly while delegating subtasks to tools or sub-agents. Characteristics include:

* Centralized state and user-facing behavior.
* Tools produce results, not messages.
* Enables progressive enhancement (e.g. "showing work" as options).
* More explainable and user-friendly for assistant-like interactions.

### Hybrid Models

Complex systems may combine both models:

* A dispatcher routes to a central assistant.
* The assistant uses tools for individual task stages.
* Cross-agent context sharing becomes critical.

## 2.2. Conversation Ownership and Transfer

Maintaining clarity about which agent is responsible for a given part of a conversation is critical.

### Ownership Metadata

* Explicit role tracking via `role` (user, assistant, tool).
* When used inside PURISTA, the metadata lives directly inside the protocol envelope and piggybacks on the existing EventBridge message (`message.sender`, `message.id`, `message.correlationId`). No additional CloudEvent extensions are required.

### Hand-Off Semantics

* Use `inreplyto` to reference previous messages. The value maps to the PURISTA message ID that triggered the response so traceability works end to end.
* Ensure conversation continuity via consistent `conversationid`. The recommended default is to reuse the PURISTA `correlationId`, which already flows through HTTP, queues, and streams.
* Intermediate agents can insert summary/context parts when transferring (e.g., include a message frame that explains why the hand-over occurred).
* The protocol is intentionally **read-only** with respect to tool directives. Frames expose what happened (messages, artifacts, telemetry, tools used) but never instruct an agent to call a specific tool; agents stay black boxes governed by manifest allowlists.

### Thread Safety and Stream Continuity

* Each agent must respect stream boundaries (`artifactId` + `taskId`).
* Partial updates must not be dropped or duplicated.
* Message integrity is preserved through CloudEvent timestamps and `lastChunk` flags.

## 2.4 Protocol Bridging

Because the envelope is intentionally transport-agnostic, it can be adapted to multiple downstream protocols without changing agent logic. The `@purista/ai` package will ship helpers that:

* Transform frames into the [Vercel AI SDK stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) so existing UI components can consume PURISTA agents directly.
* Convert streams to MCP-compatible messages for optional external toolchains.
* Map telemetry frames onto OTEL/Prometheus metrics.

These adapters ensure that the same protocol payload travels through PURISTA messages, HTTP/SSE responses, or third-party bridges with minimal glue code.
