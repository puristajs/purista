---
title: Agents, sessions, and execution lifecycle
description: Use a session as the application API and an agent as one typed model-and-tool loop.
order: 120
---

An agent accepts validated input, builds a model request, may execute permitted
tools, validates its final output, and emits typed run events. A session provides
the operational context for that run: history, memory, sandbox resources, and
one active run at a time.

```mermaid title="Agent execution through a session"
sequenceDiagram
  participant App
  participant Session
  participant Agent
  participant Model
  App->>Session: agents.answerer.run(input)
  Session->>Agent: start typed run
  Agent->>Model: request
  Model-->>Agent: object or tool call
  Agent-->>Session: validated output
  Session-->>App: result or typed error
```

Use distinct session IDs for concurrent user threads. A second active run on one
session is rejected; a session is not a queue. Use an application queue/worker
when work must wait or survive process restart.

`session.release()` closes live sandbox/MCP resources while retaining persisted
history and runs. `session.destroy()` destructively closes the session and removes
persisted session data. Choose deliberately; neither substitutes for a business
retention policy.
