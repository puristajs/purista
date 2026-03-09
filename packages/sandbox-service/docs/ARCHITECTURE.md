# Architecture Overview

The `@purista/sandbox-service` service is designed as a decoupled, message-driven component within the PURISTA ecosystem.

## Core Components

### 1. The Sandbox Service
A standard PURISTA service that exposes commands for sandbox lifecycle management (`createSandbox`, `destroySandbox`) and execution (`executeBash`).

### 2. Sandbox Drivers
The service is driver-agnostic. It interacts with virtualization technologies via a common `SandboxDriver` interface. This allows the same business logic to run against Docker, Podman, Lima, or Firecracker.

### 3. Sandbox Registry
A specialized resource that tracks active sandboxes. It uses the PURISTA **State Store** for persistence. Key features include:
- **Tenant Isolation**: Metadata includes `organizationId` and `userId`.
- **Self-Healing**: On startup, the service reconciles its internal registry with the actual running containers/VMs by scanning for `purista-*` naming patterns and recovering metadata from labels/tags.

## Message Flow

1. **Request**: A user or agent sends a `createSandbox` command.
2. **Provisioning**: The service calls `driver.createSandbox()`.
3. **Registration**: The new sandbox metadata is stored in the `SandboxRegistry` (State Store).
4. **Execution**: AI agents use the `executeBash` command. The service verifies ownership via the registry before delegating to the driver.
5. **Teardown**: When a task is finished, `destroySandbox` is called, cleaning up both the infrastructure and the registry entry.

## Resource-Based Injection

Following the PURISTA v1 patterns, dependencies are injected as resources:
- `driver`: The chosen virtualization implementation.
- `registry`: The state-store-backed registry.

This ensures that handlers remain pure and easily testable by mocking these resources.
