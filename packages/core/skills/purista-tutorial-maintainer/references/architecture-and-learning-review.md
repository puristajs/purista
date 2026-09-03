# Architecture and learning review

Use canonical `purista` architecture, state-ownership, and testing guidance.
This reference adds teaching decisions, not another runtime architecture.

## Contents

- [Inventory first](#inventory-first)
- [A small required path](#a-small-required-path)
- [Architecture gate](#architecture-gate)
- [Teach testing](#teach-testing)
- [Readiness](#readiness)

## Inventory first

List every current chapter/page with its real title, route, parent, status,
and source/checkpoint coverage. Identify duplicate ordering, misleading names,
unsupported promises, run-guide-only steps, and unrelated dependencies. Keep
an explicit old-to-new disposition when migration is part of the requested
work. If the owner chooses a clean rebuild, keep the old tree as diagnostic
evidence only: no per-page migration, redirect gate, or forced legacy structure.
Build and review one small new slice before expanding the series. Current
pages, planned destinations, and verified examples are separate states.

## A small required path

Name the Framework capability, reader task, and first observable result. Prefer
four to six required steps, adjusting when the learning sequence needs it.
Use only the actors and records needed to explain the rule. Accounting,
settlement, regulatory cases, and extensive approval policy are out of scope
unless they are the specific lesson.

A chapter title must remain useful to a reader who is searching for a Framework
task without knowing the example domain. Put the concise Example Bank scenario
in the description, diagrams, fixtures, and expected result. If removing the
bank noun makes the chapter purpose unclear, the chapter is probably organized
around domain work rather than Framework learning.

A chapter may have useful group pages and subpages, such as
`testing/mock-resources`. Do not manufacture empty index pages. Put extensive
regression suites and production variations after the first working result.
A source edit and its focused test belong together. Full source remains
available even when a page teaches only one located edit.

Group discovery by reader task while retaining independent use-case URLs.
Nested files require nested sidebar, breadcrumb, and previous/next behavior.
Verify desktop/mobile direct entry. Make feature terms such as state stores,
subscriptions, and resource mocking visible in titles, summaries, and search.

## Architecture gate

For every record/effect, name the service owner, contract, store/resource,
trusted identity, and consistency requirement. Classify by meaning before API
shape: sessions and other operational application state may use
`context.states`; transactions and other domain records use a declared
database/repository resource even when the lesson only saves and reads by id.
Use service operations for business effects. Avoid custom session maps, queues,
service registries, and route-owned business logic.

Inventory the actual HTTP adapter before writing routes. Application REST and
local session lifecycle operations are command endpoints. Mark only intentional
anonymous commands public, and use the Hono service protection middleware for
protected generated endpoints. A custom Hono route needs a named protocol or
static-asset reason that command/stream exposure cannot satisfy. Convenience or
familiar Hono syntax is not such a reason.

Do not mechanically replace every Map with KV: immutable fixtures, test
captures, and transactional repositories have different jobs. Generic KV
does not prove unique insertion, revision claims, multi-record commits,
durable jobs, or exactly-once processing.

Use a minimal independent baseline. Monitoring may need a producer; it should
not require CSV export, a legacy mock, React, and a case-management application.
Optional lessons must stay out of its required replay dependency graph.

Name each generated service after its narrow capability, not after the tutorial
application. For Example Bank, use boundaries such as `BankProfile`,
`Identity`, `Transaction`, `Monitoring`, `Analysis`, `Reporting`, `Support`,
and `Knowledge` when those capabilities are introduced. Never generate a
catch-all `Banking` or `ExampleBank` service. The example name belongs to the
application, fixtures, prose, and UI. Before replay, search the active plan,
pages, and retained source for umbrella service names and reject the packet if
one owns unrelated commands, resources, state, or agents.

Keep identity and authorization separate in the tutorial architecture.
`Identity` owns credential verification and operational sessions. Business
guards remain on the service that owns the protected action and record.

## Teach testing

Each primitive includes a test with its public builder/context helpers.
Explain the helper's boundary, resource method fakes, store stubs, a successful
result, and a meaningful failure. Assert that denied effects did not occur.
Teach a command test before a large application fixture. Teach direct hooks
when guards/transforms first appear, and use the Framework runtime for complete
lifecycle assertions. Use only a few HTTP/event/queue checks for wiring.

Compose-backed dependency, broker, and restart checks belong in named
integration variations. Scripted-model flow tests are not model evaluations.

## Readiness

Before copying a checkpoint into the next chapter, repeat the record/effect and
HTTP-route ownership review. A green predecessor is not an architecture
approval. Record each inherited database, StateStore use, generated endpoint,
custom route exception, and runtime listener owner in the chapter brief.

Review architecture, learning flow, construction, and testing separately.
Passing tests do not prove the intended architecture. Static plan validation
does not prove a smaller model implemented a packet. If the deliverable is a
revised plan, leave website/example implementation explicitly pending.
