---
title: Troubleshooting and runbooks
description: Diagnose production symptoms from safe evidence and correct the boundary that actually failed.
order: 1060
---

Start with the failing boundary and its correlation/trace identifier. Preserve
safe evidence before changing topology, retrying, or replaying work. A restart
is not a diagnosis and can duplicate an unfinished side effect.

| Symptom | Inspect | Safe corrective action | Verify |
| --- | --- | --- | --- |
| Service does not receive messages | Bridge health, subscription registration, topic/queue ACL | Correct bridge config/ACL, then restart only the affected consumer if needed | Publish one controlled event and observe the handler trace |
| Queue backlog or oldest-job age rises | Worker health, concurrency, downstream latency, DLQ count | Find the limiting dependency; repair poison jobs before bounded replay | Backlog age falls without retry/error growth |
| Repeated side effect | Business idempotency record and acknowledgement sequence | Reconcile the business key; add deduplication before another retry | Replayed job acknowledges without a second effect |
| Store or secret resolution fails | Workload identity, endpoint, component/bucket/path access | Fix least-privilege policy/connectivity; never log the secret value | A required read succeeds and neighboring target stays denied |
| HTTP route is missing/forbidden | Command exposure, service registration, middleware policy | Correct explicit exposure/registration/authentication—not all routes public | Expected route succeeds; protected neighboring route remains denied |
| Process fails during rollout | Readiness, shutdown logs, termination grace period | Fix readiness/shutdown order or startup dependency | New requests drain/reject safely and unfinished jobs recover |

Each runbook should name an owner, alert threshold, safe evidence source,
rollback/repair authority, customer-impact communication path, and the exact
queue/tenant/data scope permitted for a replay. Link a dead-letter procedure to
[recovery and replay](/handbook/framework/secure-and-operate/reliability/recovery-and-replay/).
Do not instruct operators to restart or replay blindly.

Next: [chapter overview](/handbook/framework/secure-and-operate/).
