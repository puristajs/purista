---
name: purista-skill-maintainer
description: Create, review, refactor, and keep the canonical PURISTA skill and its maintenance guidance up to date using the shared purista/skills catalog, spec-first sourcing, and cross-repo drift checks.
topics: [skills, documentation, maintenance]
phases: [spec, architecture, implementation, review]
---

# PURISTA Skill Maintainer

## When to use this skill
Use this skill when creating, refactoring, consolidating, or reviewing the shared `purista` framework skill, the `purista-skill-maintainer` meta skill, or any overlay that depends on them.

## What this skill is for
This skill defines the maintenance workflow for the shared PURISTA skill catalog in `purista/skills`.
The catalog now has one canonical framework skill, `purista`, plus one separate meta skill, `purista-skill-maintainer`.
The maintainer skill keeps that model coherent, readable, implementation-grounded, and aligned across `purista`, `starter`, `create-purista`, `specs`, and `voyage`.

## Source-of-truth order
Read sources in this order before changing a skill:
1. Relevant docs in `specs/`
2. Current implementation in `purista/`
3. The current `purista` skill and its `references/`
4. Downstream overlays and consumers in `voyage`, `starter`, and `create-purista`

## Hard rules
- Treat `purista` as the canonical shared framework skill path unless the change is explicitly about the maintainer skill itself.
- Keep `SKILL.md` compact and navigational; move depth into `references/`.
- Use the filesystem as part of the reasoning surface: good reference taxonomy matters.
- Verify every file path, package path, and code snippet in the repo.
- Update downstream docs, tests, overlays, and published LLM context files in the same refactor when the shared skill shape changes.
- Do not split the framework back into many sibling skills unless there is a genuinely separate non-runtime concern.

## Decision rules
- Keep one framework skill and split depth into references instead of adding more framework skill folders.
- Keep `purista-skill-maintainer` separate because it is a catalog-authoring workflow, not runtime framework knowledge.
- Put only the routing model, core mental model, and highest-signal rules into `SKILL.md`.
- Put examples, nuanced decisions, and topic-specific teaching into `references/`.
- Add code snippets only when they materially teach a PURISTA concept.

## Required read order
- `specs/00-context.md`
- `purista/skills/README.md`
- `purista/skills/purista/SKILL.md`
- this `SKILL.md`
- `references/maintenance-checklist.md`
- `references/catalog-audit-wave1.md`

## What to review for every change
- One-skill routing quality
- Accuracy of file references and package paths
- Definition / implementation / configuration / instantiation coverage
- Reference taxonomy quality
- Snippet relevance and duplicate-content risk
- Drift in `starter`, `create-purista`, `voyage`, `specs`, and published docs

## Read if needed
- `references/catalog-audit-wave1.md`
- `references/maintenance-checklist.md`
- `voyage/apps/server/skills/README.md`
- `purista/packages/ai/src/skills/filesystem.ts`
