---
name: purista-tutorial-maintainer
description: Creates and maintains PURISTA Framework website tutorials with beginner-friendly step pages, runnable examples, local dependencies, and an authenticated demo UI. Use for tutorial planning, authoring, verification, and drift repair; use purista-docs-maintainer for general Handbook or API documentation.
---

# PURISTA Tutorial Maintainer

## Purpose and scope

Turn a real application problem into a sequence a new developer can understand,
run, change, and verify. Maintain the tutorial prose, source checkpoints,
dependency setup, demo UI, navigation, and tests together.

This is an internal authoring workflow in the canonical `purista/skills`
catalog. It may use internal specs and plans as evidence; public tutorials and
consumer examples must work without them. It does not define another runtime
skill or authorize implementing an entire series when asked for one chapter.

All examples use PURISTA Framework. Start with its HTTP server and visible UI;
business behavior then enters services through commands, streams, queues, or events.
Agents and workflows attach to versioned services. Harness is the attached
runtime, never a separate tutorial application. Vercel AI SDK
UI is a presentation/transport dependency, not a replacement backend agent loop.

## Load only what the task needs

| Task | Read |
| --- | --- |
| Outline, chapter boundaries, writing, step pages | [Storyline and teaching](references/storyline-and-teaching.md) |
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
2. Identify the reader's problem, first observable result, existing knowledge,
   service owner, and trust boundaries. Check source, tests, CLI output, and
   current Handbook/API evidence before choosing the implementation shape.
3. Order chapters from simple local results to composed and distributed work.
   Begin a new series with the real `npm create purista@latest` or verified
   `purista init` command. When a chapter introduces a Framework artifact,
   show the project-local `npm run add:*` command that creates it before
   showing the focused edit that turns the generated placeholder into business
   behavior. Give each step an entry checkpoint, one learning outcome, exact
   files, expected evidence, and the next action. Outline focused step pages
   before prose.
   For autonomous authoring, fix business contracts and page jobs in a chapter
   brief, then assign one bounded checkpoint or page with verified inputs.
4. Build the smallest complete Framework example and local dependency setup.
   Give each chapter an independent runtime and data set. Wire the corresponding
   demo screen to real service calls; keep scripted models and external mocks
   explicitly labeled.
5. Write in easy English from the verified changes. Explain the purpose of each
   newly introduced concept, dependency, builder call, and non-obvious option.
   Put a request, UI action, or assertion after each meaningful change.
6. Trace identity and data through every used boundary. Test failures and
   isolation, not only the successful screenshot. Do not describe automatic
   propagation, durability, delivery, or stream compatibility without evidence.
7. Verify clean setup, source checkpoints, tests, UI interactions, links, and
   the newcomer journey. Update coverage and navigation only for completed
   destinations. Report exact commands, results, and unresolved gaps.

## Completion rules

- A chapter stands alone without having completed another chapter. Shared
  tooling is allowed; hidden service/database prerequisites are not.
- A tutorial teaches construction. "Run the finished example" may be a quick
  reference or an entry checkpoint, but it cannot be the main lesson. The
  first page names the command that creates the project or checkpoint; every
  command, subscription, stream, queue, worker, and agent page starts with
  the verified project-local CLI generation command and then explains the
  generated files and the learner's edit.
- Long chapters use step pages. A landing page or step must teach something,
  not merely list links or repeat the previous page.
- A reader can explain what changed and why, as well as reproduce the result.
- Dependencies and mocked external services have a reproducible local setup,
  usually Docker Compose, with health checks, fixtures, and scoped cleanup.
- The demo offers the chapter's real behavior with React, default-theme
  shadcn/ui, and AI SDK UI/AI Elements for applicable chat surfaces.
- Authentication derives trusted identity on the server. User-supplied IDs,
  model output, session IDs, and frontend selectors do not grant authority.
- Teach guards with action/object/state permissions for valid callers, not only
  identity presence. Transforms change representations; handlers own effects
  and atomic state checks. After guards cannot roll back completed mutations.
- Keep synthetic fixtures and safe outputs. Never claim the banking example
  establishes regulatory compliance or constitutes production payment software.
- Fix ordinary writing, wiring, and verification defects in scope. Record a
  source/API gap when the supported integration cannot deliver the promised
  outcome; do not disguise it with a standalone Harness example or fake success.
- Planning, implementation, publication, and external deployment are distinct
  deliverables. Finish the requested one without inventing additional approval
  gates or treating unfinished future chapters as blockers.
