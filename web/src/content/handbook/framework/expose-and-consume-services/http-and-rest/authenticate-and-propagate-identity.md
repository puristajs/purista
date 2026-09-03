---
title: Authenticate and propagate principals and tenants
description: Verify access tokens at Hono, propagate trusted principal and tenant identity, and authorize business actions with service guards.
order: 415
---

Generated command and stream endpoints are protected by default. Hono runs the
configured protection middleware only for protected routes. Mark the small set
of deliberately anonymous routes as public.

```ts title="Public login and protected current-session commands"
const loginCommandBuilder = identityV1ServiceBuilder
  .getCommandBuilder('login', 'Create a session')
  .addPayloadSchema(loginSchema)
  .addParameterSchema(z.undefined())
  .addOutputSchema(sessionTokenSchema)
  .exposeAsHttpEndpoint('POST', 'session/login')
  .makeEndpointPublic()

const currentSessionCommandBuilder = identityV1ServiceBuilder
  .getCommandBuilder('currentSession', 'Read the current session')
  .addPayloadSchema(z.undefined())
  .addParameterSchema(z.undefined())
  .addOutputSchema(sessionSchema)
  .exposeAsHttpEndpoint('GET', 'session')
```

Both definitions start with
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder),
then declare the
[`payload`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`parameter`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema),
and
[`output`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
schemas before calling
[`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint).
Only the login command calls
[`makeEndpointPublic()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#makeendpointpublic),
so the current-session route retains the protected default.

`makeEndpointPublic()` and `enableHttpSecurity(false)` disable protection for
that route. `enableHttpSecurity()` restores the default protected setting.
OpenAPI security metadata alone does not authenticate a request.

## Verify and decode the token in the protection middleware

The protection middleware owns HTTP authentication. It extracts the bearer
token, verifies it with the application's identity provider or token verifier,
decodes its trusted claims, and sets the normalized principal and tenant ids.
The verifier must check integrity, issuer, audience, and expiry. It must also
decrypt the token before reading claims when the selected token format is
encrypted.

Pass the token verifier into the middleware from the application composition
root. Do not send the bearer token through EventBridge, copy it into command
input, or make a business service decode HTTP credentials.

```ts title="src/http/accessTokenProtectMiddleware.ts"
import { HandledError, StatusCode } from '@purista/core'
import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'
type VerifiedAccessToken = {
  principalId: string
  tenantId: string
}

type AccessTokenVerifier = {
  verifyAndDecode(token: string): Promise<VerifiedAccessToken>
}

export const createAccessTokenProtectMiddleware = (
  accessTokens: AccessTokenVerifier,
): EndpointProtectMiddleware<HonoServiceClass> => async function (c, next) {
  const token = c.req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    throw new HandledError(StatusCode.Unauthorized, 'A bearer token is required')
  }

  let identity: VerifiedAccessToken
  try {
    identity = await accessTokens.verifyAndDecode(token)
  } catch {
    throw new HandledError(StatusCode.Unauthorized, 'The access token is invalid or expired')
  }

  c.set('principalId', identity.principalId)
  c.set('tenantId', identity.tenantId)
  await next()
}
```

Install it before Hono registers generated routes:

```ts title="Configure protected routes"
http.setProtectMiddleware(createAccessTokenProtectMiddleware(accessTokenVerifier))
await http.start()
```

Hono copies the middleware-provided `principalId` and `tenantId` into the
PURISTA message. The raw token remains at the HTTP boundary. Downstream
command, stream, subscription, queue, agent, and workflow calls propagate the
trusted identity fields.

## Authorize the business action in a guard

Authentication is complete before the PURISTA message is created. A command,
stream, subscription, queue-worker, or mounted-Harness guard decides whether
that authenticated identity may perform its specific business action.

```ts title="Business authorization guard"
const canReadAccount = async function (context, _payload, parameter) {
  const principalId = context.message.principalId
  const tenantId = context.message.tenantId
  const allowed = principalId !== undefined && tenantId !== undefined
    && await context.resources.accountAccess.canRead({
      accountId: parameter.accountId,
      principalId,
      tenantId,
    })
  if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Account access is not allowed')
}
```

The guard does not read or verify the bearer token. It evaluates the trusted
identity against the requested account and action and fails closed when that
identity is absent or not allowed. Do not accept principal or tenant ids from
payload/query fields as trusted identity.

Next: [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/).
