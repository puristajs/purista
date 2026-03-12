# Specification: @purista/ai Phase 2 Enhancements

## Overview
This specification outlines the functional and structural improvements for the `@purista/ai` package and its primary reference example. The goal is to move from a streaming-first architecture to a more versatile "Unary-capable" framework while reducing internal complexity and providing a best-in-class developer experience.

---

## 1. Unary REST Support (Non-Streaming HTTP)
**Goal:** Enable agents to be consumed as standard JSON `POST` endpoints without forced SSE/Streaming.

### Requirements
- **Builder API:** Add or refine `streamingMode: 'aggregate'` in `AgentBuilder`.
- **Bridge Logic:** The HTTP bridge must detect the `streamingMode`. 
  - If `'stream'`, continue using `text/event-stream`.
  - If `'aggregate'`, the bridge must internally sink the agent's stream frames and return a single `application/json` response containing the final aggregated result.
- **Status Codes:** Ensure proper HTTP status codes are mapped from the final `error` or `success` frames.

### Implementation Hint
Update the `exposeAsHttpEndpoint` logic to conditionally wrap the `AgentInstance.run()` call in an aggregator if the content type is not `text/event-stream`.

---

## 2. Simplified Internal Orchestration
**Goal:** Reduce the boilerplate required to get "just the answer" when calling agents from commands or other handlers.

### Requirements
- **New Context Helpers:** Add the following to `context.agents`:
  - `runObject<T>(options)`: Automatically calls `generateJson`, awaits the final result, and returns the typed object `T`.
  - `runText(options)`: (Refine existing) Ensure it handles reasoning/telemetry transparently and returns just the final string.
- **Invocation API:** Simplify the `AgentInvocation` return type for one-shot calls so that `.final()` is the default expectation when not iterating.

### Example DX
```ts
// Instead of this:
const result = await context.agents.invoke(...).final()

// Use this:
const data = await context.agents.runObject<MySchema>({ agentName: '...', payload: { ... } })
```

---

## 3. "Agent-as-a-Service" Architecture (Documentation Only)
**Goal:** Explicitly document the decision to keep Agents as independent, individually scalable units.

### Requirements
- Update `handbook/2_building_business-logic/agent/index.md`.
- Explain that while agents *feel* like part of a service, they are intentionally decoupled to allow independent scaling (e.g., dedicated GPU/high-memory nodes for AI workers).
- Provide a clear comparison: "Service = Domain Logic / Fast DB calls" vs "Agent = LLM Workload / Slow & Expensive."

---

## 4. Refactor `generateText` & `ModelProvider`
**Goal:** Eliminate logic duplication between the `AiSdkProvider` and the top-level helpers.

### Requirements
- **Centralize Logic:** Move reasoning normalization and text-delta aggregation into a shared internal utility or directly into the `ModelProvider` base implementations.
- **Provider Interface:** Ensure the `ModelProvider` interface is robust enough that the `AgentInstance` doesn't need "extra" logic to handle different provider quirks.

---

## 5. State, Config & Secret Store Integration
**Goal:** Ensure agents utilize the same powerful store patterns as PURISTA services.

### Requirements
- **Context Access:** Ensure `context.states`, `context.configs`, and `context.secrets` are fully supported and typed in the agent handler, just like in Command handlers.
- **Documentation:** 
  - Create a section in `agent/memory-and-knowledge.md` explaining that "Conversation Memory" is for chat history, while "State Stores" are for structured business state (e.g., a form's progress).
  - Show how to use `context.states.set` within an agent handler to persist data across multiple turns without polluting the LLM prompt.

---

## 6. Testing DSL: `MockModel`
**Goal:** Make agent unit testing extremely low-code and readable.

### Requirements
- **New Utility:** Add a `MockModel` class to `@purista/ai`.
- **Fluent API:** Support scripted responses based on input matching.

### Example DX
```ts
const { instance } = await testAgent(myAgent, {
  models: {
    'openai': new MockModel()
      .on('Hello').reply('Hi there!')
      .on(/order (.*)/).reply((match) => `Checking order ${match[1]}`)
      .onJson({ type: 'query' }).reply({ status: 'active' })
  }
})
```

---

## 7. Example Refactoring (ai-basic)
**Goal:** Provide a "Low-Code / High-DX" reference that follows the recommended PURISTA patterns.

### Backend: From Imperative to LLM-Driven
- Use the Vercel AI SDK's tool calling capability.
- Map PURISTA command schemas directly to AI SDK tools.
- Let the LLM decide when to call `lookupFaq` or `calculate`.

### Protocol: Use standard SSE format
- Call `.setSseProtocol('ai-sdk-ui-message')` in the `AgentBuilder`.
- This removes the need for manual frame aggregation on the client.

### Frontend: Use standard `useChat`
- Use `@ai-sdk/react`'s `useChat`.
- The frontend code should shrink by ~70-80%.
- Focus on rendering tool results using the `renderTool` pattern.

### Bootstrap: Service Registration
- (Phase 2 dependent) Ideally use a more direct way to register agents.
- For now, provide a helper that returns a list of services from a set of agent instances.

---

## Definition of Done
1. **Aggregated HTTP:** A `curl` call to an agent with `streamingMode: 'aggregate'` returns a valid JSON object, not a stream.
2. **Simplified Context:** An agent can be called internally with `context.agents.runObject` in a single line of code.
3. **DSL for Tests:** Existing agent tests in the `ai-basic` example can be refactored to use the new `MockModel` DSL, reducing test code by >30%.
4. **Clean Example:** The `ai-basic` example frontend code is reduced by ~70% and the backend uses LLM-driven tool calls.
5. **Docs:** The handbook reflects the store patterns and the architectural rationale for independent scaling.
