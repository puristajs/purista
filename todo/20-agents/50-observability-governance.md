# Observability & Governance

## 1. Security boundaries

- **Allowlisted tools only** – The agent runtime refuses to invoke commands not present in the manifest. Attempts are treated as handled errors and emitted as protocol error frames (`code = 'ToolNotAllowed'`).
- **Resource isolation** – Agents run inside ordinary PURISTA services/queue workers, so existing authentication, authorization, and deployment controls apply automatically. No extra “AI superpowers” exist unless a developer opts in.
- **Human-in-the-loop** – When teams require approvals, they use queues/subscriptions the same way as other business processes. The spec does not add bespoke “pause/resume” mechanics; instead, document how to build HITL flows using existing queue bridges (e.g., queue job waits for an approval event).

## 2. Pools & concurrency

- Manifest-level `concurrency.poolId`/`maxWorkers` instruct each agent instance to acquire slots from `PoolManager` before running handler code.
- Pool metrics (`active`, `waiting`, `max`, `waitTimeMs`) become part of the agent instance health response (and service info) and are exported as OTEL gauges. Operators can wire alerts externally (Grafana, Prometheus, Datadog).
- Scaling/cost control is explicitly left to the hosting platform (Kubernetes HPA, serverless concurrency). The framework emits the numbers (token usage, run counts, wait time) so downstream tooling can alert or enforce budgets, but Purista itself never guesses pricing or rate limits.

- **Adapter defaults** – pool manager defaults to the in-memory implementation. Projects can swap in Redis/Postgres backed adapters, but the AI package never requires extra infrastructure for local development.

## 3. Telemetry & tracing

- Every agent invocation creates a span named `ai.agent.run`. Tool invocations become child spans named `ai.tool_call:<service>/<command>`.
- Span attributes include:
  - `purista.ai.agent` (name/version)
  - `purista.ai.pool_id`
  - `purista.ai.prompt_tokens`, `purista.ai.completion_tokens`, `purista.ai.token_total`
  - `purista.ai.provider` (from `modelResource`)
- Telemetry frames (protocol) mirror the same metrics so UI clients receive immediate usage data. This satisfies the “provide numbers for alerts” requirement without building a budgeting engine.
- Metric names intentionally align with the [AI SDK telemetry conventions](https://ai-sdk.dev/docs/ai-sdk-core/telemetry) so teams piping results into shared dashboards or transforming frames into AI SDK streams do not need one-off adapters.

## 4. Logging & errors

- Logs come from `context.logger` exactly like any other command/worker. Structured logs include `agentName`, `agentVersion`, `sessionId`, `conversationId`, and `poolId`.
- `HandledError` vs `UnhandledError` semantics stay unchanged. Additional context appears as protocol error frames, letting frontends show meaningful error messages while the backend still performs retries/backoffs per the manifest’s `retryPolicy`.

## 5. Visualization hooks

- Because everything goes through standard PURISTA messages, ops teams can build visualizations by subscribing to protocol envelopes or OTEL traces. No bespoke “agent dashboard” lives inside the framework; instead, the spec documents which metrics/spans are emitted so third parties can build dashboards (Grafana panels, custom SSE dashboards, etc.).
