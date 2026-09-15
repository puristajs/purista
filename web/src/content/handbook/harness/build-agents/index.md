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
2. [Create a portable definition](/handbook/harness/build-agents/portable-definitions-and-host-bindings/)
3. [Write instructions and use agent context](/handbook/harness/build-agents/instructions-and-runtime-context/)
4. [Control the model loop](/handbook/harness/build-agents/control-the-model-loop/)
5. [Validate inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/)
6. [Open sessions and run agents](/handbook/harness/build-agents/sessions-and-execution/)
7. [Stream progress and cancel runs](/handbook/harness/build-agents/streaming-cancellation-and-timeouts/)
8. [Handle agent failures safely](/handbook/harness/build-agents/errors-and-failure-behavior/)
9. [Test a basic agent](/handbook/harness/build-agents/test-a-basic-agent/)

Use a workflow when the application must coordinate several agents,
deterministic work, durable steps, or human review. Those concerns belong in
the Harness orchestration chapter, not in a growing agent definition.
