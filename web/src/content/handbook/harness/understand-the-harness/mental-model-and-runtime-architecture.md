---
title: Mental model and runtime architecture
description: See where the Harness ends and where application responsibility begins.
order: 110
---

The Harness compiles definitions for models, tools, skills, agents, workflows,
and adapters. A session then executes one run at a time through those
definitions. It does not become your API gateway, identity provider, queue,
database, secret manager, or policy authority.

```mermaid title="Application, Harness, and infrastructure ownership"
flowchart TB
  subgraph Application
    Caller[Caller and identity]
    Transport[HTTP, worker, or CLI]
    Policy[Authorization and business policy]
  end
  subgraph Harness
    Definition[Harness definition]
    Session[Session]
    Agent[Typed agent loop]
    Workflow[Typed workflow]
  end
  subgraph Infrastructure
    Model[Provider adapter]
    Store[Storage and workspace]
    Boundary[Sandbox or MCP boundary]
  end
  Caller --> Transport --> Policy --> Session
  Definition --> Session
  Session --> Agent
  Session --> Workflow
  Agent --> Model
  Agent --> Boundary
  Session --> Store
```

| Use an agent when | Use a workflow when |
| --- | --- |
| One model-driven conversation can complete the task, possibly with tools | The application must sequence agents, branch, fan out, persist a step, request review, or perform a domain side effect |

An agent owns the model/tool loop. A workflow owns deterministic orchestration
around agents. Do not encode a business approval or database mutation solely in
model instructions.
