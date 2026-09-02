---
title: Secure the service boundary
description: Authenticate at the HTTP edge, propagate trusted identity, and enforce business authorization with mount guards and domain commands.
order: 3991
---

Authentication and business authorization are separate checks.

The Hono protect middleware verifies the credential for protected routes and
sets trusted `principalId` and `tenantId`. These values enter the PURISTA
message envelope and continue through address-first agent, workflow, command,
stream, queue, and host-tool calls.

Mount guards decide whether that principal may use a specific AI capability for
the requested object and current business state:

```ts title="Authorize a mounted target"
const mayAnalyzeIncident = async (context, input) => {
  const incident = await context.resources.incidentRepository.get(input.incidentId)
  if (!context.identity.principalId || incident.tenantId !== context.identity.tenantId) {
    throw new HandledError(StatusCode.Forbidden, 'Incident access denied')
  }
}

.mountHarness(supportHarness, {
  publish: { agents: ['analyze_signals'] },
  targets: {
    agents: {
      analyze_signals: { beforeGuards: { mayAnalyzeIncident } },
    },
  },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
attaches these guards to the selected target's receiving boundary. The guard
runs with trusted message identity and service resources before Harness
execution starts.

After guards validate completed outcomes before publication. Tool-backed
commands must repeat their own authorization because they protect the actual
business effect. Never trust a tenant, principal, approval, or role produced by
the model or supplied in a tool argument.
