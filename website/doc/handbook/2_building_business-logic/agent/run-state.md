---
title: Durable Run State
description: Persisting long-running execution state, checkpoints, and locks.
order: 203704
---

# Durable Run State

Use `context.runState` when the work must survive beyond one in-memory process:

- execution plans
- task lists
- checkpoints
- recovery metadata
- single-active-run locks

`context.runState` is backed by `context.states`, so it is durable application state, not transient memory.

## Why It Exists

Conversation memory is for LLM context. Run state is for operational workflow state.

Use run state for:

- architecture synthesis
- simulation or validation passes
- background planning
- child-agent orchestration where the UI should show progress

Queued durable agents should use `context.runState` together with a queue bridge and checkpoints. Run state alone is not the full recovery model.

For queued durable agents, PURISTA creates the run record before the handler starts. The handler should read the existing run with `context.runState.get()` and then mutate it with `update()`, `replaceTasks()`, `step()`, `checkpoint()`, and `finish(...)`.

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

await run.checkpoint('spec-snapshot', { projectId: payload.projectId }, { completed: true })
await run.update({ phase: 'running', status: 'running' })

const summary = await run.step(
  'write-files',
  async () => {
    // write files here
    return 'Architecture artifacts written'
  },
  { checkpoint: 'write-files-summary' },
)

await run.update({ phase: 'summarizing', status: 'summarizing' })
await run.finishSuccess(summary)
```

Available operations:

- `context.runState.start(input)`
- `context.runState.get(runId?)`
- `context.runState.update(patch)`
- `context.runState.replaceTasks(tasks)`
- `context.runState.startTask(taskId, detail?)`
- `context.runState.completeTask(taskId, detail?)`
- `context.runState.failTask(taskId, detail?)`
- `context.runState.checkpoint(name, value?, options?)`
- `context.runState.getCheckpoint(name)`
- `context.runState.finish({ summary, status, finalMessage, error })`
- `context.runState.emit()`
- `context.runState.lock(...)`

The handle returned by `start(...)` adds convenience helpers:

- `run.plan(tasks)`
- `run.update(patch)`
- `run.phase(phase, status?)`
- `run.task(taskId, async () => ...)`
- `run.step(id, async () => ..., { checkpoint })`
- `run.checkpoint(name, value, { completed })`
- `run.finishSuccess(summary)`
- `run.finishFailure(summary, error)`
- `run.setFinalMessage(message)`

## Locking and Recovery

If only one run should be active for a scope, acquire a lock when the run starts.

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

If another instance already owns the lock, PURISTA throws a handled conflict instead of silently starting duplicate work.

Queued durable agents should combine:

- `executionMode: 'queued'`
- `executionPolicy.recovery: 'resume-from-checkpoints'`
- `queueBridge` at runtime
- run-state locks for single active work per scope

The queue worker owns run creation, heartbeats, and final release. The handler should not start a second run inside the queued path.

## Streaming To The Frontend

Every persisted update emits the standard `run-state` artifact. In `ai-sdk-ui-message` mode PURISTA maps that to `data-run-state`.

That allows the UI to render:

- title and current phase
- ordered tasks with statuses
- checkpoints and recovery metadata
- completion or failure summary
- input locking while work is active

```tsx
const { messages, data } = useChat({
  api: '/api/v1/agents/supportAgent',
  onData: part => {
    if (part.type === 'data-run-state') {
      setRunState(part.data)
    }
  },
})
```

Keep execution progress separate from the chat transcript. The chat should usually contain the final human-facing summary only.

## Forwarding Child-Agent Progress

If a parent agent forwards a child agent with:

```ts
await context.agents.forward({
  agentName: 'architectureAgent',
  agentVersion: '1',
  payload,
})
```

then child `run-state` artifacts are forwarded too. That lets an orchestrator expose real sub-agent progress to the frontend without custom bridging code.

## Design Guidance

Good:

- stable ids for tasks and checkpoints
- explicit titles and short status details
- verified completion only after persistence succeeds
- one lock scope per business operation

Bad:

- storing todo lists only in local variables
- duplicating run state in conversation history
- marking tasks complete before outputs are verified
- using chat transcript as the source of truth for progress

## Related Pages

- [Context](./handler-context.md)
- [Invocation](./invocation.md)
- [Web & SDK](./frontend.md)
- [Memory & Knowledge](./memory-and-knowledge.md)
