---
title: Streaming, cancellation, and timeouts
description: Stream typed run events and propagate caller cancellation without turning streaming into an HTTP protocol.
order: 350
---

Harness exposes typed run events. Your application maps them to SSE, WebSocket,
CLI output, or another transport; Harness does not prescribe a browser protocol.

```ts title="src/transport/streamSupportClassification.ts"
import { classifyCaseHarness } from '../harness/classifyCase.js'

const controller = new AbortController()
const session = await classifyCaseHarness.getSession('support-thread-01')

for await (const event of session.agents.classify_case.stream({
  summary: 'The customer cannot sign in after a password reset.',
}, {
  signal: controller.signal,
  timeoutMs: 30_000,
})) {
  if (event.type === 'run.finished') console.log(event.output)
}
```

The default object-based loop emits content-free `model.completed` accounting
for each completed provider call, including intermediate tool-call responses
and candidates later blocked by output rails. It emits `model.object` only
after the final candidate passes output rails and its schema; never add usage
from both events. Tool-call responses do not pass through final-output rails.
A workflow or custom agent handler can call `textStream(...)` or
`objectStream(...)`; model chunks remain private unless that call opts into
`emitRunEvents: true`. Those direct calls own their content-release boundary;
agent rails do not automatically cover them or opaque provider reasoning.

Cancellation propagates into model calls, tools, memory, and sandbox operations.
Handlers should still observe `ctx.signal` and stop external side effects
promptly. A timeout ends the Harness run; it cannot guarantee that a provider
SDK or external side effect has already stopped.

Policy, approval, audit, and rail callbacks receive a bounded effective
`signal` and `deadline`. Forward them to dependencies and stop on abort.
Late callback success cannot admit a tool after cancellation or timeout, but
admission cannot be revoked after an external effect starts. A long human
review uses a durable wait and application execution claim/receipt, not a
Promise held open inside an approval callback.
