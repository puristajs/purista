# Architecture Overview

The `@purista/sandbox` package is designed as a decoupled, message-driven component within the PURISTA ecosystem.

## Core Components

### 1. Sandbox Runtime
A standard PURISTA service that exposes commands for sandbox lifecycle management (`createSandbox`, `ensureSandbox`, `destroySandbox`) and execution (`executeBash`).

### 2. Sandbox Drivers
The service is driver-agnostic. It interacts with virtualization technologies via a common `SandboxDriver` interface. This allows the same business logic to run against Docker, Podman, Lima, or Firecracker.

### 3. Sandbox Registry
A specialized resource that tracks active sandboxes. It uses the PURISTA **State Store** for persistence. Key features include:
- **Tenant Isolation**: Ownership is derived from message `tenantId` + `principalId` and stored as `organizationId` + `userId` plus explicit `projectId`.
- **Self-Healing**: On startup, the service reconciles its internal registry only from runtimes that can recover the full owner tuple from labels/tags.

## Message Flow

1. **Request**: A user or agent sends `createSandbox` or `ensureSandbox` with `tenantId` / `principalId` in the PURISTA message and `projectId` in the payload.
2. **Provisioning**: The service calls `driver.createSandbox()`.
3. **Registration**: The new sandbox metadata is stored in the `SandboxRegistry` (State Store).
4. **Execution**: AI agents use the `executeBash` command. The service verifies ownership via the registry before delegating to the driver.
5. **Teardown**: When a task is finished, `destroySandbox` is called, cleaning up both the infrastructure and the registry entry.

## Lifecycle Rules

- `createSandbox` is explicit and fails with `409 Conflict` if an owner already has a sandbox.
- `ensureSandbox` is the idempotent path. It returns the current healthy sandbox or recreates an unhealthy one.
- Drivers must not return partial metadata during reconciliation. If owner metadata cannot be recovered, `scanRunningSandboxes()` must return `[]` for those instances.

## Resource-Based Injection

Following the PURISTA v1 patterns, dependencies are injected as resources:
- `driver`: The chosen virtualization implementation.
- `registry`: The state-store-backed registry.

This ensures that handlers remain pure and easily testable by mocking these resources.
