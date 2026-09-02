---
title: Test sandbox isolation and lifecycle
description: Separate portable adapter-contract tests from backend tests that prove real process, network, resource, and tenant isolation.
order: 779
---

A passing TypeScript contract proves Sandbox protocol behavior. It does not
prove that a container, microVM, or remote platform isolates hostile code.
Test both layers before describing an adapter as suitable for untrusted work.

## 1. Run the portable contract

```ts title="src/trackedFilesystemSandbox.test.ts"
import { sandboxContract } from '@purista/harness/testing'
import { TrackedFilesystemSandbox } from './trackedFilesystemSandbox.js'

sandboxContract(() => new TrackedFilesystemSandbox(), { executor: 'unavailable' })
```

[`sandboxContract(...)`](/handbook/api/functions/_purista_harness_testing.sandboxContract/)
checks owner registration, bounded administration, create/attach/restore
behavior, concurrent create idempotency, filesystem operations, attachment
close, termination, state loss, path validation, mounts, and the declared
executor state. Pass `executor: 'available'` only when `exec(...)` is genuinely
implemented; the suite then also checks execution, timeout, and cancellation.

Use a fresh adapter for every contract test. Never point the portable suite at
a shared production namespace.

## 2. Add contracts for advertised guarantees

| Adapter claim | Additional verification |
| --- | --- |
| Several adapter clients share one backend | [`sandboxMultiClientContract(...)`](/handbook/api/functions/_purista_harness_testing.sandboxMultiClientContract/) plus real concurrent clients |
| Snapshot/resume/hibernate | [`sandboxSnapshotContract(...)`](/handbook/api/functions/_purista_harness_testing.sandboxSnapshotContract/) plus backend restart tests |
| `sandbox.spawn` | Process stdio ordering, exit, kill, cancellation, and cleanup after attachment close |
| Immutable mounts | Mutation attempts from inside the isolated process must fail |
| Persistent files | Detach, process restart, reattach, and exact state-retention tests |
| Workspace binding | Checkpoint, worker restart, restore, and missing-state failure tests |

Capabilities missing from the public tuple must also be absent from the typed
session. Add compile-time tests so a filesystem-only adapter cannot call
`exec` or `spawn`.

## 3. Prove the platform boundary

Run provider-level tests against disposable infrastructure:

- filesystem traversal, symlink, device, and host-mount escape attempts;
- default-deny network egress and explicit destination allowlists;
- unprivileged user and restricted Linux capabilities;
- CPU, memory, PID, disk, output, and wall-clock limits;
- scoped secret injection with no inheritance from the host process;
- tenant and run separation across concurrent workers;
- process cleanup after timeout, cancellation, client loss, and provider error;
- exact cleanup retries and orphan reconciliation;
- image or VM provenance and dependency policy; and
- content-free logs, metrics, traces, errors, and administration results.

These checks depend on the backend. Keep them beside the adapter package and
run them in an environment that can observe the provider boundary.

## 4. Test application behavior separately

Application tests should inject a deterministic adapter or `FakeSandbox` and
verify the tool or workflow behavior: correct path, expected file content,
cleanup call, cancellation response, and safe error mapping. They should not
need Docker, a remote sandbox account, or provider credentials.

The maintained custom adapter example contains both the application test and
the portable contract:

```bash title="Run deterministic sandbox tests"
cd examples/custom-sandbox-adapter
npm install
npm test
```

Use the [Docker sandbox guide](../local-docker-sandbox/) for the first-party
local container adapter. Treat it as trusted local tooling unless its selected
deployment and additional platform tests prove the stronger boundary your
application requires.
