---
title: Connect to PURISTA
description: Build typed clients that connect to PURISTA applications from external code.
order: 210000
---

# Connect the Outside World to PURISTA

External clients — mobile apps, frontend code, third-party services — need a typed, stable interface to your PURISTA application.

```mermaid
flowchart LR
    A["Service Definitions"]
    A -->|generate| C["REST API Client"]
    A -->|generate| D["Event Bridge Client"]
    A -->|generate| E["Embedded Client"]
    C -->|HTTP| F["External Application"]
    D -->|messages| F
    E -->|in-process| F
```

## Client types

| Client | Transport | Use case |
|---|---|---|
| [REST API Client](./create_a_rest_api_client.md) | HTTP / fetch | Frontend, mobile, external services |
| [Event Bridge Client](./create_an_eventbridge_client.md) | Messages | Services in the same message fabric |
| [Embedded Client](./embedded_client.md) | In-process | Testing, scripting, local tooling |

## Generating a REST client

HTTP client generation uses `ClientBuilder` from `@purista/core/client`; `createHttpClient` is not exported. See the [REST API client guide](./create_a_rest_api_client.md) for the correct pattern.

## When to use which client

```mermaid
flowchart TD
    A["Need to connect to PURISTA?"] --> B{"Same process?"}
    B -->|Yes| C["Embedded Client"]
    B -->|No| D{"Same message fabric?"}
    D -->|Yes| E["Event Bridge Client"]
    D -->|No| F["REST API Client"]
    C --> G["Testing, scripts, local tools"]
    E --> H["Microservices, background workers"]
    F --> I["Frontend, mobile, external APIs"]
```

## Next steps

- [REST API Client](./create_a_rest_api_client.md) — HTTP client generation
- [Event Bridge Client](./create_an_eventbridge_client.md) — message-based client
- [Embedded Client](./embedded_client.md) — in-process client for testing
