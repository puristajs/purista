# Evaluation scenarios

## Contents

- [Independent beginner entry](#1-a-beginner-enters-transaction-monitoring-directly)
- [Chat and identity](#2-rag-with-a-react-interface)
- [Infrastructure](#4-missing-infrastructure)
- [Maintenance and routing](#5-upgrade-a-shared-example)
- [Simple-to-advanced order](#8-build-the-backend-before-an-optional-ui)
- [Business guards and transforms](#9-business-permission-and-representation)
- [Bounded authoring](#10-an-outline-for-a-smaller-model)
- [Reject a run guide](#11-replace-a-run-guide-with-a-build-sequence)
- [Architecture before green tests](#12-repair-state-ownership-despite-passing-tests)
- [Nested and small lessons](#13-simplify-a-flat-course)
- [Teach Framework tests](#14-teach-command-and-resource-tests)
- [Clean rebuild](#15-rebuild-instead-of-migrating)
- [Command result events](#16-choose-a-command-success-event)
- [Capability-first course](#17-keep-the-example-out-of-the-information-architecture)
- [Narrow service names](#18-keep-the-application-name-out-of-service-boundaries)

Use these bounded scenarios to review the skill's decisions. They are
behavioral acceptance cases, not claims that an evaluation has already run.
Use temporary copies for generated artifacts and no live credentials.

## 1. A beginner enters transaction monitoring directly

Request: “Write the transaction-monitoring tutorial. I have not done the REST
chapter and do not know what a subscription is.”

Expected: independent Framework starting point; small landing plus ordered
step pages; plain explanation before the builder; runnable producer; expected
event and small monitoring signal; duplicate-delivery test; no previous database
requirement or mandatory case-assignment subsystem.

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

Request: “The Harness mount API changed. Refresh only the affected tutorials.”

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

## 8. Build the backend before an optional UI

Request: “Show how to create the project and add Hono. The frontend is not relevant.”

Expected: generate the project, install the HTTP packages, write configuration,
connect startup/shutdown, generate a service and command, and verify the HTTP
request. Keep the UI optional and teach identity and business guards next.

Check: replay from an empty directory with published dependencies, without a
prebuilt demo, frontend, model, broker, or database. Each imported file must
already exist from generation or a preceding visible edit.

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

## 11. Replace a run guide with a build sequence

Request: “The tutorial tells me how to run the demo, not how to build it.”

Expected: inspect consecutive pages and actual generated output. Replace
disconnected snippets with explained edits, including imports, contracts,
resource injection, definition registration, instance startup, and meaningful
tests. Keep a finished-demo shortcut separate from the main lesson.

Check: replay the printed commands and file edits outside the monorepo. Fail
the review if only CLI commands were added to chapter introductions, if the
reference source has an unexplained different layout, or if verification only
runs the already-complete demo. Test outcomes must come from the learner's
constructed checkpoint.

## 12. Repair state ownership despite passing tests

Request: “The login tutorial rebuilds a store with a Map. It passes replay,
but it does not follow PURISTA. Review every chapter.”

Expected: inventory every page and source owner; classify operational state
versus domain records by meaning. Move session operations into generated
Identity commands and use PURISTA StateStore for their operational session
records. Put transactions behind an injected database resource even if the
first repository API only saves and reads by id. Keep Hono protection in
`setProtectMiddleware`, mark only login public, and remove parallel lifecycle
routes. Do not rewrite unrelated user work.

Check: published claims, local limitations, dependencies and helper tests agree;
architecture review is separate from snapshot equality and passing HTTP tests.
A plan identifies remaining implementation work instead of calling it fixed.
Fail if storage was chosen from method count, a generated endpoint was replaced
with ordinary Hono syntax, or `prepareDestroy()` is claimed to close the runtime
listener.

Learner-facing replacement pages contain only the resulting design. Explanations
of the old mistake and repair stay in internal evidence.

## 13. Simplify a flat course

Request: “There are too many pages. We can use subpages and sub-subpages; this
is a framework example, not a real bank.”

Expected: list the actual current tree; retain a disposition for every route;
choose small required outcomes and nested optional variations; check actual
navigation support rather than assuming nested URLs produce a nested sidebar.
Independent chapter baselines exclude unrelated CSV, UI, broker or AI work.

Check: meaningful group indexes, required next/previous traversal, direct entry
recipes, breadcrumbs and verified redirects are planned. Simplicity removes
unnecessary domain machinery, not imports, registration, explanations or tests.

## 14. Teach command and resource tests

Request: “Testing must show how PURISTA commands are tested and resources mocked.”

Expected: command-context test in the first chapter, state stubs beside state,
typed client fakes beside resources, direct business-guard and transform tests,
then a small runtime integration check. Explain helper limitations in easy English.

Check: the reader writes the test from a generated project; verifies success,
dependency failure and no denied effect; understands why an HTTP test or raw
handler call cannot prove every lifecycle stage. Printed code compiles with
the selected published package and does not invent helper identity options.

## 15. Rebuild instead of migrating

Request: “Do not migrate the existing pages. Start clean and then we review.”

Expected: remove migration and redirect work from the active plan. Use old
content only as diagnostic evidence. Build one small new source-and-prose
slice, including Framework tests, and review it before expanding the series.

Check: no legacy compatibility gate, forced old route structure, cumulative
demo dependency, or mass authoring before the first working slice is reviewed.
Existing unrelated work is preserved; the plan does not claim code is rebuilt.

## 16. Choose a command success event

Request: “Publish a fact after saving a transaction so a subscription can use
the completed command result.”

Expected: use `setSuccessEventName` on the transaction command and subscribe to
the named command success response. Explain that PURISTA publishes it only when
the command completes successfully. Use `canEmit` and `context.emit` in a
separate example only when a different fact occurs during execution.

Check: repository failure produces no event; the handler has no duplicate
manual emit; the runtime test asserts `CommandSuccessResponse`, event name,
sender, trusted tenant/principal metadata, and result payload.

## 17. Keep the example out of the information architecture

Request: “The bank is only our concise example. Teach people how to build with
PURISTA.”

Expected: root titles lead with tasks such as using Hono, serving static files,
adding endpoints, protecting endpoints, handling sessions, subscriptions,
streams, and queue processing. Descriptions state the small banking result.
The capability dependency order determines navigation and baselines.

Check: a reader can scan titles and find a PURISTA capability without knowing
the Example Bank storyline. Every bank-specific record or rule has a direct
teaching job. Remove domain machinery that does not prove the current builder,
context, runtime, transport, store/resource, guard, or test boundary.

## 18. Keep the application name out of service boundaries

Request: “Use one BankingService for login, transactions, monitoring, reports,
and support AI so the tutorial has fewer names.”

Expected: reject the catch-all service. Start with `BankProfile`, then introduce
`Identity`, `Transaction`, `Monitoring`, `Analysis`, `Reporting`, `Support`, and
`Knowledge` only when their capabilities appear. Keep session authentication
in Identity and business authorization guards on the service that owns the
action. Example Bank remains the application and UI name.

Check: the active plan, CLI commands, learner pages, replay manifest, and
retained source contain no generated `Banking` or `ExampleBank` service. Every
service has a clear owner, state/resource boundary, excluded responsibilities,
and focused Framework tests. Old diagnostic evidence may preserve the rejected
name but cannot be a starting checkpoint.
