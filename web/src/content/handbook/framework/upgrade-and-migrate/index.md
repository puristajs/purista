---
title: Upgrade and migrate
description: Change PURISTA, its adapters, and service contracts with a staged, observable rollout.
order: 1100
---

An upgrade changes more than a dependency version: it can affect generated artifacts, transport behavior, and contracts that outlive a deployment. Start by identifying the boundary you are changing, then validate it in an environment that uses the intended adapter.

| Change | Primary concern | Start here |
| --- | --- | --- |
| PURISTA or an adapter version | Runtime and dependency compatibility | [Prepare the upgrade](/handbook/framework/upgrade-and-migrate/version-policy-and-preparation/) |
| Command, event, or HTTP contract | Existing consumers and delayed messages | [Preserve contracts](/handbook/framework/upgrade-and-migrate/contract-compatibility/) |
| Process topology or broker | Delivery and recovery behavior | [Migrate adapters](/handbook/framework/upgrade-and-migrate/framework-and-adapter-migrations/) |
| Production rollout | Evidence, rollback, and ownership | [Verify and roll back](/handbook/framework/upgrade-and-migrate/verification-and-rollback/) |

PURISTA does not expose a general one-command migration API that can transform application code, broker data, or external contracts safely. Treat a framework migration as an application change with an owned rollout plan.

Before changing production, run focused service/message tests and an integration environment with the new external dependencies. Keep the previous deployment executable until the new behavior has passed its acceptance checks.

Next: [services and boundaries](/handbook/framework/understand-the-framework/services-and-boundaries/), [adapter availability](/handbook/framework/reference/packages-and-feature-availability/), and [reliability](/handbook/framework/secure-and-operate/reliability/).
