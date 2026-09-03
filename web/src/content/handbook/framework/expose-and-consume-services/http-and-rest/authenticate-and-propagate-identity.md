---
title: Authenticate and propagate principals and tenants
description: Protect endpoints by default, resolve technical identity at Hono, and enforce business access with service guards.
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

## Resolve a session through a service command

Store short-lived session state behind the Identity service. The Hono
middleware reads the opaque bearer token, then invokes the Identity command by
address through EventBridge. It does not read the state store directly.

```ts title="src/http/sessionProtectMiddleware.ts"
import { HandledError, StatusCode } from '@purista/core'
import type { EndpointProtectMiddleware, HonoServiceClass } from '@purista/hono-http-server'
import type { SessionRecord } from '../service/identity/v1/session.js'

export const createSessionProtectMiddleware = (
  http: HonoServiceClass,
): EndpointProtectMiddleware<HonoServiceClass> => async function (c, next) {
  const token = c.req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    throw new HandledError(StatusCode.Unauthorized, 'A session bearer token is required')
  }

  let session: SessionRecord
  try {
    session = await http.invoke({
      receiver: {
        serviceName: 'Identity',
        serviceVersion: '1',
        serviceTarget: 'resolveSession',
      },
      payload: { payload: undefined, parameter: { sessionToken: token } },
      contentType: 'application/json',
      contentEncoding: 'utf-8',
    }, 'protect-session') as SessionRecord
  } catch {
    throw new HandledError(StatusCode.Unauthorized, 'The session is invalid or expired')
  }

  c.set('principalId', session.principalId)
  c.set('tenantId', session.tenantId)
  await next()
}
```

Install it before Hono registers generated routes:

```ts title="Configure protected routes"
http.setProtectMiddleware(createSessionProtectMiddleware(http))
await http.start()
```

Hono copies only middleware-provided `principalId` and `tenantId` into the
PURISTA message. Downstream command, stream, queue, agent, and workflow calls
propagate those trusted message fields.

## Authorize the business action in a guard

Authentication proves who called. A command guard decides whether that caller
may act on this account, transaction, or tenant.

```ts title="Business authorization guard"
const canReadAccount = async function (context, _payload, parameter) {
  const principalId = context.message.principalId
  const tenantId = context.message.tenantId
  if (!principalId || !tenantId) {
    throw new HandledError(StatusCode.Unauthorized, 'Authentication is required')
  }

  const allowed = await context.resources.accountAccess.canRead({
    accountId: parameter.accountId,
    principalId,
    tenantId,
  })
  if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Account access is not allowed')
}
```

Do not treat “a valid user exists” as business authorization. Do not accept
principal or tenant IDs from payload/query fields as trusted identity.

Next: [configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/).
