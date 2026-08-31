# Demo UI and trusted identity

## UI purpose and stack

Give learners a small interface to exercise the actual service, not another
application to understand before starting the tutorial. Use React and
shadcn/ui with its default theme. Keep components, spacing, typography,
navigation, and forms familiar. Do not import the website's marketing theme.

Use Vercel AI SDK UI and AI Elements for chat where relevant. Verify installed
versions, source, and official documentation before writing hooks or transport
code. Selected AI Elements components must be checked for framework-specific
imports; do not assume a Next.js-oriented setup guide proves Vite compatibility.
Prefer a static React build served by the example's Hono server when supported.
Keep the development proxy and built serving path explicit and tested.

The browser calls PURISTA only. A thin application-owned adapter may translate
PURISTA responses/events to the AI SDK UI protocol, or implement the matching
custom chat transport. Verify start/delta/end, source and tool parts, errors,
completion, and cancellation for the selected protocol. Raw PURISTA SSE is
not automatically an AI SDK UI message stream. Do not install a second model
loop, AI Gateway backend, or standalone Harness service to make the UI work.

Build one reusable shell with chapter-specific screens and navigation that
shows only implemented capabilities. Suitable screens include transactions,
review cases, jobs/results, ingestion status, cited chat, and approvals. Each
screen needs labels, keyboard operation, loading/empty/success/error states,
and responsive layout. Connect actions to real service contracts; label
fixtures and scripted model results visibly. Teach UI serving first with display
fixtures; teach login after the REST API and each new identity handoff at first use.

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

Once UI serving and the REST API are familiar, teach: establish a local session →
verify it in Hono → derive tenant membership and principal → set trusted
metadata → invoke the command → verify downstream access → log out and test
denials. Supply a real local auth fixture or mock identity provider; do not
equate a frontend user dropdown or decoded-but-unverified JWT with login.

With bearer tokens, verify signatures, issuer, audience, expiry, and allowed
tenant membership. With cookies, use an opaque server-validated session and
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
