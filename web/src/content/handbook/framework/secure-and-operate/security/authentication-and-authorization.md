---
title: Authentication and authorization
description: Establish trusted identity in the transport and enforce business authorization with service guards and resources.
order: 1011
---

Authentication verifies who called; authorization verifies what that identity
may do. Keep them separate. Hono middleware can set `principalId`, `tenantId`,
and additional parameters for an HTTP-exposed command after it has verified and
decoded the token. A command, stream, subscription, queue-worker, or
mounted-Harness guard performs the business decision.

## Protect the transport, then guard the command

Mark an HTTP endpoint as secure. The Hono server runs its configured protection
middleware for that endpoint. The middleware should validate the credential with
your identity provider and set only trusted, normalized values; it must not copy
identity from the JSON body or an unverified header.

```ts title="src/index.ts"
import { HandledError, StatusCode } from '@purista/core'

honoService.setProtectMiddleware(async function (context, next) {
  const token = context.req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    throw new HandledError(StatusCode.Unauthorized, 'Authentication required')
  }

  try {
    const claims = await accessTokenVerifier.verifyAndDecode(token)
    context.set('principalId', claims.principalId)
    context.set('tenantId', claims.tenantId)
  } catch {
    throw new HandledError(StatusCode.Unauthorized, 'Access token is invalid or expired')
  }
  return next()
})
```

`verifyAndDecode(...)` represents the application-selected token implementation.
It validates integrity, issuer, audience, and expiry and decrypts encrypted
tokens before returning claims. The middleware keeps the raw token at the HTTP
boundary and places only trusted normalized identity on the Hono context.

The Hono service's default protection handler is a pass-through. If neither
`setProtectMiddleware(...)` nor `serviceConfig.protectHandler` is configured,
an endpoint marked secure still accepts the request. `enableHttpSecurity(true)`
selects the configured middleware; it does not create authentication. Throwing
`HandledError` lets the Hono service's built-in error handler produce the
configured RFC 9457 problem response and trace metadata consistently.

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
    mayApproveInvoice: async function (context, payload) {
      const principalId = context.message.principalId
      const tenantId = context.message.tenantId
      const invoice = await context.resources.invoiceRepository.get(payload.invoiceId)

      // This is the business access rule. The public payload is not an authority.
      if (!principalId || !tenantId || !invoice) {
        throw new HandledError(StatusCode.Forbidden, 'Invoice access is not allowed')
      }

      const allowed = invoice.tenantId === tenantId
        && await context.resources.invoicePolicy.mayApprove({ principalId, invoice })
      if (!allowed) {
        throw new HandledError(StatusCode.Forbidden, 'Invoice access is not allowed')
      }
    },
  })
  .setCommandFunction(async function (context, payload) {
    // The transport authenticated the caller and the guard authorized this action.
    const principalId = context.message.principalId as string

    return context.resources.invoiceRepository.approve(payload.invoiceId, principalId)
  })
```

| Declaration | What it establishes | Options, default, and failure boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | The stable service-local invoice operation. | `eventName` is optional and only names a canonical success event. This call creates a builder; register its completed definition in the service before another transport can invoke it. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The validated domain invoice input and inferred handler payload. | The optional representation values retain earlier values or resolve to JSON and UTF-8. Domain input is rejected before guards and cannot reach the repository; an optional raw schema and input transform run earlier. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The safe success result contract. | Its optional representation values use the same defaults. A result that violates the schema is an internal error; do not expose authorization details through it. |
| [`enableHttpSecurity(enabled = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#enablehttpsecurity) | Secure-route metadata consumed by the configured Hono protection middleware. | `true` is the default, but it is inert when no protection middleware is configured. It does not protect an internal invocation or authorize business access. |
| [`makeEndpointPublic()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#makeendpointpublic) | Opts one intentionally public HTTP projection out of the protection middleware. | Use this explicit method after reviewing the public contract. `disableHttpSecurity(...)` is deprecated; passing `false` to `enableHttpSecurity(...)` is supported but less clear. |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | Named, service-bound business access checks between input validation and the handler. | Each value must be a non-arrow function. Reusing a hook name replaces its earlier definition; named hooks run concurrently, so do not rely on name order. A thrown error prevents the handler from running. Guards may use declared resources to evaluate record, tenant, role, plan, or lifecycle policy. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The business effect after validation and guards succeed. | Use a non-arrow `async function`; Core rejects arrows and requires a handler before definition assembly. Its trusted identity is on `context.message`, not the client payload. |

The example assumes that `invoiceRepository` and `invoicePolicy` are narrowly
scoped declared resources. The guard loads the record and evaluates the
principal, tenant, record, and requested action; Hono already handled token
validity. For a real database, also scope the mutation itself by tenant or an
authorization predicate so a changed record cannot slip between the guard read
and the write.

## Choose the right control

| Need | Use | Why |
| --- | --- | --- |
| Reject public requests without a valid credential | Protected endpoint + Hono protection middleware | Stops unauthenticated HTTP calls early and supplies trusted context |
| Make one endpoint intentionally public | `makeEndpointPublic()` | Explicitly skips the configured protection middleware for this projection only |
| Enforce a business access rule regardless of transport | `setBeforeGuardHooks(...)` | The guard uses trusted identity plus payload/resources after domain input validation and before the handler |
| Allow access only to a record in the caller's tenant | Guard plus a tenant-scoped repository mutation using `context.message.tenantId` | The stored record and trusted context are the authority; public input is not |
| Limit database, broker, or secret access | Resource design and workload permissions | End-user identity is not a cloud permission model |

Do not make authorization depend only on route visibility. A command can be invoked through another supported transport, so enforce policy at the service definition/handler boundary as well. Pass only the resource permissions the service needs; an administrator database client in every service defeats least privilege.

Test missing, malformed, expired, and invalid tokens against the protection
middleware and expect `401`. Separately test one allowed and one denied
identity for every sensitive guard. Include a missing trusted identity, another
tenant, and a route-bypass/internal-invocation case and expect authorization to
fail closed. Avoid logging bearer material or full request headers. See [Hono HTTP endpoints](/handbook/framework/expose-and-consume-services/http-and-rest/hono/)
for server setup and [tenant isolation](/handbook/framework/secure-and-operate/security/tenant-isolation/)
for data scope.

Next: [chapter overview](/handbook/framework/secure-and-operate/security/).
