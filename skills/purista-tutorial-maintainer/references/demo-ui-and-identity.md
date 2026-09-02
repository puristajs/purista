# Demo UI and trusted identity

## Contents

- [UI purpose and stack](#ui-purpose-and-stack)
- [Hono identity lesson](#hono-identity-lesson)
- [Follow every used hop](#follow-every-used-hop)
- [External references](#external-references)

## UI purpose and stack

Give learners a small interface to exercise the actual service, not another
application to understand before starting the tutorial. Use React and
shadcn/ui with its default theme. Keep components, spacing, typography,
navigation, and forms familiar. Do not import the website's marketing theme.

Use Vercel AI SDK UI Message Stream v1 and AI Elements for every chat surface.
Do not create parallel message, conversation, prompt, tool, source, reasoning,
status, or approval components when AI Elements provides them. Verify installed
versions, source, and official documentation before writing hooks or transport
code. Check selected AI Elements components for framework-specific imports and
make their integration work in the example's actual React build; a
Next.js-oriented setup guide alone does not prove the static build. Serve the
result from the example's Hono server and keep the development proxy and built
serving path explicit and tested.

The browser calls PURISTA only. The initial release supports exactly the AI SDK
UI Message Stream v1 protocol. A server-side projection translates portable
Harness invocation events into that exact protocol; raw PURISTA SSE is not an
AI SDK UI message stream. Keep projection behind a narrow adapter boundary so
a future named protocol can be added in a separate package and conformance
suite without changing Harness execution or EventBridge dispatch. Do not add
generic protocol switches to Core, invent a PURISTA browser protocol, or
install a second model loop, AI Gateway backend, or standalone Harness service.

Verify start/delta/end, safe status data, sources, tool input/output, approval,
denial, completion, terminal error, cancellation, reconnect, headers, and the
`[DONE]` marker with the official AI SDK parser and the example UI.

Build one reusable shell with chapter-specific screens and navigation that
shows only implemented capabilities. Suitable screens include transactions,
review cases, jobs/results, ingestion status, cited chat, and approvals. Each
screen needs labels, keyboard operation, loading/empty/success/error states,
and responsive layout. Connect actions to real service contracts; label
fixtures and scripted model results visibly. In the optional UI chapter, teach
asset serving with display fixtures before wiring interactive calls. Backend
identity lessons must work through requests without requiring React; teach
each new identity handoff at its first use.

## Hono identity lesson

Explain that a **tenant** is the organization whose data is being accessed and
a **principal** is the authenticated person or service making the request.
Neither ID grants business access; use the business-guards-and-transforms reference.

Source entry points, relative to the `purista` repo:

- `packages/hono-http-server/src/service/hono/v1/HonoServiceClass.ts`:
  `setProtectMiddleware` and the generated command/stream HTTP handlers.
- `packages/hono-http-server/src/types/EndpointProtectMiddleware.ts` and
  `VariablesBase.ts`: middleware and typed identity variables.
- `packages/core/src/core/Service/Service.impl.ts`: invocation, event, stream,
  subscription, and worker context construction.
- `packages/core/src/AgentQueueBuilder/runtime/`: attached runtime identity.

Verify these at authoring time. The current protection hook sets trusted Hono
variables before a protected generated endpoint invokes PURISTA. It is not a
complete authentication solution and does not automatically protect arbitrary
custom/static routes. Show middleware registration order and route coverage.

Once the REST API is familiar, teach: call a public Identity login command →
receive an opaque local bearer session → verify it in Hono's protection
middleware → derive tenant membership and principal → set trusted metadata →
invoke the protected command → verify downstream access → call the protected
logout command and test denials. Login, current-session, and logout are generated
Identity command endpoints, not handwritten Hono routes. Supply a real local
auth fixture or mock identity provider; do not
equate a frontend user dropdown or decoded-but-unverified JWT with login.
When implementing session issue/resolve/revoke locally, give those operations
an explicit service owner and use `context.states` with a supplied PURISTA
state store. Use `makeEndpointPublic()` only for login; leave session and logout
protected. Do not reinvent
the state store with an application Map. Check expiry explicitly; generic
StateStore does not promise TTL or record enumeration. Explain local-only
fixture configuration and cleanup rather than presenting it as a production
identity provider.

For a locally owned opaque session, keep resolution in Identity as an internal
command with no HTTP exposure. Because the protection middleware is bound to
the Hono service instance, it can call that command with `this.invoke(...)`,
then set `principalId` and `tenantId`. Hono must not reach into Identity's
StateStore directly. The protected current-session and logout endpoints run
after this authentication step; logout can receive the opaque token through a
declared additional parameter.

With externally issued bearer tokens, verify signatures, issuer, audience,
expiry, and allowed tenant membership. The tutorial's locally issued bearer is
opaque and is resolved through StateStore rather than decoded by the browser.
With cookies, use an opaque server-validated session and
appropriate cookie flags, origin/CSRF controls, and logout behavior. Explain
local HTTP differences without disabling production protections. Browser
requests may select a tenant, but the server authorizes that selection.

Reject/ignore forged identity in body, query, and headers. Do not copy it into
trusted message metadata or treat `additionalParameter` as an identity proof.
Do not forward browser tokens into events, jobs, model prompts, or telemetry.

## Follow every used hop

Create an evidence table for each path: incoming identity, trusted source,
actual outgoing metadata/context, authorization owner, and negative test.
Cover command-to-command calls, streams, events/subscriptions, queues/workers,
attached agents/tools, session memory, retrieval, files, and review actions.

Verify each path instead of claiming every component automatically inherits
the original principal. Subscriptions, schedules, and delayed jobs may execute
with a service identity or explicit configured scope. Distinguish the initiating
user from the execution actor; carry minimal approved business context and
re-check current authorization where execution semantics require it.

Test two tenants and two users in one tenant. Cover forged tenant/principal
values, missing/expired sessions, cross-user resource IDs, job polling and
artifacts, chat/history/stream access, retrieval, queued execution, and review
decisions. Identity presence is not evidence of isolation. Use test assertions
and a protected local demo display for synthetic identity, not production logs.

If the downstream path drops required identity, record the integration defect
and fix it in an authorized source scope before claiming end-to-end support.

## External references

- [AI SDK UI transport](https://ai-sdk.dev/docs/ai-sdk-ui/transport)
- [AI SDK UI stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
- [AI Elements setup](https://elements.ai-sdk.dev/docs/setup)
- [shadcn/ui with Vite](https://ui.shadcn.com/docs/installation/vite)

These establish integration choices, not a frozen API version. Recheck against
the installed dependency versions during implementation.
