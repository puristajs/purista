---
title: Enterprise Interoperability
description: Provider-neutral contracts for schedules, events, queues, long-running jobs, agents, and exports.
order: 610000
---

# Enterprise Interoperability

PURISTA enterprise interoperability is about making service contracts legible to schedulers, brokers, gateways, operators, and other platforms without moving business ownership out of PURISTA services.

The recommended long-running backend storyline is:

```text
schedule -> event -> event-to-queue binding -> long-running queue -> result event -> subscription
```

This keeps each responsibility small:

- schedules declare when something should happen, but production scheduling stays external
- events publish business facts that can have many consumers
- event-to-queue bindings perform bounded handoff from event delivery to durable work
- queues own lease, retry, heartbeat, and dead-letter behavior
- result events publish final worker output to downstream subscribers

See the local runnable example in `examples/enterprise-billing-cycle`.

Continue with:

- [Scheduling](./scheduling.md)
- [Event-to-queue](./event-to-queue.md)
- [Long-running queues](./long-running-queues.md)
- [Result events](./result-events.md)
- [Async agent queues](./async-agent-queues.md)
- [Exports](./exports.md)
