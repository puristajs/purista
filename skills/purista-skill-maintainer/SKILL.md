---
name: purista-skill-maintainer
description: Create, review, refactor, and keep PURISTA skills up to date using the shared purista/skills catalog, spec-first sourcing, and cross-repo drift checks.
topics: [skills, documentation, architecture, maintenance]
phases: [spec, architecture, implementation, planning]
---

# PURISTA Skill Maintainer

## When to use this skill
Use this skill when creating a new PURISTA skill, updating an existing one, consolidating overlapping skills, or auditing the catalog for drift after framework changes.

## What this skill is for
This skill defines the maintenance workflow for the shared PURISTA skill catalog in `purista/skills`.
It keeps skills short, reusable, implementation-grounded, and aligned with framework behavior across `purista`, `starter`, `create-purista`, `specs`, and `voyage`.
Its primary goal is to let AI systems and LLMs build correct PURISTA applications even when the model has no pretrained PURISTA knowledge.
That means the catalog must teach the framework's concepts, patterns, structures, and builder-driven composition model explicitly enough to be usable as an externalized framework memory.

## Source-of-truth order
Read sources in this order before changing a skill:
1. Relevant docs in `specs/`
2. Current implementation in `purista/`
3. Neighboring skills in `purista/skills/`
4. Downstream usage or overlays in `starter`, `create-purista`, and `voyage` when the framework capability affects them

If these sources disagree, treat the shared catalog in `purista/skills` plus current framework implementation as the operational truth, and note the drift explicitly.

## Hard rules
- Keep one primary concern per skill.
- Optimize every framework skill for knowledge transfer into models that do not already know PURISTA.
- Start from actual PURISTA concepts and files, not generic AI-agent advice.
- Teach the PURISTA builder model explicitly where relevant:
  - definition via builders
  - implementation behind builder contracts
  - configuration attached to builders and resources
  - runtime instance creation from builder definitions
- Keep `SKILL.md` lean and procedural; move detailed examples or matrices into `references/`.
- Reuse existing skill structure: frontmatter, focused sections, optional `references/`, optional `scripts/`, optional `assets/`.
- Treat a skill as a small system, not only a markdown note: include scripts, templates, queries, or validation helpers when they materially improve reliability.
- Add cross-links only when they express a real dependency, prerequisite, or next-step relationship.
- Do not introduce plugin-specific formats, runtime wrappers, or extra per-skill docs unless the PURISTA catalog explicitly adopts them.
- When a framework capability changes, update affected skills in the same pass or document the precise follow-up gap.
- Prefer structure and high-signal context over rigid micromanagement; leave room for agent judgment where multiple valid approaches exist.
- Do not assume the reader understands PURISTA terms such as service builder, command builder, queue builder, resource definition, or runtime binding unless the skill or a linked reference teaches them.

## Decision rules
- Create a new skill when the concept has a stable boundary and the workflow would otherwise overload an existing skill.
- Update an existing skill when the behavior is the same but the framework capability, contract, or guidance changed.
- Merge skills when users would reasonably trigger either one for the same task and the distinction is mostly editorial.
- Split a skill when it mixes multiple bounded concerns or exceeds a compact working guide.
- Add `references/` when detail is useful but not needed on every invocation.
- Add `scripts/` only when a repeated validation or generation step benefits from determinism.

## Recommended skill categories
- Knowledge skills: teach PURISTA APIs, packages, contracts, file layouts, or framework-specific decision rules.
- Verification skills: run tests, assertions, sample executions, or output checks for PURISTA behavior.
- Data skills: collect or compare logs, traces, specs, generated artifacts, or drift signals.
- Automation skills: execute repeatable repo workflows such as spec sync, release prep, or migration sweeps.
- Scaffolding skills: generate structured service, queue, resource, or app boilerplate.
- Review skills: enforce code, architecture, contract, or operational quality bars.
- Runbook skills: diagnose failures, inspect logs, and drive incident or local-debug workflows.

Use these as a taxonomy for deciding whether to create a new skill or extend an existing one.

