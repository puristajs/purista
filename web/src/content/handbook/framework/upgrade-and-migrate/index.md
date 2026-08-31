---
title: Upgrade and migrate
description: Change PURISTA, its adapters, and service contracts with a staged, observable rollout.
order: 1100
---

An upgrade changes more than a dependency version: it can affect generated artifacts, transport behavior, and contracts that outlive a deployment. Start with the guide for the version you run, then validate the changed boundaries against the adapters used by the deployment.

| Change | Primary concern | Start here |
| --- | --- | --- |
| PURISTA 3.2.4 to PURISTA 4 | Attached-agent model, storage, sandbox, and failure boundaries | [Migrate PURISTA 3 to PURISTA 4](/handbook/framework/upgrade-and-migrate/migrate-v3-to-v4/) |
| PURISTA or an adapter version | Runtime and dependency compatibility | [Prepare the upgrade](/handbook/framework/upgrade-and-migrate/version-policy-and-preparation/) |
| Command, event, or HTTP contract | Existing consumers and delayed messages | [Preserve contracts](/handbook/framework/upgrade-and-migrate/contract-compatibility/) |
| Process topology or broker | Delivery and recovery behavior | [Migrate adapters](/handbook/framework/upgrade-and-migrate/framework-and-adapter-migrations/) |
| Production rollout | Evidence, rollback, and ownership | [Verify and roll back](/handbook/framework/upgrade-and-migrate/verification-and-rollback/) |

The v3-to-v4 guide compares the latest published v3 Framework tag with the current v4 target. It does not include APIs that existed only while v4 was being developed. PURISTA does not expose a general one-command migration API that can transform application code, durable Harness data, broker data, or external contracts safely.

Before changing production, run focused service/message tests and an integration environment with the new external dependencies. Keep the previous deployment executable until the new behavior has passed its acceptance checks.

Next: [services and boundaries](/handbook/framework/understand-the-framework/services-and-boundaries/), [adapter availability](/handbook/framework/reference/packages-and-feature-availability/), and [reliability](/handbook/framework/secure-and-operate/reliability/).
