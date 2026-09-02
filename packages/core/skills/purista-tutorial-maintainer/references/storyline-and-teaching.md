# Storyline and teaching

## Contents

- [Chapter and page ownership](#chapter-and-page-ownership)
- [Easy English without missing explanations](#easy-english-without-missing-explanations)
- [Snippets, screenshots, and boundaries](#snippets-screenshots-and-boundaries)

## Chapter and page ownership

Use one continuous application vocabulary, fixture set, and business scenario
across a series. The scenario is supporting material. Each root chapter teaches
one independently useful Framework capability and names that capability in the
title: “Process work with queues” is clearer for this course than a title about
generating a bank statement. The description can say that the queue produces a
small Example Bank statement.

The continuous application name is not a service name. Introduce a small
service only when a lesson needs its capability, and keep that service after it
appears. In this course `BankProfile` supplies the first public fixture,
`Identity` owns sessions, `Transaction` owns transaction behavior and business
guards, and later capabilities use their own owners. Do not use `Banking` as a
container for whatever the next lesson needs. Do not derive identifiers such as
`bankingService`, `bankingV1ServiceBuilder`, or `src/service/banking` from the
application name. Do not create one service per page either: add an artifact to
an existing service when it shares that service's capability, rules, and
resources; create a service when it establishes a different owner.

Before writing pages, separate four kinds of names in the chapter plan:

1. the demo application and UI name;
2. transport services such as Hono;
3. capability services that own commands, subscriptions, queues, streams, or
   attached agents; and
4. injected resources such as repositories, provider clients, and model
   adapters.

Only the third group defines application service boundaries. The composition
root assembles all four groups. It does not need an umbrella service whose name
repeats the application name.

Learner-facing pages describe this ownership model positively. Do not mention
rejected service names, deleted structures, earlier drift, or corrections in a
tutorial. Keep those names in internal replay checks and evaluation scenarios,
where they can prevent the same drift without teaching it to readers.

A chapter landing explains the problem, finished behavior, a small system
diagram, prerequisites, the command that creates its starting project or
checkpoint, and suggested steps. Do not put the entire implementation there.
A short chapter may use fewer steps; do not manufacture pages just to fill a
fixed template.

Use ordered steps and meaningful nested groups below the chapter. A short
Build path, Test with PURISTA, and optional Extensions can contain subpages
and deeper pages when needed. Do not flatten every variation into the required
reading path or manufacture group indexes that only repeat links. Start with
a working result, add one behavior and its focused test at a time, then test
the complete flow. Cross-cutting lookups must not interrupt the first result.

Order the series by Framework knowledge and dependencies. For the banking
series, generate a PURISTA project, run Hono, serve the small UI, expose command
endpoints, inject persistence, then add protection, sessions, and business
guards. Continue with transforms, resources, named command results,
subscriptions, streams, queues, schedules, observability, agents, and workflows. Introduce one attached
agent before RAG or multi-agent orchestration; leave distributed operation late.
The frontend is optional. Every core lesson has a terminal/request path and
must remain understandable without React. Do not require brokers or AI for the first server.
Separate UI serving from security teaching rather than moving a large chapter
unchanged to the front. Keep safe local defaults in every starting point and
teach identity propagation when each receiving primitive is introduced.
Advanced variations stay after the chapter's first useful result. Check for
forward knowledge dependencies even though every example runs independently.

Use a page-job table before authoring. Put the Framework capability in the page
job and use the banking action only as its concrete result:

| Page | Reader question | Entry checkpoint | New change | Observable evidence | Next step |
| --- | --- | --- | --- | --- | --- |
| Publish a transaction event | How can another service learn that a transaction was recorded? | Running transaction API | Name the successful command result as an event | Runtime test captures the named command response | Add a monitoring subscription |

For this example the next steps could be: add the subscription, save and
inspect one monitoring signal, handle duplicate delivery, and test the flow.
A case-assignment subsystem is an optional guard variation, not a prerequisite
for learning subscriptions. Use PURISTA StateStore for operational application
state; domain records use a declared database resource.
Each page states the checkpoint to run when arriving directly from search.
When it introduces a PURISTA artifact, it also gives the exact local CLI
command that generates the artifact, identifies the generated files, and
shows the edit that gives the placeholder its business meaning. Do not require
the reader to find an old commit, copy a finished application blindly, or
reconstruct earlier edits.

## Easy English without missing explanations

Assume basic programming familiarity, not knowledge of distributed systems,
PURISTA, containers, authentication, or AI orchestration. State any actual
TypeScript or terminal prerequisite and explain the syntax when first used.

- Explain the familiar problem before naming its technical solution.
- Define a new term at first use. A subscription is a handler that runs when
  an event matches; idempotency means repeating an operation does not repeat
  its intended effect. Explain the relevant limitations immediately afterward.
- Explain producer/consumer, tenant/principal, enqueue/complete, schema/type,
  model/agent, and mock/real dependency when the chapter first needs them.
- Use short sentences, active verbs, specific nouns, and small examples.
  Avoid “simply”, “obviously”, unexplained acronyms, and promotional claims.
- For each new API/configuration call, say why it is needed, what it receives,
  what it changes, and how it can fail. Link to exact verified API details for
  exhaustive options; do not make those links substitute for explanation.
- Explain where a snippet belongs and whether it replaces or extends existing
  code. Show the relevant imports and registration, not only a handler body.
- Explain terminal working directories, foreground processes, second terminals,
  environment variables, ports, and stop commands the first time they matter.
- State what the reader should see after a command or UI action, what it means,
  and one likely fix when it differs. A successful build alone is not proof of
  a business result.

Example wording:

> The transaction service records the transaction and returns it. PURISTA names
> that successful command response as an event. The monitoring service receives
> the named response through a subscription. This lets us add monitoring without
> making the transaction handler call the monitoring service directly.

Follow with the exact delivery and database/event atomicity limitations of
the selected implementation. Easy language must not erase those boundaries.

## Snippets, screenshots, and boundaries

Use the docs-maintainer formatting conventions: language-correct fences with
real file/action titles, focused snippets from tested source, small semantic
Mermaid diagrams, and concise tables where they clarify a mapping.

Show the terminal/API path and, when a UI is included, its corresponding action. Use
screenshots to orient readers, not as the only explanation of a result.
Provide text labels and accessible status/error content.

Separate “What you built”, “What changes in production”, and “Next step” when
those distinctions matter. Do not put security off until a final appendix.
Keep the essential safe configuration on the first runnable path.

Write from the final design. Do not tell learners that an earlier page, source
checkpoint, or authoring attempt was wrong and then narrate its correction.
Keep that history in plans and verification evidence. A replacement page should
teach only the intended architecture and the choices a new learner needs.

For review, enter from a random step as a beginner: can you find the right
checkpoint, run it, explain the next edit, and recognize success without
opening unrelated chapters? Also read consecutive pages to detect repeated
introductions, unexplained jumps, inconsistent names, and missing handoffs.
