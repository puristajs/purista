---
title: PURISTA handbook
description: Learn how to build awesome applications with the PURISTA typescript backend framework
order: 0
---

# Handbook

This handbook is organized as a practical learning path.

## Recommended reading order

1. [Quickstart](./1_quickstart/index.md)
2. [From Zero to Production](./from-zero-to-production.md)
3. [Building business logic](./2_building_business-logic/index.md)
4. [PURISTA ecosystem](./3_eco_system/index.md)
5. [OpenTelemetry](./4_open_telemetry/index.md)
6. [Deploy & Scale](./5_deploy_and_scale/index.md)
7. [Integrations](./6_integrations/index.md)

## If you are new to PURISTA

Follow this minimal path:

1. Create a service and first command.
2. Add one subscription reacting to an event.
3. Expose one command as REST endpoint.
4. Add one state/config/secret store usage.
5. Run tests for service, command, and subscription.

## If you are migrating an existing app

Focus first on:

1. [Service builder](./2_building_business-logic/service/the-service-builder.md)
2. [Command builder](./2_building_business-logic/command/the-command-builder.md)
3. [Subscription builder](./2_building_business-logic/subscription/the-subscription-builder.md)
4. [Event bridges](./3_eco_system/eventbridges/index.md)
5. [Deployment options](./5_deploy_and_scale/index.md)

## If you are adding AI agents

Start with [AI agents](./2_building_business-logic/ai/index.md), then read [Queues](./2_building_business-logic/queue/index.md) and [Streams](./2_building_business-logic/stream/index.md). Agents use normal PURISTA queues, workers, commands, and streams under the hood.
