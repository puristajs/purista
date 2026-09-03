---
title: Test adapters
description: Run the shared port contract, then add provider-specific tests for topology, isolation, recovery, and operations.
order: 814
---

A custom adapter has two obligations. It must behave like the Harness port, and
its backing platform must enforce the additional guarantees your deployment
claims. Test those obligations separately so a passing generic suite is never
mistaken for proof of infrastructure isolation or durability.

## Run the matching shared contract

Import contract suites from `@purista/harness/testing`. Each suite constructs a
fresh adapter per test and verifies the public lifecycle, data shapes,
cancellation, and normalized failures.

| Adapter port | Contract helper |
| --- | --- |
| Harness storage | `harnessStorageContract` |
| Sandbox | `sandboxContract` |
| Sandbox text search | `sandboxTextSearchContract` |
| Distributed sandbox | `sandboxMultiClientContract` |
| Durable workspace | `durableWorkspaceContract` |
| Memory engine | `memoryEngineContract` |
| Model provider | `modelProviderContract` |
| Logger | `loggerContract` |

This example validates a custom files-and-command sandbox:

```ts title="src/adapters/isolatedSandbox.contract.test.ts"
import { sandboxContract, sandboxMultiClientContract, sandboxTextSearchContract } from '@purista/harness/testing'
import { createIsolatedSandbox, createIsolatedSandboxPair } from './isolatedSandbox.js'

sandboxContract(() => createIsolatedSandbox(), { executor: 'available' })
sandboxTextSearchContract(() => createIsolatedSandbox())
sandboxMultiClientContract(() => createIsolatedSandboxPair())
```

`createIsolatedSandboxPair()` must return two independently constructed clients
over the same deterministic test backend. That proves a second worker can
attach to the same logical scope and that termination invalidates stale
attachments without exposing provider references through the public API.

Do not copy a first-party fake and rename it as the production adapter. The
factory in a contract test must construct the implementation the application
will configure, with only its external SDK or transport replaced by a
deterministic client.

## Add the platform tests the contract cannot provide

| Claimed behavior | Required provider-specific evidence |
| --- | --- |
| Tenant isolation | Two authorized tenants cannot read, attach, list, or mutate each other's state |
| Process isolation | Guest code cannot reach host paths, sockets, metadata services, or inherited credentials |
| Network policy | Default deny and every allowlist/redirect/DNS boundary are enforced by the platform |
| Resource limits | CPU, memory, PID, storage, output, and wall-clock limits fail explicitly |
| Durable recovery | A new process or worker resumes only committed state; missing state fails closed |
| Concurrency | Lease/fence conflict, stale owner rejection, handoff, and retry are deterministic |
| Cleanup | Termination is idempotent; partial cleanup remains visible and retryable |
| Privacy | Logs, spans, metrics, events, and errors omit content, credentials, paths, identities, and provider references |
| Data-local search | Files remain in the sandbox backend; adversarial patterns, scan limits, cancellation, ordering, and incomplete results match the shared contract |

Run external-provider tests only when explicit environment variables select the
provider and disposable resources. Use unique, synthetic owner identifiers and
an idempotent cleanup path so a failed CI job can be reconciled safely.

## Test application wiring separately

After the adapter contract passes, build one small Harness with that adapter
and verify the application-required capability using a fake provider. This
catches composition mistakes such as registering a sandbox after tools,
omitting `.requires(...)`, selecting an adapter without `sandbox.spawn`, or
forgetting shutdown.

Keep a live model out of this test. Adapter conformance, application wiring,
and model quality are independent questions with different failure evidence.
