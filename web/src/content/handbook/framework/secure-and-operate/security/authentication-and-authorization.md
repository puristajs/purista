---
title: Authentication and authorization
description: Establish trusted identity in the transport and enforce business authorization with service guards and resources.
order: 1011
---

Authentication verifies who called; authorization verifies what that identity
may do. Keep them separate. Hono middleware can set `principalId`, `tenantId`,
and additional parameters for an HTTP-exposed command, while a command,
subscription, or worker guard performs the business decision.

## Protect the transport, then guard the command

Mark an HTTP endpoint as secure. The Hono server runs its configured protection
middleware for that endpoint. The middleware should validate the credential with
your identity provider and set only trusted, normalized values; it must not copy
identity from the JSON body or an unverified header.

```ts title="src/index.ts"
honoService.setProtectMiddleware(async (context, next) => {
  const identity = await verifyAccessToken(context.req.header('authorization'))

  if (!identity) {
    return context.json({ message: 'Unauthorized' }, 401)
  }

  context.set('principalId', identity.subject)
  context.set('tenantId', identity.tenantId)
  await next()
})
```

[`enableHttpSecurity(enabled = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#enablehttpsecurity)
keeps the generated endpoint opted into that middleware; command HTTP metadata
is secure by default, so `true` is explicit policy rather than a new
authentication mechanism. It is not the authorization decision: the same
command can be invoked by a different transport. Put the decision in a guard
and make its failure explicit.

```ts title="src/service/invoice/v1/command/approveInvoice/approveInvoiceCommandBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'
import { invoiceV1ServiceBuilder } from '../../invoiceV1ServiceBuilder.js'
import { approveInvoiceInputSchema, approveInvoiceOutputSchema } from './schemas.js'

export const approveInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('approveInvoice', 'Approve an invoice')
  .addPayloadSchema(approveInvoiceInputSchema)
  .addOutputSchema(approveInvoiceOutputSchema)
  .enableHttpSecurity(true)
  .setBeforeGuardHooks({
    authenticated: async function (context) {
      if (!context.message.principalId || !context.message.tenantId) {
        throw new HandledError(StatusCode.Unauthorized, 'Authentication required')
      }
    },
  })
  .setCommandFunction(async function (context, payload) {
    const invoice = await context.resources.invoiceRepository.get(payload.invoiceId)

    // Authorize against the loaded record, never against a tenant id in input.
    if (!invoice || invoice.tenantId !== context.message.tenantId) {
      throw new HandledError(StatusCode.Forbidden, 'Invoice access is not allowed')
    }

    return context.resources.invoiceRepository.approve(invoice.id, context.message.principalId)
  })
```

| Declaration | What it establishes | Options, default, and failure boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | The stable service-local invoice operation. | `eventName` is optional and only names a canonical success event. This call creates a builder; register its completed definition in the service before another transport can invoke it. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The validated domain invoice input and inferred handler payload. | The optional representation values retain earlier values or resolve to JSON and UTF-8. Domain input is rejected before guards and cannot reach the repository; an optional raw schema and input transform run earlier. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The safe success result contract. | Its optional representation values use the same defaults. A result that violates the schema is an internal error; do not expose authorization details through it. |
| [`enableHttpSecurity(enabled = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#enablehttpsecurity) | Secure-route metadata consumed by the configured Hono protection middleware. | `true` is the default. Pass `false` only for an intentionally public endpoint with a separately reviewed threat model; it does not make internal invocation safe or authorize business access. |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | Named, service-bound checks between input validation and the handler. | Each value must be a non-arrow function. Reusing a hook name replaces its earlier definition; named hooks run concurrently, so do not rely on name order. A thrown error prevents the handler from running. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The record-aware authorization decision and business effect. | Use a non-arrow `async function`; Core rejects arrows and requires a handler before definition assembly. Its trusted identity is on `context.message`, not the client payload. |

The example assumes that `invoiceRepository` is the narrowly scoped resource
declared by the service. Keep policy close to the data when permissions depend
on record ownership, plan, role, or lifecycle state. A guard is ideal for
identity prerequisites shared by several handlers; the handler is the right
place for an authorization decision that needs the loaded record.

## Choose the right control

| Need | Use | Why |
| --- | --- | --- |
| Reject public requests without a valid credential | Protected endpoint + Hono protection middleware | Stops unauthenticated HTTP calls early and supplies trusted context |
| Reject a command regardless of how it arrives | `setBeforeGuardHooks(...)` | The check runs after domain input validation and before the handler; it does not precede an input transform |
| Allow access only to a record in the caller's tenant | Handler/repository check using `context.message.tenantId` | The record is the authority; input is not |
| Limit database, broker, or secret access | Resource design and workload permissions | End-user identity is not a cloud permission model |

Do not make authorization depend only on route visibility. A command can be invoked through another supported transport, so enforce policy at the service definition/handler boundary as well. Pass only the resource permissions the service needs; an administrator database client in every service defeats least privilege.

Test one allowed and one denied identity for each sensitive operation. Include a
missing identity, another tenant, and a route-bypass/internal-invocation case.
Return a controlled authorization response and avoid logging bearer material or
full request headers. See [Hono HTTP endpoints](/handbook/framework/expose-and-consume-services/http-and-rest/hono/)
for server setup and [tenant isolation](/handbook/framework/secure-and-operate/security/tenant-isolation/)
for data scope.

Next: [chapter overview](/handbook/framework/secure-and-operate/security/).
