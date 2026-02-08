---
title: From Zero to Production
description: A pragmatic end-to-end path from first service to production-ready PURISTA deployment
order: 50000
---

# From Zero to Production

This page is a practical implementation path to build and ship a PURISTA application.

## Phase 1: Foundation

1. Create project and run quickstart flow.
2. Create first service, command, and subscription.
3. Add schema validation for payload/parameter/output.
4. Add unit tests for service/command/subscription.

Reference:

- [Quickstart](./1_quickstart/index.md)
- [Service](./2_building_business-logic/service/index.md)
- [Command](./2_building_business-logic/command/index.md)
- [Subscription](./2_building_business-logic/subscription/index.md)

## Phase 2: Integration-ready logic

1. Add stores (config/secret/state) where required.
2. Define resources (DB clients, external SDK wrappers).
3. Expose required commands through REST endpoints.
4. Add invoke relations (`canInvoke`) explicitly.

Reference:

- [Stores](./2_building_business-logic/stores/index.md)
- [Define resources](./2_building_business-logic/service/define-resources.md)
- [Exposing commands](./2_building_business-logic/exposing_endpoints/index.md)

## Phase 3: Runtime architecture

1. Choose event bridge based on delivery requirements.
2. Choose deployment model (monolith, microservice style, edge, serverless).
3. Configure graceful shutdown and startup ordering.

Reference:

- [Event bridges](./3_eco_system/eventbridges/index.md)
- [Deploy & Scale](./5_deploy_and_scale/index.md)

## Phase 4: Production readiness

1. Enable tracing and metrics with OpenTelemetry.
2. Add endpoint protection/auth middleware.
3. Validate error handling and timeout behavior.
4. Run integration tests against real broker/store setup.

Reference:

- [OpenTelemetry](./4_open_telemetry/index.md)
- [Error handling](./2_building_business-logic/error-handling.md)

## Release checklist

- schemas are explicit and stable
- no accidental `any`/`unknown` in core paths
- tests cover happy path and failure path
- runtime config is documented
- observability and shutdown behavior verified
