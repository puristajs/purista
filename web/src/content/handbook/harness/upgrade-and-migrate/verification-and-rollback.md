---
title: Verify rollout and rollback
description: Drain Harness 2.1.1 safely, verify Harness 3 in staging and canary deployments, and preserve a version-matched rollback path.
order: 1330
---

Roll out Harness 3 only after source migration, data migration, and adapter
verification are independently green.

## 1. Define stop and rollback conditions

Choose measurable conditions before deployment: startup validation failures,
provider capability errors, permission denials, failed durable resumes,
adapter timeouts, model error rate, or latency regression. Assign an operator
who can stop the rollout and restore the previous deployment and data snapshot.

## 2. Drain Harness 2.1.1

Stop new work, wait for active runs and immediate approvals to settle, and
resolve or cancel application-owned human-review tasks using the 2.1.1
application. Record any run that cannot finish; do not hand it to Harness 3.

Back up application data and every retained 2.1.1 database or namespace before
creating Harness 3 resources. Test the restore command against a non-production
copy.

## 3. Verify staging

Run, in order:

1. application typecheck and build;
2. deterministic agent, tool, workflow, governance, and Guardrail tests;
3. shared contracts for custom storage, memory, workspace, sandbox, and model
   providers;
4. integration tests against each selected real adapter;
5. a restart after every durable workflow step and external wait;
6. one live-provider smoke test with bounded credentials and cost;
7. evaluations for the quality behaviors that deterministic adapters cannot
   prove.

Confirm logs, spans, and metrics contain operational identifiers but no prompts,
tool payloads, secrets, or reviewed content. Follow
[Observe the runtime](/handbook/harness/configure-the-runtime/observability/).

## 4. Deploy a canary

Send only new sessions and new durable runs to Harness 3. Keep its storage,
memory namespaces, workspaces, and sandbox resources separate from 2.1.1. Compare
the predefined health signals before increasing traffic.

Do not run both majors against one session or durable-run namespace. A model
alias may point to the same provider, but that does not make runtime records
compatible.

## 5. Shut down in ownership order

During deployment or rollback:

1. stop accepting new application work;
2. wait for active Harness calls to finish or cancel them deliberately;
3. release idle sessions when their durable history must remain;
4. call `harness.shutdown()`;
5. close application-owned adapter pools and local durable bundles;
6. flush the OpenTelemetry SDK last.

Use `session.destroy()` only when the application intends to delete the
conversation and its Harness-owned records. It is not a graceful worker-drain
operation.

## 6. Roll back without cross-reading

If a stop condition is reached, remove Harness 3 from traffic and restore the
Harness 2.1.1 deployment with its matching pre-migration data snapshot. Do not
point 2.1.1 at Harness 3 databases or replay Harness 3 run events through 2.1.1.

Application business effects that occurred during the canary need their own
idempotent reconciliation or compensation. Restoring Harness storage does not
undo an email, payment, ticket update, or other external side effect.

After the rollback window closes, remove old data only through an approved,
bounded cleanup operation with a verified target and backup policy.
