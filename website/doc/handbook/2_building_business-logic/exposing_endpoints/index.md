---
title: Exposing Commands
description: Learn how to call commands as REST-API or via GraphQL
order: 207000
---

# Exposing Commands

PURISTA commands are transport-agnostic by design.  
Business logic is implemented in commands once, and exposed through one or more adapters.

## Available approaches

- [REST API](./rest_api_http_endpoints.md): use `@purista/hono-http-server` for HTTP/OpenAPI.
- [GraphQL](./graphql_mutation_and_query.md): build a GraphQL layer that invokes commands.

## Which approach to choose

- Use REST when you want standardized HTTP semantics, generated OpenAPI, and broad tooling support.
- Use GraphQL when clients need flexible selection of fields and a single typed query endpoint.
- You can use both in parallel because commands stay independent from protocol-specific code.

## Design guideline

Keep command contracts schema-driven and stable.
Adapters (REST/GraphQL) should only map incoming requests to command payload/parameter and map command output back to transport-specific responses.
