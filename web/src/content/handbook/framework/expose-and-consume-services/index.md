---
title: Expose and consume services
description: Choose HTTP, direct calls, or generated clients without moving business contracts into transport code.
order: 400
---

Services own commands and schemas. A transport projects selected commands to callers; it does not become a second place for business logic.

```mermaid title="Expose a selected contract without moving business behavior"
flowchart LR
  Caller[Caller or consumer] --> Boundary[HTTP, GraphQL, generated client, or EventBridge]
  Boundary --> Contract[Versioned PURISTA command or stream contract]
  Contract --> Service[Business service]
  Service --> Result[Validated result, frames, or accepted work]
  Result --> Boundary
  Boundary --> Caller
```

Choose the boundary from who calls, where it runs, and what public commitment
you want to make. Do not choose a public transport merely because a service is
already callable internally.

| Need | Choose | Main trade-off |
| --- | --- | --- |
| Public or partner HTTP API | [HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/) | You own authentication, rate limits, and public compatibility. |
| GraphQL | [Application-owned integration](/handbook/framework/expose-and-consume-services/graphql/) | There is no first-party GraphQL builder, schema generator, or server package; do not infer support from HTTP metadata. |
| In-process call | [Direct and embedded client](/handbook/framework/expose-and-consume-services/service-clients/) | No network isolation or remote failure behavior. |
| Call another PURISTA runtime | [EventBridge or generated client](/handbook/framework/expose-and-consume-services/service-clients/) | Requires a reachable, versioned contract. |

## Establish the public boundary in this order

| Step | Decide | Evidence |
| --- | --- | --- |
| 1. Select the capability | A bounded command, a connected stream, or asynchronous job acceptance is the appropriate caller outcome. | The primitive’s lifecycle and error/recovery behavior fit the caller promise. |
| 2. Declare projection metadata | Mark only the chosen command or stream for HTTP; keep a GraphQL resolver or generated client mapping narrow. | The route/schema/client method is visible in the generated contract. |
| 3. Compose the adapter | Install and start Hono or the application-owned GraphQL/client integration; configure the correct monolith or distributed topology. | The process is ready only after its routes/definition mapping are registered. |
| 4. Establish identity | Authenticate at the transport and pass trusted principal/tenant context to the service. | A missing or unrelated identity receives the intended controlled rejection. |
| 5. Publish and verify | Publish OpenAPI/client artifacts, then test the route, client, error shape, and observability path. | A consumer can use the documented contract without access to internal service wiring. |

Expose only the commands intended for external callers. Internal administrative
commands and raw error details must stay behind an authenticated application
boundary. A public route, GraphQL field, or generated package is a compatibility
commitment: version it deliberately and test it at the actual transport.

Next: [HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/),
[GraphQL](/handbook/framework/expose-and-consume-services/graphql/),
[service clients](/handbook/framework/expose-and-consume-services/service-clients/),
or [service discovery and contracts](/handbook/framework/expose-and-consume-services/service-discovery/).
