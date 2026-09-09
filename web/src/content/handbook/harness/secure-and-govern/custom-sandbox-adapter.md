---
title: Build a custom sandbox adapter
description: Implement only the sandbox capabilities and lifecycle guarantees the application can test.
order: 746
---

Implement the public `Sandbox` port with owner registration, attachment,
capability reporting, cancellation, termination, and cleanup. Advertise only
capabilities backed by real tests.

```ts title="Custom Sandbox Adapter example 1"
const definition = defineHarness({ name: 'custom-sandbox' }).addAgent(agent)
const harness = await definition.getInstance({ model: primaryModel, sandbox: customSandbox })
```
Run the shared sandbox contract plus platform tests for path traversal,
process isolation, network policy, quotas, cancellation, restart, snapshot and
restore, concurrent owners, and cleanup. A structurally assignable object is
not evidence of isolation.
