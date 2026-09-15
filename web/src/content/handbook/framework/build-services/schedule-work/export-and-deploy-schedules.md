---
title: Export and deploy schedules
description: Treat schedule definitions as external-platform input, then make installation, deployment, enablement, and verification explicit for the selected scheduler.
order: 363
---

PURISTA has no default in-process production scheduler, but Core and the
project-local CLI can export schedule contracts. The export is an artifact for
your scheduler platform; it does not deploy a trigger or execute a schedule.
There is no scheduler runtime package. Install the CLI that provides the
`purista` executable:

```bash title="Install the PURISTA CLI for schedule export"
npm install --save-dev @purista/cli
```

## Export the contract before deploying it

Write the selected service builders to the standard definitions artifact during
your build, then generate the schedule manifest from that artifact.

```ts title="tools/export-service-definitions.ts"
import { writeFile } from 'node:fs/promises'
import { exportServiceDefinitions } from '@purista/core'
import { billingV1Service } from '../src/service/billing/v1/billingV1Service.js'

const definitions = await exportServiceDefinitions([billingV1Service])
await writeFile('purista.definitions.json', `${JSON.stringify(definitions, null, 2)}\n`)
```

```bash title="Export the provider-neutral schedule manifest"
npm exec purista export schedule-manifest \
  --definitions purista.definitions.json \
  --out schedule-manifest.json
```

[`exportScheduleManifest(...)`](/handbook/api/functions/_purista_core.exportScheduleManifest/)
and the CLI command serialize service-, command-, and queue-owned schedule
definitions into portable JSON. Review this artifact in the same change as its
service contract. It does not connect to a scheduler, validate a cron dialect,
or create a target endpoint.

## Generate Kubernetes CronJobs only for cron schedules

The optional Kubernetes export generates `batch/v1` CronJob JSON from cron
schedules. It requires a caller-owned trigger container and exactly one trigger
shape: a command (with optional arguments) or an HTTP request template.

```bash title="Export Kubernetes CronJobs with an HTTP trigger"
npm exec purista export kubernetes-cronjob \
  --definitions purista.definitions.json \
  --out kubernetes-cronjobs.json \
  --trigger-image registry.example.com/billing-schedule-trigger:1.0.0 \
  --trigger-url https://scheduler.internal.example/run
```

| Export behavior | What the generated CronJob does | What your deployment must still own |
| --- | --- | --- |
| Cron expression and timezone | Sets `spec.schedule` and `spec.timeZone`. | Use a Kubernetes-compatible cron expression. One interval or one-shot schedule makes the entire CronJob export throw; split manifests or export those schedules for another platform. |
| `allow`, `forbid`, `replace` | Maps to Kubernetes `Allow`, `Forbid`, `Replace`. | Verify the platform's overlap behavior matches the business effect. |
| `enabledByDefault: false` | Sets `spec.suspend: true`. | Review and unsuspend the real CronJob deliberately. |
| Missed runs, catch-up, jitter, idempotency key, provider hints | Copies the values into `purista.dev/*` annotations. | Implement and verify any required enforcement in the trigger or platform; annotations do not enforce it. |
| Event, queue, or command target | Renders target variables into the supplied trigger template. | Authenticate and authorize the trigger, then emit, enqueue, or invoke the declared target. |

[`exportKubernetesCronJobs(...)`](/handbook/api/functions/_purista_core.exportKubernetesCronJobs/)
is a pure JSON generator. It never supplies the image, credentials, URL,
service account, namespace, or target implementation.

The export also aborts as a whole when any schedule has an unsupported target
kind. It does not skip incompatible entries and continue with a partial set.

## Do not skip the platform enablement boundary

Before enabling a schedule that can change money, inventory, or customer
communication, verify each step with the platform owner:

1. Choose a scheduler platform that supports your expression, timezone,
   overlap, retry, and identity requirements.
2. Generate and review the platform artifact/trigger from the registered
   schedule metadata.
3. Grant it only permission to invoke the selected command, emit the selected
   event, or enqueue the selected queue job.
4. Deploy it with the service/bridge topology that owns its target.
5. Start disabled when the first execution is consequential; use
   `enabledByDefault: false` as deployment intent and enable the real platform
   trigger only after review.
6. Perform one safe run and verify the target's event, job, trace, and logs.

`providerHints` can carry provider-specific export metadata, but PURISTA core
does not interpret or validate it. A successfully generated artifact does not
prove cron dialect compatibility, timezone data, permission, target discovery,
or network connectivity.

Document the selected platform next to its infrastructure/deployment code, and
write a real integration test that proves one deployed trigger reaches the
registered target. The platform's own retry behavior does not replace queue
delivery or business idempotency.

For the portable contract, see [ScheduleDefinition](/handbook/api/types/_purista_core.ScheduleDefinition/).
