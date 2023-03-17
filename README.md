# PURISTA

**Let developers focus on pure business logic**

![npm (scoped)](https://img.shields.io/npm/v/@purista/core?label=latest%20version&logo=npm&style=for-the-badge)

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, OpenApi documentation (swagger) and tracing via Opentelemetry.

**The main goal is to let developers keep focusing on solving business requirements while building robust & maintainable software fast and efficient in professional business environments.**

**Visit [purista.dev](https://purista.dev)**

## Quickstart

Create a new project folder and simply run:

```bash
npx @purista/cli init
```

The cli tool will guide you through all steps.

After successfull init, simply start adding your business logic by adding your first service.

```bash
purista add service
```

As soon as you've created your first service, you can start adding commands and subscriptions to implement your business logic.  
To add a command to your service use the cli tool.

```bash
purista add command
```

## Security

Please help us to provide a secure software.  
see: [Security](./SECURITY.md)
