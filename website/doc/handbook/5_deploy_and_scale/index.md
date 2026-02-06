---
title: Deploy & Scale
description: Learn how to deploy and scale PURISTA based typescript applications
order: 500000
---

# Deployment and Scale

PURISTA supports multiple deployment styles.  
Choose based on team structure, operational maturity, and scaling requirements.

## Deployment options

- [Monolithic](./monolithic.md): simplest operational model, good default start.
- [Edge](./edge.md): lightweight local/IoT deployments.
- [Microservice style](./microservice_style/index.md): independent service deployment and scaling.
- [Serverless/FaaS](./serverless_function_fass.md): function-oriented hosting model.

## How to choose

1. Start with monolithic if you need fastest delivery and lowest ops overhead.
2. Move to microservice style when teams/services need independent release cycles.
3. Use edge for constrained environments or on-device preprocessing.
4. Consider serverless for bursty workloads and platform-managed scaling.

## Related

- [Event bridges](../3_eco_system/eventbridges/index.md)
- [Stores](../2_building_business-logic/stores/index.md)
- [OpenTelemetry](../4_open_telemetry/index.md)
