# Skill Catalogs

This repository ships one shared framework skill catalog in `skills/`.

## Canonical Model
- `skills/purista/` is the default shared framework skill for PURISTA application work.
- `skills/purista-migration/` is the focused, evidence-and-rollback workflow for upgrading existing PURISTA applications.
- `skills/purista-skill-maintainer/` is the meta skill for maintaining that catalog.
- Applications may add overlay skills, but core framework knowledge should stay in the shared `purista` references; migration-specific procedure stays in `purista-migration`.
- Repo-local `skills/` is the source of truth. Installed copies in agent skill directories are mirrors and should be refreshed from here when drift appears.
- The user-facing `purista` skill must not require internal spec access. The maintainer skill may use specs because it is for developing and aligning PURISTA itself.

## Filesystem Layout
- Each skill uses `skills/<skill-name>/SKILL.md`.
- Optional `references/`, `scripts/`, and `assets/` folders may exist beside `SKILL.md`.
- `SKILL.md` stays compact and navigational.
- Detailed framework material belongs in `skills/purista/references/`; upgrade-only procedure belongs in `skills/purista-migration/references/`.

## Content Expectations
- Split architecture guidance from implementation guidance.
- Split package guidance from component/builder guidance.
- Prefer CLI-generated skeletons whenever possible; document lower-level builder usage as the refinement path.
- Keep `SKILL.md` files compact and route detailed material into directly linked references.
- Add `## Contents` to reference files over 100 lines.
- Keep concrete evaluation scenarios for the canonical `purista` skill so drift repairs can be tested against realistic tasks.
- Keep active specs, implementation, public docs, and skills aligned in that order: specs define intended behavior, implementation realizes it, public docs explain it, and user-facing skills teach the implemented behavior.
- Keep current platform decisions visible: Hono as active HTTP runtime, EventBridge/QueueBridge separation, core-owned harness-backed agents, and provider packages as app-level dependencies.
- Keep current enterprise decisions visible: Core owns a standalone event-only Scheduler Runtime, provider packages own distributed scheduler coordination, Kubernetes CronJob export is manifest generation, Redis/NATS strict idempotency returns the original job id, and no `@purista/contracts` package is used.
- Contract guidance should prefer boundary-local consumer schemas over one oversized shared schema reused across many services.
- Security guidance should treat tenant isolation, authorization, auditability, data minimization, secret handling, and PII/prompt redaction as first-class architecture concerns.
- AI guidance should prevent accidental leakage of confidential data through prompts, completions, tool arguments, sandbox output, logs, metrics, traces, events, streams, and generated examples.

## Layering
Shared roots load first. App-local overlay roots load second. Overlays may override a shared skill of the same name, but the preferred shape is `purista` for normal application work, `purista-migration` for existing-app upgrades, and app-specific overlays for local policy.

Overlays should document product-local decisions only. They should not fork core framework behavior unless the framework itself changed and the shared catalog is updated first.

## Validation
Run `npm run audit:skills` from the `purista` repo after changing this catalog.
For a release candidate, run `npm run release:check` and capture the emitted
`PURISTA_RELEASE_EVIDENCE=` record. The record includes knowledge and, when
available, non-git spec digests; pass `PURISTA_SPEC_ROOT` or `--require-specs`
when the release environment must prove that external spec source was present.

## Runtime mirrors

Use one canonical catalog for Codex, Claude, OpenCode, or another client that
accepts `SKILL.md` directories. Supply that client's absolute skills directory:

```bash
npm run sync:skills -- --target /absolute/path/to/agent/skills
npm run audit:skill-mirror -- --target /absolute/path/to/agent/skills
```

The sync command replaces only the three PURISTA-owned skill directories; it
does not alter unrelated skills in the target directory. The audit form is
read-only and fails when any catalog file differs.

## Model-agnostic response evaluations

The catalog includes deterministic rubrics under `purista/evaluations/`. Save
one response from any agent as JSON with `scenarioId` and `response` fields,
then score it without model credentials:

```bash
npm run evaluate:skill-response -- --response /absolute/path/to/response.json
```

`npm run test:skill-evaluations` validates the rubric and positive/negative
fixtures. It is part of `release:check`; it verifies evaluator integrity, not a
claim that a particular model was run during the release.
