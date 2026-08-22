---
name: purista-skill-maintainer
description: Maintains the canonical PURISTA skill catalog with spec-grounded drift checks, implementation verification, progressive disclosure, and evaluation scenarios. Use when creating, reviewing, or maintaining the canonical PURISTA skill catalog and its downstream mirrors.
---

# PURISTA Skill Maintainer

## When to use this skill
Use this skill when creating, refactoring, consolidating, or reviewing the shared `purista` framework skill, the `purista-skill-maintainer` meta skill, or any overlay that depends on them.

## What this skill is for
This skill defines the maintenance workflow for the shared PURISTA skill catalog in `purista/skills`.
The catalog now has one canonical framework skill, `purista`, plus one separate meta skill, `purista-skill-maintainer`.
The maintainer skill keeps that model coherent, readable, spec-grounded, implementation-verified, and aligned across `purista`, `starter`, `create-purista`, public docs, and `voyage`.

## Source-of-truth order
Read sources in this order before changing a skill:
1. Current relevant specs in `specs/`
2. Current implementation in `purista/`
3. Public handbook/API docs in `purista/web`
4. The current `purista` skill and its `references/`
5. Downstream overlays and consumers in `voyage`, `starter`, and `create-purista`

Specs are the source of truth for framework development. If implementation and specs conflict, first decide whether the implementation drifted or the spec is stale. Fix the drift in the implementation or update/supersede the spec, then align skills to the implemented behavior that now follows the current spec.

## Hard rules
- Treat `purista` as the canonical shared framework skill path unless the change is explicitly about the maintainer skill itself.
- Keep user-facing framework skills independent from internal spec access. The `purista-skill-maintainer` skill may reference specs because it is for maintaining PURISTA itself.
- Keep `SKILL.md` compact and navigational; move depth into `references/`.
- Keep the skill catalog compatible with agent-skill best practices: specific trigger descriptions, progressive disclosure, one-level reference loading, references over 100 lines with a `## Contents` section, and concrete evaluation scenarios.
- Use the filesystem as part of the reasoning surface: good reference taxonomy matters.
- Verify every file path, package path, and code snippet in the repo.
- Run `npm run audit:skills` after skill edits and fix structural issues before publishing.
- Update downstream docs, tests, overlays, and published LLM context files in the same refactor when the shared skill shape changes.
- Keep `purista/skills` as the source of truth; installed client copies are mirrors that may need syncing after repo changes through `npm run sync:skills -- --target <absolute-skills-directory>`.
- Do not split the framework back into many sibling skills unless there is a genuinely separate non-runtime concern.
- When teaching schemas and contracts, prefer consumer-local schema definitions over one shared cross-service Zod schema unless every consumer truly needs the exact same shape.
- Keep current platform decisions visible, especially safe defaults, strict capability validation, Hono as the active HTTP server runtime, and the current queue/event bridge reliability model.
- Keep observability guidance aligned: OTel Metrics API is canonical for metrics, app code owns SDK/exporters, Prometheus stays outside core, and `@purista/harness` owns GenAI/model/token/tool metrics.
- Keep security and privacy guidance aligned: tenant/principal propagation, guard-based authorization, secret-store usage, least-privilege resources, auditability, and no sensitive data in logs/metrics/traces/prompts/examples.

## Decision rules
- Keep one framework skill and split depth into references instead of adding more framework skill folders.
- Keep `purista-skill-maintainer` separate because it is a catalog-authoring workflow, not runtime framework knowledge.
- Put only the routing model, core mental model, and highest-signal rules into `SKILL.md`.
- Put examples, nuanced decisions, and topic-specific teaching into `references/`.
- Add code snippets only when they materially teach a PURISTA concept.
- If a producer emits a broad payload, document that consumers should redefine a narrower schema locally and keep only the fields they actually use.

## Required read order
- `specs/README.md`
- relevant active specs for the framework capability being changed
- `purista/skills/README.md`
- `purista/skills/purista/SKILL.md`
- this `SKILL.md`
- `references/maintenance-checklist.md`
- `references/catalog-audit-wave1.md`
- `purista/skills/purista/references/11-evaluation-scenarios.md`

## What to review for every change
- One-skill routing quality
- Accuracy of file references and package paths
- Definition / implementation / configuration / instantiation coverage
- Reference taxonomy quality
- Progressive disclosure quality: `SKILL.md` routes, references teach depth, and no reference requires loading unrelated files
- Snippet relevance and duplicate-content risk
- Evaluation scenarios still cover setup, CLI scaffolding, streams, queues, agents, enterprise review, and drift repair
- Drift between active specs and implementation
- Drift in `starter`, `create-purista`, `voyage`, and published docs
- Drift between repo-local skills and installed mirror copies under `$CODEX_HOME/skills`
- Drift between metric catalog, observability docs, examples, and skill snippets
- Drift between security/privacy handbook pages, AI docs, generated examples, and skill guidance about PII, prompts, secrets, telemetry, and tenant isolation

## Read if needed
- `references/catalog-audit-wave1.md`
- `references/maintenance-checklist.md`
- `voyage/apps/server/skills/README.md`
