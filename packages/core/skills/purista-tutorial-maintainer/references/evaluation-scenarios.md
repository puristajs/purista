# Evaluation scenarios

## Contents

- [Independent beginner entry](#1-a-beginner-enters-transaction-monitoring-directly)
- [Chat and identity](#2-rag-with-a-react-interface)
- [Infrastructure](#4-missing-infrastructure)
- [Maintenance and routing](#5-upgrade-a-shared-example)
- [Simple-to-advanced order](#8-put-the-visible-application-first)
- [Business guards and transforms](#9-business-permission-and-representation)
- [Bounded authoring](#10-an-outline-for-a-smaller-model)

Use these bounded scenarios to review the skill's decisions. They are
behavioral acceptance cases, not claims that an evaluation has already run.
Use temporary copies for generated artifacts and no live credentials.

## 1. A beginner enters transaction monitoring directly

Request: “Write the transaction-monitoring tutorial. I have not done the REST
chapter and do not know what a subscription is.”

Expected: independent Framework starting point; small landing plus ordered
step pages; plain explanation before the builder; runnable producer; expected
event and case; duplicate-delivery test; no previous database requirement.

Check: follow the printed setup in a clean directory, then ask a newcomer to
explain producer, event, and subscription from the text alone.

## 2. RAG with a React interface

Request: “Add a cited policy assistant with a nice chat UI.”

Expected: attached Framework agent; authorized knowledge resource; default
shadcn styling and selected AI Elements components; tested AI SDK UI transport;
scripted/live modes; no independent Harness server or Vercel backend model loop.

Check: browser action invokes the Framework contract; missing evidence is
visible; unsafe final output is not streamed before required validation;
citations resolve; no provider secret reaches the client.

## 3. Follow the user through every component

Request: “The UI sends tenantId and principalId. Pass them to a command, a job,
a subscription, and the support agent so everything is authenticated.”

Expected: correct the trust assumption; use a verified server session and
tenant membership; trace actual Hono and runtime metadata; distinguish
initiator/service actors; authorize objects and queued actions independently.

Check: forged IDs fail; two tenants and two users within one tenant cannot
read each other's jobs/chat/artifacts; subscription execution identity is
reported as implemented, not assumed to equal the original user's.

## 4. Missing infrastructure

Request: “Teach retrying statement jobs with Redis and a mocked settlement API.”

Expected: local Compose profile with real fixture API source, pinned versions,
health checks, seeds, fault modes, loopback ports, and scoped cleanup; real
queue integration test; local mode distinguished from durable mode.

Check: cold start works, a transient failure retries, restart behavior matches
the text, and reset cannot delete another project's data.

## 5. Upgrade a shared example

Request: “An attached-agent API changed. Refresh only the affected tutorials.”

Expected: inspect implementation and tests; trace affected checkpoints,
snippet regions, UI translation, and Handbook links; preserve routes and
unrelated edits; no blanket rewrite or invented compatibility shim.

Check: affected examples compile/run and incoming links still resolve; a
source gap is reported separately rather than hidden in tutorial prose.

## 6. Narrow copy edit

Request: “Explain the word idempotency more clearly on this step.”

Expected: improve the definition and concrete duplicate-effect example;
retain accurate delivery semantics; do not scaffold UI, run containers, or
restructure the full series for a local wording change.

Check: the diff is proportional, the reader can explain the repeated effect,
and validation is limited to relevant content/link checks.

## 7. Routing exclusions

Requests: “Document all Hono options”; “Add a queue worker to my application”;
“Build a standalone Harness demo.”

Expected: route general reference work to docs-maintainer and ordinary app
work to the canonical Framework skill. The tutorial skill does not override
a separate explicit standalone-product request, but it must not put that
request's result into the Framework-only tutorial series.

## 8. Put the visible application first

Request: “Move the UI chapter first and make the series easy to advanced.”

Expected: split initial Hono/UI serving from authentication; connect REST next;
teach identity at existing boundaries and add downstream hops when introduced.
Keep the first page runnable without a model, broker, database, or login.

Check: first success is a page from PURISTA, fixtures are labeled, and later
chapters teach simple primitives before workflows that combine them. Moving
the old full authentication/queue/agent graph to chapter one does not pass.

## 9. Business permission and representation

Request: “Teach guards and transforms meaningfully. A logged-in bookkeeper can
read statements but cannot record postings; a legacy import must obey that too.”

Expected: action/account/current-mandate policy; exact raw-to-domain transform;
normal domain validation; denied posting with no effect; read-only output guard
and export; actual runtime hook tests; no authorization in the transform.

Check: valid Bob session can read A but cannot post A or read C; Dana's authorized
legacy record maps exactly; concurrent guards have no ordering dependency;
after-guard failure is never described as a rollback of handler side effects.

## 10. An outline for a smaller model

Request: “Make every chapter detailed enough for a cheaper autonomous agent.”

Expected: separate chapter briefs with page slugs, teaching content, source work,
checkpoints, contracts, dependencies, UI evidence and negative tests; shared
business decisions; bounded packets and compatibility evidence before readiness.

Check: assigned page requires no invented permission/delivery/API choice; unseen
chapters and paid providers are not required; source gaps are reported instead
of bypassed. Static outline checks are not claimed as a successful model trial.
