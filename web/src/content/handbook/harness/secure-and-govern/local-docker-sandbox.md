---
title: Run a local Docker sandbox
description: Configure Docker isolation only when the daemon, image, network, and resource policy are explicit.
order: 742
---

Install `@purista/harness-sandbox-docker`, provision a restricted image, and
bind the adapter at instance creation.

```ts title="Local Docker Sandbox example 1"
import { dockerSandbox } from '@purista/harness-sandbox-docker'
const sandbox = dockerSandbox({ image: 'support-runner:approved', network: 'none' })
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({ models: { answering: answeringModel }, sandbox })
```
A Docker daemon is an operational dependency. Configure filesystem mounts,
network egress, CPU/memory limits, credentials, cleanup, and image provenance.
Docker on one host is not a multi-tenant guarantee; test isolation and failed
cleanup with the deployment boundary.
