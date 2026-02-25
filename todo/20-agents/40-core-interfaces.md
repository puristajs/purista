# Agent Core Interfaces (Draft)

Goal: define a strict, provider-agnostic agent runtime surface that composes with Purista (commands/subscriptions/streams) and preserves schema-driven typing.

## Design principles

- Provider adapters must expose explicit capability flags.
- Structured outputs must be schema validated at runtime and typed at compile time.
- Tool calls must be validated (never execute raw model JSON).
- Streaming is first-class (agent output, step events, tool events, metrics).

## Errors

Prefer a closed error taxonomy that callers can switch on.

```ts
export type AgentError =
  | { type: 'ProviderAuthError'; message: string; cause?: unknown }
  | { type: 'ProviderRateLimitError'; message: string; retryAfterMs?: number; cause?: unknown }
  | { type: 'ProviderTransientError'; message: string; cause?: unknown }
  | { type: 'ToolValidationError'; message: string; toolName: string; cause?: unknown }
  | { type: 'ToolExecutionError'; message: string; toolName: string; cause?: unknown }
  | { type: 'MemoryAccessError'; message: string; cause?: unknown }
  | { type: 'PolicyViolationError'; message: string; cause?: unknown }
  | { type: 'AgentTimeoutError'; message: string; cause?: unknown }
```

## Provider capability model

```ts
export type ProviderCapability =
  | 'text-generate'
  | 'text-stream'
  | 'tool-calls'
  | 'structured-output'
  | 'embeddings'

export interface ProviderCapabilities {
  readonly supports: ReadonlySet<ProviderCapability>
}
```

## Token/cost usage model

```ts
export type Usage = Readonly<{
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  costUsd?: number
}>
```

## Core request/response types

We need to keep this minimal but extensible. It should cover:
- plain completion
- streaming completion
- tool calling
- structured outputs

```ts
export type ModelMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string }
  | { role: 'tool'; name: string; content: string }

export type ModelCompletion = Readonly<{
  content: string
  usage?: Usage
}>
```

## Structured output (schema-driven)

```ts
export type StructuredCompletion<T> = Readonly<{
  value: T
  rawText?: string
  usage?: Usage
}>
```

Rule: `T` must come from a runtime-validated schema in the public API (example: zod schema -> `Infer<typeof schema>`).

## Streaming types

Agent streaming should be representable as a stream of typed events (not just tokens).

```ts
export type AgentStreamEvent =
  | { type: 'RunStarted'; runId: string; timestamp: number }
  | { type: 'Token'; runId: string; token: string; timestamp: number }
  | { type: 'ToolCallRequested'; runId: string; toolName: string; argsJson: string; timestamp: number }
  | { type: 'ToolCallSucceeded'; runId: string; toolName: string; timestamp: number }
  | { type: 'ToolCallFailed'; runId: string; toolName: string; error: AgentError; timestamp: number }
  | { type: 'Usage'; runId: string; usage: Usage; timestamp: number }
  | { type: 'RunCompleted'; runId: string; timestamp: number }
  | { type: 'RunFailed'; runId: string; error: AgentError; timestamp: number }
```

Implementation detail: these events can be mapped onto the streaming primitives in `todo/10-streaming/*`.

## Tools

Tools must be schema-validated at the boundary:

- model emits `args` (string/unknown)
- runtime validates against schema
- tool handler runs with typed args
- output is serialized back into model context (and optionally validated too)

```ts
export interface ToolDefinition<TArgs, TResult> {
  readonly name: string
  readonly description: string
  validateArgs(input: unknown): TArgs
  validateResult?(input: unknown): TResult
  execute(args: TArgs): Promise<TResult>
}

export interface ToolRegistry {
  get(name: string): ToolDefinition<unknown, unknown> | undefined
  list(): ToolDefinition<unknown, unknown>[]
}
```

## Memory

We likely need at least two layers:
- run-scoped scratchpad state
- persistent memory store (optional)

```ts
export interface AgentMemoryStore {
  get(runId: string, key: string): Promise<unknown>
  set(runId: string, key: string, value: unknown, ttlMs?: number): Promise<void>
}
```

To preserve typing, higher-level memory helpers should be schema-driven (not shown here).

## Agent runtime orchestration

```ts
export interface AgentRuntime {
  readonly capabilities: ProviderCapabilities
  run(input: { messages: ModelMessage[]; runId?: string }): Promise<ModelCompletion>
  stream(input: { messages: ModelMessage[]; runId?: string }): AsyncIterable<AgentStreamEvent>
}
```

Open questions:
- How do we represent multi-turn state (conversation) across invocations?
- Where should policies (redaction, allowlists) live: runtime vs builder vs service hooks?

