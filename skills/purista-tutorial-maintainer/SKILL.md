---
name: purista-tutorial-maintainer
description: Creates and maintains PURISTA Framework website tutorials with beginner-friendly step pages, runnable examples, local dependencies, and an authenticated demo UI. Use for tutorial planning, authoring, verification, and drift repair; use purista-docs-maintainer for general Handbook or API documentation.
---

# PURISTA Tutorial Maintainer

## Purpose and scope

Turn a PURISTA capability into a sequence a new developer can understand, run,
change, and verify. Use one small real-world application only to make the
capability observable. Maintain the tutorial prose, source checkpoints,
dependency setup, demo UI, navigation, and tests together.

This is an internal authoring workflow in the canonical `purista/skills`
catalog. It may use internal specs and plans as evidence; public tutorials and
consumer examples must work without them. It does not define another runtime
skill or authorize implementing an entire series when asked for one chapter.

All examples use PURISTA Framework. Start by creating a project, then install,
configure, and start its HTTP server. A browser UI is an optional extension;
business behavior then enters services through commands, streams, queues, or events.
Agents and workflows are native Harness modules composed into one definition
and runtime mounted by the owning versioned service. Harness is never a
separate tutorial application. Vercel AI SDK UI Message
Stream v1 is the initial browser protocol. AI Elements supplies the example's
chat, message, tool, source, prompt, status, and approval components. Neither
is a replacement backend agent loop.

## Load only what the task needs

| Task | Read |
| --- | --- |
| Outline, chapter boundaries, writing, step pages | [Storyline and teaching](references/storyline-and-teaching.md) |
| Architecture fit, scope, nested pages, Framework testing | [Architecture and learning review](references/architecture-and-learning-review.md) |
| Source, checkpoints, dependencies, mocks, Compose | [Runnable examples](references/runnable-examples.md) |
| React UI, chat transport, Hono, identity | [Demo UI and identity](references/demo-ui-and-identity.md) |
| Business authorization, lifecycle, meaningful transforms | [Business guards and transforms](references/business-guards-and-transforms.md) |
| Detailed chapter briefs, smaller-model tasks, handoffs | [Bounded agent authoring](references/bounded-agent-authoring.md) |
| Review, publication, upgrades, maintenance | [Verification and maintenance](references/verification-and-maintenance.md) |
| Skill changes and behavioral checks | [Evaluation scenarios](references/evaluation-scenarios.md) |

Reuse the adjacent `purista-docs-maintainer` skill's
`references/writing-and-presentation.md` for code fences, exact file titles,
diagrams, source verification, and technical prose. For route changes also
read its `references/information-architecture.md` and
`references/structure-governance.md`; for dependency choices read
`references/optional-dependencies-and-feature-enablement.md`. Do not duplicate
those guides here. The catalog ships these references together.

Read `web/AGENTS.md` and `web/DESIGN.md` before changing website presentation.
Their editorial style applies to tutorial pages. The example app uses the
owner-requested default shadcn theme; do not restyle it as the marketing site.
Use the canonical `purista` skill and source/tests to verify Framework usage.

## Workflow

1. Read the latest user decisions and relevant active specs/series plan. For
   this workspace, the banking series starts in
   `plans/banking-tutorials/proposal.md` above the `purista` repo. Preserve its
   confirmed direction while distinguishing unimplemented choices from facts.
2. Identify the Framework capability, reader task, first observable result,
   existing knowledge, service owner, and trust boundaries. Check source, tests, CLI output, and
   current Handbook/API evidence before choosing the implementation shape.
   Apply the architecture and learning review before extending a series:
   passing tests do not excuse replacing PURISTA stores, service boundaries,
   or test helpers with parallel application machinery.
