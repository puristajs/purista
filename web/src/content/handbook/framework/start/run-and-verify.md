---
title: Run and verify the application
description: Prove that the generated project builds, tests, and starts before adding infrastructure.
order: 160
---

The first verification is intentionally local. It proves that generated definitions, schemas, service wiring, command execution, and event delivery agree before external infrastructure adds another failure boundary.

## Run the checks

```bash title="Run generated project checks"
npm test
npm run build
node --import tsx src/verify-first-result.ts
```

The generated Node project supplies the first two scripts and installs `tsx` as
a local development dependency. The last command runs the verifier created in
[Add a subscription](/handbook/framework/start/add-a-subscription/). It starts
the two services, invokes the command through the local EventBridge, waits for
the subscription handler, and tears the local runtime down again.

`npm run start` still starts `src/index.ts` for a long-lived local process. It
does not itself submit an incident because the default scaffold has no public
transport. Add an [HTTP server and exposed command](/handbook/framework/expose-and-consume-services/http-and-rest/) when a browser, CLI, or another process must invoke the service.

## Expected evidence

- Tests pass for the generated service, command, and subscription files.
- The verifier prints `Command result: { incidentId: 'incident-8' }` for the `API down` input shown in the previous page.
- Structured logs include `notification accepted`, proving that the `incidentCreated` success event reached the notification subscription in the local process.
- Startup logs show that the selected EventBridge started before its services. Warnings about the default state, configuration, and secret stores identify their development-only boundary.

## If it does not work

| Symptom | Check first | Safe correction |
| --- | --- | --- |
| Type error in a handler | Generated schema and handler return value | Return the declared output shape; do not weaken the schema to hide an error. |
| Service never receives an event | Event name and service startup order | Start the EventBridge, then the subscriber and producer services, before invoking the command. |
| `InvalidCommand` or a timeout | The receiver address in `verify-first-result.ts` | Derive the service name and version from `incidentService.serviceInfo`; keep `createIncident` equal to the command builder name. |
| Repeated external side effect | Subscription retry path | Add an idempotency key or a persisted deduplication strategy before retrying. |

Next: [understand the Framework](/handbook/framework/understand-the-framework/), or build a [queue and worker](/handbook/framework/build-services/queues-and-workers/) for durable background work.
