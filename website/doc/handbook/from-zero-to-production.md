---
title: From Zero to Production
description: A pragmatic end-to-end path from first service to production-ready PURISTA deployment
order: 50000
---

# From Zero to Production

This page is a practical implementation path to build and ship a PURISTA application.

## Phase 1: Foundation

1. Create project and run quickstart flow.
2. Create first service plus at least one command, subscription, stream, and, if you need pull-based async work, a queue + worker pair.
3. Add schema validation for payload/parameter/output.
4. Add unit tests for service/command/subscription/stream.

Reference:

- [Quickstart](./1_quickstart/index.md)
- [Service](./2_building_business-logic/service/index.md)
- [Command](./2_building_business-logic/command/index.md)
- [Stream](./2_building_business-logic/stream/index.md)
- [Subscription](./2_building_business-logic/subscription/index.md)
- [Queues](./2_building_business-logic/queue/index.md)

## Phase 2: Integration-ready logic

1. Add stores (config/secret/state) where required.
2. Define resources (DB clients, external SDK wrappers).
3. Expose required commands/streams through REST endpoints (JSON + SSE).
4. Add invoke relations (`canInvoke`) explicitly.

Reference:

- [Stores](./2_building_business-logic/stores/index.md)
- [Define resources](./2_building_business-logic/service/define-resources.md)
- [Exposing commands](./2_building_business-logic/exposing_endpoints/index.md)

## Phase 3: Runtime architecture

1. Choose event bridge based on delivery requirements.
2. Choose queue bridge (default in-memory vs Redis or other providers) for pull-based workloads.
3. Choose deployment model (monolith, microservice style, edge, serverless).
4. Configure graceful shutdown and startup ordering.

Reference:

- [Event bridges](./3_eco_system/eventbridges/index.md)
- [Queue bridges](./3_eco_system/queue_bridges/index.md)
- [Deploy & Scale](./5_deploy_and_scale/index.md)

## Phase 4: Production readiness

1. Enable tracing and metrics with OpenTelemetry.
2. Add endpoint protection/auth middleware.
3. Validate error handling, timeout behavior, and stream cancellation behavior.
4. Run integration tests against real broker/store setup (including delivery semantics).
5. Verify stream consumers and telemetry in staging before rollout.

Reference:

- [OpenTelemetry](./4_open_telemetry/index.md)
- [Error handling](./2_building_business-logic/error-handling.md)

## Release checklist

- schemas are explicit and stable
- no accidental `any`/`unknown` in core paths
- tests cover happy path, failure path, and cancellation/retry paths
- streaming and event-bridge docs match implemented behavior
- runtime config is documented
- observability and shutdown behavior verified