3. Order chapters from simple local results to composed and distributed work.
   Begin a new series with the real `npm create purista@latest` or verified
   `purista init` command. When a chapter introduces a Framework artifact,
   show the project-local `npm run add:*` command that creates it before
   showing the complete, located edit that turns the generated placeholder into business
   behavior. Give each step an entry checkpoint, one learning outcome, exact
   files, expected evidence, and the next action. Outline focused step pages
   before prose. CLI commands in introductions are not sufficient: replay the
   consecutive pages from an empty directory, using only the shown commands
   and file edits. Verify package installation, generated filenames, resource
   injection, service registration, startup, and the first real request.
   Install PURISTA packages from npm with the released version used by the
   lesson. Never teach or retain a workspace link, local package archive,
   package source import, or checkout-specific copy step.
   For autonomous authoring, fix business contracts and page jobs in a chapter
   brief, then assign one bounded checkpoint or page with verified inputs.
4. Write the teaching steps, commands and located edits before implementing
   the example. Follow those instructions in a clean consumer project; fix the
   instructions when the replay reveals a missing or incorrect step. The
   checked-in solution is the replay result, not the source used to manufacture
   a matching tutorial. Give each chapter an independent runtime and data set. Wire the corresponding
   optional demo screen to real service calls; keep scripted models and external mocks
   explicitly labeled.
5. Refine the drafted explanation using replay evidence. Explain the purpose of each
   newly introduced concept, dependency, builder call, and non-obvious option.
   Put a request, UI action, or assertion after each meaningful change.
6. Trace identity and data through every used boundary. Test failures and
   isolation, not only the successful screenshot. Do not describe automatic
   propagation, durability, delivery, or stream compatibility without evidence.
7. Verify clean setup, source checkpoints, tests, UI interactions, links, and
   the newcomer journey. Update coverage and navigation only for completed
   destinations. During isolated maintenance, use the replay tool's focused
   `--check --chapter <id>` mode so a deliberately frozen dependent branch does
   not force unrelated migration. The unfiltered source-provenance check remains
   the release gate. Report exact commands, results, and unresolved gaps.

## Completion rules

- A chapter stands alone without having completed another chapter. Shared
  tooling is allowed; hidden service/database prerequisites are not.
- Root chapter titles and navigation lead with the PURISTA capability or task:
  for example “Use the Hono webserver”, “Protect HTTP endpoints”, “Handle
  sessions”, or “Process work with queues”. The shared domain example belongs
  in the description and code, not in the information architecture.
- Keep the example domain deliberately small. Add a bank-specific rule, record,
  service, or screen only when it makes the current Framework capability easier
  to see or test. Do not make learners understand a banking system before they
  can understand PURISTA.
- A tutorial teaches construction. "Run the finished example" may be a quick
  reference or an entry checkpoint, but it cannot be the main lesson. The
  first page names the command that creates the project or checkpoint. A step
  creating a command, subscription, stream, queue, worker, or agent shows the
  verified project-local CLI command, generated files and learner's edit.
  Later steps identify that existing artifact; do not repeatedly generate it.
- Long chapters use step pages. A landing page or step must teach something,
  not merely list links or repeat the previous page.
- Maintain a chapter artifact ledger while authoring. For every CLI-generated
  artifact, record the generated path, the page that replaces or extends it,
  the file that registers it, the composition-root dependency that makes it
  run, the focused test that proves it, and the first observable result. Do not
  publish a definition, handler, resource, model alias, mount, or invocation
  that is absent from this end-to-end trace.
- Treat each code fence as a reproducible edit. Mark whether it creates,
  replaces, or extends the titled file; include required imports and nearby
  registration; and never use an undeclared placeholder in a command the
  learner is expected to run. At each page boundary, the exit state must be the
  next page's entry state.
- Keep a short required path, nesting optional variations and deeper checks
  beneath their owner. Do not require unrelated chapters or grow the teaching
  domain into a production bank.
- Teach builder/context testing, mocked resources/stores, and focused
  guard/transform tests beside implementation, followed by small runtime
  checks. An HTTP-only suite does not satisfy the Framework testing lesson.
- A reader can explain what changed and why, as well as reproduce the result.
- Dependencies and mocked external services have a reproducible local setup,
  usually Docker Compose, with health checks, fixtures, and scoped cleanup.
