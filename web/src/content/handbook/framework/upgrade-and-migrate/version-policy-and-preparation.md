---
title: Prepare a Framework or adapter upgrade
description: Inventory the application boundary, align official packages, and test the target runtime before rollout.
order: 1120
---

Keep official `@purista/*` packages on compatible versions; mixed major versions can create TypeScript and runtime mismatches. Record the current lockfile, generated artifacts, configured adapters, and external platform versions before changing dependencies.

For the current major transition, start with [Migrate PURISTA 3 to PURISTA 4](/handbook/framework/upgrade-and-migrate/migrate-v3-to-v4/). A version guide owns exact source changes; this page owns the reusable preparation process.

## Build an upgrade inventory

For a billing service running an HTTP server, NATS EventBridge, Redis queue,
and AWS secret store, the upgrade unit is the whole deployed composition—not
only `@purista/core`. Capture the current and target value for each boundary so
you can reproduce a failure and roll back without guessing.

| Boundary | Capture before changing | Verify after changing |
| --- | --- | --- |
| Application packages | Lockfile, Node/runtime version, CLI-generated sources | Build/typecheck and generated-artifact diff |
| Service contracts | Exposed commands/events, schema versions, retention period | Old and new client/subscriber behavior |
| Bridge and queue | Adapter version, broker mode, capability settings, ACLs | Startup capability validation and one protected round trip |
| Stores | Adapter configuration, key/secret paths, backup/retention | Allowed and denied access, read/write compatibility |
| Operations | Probe, telemetry, alerts, rollback command/configuration | Canary evidence and bounded recovery procedure |

1. Read the release notes and current package README for every changed package.
2. Upgrade the Framework and its selected official adapters together in a branch.
3. Regenerate artifacts only through the project-local CLI commands when their generated output changes.
4. Run unit/contract tests, then start the application against a disposable instance of each selected broker, store, and HTTP server.
5. Promote only after health, traces, expected messages, and failure paths are verified.

Do not infer package compatibility from a successful `npm install`. Installation proves dependency resolution, not credential validity, broker capability, or safe message delivery.

Use [package availability](/handbook/framework/reference/packages-and-feature-availability/) to identify optional packages, and [test the target topology](/handbook/framework/test-applications/local-infrastructure-and-production-adapters/) before rollout.
