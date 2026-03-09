---
title: Sandbox Service
description: Reusable sandbox execution service for agents and secure tool runtime
order: 303500
---

# Sandbox Service

`@purista/sandbox-service` provides a reusable multi-tenant sandbox runtime for PURISTA services.

## Package

- API docs: [@purista/sandbox-service](../../api/@purista/sandbox-service/README.md)
- Source: [packages/sandbox-service](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/README.md)

## Dockerfile

The hardened sandbox image Dockerfile is part of the package:

- [packages/sandbox-service/Dockerfile.sandbox](https://github.com/puristajs/purista/blob/master/packages/sandbox-service/Dockerfile.sandbox)

Build command:

```bash
docker build -t purista-sandbox-agent:latest -f packages/sandbox-service/Dockerfile.sandbox .
```

## Example

A runnable integration example is available in:

- [examples/sandbox-service](https://github.com/puristajs/purista/blob/master/examples/sandbox-service/README.md)