- When a demo UI is included, it offers the chapter's real behavior with React
  and default-theme shadcn/ui. Applicable AI surfaces use AI SDK UI Message
  Stream v1 and AI Elements instead of custom chat, message, tool, source,
  prompt, status, or approval components.
- Authentication derives trusted identity on the server. User-supplied IDs,
  model output, session IDs, and frontend selectors do not grant authority.
- When a chapter contrasts public and protected generated endpoints, its shown
  command builders contain the actual metadata calls: use
  `makeEndpointPublic()` only on the anonymous command and leave protected
  commands at the secure default. Protection middleware throws `HandledError`
  for expected denial so Hono owns the RFC 9457 response; do not handcraft a
  second problem-response implementation in the tutorial.
- Separate resource chapters by the new boundary they teach. Teach the common
  declaration/injection/mock pattern once; a database follow-up focuses on
  persistence and lifecycle, while an outbound-provider follow-up focuses on
  timeouts, secrets, remote validation, and failure mapping.
- For AI chapters, distinguish an application-controlled command call from a
  model-selected tool. A default-loop RAG agent receives retrieval through a
  native Harness host-tool contract bound with `commandAsHarnessTool(...)` or
  `getHarnessHostToolBuilder(...)`; do not pre-call retrieval in a custom
  agent handler. Keep retrieval authorization in the PURISTA command guard and
  add a mount business guard when the same scope is known before model work.
  Every published mounted target that can be called directly through
  EventBridge carries its own business guard; a wrapper command guard does not
  protect the target address.
- Before accepting an AI integration chapter, trace all of these artifacts:
  portable native target, service-level Harness composition, published mount
  policy, direct-target business guard, host-tool implementation when used,
  owning PURISTA capability and guard, address-first caller, runtime model and
  resource bindings, deterministic native Harness test, focused PURISTA helper
  test, and real EventBridge integration test. Omit only items the chapter does
  not claim to teach, and state the reason in internal review evidence.
- Give each AI chapter a deterministic default demo when its lesson does not
  depend on a live provider's behavior. The demo must cross the real PURISTA
  EventBridge and mounted Harness boundary with a strict scripted provider and
  run without credentials. Keep an optional live provider composition
  separate; do not make an API key the learner's first proof that the chapter
  is wired correctly.
- Treat Agent Skills as model-readable context only. Register explicit
  directories, validate them at startup, expose only the required sandbox
  tools, and prove the initial prompt contains the compact catalog rather than
  the complete Skill. Skill trust metadata never replaces PURISTA business
  guards or grants script execution, network access, credentials, or tools.
- Teach RAG as one complete index-to-answer path. Ingestion remains deterministic
  PURISTA command or worker logic, but embeddings come from a declared Harness
  model alias through `canUseHarnessModel(...)`; do not invent an embedding
  provider resource beside Harness. Use that same model contract for query
  embeddings, keep documents and vectors in a database resource, and let the
  answer agent choose an authorized command-backed retrieval tool. The runnable
  UI must exercise ingestion before standard AI SDK UI streaming.
- Teach guards with action/object/state permissions for valid callers, not only
  identity presence. Transforms change representations; handlers own effects
  and atomic state checks. After guards cannot roll back completed mutations.
- Use a command's named success response when its completed result is the event
  a subscription needs. Teach manual `context.emit` only for a distinct fact
  produced during execution.
- Present the final correct design to learners. Keep audit history, earlier
  mistakes, migration commentary, and repair explanations in internal evidence,
  not in tutorial prose.
- Keep synthetic fixtures and safe outputs. Never claim the banking example
  establishes regulatory compliance or constitutes production payment software.
- Fix ordinary writing, wiring, and verification defects in scope. Record a
  source/API gap when the supported integration cannot deliver the promised
  outcome; do not disguise it with a standalone Harness example or fake success.
- Planning, implementation, publication, and external deployment are distinct
  deliverables. Finish the requested one without inventing additional approval
  gates or treating unfinished future chapters as blockers.
