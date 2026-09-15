---
title: Secure the service boundary
description: Authenticate at the HTTP edge, propagate trusted identity, and authorize business actions with target guards and domain commands.
order: 3991
---

Authentication and business authorization are separate checks.

The Hono `ProtectMiddleware` verifies credentials for protected routes and
sets trusted `principalId` and `tenantId`. These values enter the PURISTA
message envelope and continue through agent, workflow, command, stream, queue,
and host-tool calls.

A target guard decides whether that principal may use a specific AI capability
for the requested object and current business state:

```ts title="Authorize a mounted target"
const mayAnalyzeIncident = async (context, input) => {
  const incident = await context.resources.incidentRepository.get(input.incidentId)
  if (!context.identity.principalId || incident.tenantId !== context.identity.tenantId) {
    throw new HandledError(StatusCode.Forbidden, 'Incident access denied')
  }
}

const policy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
  agents: {
    analyzeSignals: { beforeGuards: { mayAnalyzeIncident } },
  },
})

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, policy)
```

[`defineHarnessPolicy(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineharnesspolicy)
keeps the guard input and service resources typed.
[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
attaches
the resulting policy to the target's receiving boundary.

The target guard runs with trusted message identity and service resources
before Harness execution. A protected wrapper still needs this guard because
another service may call the mounted target directly.

After guards validate completed outcomes before publication. Commands used by
host tools repeat their own authorization because they own the business effect.
Never trust a tenant, principal, approval, or role produced by the model or
supplied as a tool argument.
