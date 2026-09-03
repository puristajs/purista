---
title: Orchestrate work
description: Coordinate typed agents, decisions, and durable steps in application-owned workflows.
order: 500
---

Use a workflow when the job needs sequencing, fan-out, review, retries, or a
durable checkpoint. A direct agent remains the better choice for one bounded
model loop. Workflows are typed application code, not another prompting layer.

| Situation | Start here |
| --- | --- |
| Chain or fan out agent work | [Build a workflow](/handbook/harness/orchestrate-work/workflows/) |
| Launch background or private child work | [Child tasks and data flow](/handbook/harness/orchestrate-work/child-tasks-and-data-flow/) |
| Resume after a process failure | [Durable workflows](/handbook/harness/orchestrate-work/durable-workflows/) |
| Pause for an application-owned decision | [Human review](/handbook/harness/orchestrate-work/human-review/) |
| Make retries and side effects safe | [Retries, compensation, and tests](/handbook/harness/orchestrate-work/retries-compensation-and-testing/) |

The application owns queues, scheduling, authorization, domain writes, and
deployment versioning. Harness owns typed workflow execution, cancellation,
events, and the configured durability adapters.