## Recommended workflow
1. Identify the trigger: new capability, drift, weak description, overlap, or stale guidance.
2. Read the relevant spec and implementation files first.
3. Extract the minimum framework knowledge an otherwise untrained model would need in order to use the relevant PURISTA concept correctly.
4. Compare the target skill with neighboring skills to avoid duplication or gaps.
5. Rewrite the skill around:
   - when to use
   - what it is for
   - core PURISTA concept or builder role
   - hard rules
   - decision rules
   - definition vs implementation vs configuration vs instantiation guidance when applicable
   - recommended workflow or file structure
   - common mistakes
   - read-if-needed pointers
   - related skill links when the dependency chain matters
6. Keep routing metadata accurate: `name`, `description`, and if useful `topics`, `phases`, `requires_sandbox`.
7. Validate that examples, file paths, and package names still exist.
8. Add or update validation guidance:
   - simulate realistic usage where possible
   - prefer assertions, logs, and observed outputs over “looks right”
   - include scripts when verification is repeated or brittle
9. Check downstream impact:
   - `starter` defaults and generated structure
   - `create-purista` scaffolding and templates
   - `voyage` overlays or capability assumptions
   - `specs` guidance and migration notes
10. Capture newly discovered edge cases, failures, or gotchas in the skill or a local reference file if they are likely to recur.
11. If drift remains outside the edited skill, record it clearly in the response or follow-up task.

## Skill style
- Prefer imperative guidance over explanation-heavy prose.
- Optimize descriptions for routing: concrete nouns, verbs, and trigger conditions.
- Prefer local PURISTA terminology over generic “agent framework” language.
- Use short sections and compact bullets.
- Include only implementation-relevant file paths.
- Put only the core workflow in `SKILL.md`; let the filesystem provide progressive disclosure through `references/`, `scripts/`, and `assets/`.
- Explain PURISTA-specific abstractions clearly enough that a capable but untrained model can act correctly without hidden prior knowledge.
- Use sparse, directional skill links; do not create a dense web of reciprocal links with no decision value.

## Verification standard
- Do not treat generation as completion.
- Prefer skills that can prove outcomes with tests, assertions, logs, diffs, or sample executions.
- For complex or failure-prone workflows, include explicit verification steps in the skill body.
- If the skill repeatedly fails on the same edge case, convert that lesson into a durable rule or reference.
- Verify not only that code compiles or tests pass, but that the produced shape respects PURISTA builder patterns and runtime composition rules.

## External pattern fit
- Keep the Claude-style pattern of a lightweight entry file plus optional supporting resources.
- Keep the strongest idea from the tweet guidance: the filesystem is part of the reasoning surface, so folder structure should make the right information easy to load incrementally.
- Keep the AnythingLLM idea of clear folder ownership and hot-reload-friendly updates only as a general maintenance principle, not as a file-format template.
- Prefer the existing PURISTA markdown catalog over executable plugin packaging.

## Common mistakes / anti-patterns
- Writing a broad “do everything” skill.
- Duplicating framework knowledge across many skills with slightly different wording.
- Leaving stale package paths, old capability names, or pre-refactor folder layouts.
- Using external tool ecosystems as the primary structure instead of adapting them to PURISTA.
- Writing a skill that assumes prior framework training instead of teaching the required PURISTA concepts.
- Describing only implementation steps without explaining the underlying builder, configuration, and instance model.
- Stopping at content generation without adding any verification path for critical workflows.
- Over-constraining the agent with brittle instructions where a decision rule would work better.
- Updating `purista` behavior without checking whether `starter`, `create-purista`, `voyage`, or `specs` now drift.

## How this connects to other PURISTA concepts
This is a meta-skill for maintaining the shared skill catalog that supports core, architecture, service design, queues, agents, stores, sandbox, scaffolding, and runtime guidance.

## Read if needed
- `purista/skills/README.md`
- `specs/README.md`
- `specs/30-roadmap/implementation-plan.md`
- `voyage/apps/server/skills/README.md`
- `purista/skills/purista-core/SKILL.md`
- `references/catalog-audit-wave1.md`
- `references/maintenance-checklist.md`
