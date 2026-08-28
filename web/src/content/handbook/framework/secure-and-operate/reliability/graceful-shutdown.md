---
title: Graceful shutdown
description: Drain services and close listeners with a bounded shutdown policy rather than terminating in-flight work blindly.
order: 1033
---

PURISTA exports `gracefulShutdown(logger, list, timeoutMs = 30_000)`. It
installs one-shot `SIGTERM`, `SIGINT`, and `SIGQUIT` handlers, then executes
the supplied entries sequentially. It exits with code `1` if the timeout
elapses or any entry fails; on a clean shutdown it re-sends the received signal
to terminate. The list order is therefore part of your availability design.

## Stop intake before dependencies

For an HTTP application, first reject new API calls, then stop the event bridge
from accepting incoming work, drain services/stores, close the listener, and
finally flush telemetry. Calling `honoService.setServiceUnavailable()` makes
generated endpoints return `503` while shutdown is in progress.

```ts title="src/index.ts"
import { gracefulShutdown } from '@purista/core'

gracefulShutdown(logger, [
  {
    name: 'stop HTTP intake',
    destroy: () => honoService.setServiceUnavailable(),
  },
  eventBridge,
  invoiceService,
  stateStore,
  {
    name: 'http-listener',
    destroy: () => new Promise<void>((resolve, reject) =>
      server.close(error => (error ? reject(error) : resolve())),
    ),
  },
  { name: 'otel', destroy: () => meterProvider.shutdown() },
  { name: 'traces', destroy: () => spanProcessor.shutdown() },
], 30_000)
```

`gracefulShutdown` expects entries with a `name` and `destroy()` method. Most
PURISTA components already satisfy that shape. Add external listeners and
telemetry providers explicitly, as shown above. It does not independently
drain work: each entry's `destroy()` owns that behavior. Do not put an infinite
drain or an interactive repair workflow in this path—the timeout terminates the
process once the budget is spent.

`honoService.prepareDestroy()` is a convenience helper with the same behavior.
Use the wrapper when you want an application-specific entry name; otherwise it
is safe to pass `honoService.prepareDestroy()` directly to
`gracefulShutdown`.

## Pick a realistic termination budget

| Workload | Termination decision |
| --- | --- |
| HTTP command that finishes quickly | Stop intake, use a short drain budget, return `503` for new requests |
| Queue worker | Ensure the platform termination grace period exceeds the longest safe lease/handler window; rely on adapter recovery for unfinished leases |
| Long-running stream | Bound or cancel it deliberately; do not let one client prevent replacement forever |
| Exporter | Flush after business traffic stops, but keep it inside the same timeout |

Set your container/platform termination grace period longer than this in-process
timeout plus a small buffer. Otherwise the platform can kill the process before
the ordered shutdown runs.

`Service.destroy()` cancels active stream sessions and aborts active queue
worker signals with `service_shutdown`, then waits for worker tasks to settle.
Workers must observe `context.signal`; cancellation does not force an arbitrary
handler to stop. An unfinished lease relies on the selected QueueBridge's
recovery path. A service also destroys a QueueBridge it started, including one
supplied at composition time, so do not let several services independently own
the same QueueBridge without an explicit lifecycle strategy.

Test shutdown with a controlled in-flight request/job: new HTTP work receives
`503`, the in-flight operation either completes within budget or is recovered,
and the selected queue adapter redelivers unfinished work according to its
lease/retry configuration. Do not assume a worker completed work it did not
acknowledge.

Next: [chapter overview](/handbook/framework/secure-and-operate/reliability/).
