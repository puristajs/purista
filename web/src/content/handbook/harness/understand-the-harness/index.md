---
title: Understand the AI Harness
description: Learn the runtime boundaries before adding models, tools, workflows, or persistence.
order: 100
---

Harness is an in-process runtime, not an AI hosting platform. It gives an
application a typed boundary around model calls and agent execution while the
application retains authority over identity, business policy, infrastructure,
and deployment.

```mermaid title="Harness runtime boundaries"
flowchart LR
  App[Application route, worker, or CLI] --> Session[Harness session]
  Session --> Agent[Agent loop]
  Session --> Workflow[Application workflow]
  Agent --> Provider[Model provider]
  Agent --> Capability[Tool, skill, or MCP]
  Session --> State[Storage, workspace, telemetry]
```

1. [Mental model and runtime architecture](/handbook/harness/understand-the-harness/mental-model-and-runtime-architecture/)
2. [Agents, sessions, and lifecycle](/handbook/harness/understand-the-harness/agents-sessions-and-lifecycle/)
3. [Workflows and tasks](/handbook/harness/understand-the-harness/workflows-and-tasks/)
4. [Capabilities and extension points](/handbook/harness/understand-the-harness/capabilities-and-extension-points/)
5. [Context, memory, and persistence](/handbook/harness/understand-the-harness/context-memory-and-persistence/)
6. [Failure and durability model](/handbook/harness/understand-the-harness/failure-and-durability-model/)
