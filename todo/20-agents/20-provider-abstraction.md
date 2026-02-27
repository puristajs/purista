# Agent Protocol Integration

## 1. Transport strategy

- The protocol defined in `specs/agent_protocol_concept` rides inside the **payload** (or stream chunk) of a normal PURISTA message. No EventBridge changes or new message kinds are required.
- `conversationId` defaults to the PURISTA `correlationId`, while `inReplyTo` reuses the triggering `message.id`. The helper keeps these aligned automatically.
- Developers never touch envelope fields manually. `@purista/ai` exposes:
  - `context.protocol.emitMessage(content)` – emits a protocol frame using IDs/actor metadata from the current context.
  - `context.protocol.emitTelemetry(metrics)` – reports token usage, duration, pool IDs.
  - `context.protocol.emitError(error, handled)` – wraps handled/unhandled errors into protocol frames.
  - `streamAgentResult(asyncGenerator)` – utility that consumes async iterators and emits properly typed frames (message + telemetry + final completion) without boilerplate.
- Because the helper set is exported from `@purista/ai`, non-PURISTA projects (frontend SDKs, integration gateways) can reuse the same constructors when they need to talk to an agent over HTTP/WebSocket.

## 2. Frame types & telemetry

- **Message** – textual or structured assistant updates. Supports incremental streaming where every chunk sets `message.partial = true`.
- **Artifact** – binary or JSON attachments (code diffs, UI widgets). Frames specify `artifactId`, `mimeType`, and chunk sequencing metadata.
- **Tool** – emitted automatically when the runtime invokes a PURISTA command as a tool. Includes tool name, input, output, and handled errors.
- **Telemetry** – always emitted at the end of a run (and optionally at checkpoints). Contains token usage (prompt/completion/total), duration statistics, pool ID, provider name/model, and concurrency wait time so operators can build dashboards.
- **Error** – emitted whenever the handler throws. Handled errors keep HTTP status/resolution semantics but also produce a protocol frame so UIs can render the failure. Unhandled errors inherit the standard PURISTA error propagation **and** emit a frame.

## 3. Conversation ownership & identity

- `actor` metadata is derived from the agent definition: `{ agentName, agentVersion, instanceId }`. This is enough for downstream routing without exposing internal security metadata.
- Delegation between agents is expressed via tool calls; the receiving agent keeps the same conversation and `inReplyTo` chain, so traces remain linear.
- Tool invocation allowlists ensure a developer explicitly opts in before another agent or command can interact with sensitive operations.

## 4. UI integration

- HTTP/SSE/WebSocket bridges simply forward protocol frames to clients. Since agents expose `.exposeAsHttpEndpoint`, routes are predictable (`/api/v1/agents/<name>` or developer-defined paths) and automatically documented through OpenAPI.
- Frontend components can map known `mimeType`s to widgets (diff viewers, form renderers, etc.) without backend changes.
- Streaming flows behave identically inside commands, queues, or HTTP requests because every chunk is a protocol envelope. Clients that only care about the final result can wait for the frame that includes `message.final = true`.

## 5. Optional external usage

The protocol helpers live in their own export tree (`@purista/ai/protocol`). Any Node.js or browser bundle can import the schemas to:

- Validate frames coming from a PURISTA API,
- Generate simulated agent transcripts for tests,
- Build third-party connectors (e.g., bridging MCP clients to PURISTA agents),
- Translate envelopes into other community formats (for example, the Vercel AI SDK stream protocol) without requiring the original PURISTA runtime.

This keeps the protocol a shared contract, not something hidden inside the framework implementation, and guarantees that a single helper (e.g., `toAiSdkStream`) can power HTTP/SSE responses, MCP bridges, or custom dashboards.
