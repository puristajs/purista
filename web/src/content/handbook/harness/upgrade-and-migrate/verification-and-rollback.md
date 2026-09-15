---
title: Verify Harness v4 rollout and rollback
description: Prove the v4 source rewrite, adapters, outcomes, and data boundaries before production traffic moves.
order: 1330
---

Define measurable stop conditions before deployment: startup validation failure,
provider capability mismatch, permission denial, durable restart failure,
approval resume failure, adapter timeout, duplicate side effect, or a
redaction violation.

## Verify the source and runtime

Run, in order:

1. application typecheck and build;
2. deterministic agent, tool, workflow, governance, and Guardrail tests;
3. storage, memory, workspace, sandbox, MCP, and model-provider contracts;
4. restart tests after durable steps and external waits;
5. one bounded live-provider smoke test;
6. evaluations for behaviors deterministic fakes cannot prove.

Confirm traces and metrics contain operational identifiers without prompts,
tool payloads, secrets, reviewed content, or tenant identifiers.

## Deploy a canary

Send only new sessions and new durable runs to v4. Keep storage, memory
namespaces, workspaces, artifact stores, and sandbox resources separate from
the old runtime. Compare the predefined health and business signals before
increasing traffic.

Do not run both versions against one session or durable-run namespace. A shared
provider model does not make runtime records compatible.

## Shut down in ownership order

Stop new application work, let active calls finish or cancel them deliberately,
release retained sessions, destroy sessions only when deletion is intended, then
close the Harness instance:

~~~ts title="Close the Harness runtime"
await instance.close()
~~~

Close application-owned adapters next and flush telemetry last.

## Roll back without cross-reading

If a stop condition is reached, remove v4 from traffic and restore the previous
deployment with its matching data snapshot. Do not point the old runtime at v4
storage or replay v4 run events through it. Reconcile external business effects
with an idempotent application procedure; restoring Harness storage cannot undo
an email, payment, or ticket update.

After the rollback window closes, remove old data only through a bounded,
verified cleanup operation with a backup and retention record.
