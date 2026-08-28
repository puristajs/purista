---
title: Verify and roll back a migration
description: Define acceptance evidence and a safe exit before changing a production Framework boundary.
order: 1140
---

Write the rollback condition before rollout. A safe condition names an observable failure, such as a sustained authorization error, rising duplicate side effects, failed readiness, or unexpected retry/DLQ growth—not a vague sense that the release is unhealthy.

| Stage | Evidence | Exit condition |
| --- | --- | --- |
| Pre-production | Contract tests and a real adapter connection | Do not proceed on capability/credential failures |
| Canary | Health, traces, error rate, message lag, and business result | Stop on defined regression threshold |
| Rollout | Consumer drain and delivery/retry evidence | Keep prior runtime available while contracts overlap |
| Completion | Old traffic and retained messages are handled or expired by policy | Remove old path only with recorded evidence |

Rollback configuration and deployment first; do not blindly replay messages or reverse a data change. Confirm whether the new version emitted side effects, then use the business recovery procedure for only the affected records.

For the invoice-email migration, an acceptable canary might require no increase
in queue age, authorization failures, duplicate delivery records, or provider
errors over a defined traffic sample. If it fails, stop the new producer,
restore the previous consumer/deployment configuration, and reconcile the
small set of business keys processed by the canary before replaying anything.
The rollback succeeds when the previous contract is serving safely—not merely
when the new Pod/process has stopped.

Use [troubleshooting and runbooks](/handbook/framework/secure-and-operate/troubleshooting-and-runbooks/) and [message-flow tests](/handbook/framework/test-applications/message-flows-queues-and-retries/) to prepare the evidence.
