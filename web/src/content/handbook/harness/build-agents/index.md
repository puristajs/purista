---
title: Build agents
description: Define a bounded model loop with schemas, a session lifecycle, streaming, and deterministic tests.
order: 300
---

An agent is one typed model-and-tool loop. It is not a workflow engine, a route
handler, or an authorization boundary. Start with a schema-validated direct
agent, then add sessions, streaming, timeouts, and tests as the application
needs them.

1. [Define an agent](/handbook/harness/build-agents/agent-definition/)
2. [Set instructions and runtime context](/handbook/harness/build-agents/instructions-and-runtime-context/)
3. [Validate inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/)
4. [Open a session and execute a run](/handbook/harness/build-agents/sessions-and-execution/)
5. [Stream, cancel, and time-bound work](/handbook/harness/build-agents/streaming-cancellation-and-timeouts/)
6. [Handle errors and failure behavior](/handbook/harness/build-agents/errors-and-failure-behavior/)
7. [Test a basic agent](/handbook/harness/build-agents/test-a-basic-agent/)

Use a workflow when the application must coordinate several agents,
deterministic work, durable steps, or human review. Those concerns belong in
the Harness orchestration chapter, not in a growing agent definition.
