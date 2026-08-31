# Bounded agent authoring

## When detailed handoffs help

Use this workflow when the user wants a chapter plan another agent can execute,
especially with a smaller model or limited context. Do not turn a small copy
edit into a whole-series planning exercise or spawn agents just because this
guide mentions autonomous work.

Keep the concept and contract decisions in one series plan. Give each chapter
its own short brief so the implementer loads one task and its direct evidence,
not the entire series. For this workspace, use
`plans/banking-tutorials/agent-execution-guide.md` and `chapters/` above the repo.
These are internal handoffs; public instructions remain self-contained.

## A chapter brief must remove the important guesses

Include:

- Public title, opening and route; problem, first visible result and exclusions.
- Independent starting runtime, fixtures and dependency profile, identifying
  required infrastructure versus optional live/model modes.
- Service owner and intended request/result contracts; business side effects,
  actor/scope, guard rules, transform mapping and important failure behavior.
- Ordered child-page slugs and titles. For each: what to explain, what to build,
  owned source artifact, entry/exit checkpoint and observable evidence.
- UI actions/states, meaningful positive/negative tests, current source/API
  owners and constraints, optional extensions after the first useful result.

Use shared policy IDs to avoid contradictory rules, but explain their meaning
in the actual tutorial. Fix decisions such as approval limits, revocation time,
duplicate handling and output exposure in the brief rather than letting each
page agent invent its own version.

## Separate design readiness from execution readiness

A proposed folder or command is not an existing runnable tool. Resolve the
supported dependency versions, public API, generated paths, runtime composition
and capability evidence before handing an implementation packet to a smaller
model. A missing API must not become invented code or a standalone Harness app.

Establish the minimum shared foundations first: chapter/checkpoint runner,
consumer install, fixtures, UI shell, local dependencies, source-region checking
and website manifest. Each can be a bounded assignment. Do not require every
advanced foundation to finish before a simple HTTP chapter can proceed.

Keep pedagogical order separate from authoring dependencies. A later example
can reuse shared infrastructure, but cannot require an earlier chapter's running
database or service. Shared utilities must not hide the lesson's business logic.

## Assign one observable change

Each packet states objective, assigned chapter/page, exact input checkpoint,
verified API/source paths, fixtures/policies, owned paths, expected behavior,
verification commands, forbidden effects, exclusions and handoff output.
Choose one checkpoint change, focused verification task, or page of prose.
Write prose after the corresponding code is verified.

Use explicit checkpoints and source-region references. No TODO handlers or
unbuildable intermediate states. If a page introduces no code change, map it
honestly to the same source checkpoint instead of duplicating a fake milestone.
Coordinate edits to shared manifests/UI/runner through a single owner.

When a source/API contradiction remains after focused inspection, preserve a
small reproduction and route that decision to the coordinating task. Continue
unaffected work in scope. Do not weaken authorization, remove tests, invent
provider capabilities or repeatedly guess signatures to make a build pass.

## Evidence and handoff

Report changed files, source regions, exact executed checks, observed results,
runtime/UI evidence and unresolved limits. Mark planned, ready, verified and
published separately; do not label prose-only work as an implemented tutorial.
Consumer setup, negative business cases and advertised intermediate checkpoints
must work, not only the final happy-path screenshot.

Validate planning structure cheaply (links, routes, page/checkpoint coverage,
required handoff fields), but distinguish static validation from a real smaller-
model implementation trial. A claim that cheap models can reliably execute the
guide requires that separate behavioral evidence. Do not claim it from a parser.
