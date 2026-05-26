---
title: Async HTTP Exposure
description: Return 202 responses, implement polling commands, and schedule delayed jobs for queues.
order: 203530
---

# Async HTTP Exposure

Expose commands with `.exposeAsHttpEndpoint(..., { mode: 'async' })` when a request should enqueue work and respond quickly. The pattern mirrors CQRS write → async read flows.

## Producer command

```ts
export const pingAsyncCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('pingAsync', 'Async ping endpoint')
  .addPayloadSchema(pingAsyncPayloadSchema)
  .addParameterSchema(pingAsyncParameterSchema)
  .canEnqueue('pingJob', pingJobPayloadSchema, pingJobParameterSchema)
  .exposeAsHttpEndpoint('POST', 'ping/async', undefined, undefined, undefined, undefined, { mode: 'async' })
  .setCommandFunction(async function (context, payload, parameter) {
    const job = await context.queue.enqueue.pingJob(payload, parameter)
    return {
      queueId: job.queueName,
      jobId: job.jobId,
      statusUrl: `/api/v1/ping/status/${job.jobId}`,
    }
  })
```

The HTTP adapter returns `202 Accepted` with the JSON payload above.

## Status command

```ts
export const pingStatusCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('pingStatus', 'Check ping job status')
  .addParameterSchema(z.object({ jobId: z.string().uuid() }))
  .setCommandFunction(async function (context, _payload, parameter) {
    const job = await context.queue.metrics.pingJob(parameter.jobId)
    if (!job) {
      throw new HandledError(StatusCode.Gone, 'Job expired or unknown')
    }

    return {
      state: job.state, // pending | inFlight | completed | failed | deadLetter
      attempts: job.attempt,
      lastError: job.lastError,
      queueId: job.queueName,
      jobId: job.id,
    }
  })
```

Map queue states to HTTP codes:

| queue state | HTTP response | guidance |
| --- | --- | --- |
| `pending` / `inFlight` | `202 Accepted` | Ask the client to poll later. |
| `completed` | `200 OK` with final result | Optionally include output payload from `context.job.complete(result)`. |
| `deadLetter` / `failed` | `500 Internal Server Error` | Surface error details or redirect to manual remediation. |
| `expired` / missing | `410 Gone` | Tell clients the job was purged or never existed. |
| redirect (custom) | `303 See Other` | Include `Location` header to alternate status endpoint. |

## Delayed jobs

Use `scheduleAt` to defer execution:

```ts
await context.queue.scheduleAt.pingJob(Date.now() + 5 * 60_000, payload, parameter)
```

This is ideal for backoff strategies, nightly batches, or cron replacements.

## Client guidance

- Poll the status endpoint with exponential backoff.
- Cache the `statusUrl` in your frontend/API clients.
- Handle `410 Gone` by showing a “job expired” message rather than retrying indefinitely.

## Related docs

- [Queue builder](./the-queue-builder.md)
- [Queue worker builder](./the-queue-worker-builder.md)
- [Queue bridges](../../3_eco_system/queue_bridges/index.md)
- [HTTP exposure for commands](../command/exposing-a-command-as-http-endpoint.md)
