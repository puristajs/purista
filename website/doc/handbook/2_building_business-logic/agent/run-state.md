---
title: Durable Run State
description: Persisting long-running agent execution state, progress, and locks.
order: 203704
---

# Durable Run State

Use `context.runState` when an agent performs work that should survive beyond one in-memory process:

- execution plans
- todo/task lists
- current phase and summary
- single-active-run locks
- resumable progress for reconnecting frontends or distributed workers

`context.runState` is backed by `context.states`, so it is durable application state, not transient instance memory.

## When To Use It

Use conversation memory for LLM context. Use durable run state for operational workflow state.

Examples:

- architecture generation with multiple steps
- simulation or validation passes
- long-running background review jobs
- child-agent orchestration where the UI should show progress

## Core Lifecycle

```ts
const run = await context.runState.start({
  title: 'Architecture synthesis',
  extraScope: { projectId: payload.projectId },
  lock: { key: 'architecture' },
})

await run.plan([
  { id: 'review-spec', title: 'Review specification' },
  { id: 'write-files', title: 'Write architecture artifacts' },
  { id: 'verify', title: 'Verify persisted outputs' },
])

await run.phase('running', 'Generating architecture artifacts')

await run.task('write-files', async () => {
  // persist files here
})

await run.finishSuccess('Architecture artifacts are ready.')
```

Available operations:

- `context.runState.start(input)`
- `context.runState.get(runId?)`
- `context.runState.update(patch)`
- `context.runState.replaceTasks(tasks)`
- `context.runState.startTask(taskId, detail?)`
- `context.runState.completeTask(taskId, detail?)`
- `context.runState.failTask(taskId, detail?)`
- `context.runState.finish({ summary, status })`
- `context.runState.emit()`
- `context.runState.lock(...)`

The handle returned by `start(...)` adds convenience helpers:

- `run.plan(tasks)`
- `run.phase(status, detail?)`
- `run.task(taskId, async () => ...)`
- `run.finishSuccess(summary)`
- `run.finishFailure(summary)`

## Locking

If only one run should be active for a given scope, acquire a lock when the run starts:

```ts
const run = await context.runState.start({
  title: 'Simulation',
  extraScope: { projectId: payload.projectId },
  lock: {
    key: 'simulation',
    extraScope: { projectId: payload.projectId },
  },
})
```

If another instance already owns the lock, PURISTA throws a handled conflict instead of silently running duplicate work.

Use this for:

- validation queues
- architecture generation
- simulation
- implementation runs

## Streaming To The Frontend

Every persisted update emits the standard `run-state` artifact.

In `ai-sdk-ui-message` mode PURISTA automatically maps that to `data-run-state`.

That allows the UI to render:

- current run title
- current phase
- ordered tasks with statuses
- final summary
- input locking while work is still active

```tsx
const { messages } = useChat({
  api: '/api/v1/agents/support',
  onData: part => {
    if (part.type === 'data-run-state') {
      setRunState(part.data)
    }
  },
})
```

Keep the execution panel separate from the chat transcript. The chat should usually contain only the final human-facing summary.

## Forwarding Child-Agent Progress

If a parent agent forwards a child agent with:

```ts
await context.agents.forward({
  agentName: 'architectureAgent',
  agentVersion: '1',
  payload,
})
```

then child `run-state` artifacts are forwarded too. That lets an orchestrator agent expose real sub-agent progress to the frontend without custom bridging code.

## Design Guidance

Treat run state as workflow state, not prompt state.

Good:

- stable ids for tasks
- explicit titles and short status details
- verified completion only after persistence succeeds
- one lock scope per business operation

Bad:

- storing todo lists only in local variables
- duplicating run state in conversation history
- marking tasks complete before outputs are verified
- using chat transcript as the source of truth for execution progress

## Related Pages

- [Context](./handler-context.md)
- [Invocation](./invocation.md)
- [Web & SDK](./frontend.md)
- [Memory & Knowledge](./memory-and-knowledge.md)
