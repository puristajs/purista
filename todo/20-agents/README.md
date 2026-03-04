# `@purista/ai` Specification (Draft)

This directory contains the specifications for integrating robust, multi-agent AI orchestration natively into the PURISTA framework.

The spec now reflects the consolidated `@purista/ai` package: builders, runtime helpers, protocol tooling, MCP bridges, and evaluation utilities all live in `packages/ai`, depend on the Vercel AI SDK for provider plumbing, and stay optional for applications that do not import the package.

The goal is to allow developers to build AI components within a PURISTA-based application that feel native to the framework's pattern, style, and architecture, providing strong error handling, validation, traceability, modularity, and isolation. AI remains an optional add-on: applications that do not import `@purista/ai` continue to work unchanged.

## Table of Contents

- [00-requirements.md](./00-requirements.md)
  - Functional, Reliability, DX, and Governance requirements for native AI integration.
  - Emphasis on utilizing PURISTA's Core `streams` and `async-queues`.

- [10-platform-architecture.md](./10-platform-architecture.md)
  - Package layout centred on the `AgentBuilder`, protocol helpers, and adapters.
  - How standalone agent instances register on the EventBridge and expose streaming APIs without new runtime services.
  - Pool/concurrency rules that reuse existing async-queue capabilities but are configured per agent.

- [20-protocol-and-ui.md](./20-protocol-and-ui.md)
  - Protocol as payload (reuse message IDs, correlation IDs, actor metadata).
  - Helper functions that prevent manual envelope assembly.
  - Message/artifact/telemetry/error frames consumable by any UI or external system.

- [30-builder-integration.md](./30-builder-integration.md)
  - `new AgentBuilder(...)` ergonomics, `.getInstance(eventBridge, options)`, and lifecycle management.
  - CLI scaffolding for standalone agents with prepared agent test files.
  - HTTP/OpenAPI exposure that mirrors command configuration knobs.

- [40-core-interfaces.md](./40-core-interfaces.md)
  - Agent definition + instance contracts, provider/session/knowledge adapter interfaces.
  - Protocol helper exports reusable outside PURISTA and registered via builder metadata.

- [50-observability-governance.md](./50-observability-governance.md)
  - Allowlisted tools, concurrency pools, OpenTelemetry spans surfaced by each agent runtime.
  - Telemetry frames for token usage/duration without a budgeting engine.
- [99-review-feedback-tracker.md](./99-review-feedback-tracker.md)
  - Active feedback checklist and alignment status.
  - Includes tracking for naming, stream behavior, runtime pool config, and docs/example parity.

## Canonical example

`examples/ai-basic` is the mandatory, copy-pasteable reference implementation. It must continuously cover:

- Agent endpoints exposed through HTTP/SSE
- Command -> agent invocation using `canInvokeAgent` + `context.invokeAgent`
- Allowlisted command tools
- Agent-to-agent delegation
- Event subscription -> agent invocation
- Deterministic tests for both agents and integration command flow
