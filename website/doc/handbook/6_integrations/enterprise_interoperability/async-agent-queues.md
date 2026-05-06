---
title: Async agent queues
description: Use the same queue lifecycle for long-running agent execution.
order: 610050
---

# Async agent queues

Long-running agents should use the same queue lifecycle as other durable work. The agent-specific addition is `runId`.

Keep the identifiers separate:

- `jobId` identifies queue ownership, retry, lease, and DLQ state
- `runId` identifies the agent execution
- `conversationId` identifies the logical AI conversation
- `correlationId` remains transport correlation metadata

Async agent endpoints should return an accepted handle instead of waiting for final output:

```json
{
  "jobId": "job_123",
  "runId": "run_456",
  "status": "queued",
  "statusUrl": "/jobs/job_123",
  "streamUrl": "/jobs/job_123/events"
}
```

Deliver final output through result policy, status storage, stream/SSE, event, or callback. Direct aggregate or stream execution is still valid for short interactive agents.

The important constraint is architectural: do not create a separate agent queue transport. Agents run on normal queues and inherit the same lease, heartbeat, retry, and result-event semantics.
