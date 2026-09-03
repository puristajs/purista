---
title: Generate OpenAPI contracts
description: Combine service-level OpenAPI metadata with command and stream schemas, security, parameters, and response declarations.
order: 417
---

Hono generates OpenAPI 3.1 from the HTTP metadata on registered command and
stream definitions. The document describes the runtime routes; it does not
authenticate them or prove a downstream service is healthy.

## Configure the document before registration

```ts title="src/http/openApiConfig.ts"
import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

export const httpConfig = {
  apiMountPath: '/api',
  openApi: {
    enabled: true,
    openapi: '3.1.0',
    info: {
      title: 'Example Bank API',
      description: 'Public transaction and knowledge operations',
      version: '1.0.0',
    },
    servers: [{ url: 'https://api.example.com' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
} satisfies HonoServiceV1ConfigPartial
```

Define security schemes before endpoints are registered. Adding a scheme later
does not retrofit already generated operations.

## Add operation metadata at the builder

```ts title="Document a protected command"
const getTransactionCommandBuilder = transactionV1ServiceBuilder
  .getCommandBuilder('getTransaction', 'Return one transaction')
  .addPayloadSchema(z.undefined())
  .addParameterSchema(z.object({ transactionId: z.string().uuid() }))
  .addOutputSchema(transactionSchema)
  .exposeAsHttpEndpoint('GET', 'transactions/:transactionId')
  .setOpenApiSummary('Read a transaction')
  .setOpenApiOperationId('getTransaction')
  .addOpenApiTags('Transactions')
  .addOpenApiErrorStatusCodes(StatusCode.Unauthorized, StatusCode.Forbidden, StatusCode.NotFound)
  .addQueryParameters({
    name: 'transactionId',
    required: true,
  })
```

The operation begins with
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder).
Its
[`payload`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`parameter`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema),
and
[`output`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
schemas supply the request and success response contract, while
[`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint)
supplies the method and path. The OpenAPI-specific calls own the
[`summary`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapisummary),
[`operationId`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapioperationid),
[`tags`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addopenapitags),
[`declared error statuses`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addopenapierrorstatuscodes),
and
[`query-parameter metadata`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addqueryparameters).

The builder's payload, parameter, output, and error metadata form the operation
schema. `makeEndpointPublic()` produces an operation without the configured
security requirement; protected is the default.

## Publish and verify the artifact

With the default mount path, Hono serves:

- `GET /api/openapi.json`
- `GET /api/openapi.yaml`

Fetch the JSON in CI, validate it with the consumer/tooling you publish, and
diff intentional contract changes. Verify that protected operations include
security, public operations do not, async commands document `202`, and stream
content matches the selected aggregate/SSE mode.

OpenAPI generation happens when routes register. Register all direct services
or receive all dynamic announcements before treating the document as complete.

Next: [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/).
