# Storyline and teaching

## Contents

- [Chapter and page ownership](#chapter-and-page-ownership)
- [Easy English without missing explanations](#easy-english-without-missing-explanations)
- [Snippets, screenshots, and boundaries](#snippets-screenshots-and-boundaries)

## Chapter and page ownership

Use one continuous application vocabulary, fixture set, and business scenario
across a series. Each chapter solves one independently useful problem. Keep
the chapter's title outcome-based: “Generate account statements in the
background” tells a beginner more than “QueueWorkerBuilder”.

A chapter landing explains the problem, finished behavior, a small system
diagram, prerequisites, the command that creates its starting project or
checkpoint, and suggested steps. Do not put the entire implementation there.
A short chapter may use fewer steps; do not manufacture pages just to fill a
fixed template.

Keep the steps as ordered siblings below that chapter. Their order follows
what a learner must understand and build. Start with a working result, then
add one behavior at a time, handle its main failure, and test the complete
flow. Cross-cutting lookups must not interrupt the first result.

Order the series by the knowledge and dependencies each outcome introduces.
For the banking series, first boot PURISTA/Hono and serve a small React page;
then connect a REST API, teach account/action permissions at that boundary,
normalize an external format, and add events, streams, jobs and workflows. Introduce one attached
agent before RAG or multi-agent orchestration; leave distributed operation late.
The initial UI is a visible server result with labeled display fixtures, not a
fake working bank. Do not require authentication, brokers, or AI to serve it.
Separate UI serving from security teaching rather than moving a large chapter
unchanged to the front. Keep safe local defaults in every starting point and
teach identity propagation when each receiving primitive is introduced.
Advanced variations stay after the chapter's first useful result. Check for
forward knowledge dependencies even though every example runs independently.

Use a page-job table before authoring:

| Page | Reader question | Entry checkpoint | New change | Observable evidence | Next step |
| --- | --- | --- | --- | --- | --- |
| Publish a transaction event | How can another service learn that a transaction was recorded? | Running transaction API | Declare and publish the event | Runtime test captures the expected event | Add a monitoring subscription |

For this example the next steps could be: add the subscription, create and
inspect a review case, handle duplicate delivery, and test the monitoring flow.
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

> The transaction service records the transaction. It then publishes an event
> to tell other services what happened. The monitoring service receives that
> event through a subscription. This lets us add monitoring without making
> the transaction handler call the monitoring service directly.

Follow with the exact delivery and database/event atomicity limitations of
the selected implementation. Easy language must not erase those boundaries.

## Snippets, screenshots, and boundaries

Use the docs-maintainer formatting conventions: language-correct fences with
real file/action titles, focused snippets from tested source, small semantic
Mermaid diagrams, and concise tables where they clarify a mapping.

Show the terminal/API path and the corresponding demo UI action. Use
screenshots to orient readers, not as the only explanation of a result.
Provide text labels and accessible status/error content.

Separate “What you built”, “What changes in production”, and “Next step” when
those distinctions matter. Do not put security off until a final appendix.
Keep the essential safe configuration on the first runnable path.

For review, enter from a random step as a beginner: can you find the right
checkpoint, run it, explain the next edit, and recognize success without
opening unrelated chapters? Also read consecutive pages to detect repeated
introductions, unexplained jumps, inconsistent names, and missing handoffs.
