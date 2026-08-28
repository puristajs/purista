---
title: Sessions and execution
description: Open a session at the application boundary and invoke agents through its typed API.
order: 340
---

The session holds the operational context for a run, including history, memory,
sandbox resources, and run events. It allows one active run at a time; it is not
a queue.

```ts title="src/transport/classifySupportCase.ts"
import { classifyCaseHarness } from '../harness/classifyCase.js'

const session = await classifyCaseHarness.getSession('support-thread-01')

const result = await session.agents.classify_case.prompt({
  summary: 'The customer cannot sign in after a password reset.',
})

console.log(result.priority)
await session.release()
```

Use distinct session IDs for independent concurrent threads. If work must wait,
be retried by a broker, or survive an application process restart, send it
through the application/PURISTA queue and use a workflow with explicit durable
state where appropriate.

`release()` closes live session resources while retaining persisted state.
`close()` destructively closes a session and removes persisted session data.
Select one based on application retention policy; neither is a general privacy
deletion policy.
