# Core Interfaces & Types

## 1. Agent definition & manifest

```ts
type AgentManifest = {
  agentName: string
  agentVersion: string
  description?: string
  eventBridge: string
  modelResource?: { resourceName: string; variant?: string }
  session?: { storeName: string; strategy?: 'full' | 'summary'; maxFrames?: number }
  knowledge?: Array<{ adapterName: string; options?: Record<string, unknown> }>
  concurrency: { poolId: string; maxWorkers: number }
  retryPolicy?: { maxAttempts: number; delayMs?: number; strategy?: 'fixed' | 'exponential' }
  telemetry?: { attributes?: Record<string, string | number | boolean> }
  allowedTools: Array<{ serviceName: string; serviceVersion: string; commandName: string; description?: string }>
  payloadSchema?: Schema
  parameterSchema?: Schema
  outputSchema?: Schema
  contextSchema?: Schema
  httpExposure?: {
    method: HttpMethod
    path: string
    streamingMode: 'sse' | 'chunked' | 'buffered'
    requestContentType?: string
    responseContentType?: string
    public?: boolean
    queryParameters?: Array<{ name: string; required: boolean }>
  }
}

type AgentDefinition = {
  info: { agentName: string; agentVersion: string; description?: string }
  getManifest(): AgentManifest
  getInstance(options: AgentRuntimeOptions): Promise<AgentInstance>
  schemas: {
    payload?: Schema
    parameter?: Schema
    output?: Schema
    context?: Schema
  }
}
```

If a builder omits `concurrency`, the runtime injects the default `{ poolId: \`agent:${agentName}\`, maxWorkers: 1 }` so every agent is governed by a pool even in development.

`AgentRuntimeOptions` mirror service instances: event bridge, logger, span processor, managed config access, session/knowledge adapters, resources (LLM providers, storage), and optional overrides (`config.maxWorkers`, `resources.llm`, etc.).

## 2. Instance lifecycle & invocation

```ts
interface AgentInstance {
  start(): Promise<void>
  stop(): Promise<void>
  invoke(request: AgentInvokeRequest, contextOverrides?: Partial<InvokeContext>): Promise<AgentInvokeResult>
}

type AgentInvokeRequest = {
  payload: unknown
  parameter?: unknown
  correlationId?: string
  sessionId?: string
  stream?: AgentStreamResponder
}

type AgentInvokeResult = {
  envelopes: AgentProtocolEnvelope[]
  telemetry?: AgentTelemetry
}

type AgentStreamResponder = {
  onFrame(frame: AgentProtocolEnvelope): void
  onComplete(): void
  onError(error: unknown): void
}
```

`invokeAgent()` is a helper exported from `@purista/ai` that wraps this interaction, handling EventBridge messaging, retries, streaming vs buffering, and conversion to HTTP responses when needed.

## 3. Provider, session, and knowledge interfaces

```ts
interface ModelProvider {
  id: string
  supportsStreaming: boolean
  generate(request: {
    conversation: ConversationHistory
    prompt: string
    tools: AllowedToolDescriptor[]
    responseSchema?: Schema
    context?: string
  }): AsyncGenerator<ProviderChunk, ProviderCompletion>
}

interface SessionStore {
  load(sessionId: string): Promise<ConversationRecord | undefined>
  save(record: ConversationRecord): Promise<void>
  delete(sessionId: string): Promise<void>
}

interface KnowledgeAdapter {
  id: string
  query(prompt: string, limit?: number): Promise<KnowledgeDocument[]>
  upsert(document: KnowledgeDocument): Promise<void>
  delete(id: string): Promise<void>
}
```

Default implementations (echo provider, in-memory session store, in-memory knowledge adapter) keep examples runnable. Custom adapters follow the same contracts and plug in through builder resources/config.

`ModelProvider` implementations are thin wrappers around the [Vercel AI SDK](https://ai-sdk.dev/docs/introduction). Each registry entry binds a configured `LanguageModel` (or tool-capable runner) so the runtime inherits telemetry, safety features, and the ability to transform responses into AI SDK streams when exposing HTTP endpoints. Advanced projects can still implement the interface directly (e.g., for highly specialized local inference) without opting into the SDK.

## 4. Protocol helpers

- `createProtocolEnvelope`, `createMessageFrame`, `createTelemetryFrame`, `createErrorFrame`, `createArtifactFrame`, `createTokenUsage` – low-level builders exported via `@purista/ai/protocol`.
- `ProtocolEmitter` (available through `context.protocol`) offers higher-level APIs:
  - `emitMessage({ content, partial?, final?, summary? })`
  - `emitArtifact({ artifactId, sequence, mimeType, data, final? })`
  - `emitToolEvent({ toolName, status, input, output, errorCode })`
  - `emitTelemetry({ usage, durationMs, waitTimeMs, provider, poolId })`
  - `emitError(error, { code?, handled? })`
  - `has(kind)` – introspection so handlers can avoid duplicate frames.
- `streamAgentResult(generator, emitter)` consumes async generators (LLM providers, MCP bridges) and emits frames plus token usage automatically.

These helpers live in a standalone subpath so non-PURISTA environments (frontends, integration services) can build or consume protocol frames.

## 5. Error & telemetry taxonomy

```ts
type AgentProtocolFrame =
  | { kind: 'message'; role: 'assistant' | 'tool'; content: string; partial?: boolean; final?: boolean; summary?: string }
  | { kind: 'artifact'; artifactId: string; sequence: number; total?: number; mimeType?: string; data: string | Record<string, unknown> }
  | { kind: 'tool'; toolName: string; status: 'invoked' | 'success' | 'error'; input?: unknown; output?: unknown; errorCode?: string }
  | { kind: 'telemetry';
      usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number; costUsd?: number };
      durationMs?: number;
      waitTimeMs?: number;
      poolId?: string;
      provider?: string;
    }
  | { kind: 'error'; code: string; message: string; handled: boolean; details?: unknown }
```

Telemetry attributes are mapped onto OpenTelemetry spans with the prefix `purista.ai.*`, ensuring dashboards and tracing remain consistent with the rest of the framework. Errors automatically propagate as `HandledError`/`UnhandledError` in addition to emitting protocol frames, so downstream systems receive structured diagnostics without losing the native PURISTA semantics.
