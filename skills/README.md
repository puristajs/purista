# Skill Catalogs

This repository ships one shared framework skill catalog in `skills/`.

## Canonical Model
- `skills/purista/` is the single shared framework skill for PURISTA.
- `skills/purista-skill-maintainer/` is the meta skill for maintaining that catalog.
- `skills/purista-docs-maintainer/` is the internal workflow for maintaining the public website, handbook, API documentation, navigation, and coverage.
- `skills/purista-tutorial-maintainer/` is the internal workflow for Framework tutorial storylines, beginner-friendly step pages, runnable source, local dependencies, and authenticated demo UIs.
- Applications may add overlay skills, but core framework knowledge should stay in the shared `purista` skill references.
- Repo-local `skills/` is the source of truth. Installed copies in `$CODEX_HOME/skills` are mirrors and should be refreshed from here when drift appears.
- The user-facing `purista` skill must not require internal spec access. Internal maintainer skills may use specs because they develop and align PURISTA itself.

## Filesystem Layout
- Each skill uses `skills/<skill-name>/SKILL.md`.
- Optional `references/`, `scripts/`, and `assets/` folders may exist beside `SKILL.md`.
- `SKILL.md` stays compact and navigational.
- Detailed framework material belongs in `skills/purista/references/`.

## Content Expectations
- Split architecture guidance from implementation guidance.
- Split package guidance from component/builder guidance.
- Prefer CLI-generated skeletons whenever possible; document lower-level builder usage as the refinement path.
- Keep `SKILL.md` files compact and route detailed material into directly linked references.
- Add `## Contents` to reference files over 100 lines.
- Keep concrete evaluation scenarios for the canonical `purista` skill so drift repairs can be tested against realistic tasks.
- Keep concrete evaluation scenarios for `purista-docs-maintainer` so page structure, coverage, adapter guidance, and proportional-change behavior can be forward-tested.
- Keep concrete evaluation scenarios for `purista-tutorial-maintainer` covering direct entry, easy English, Framework-only AI, reproducible dependencies, UI protocol compatibility, and trusted identity across boundaries.
- Keep active specs, implementation, public docs, and skills aligned in that order: specs define intended behavior, implementation realizes it, public docs explain it, and user-facing skills teach the implemented behavior.
- Keep current platform decisions visible: Hono as active HTTP runtime,
  EventBridge/QueueBridge separation, native Harness definitions mounted by
  Core, and provider packages as app-level dependencies.
- Keep current enterprise decisions visible: schedules are contracts, Kubernetes CronJob export is manifest generation, Redis/NATS strict idempotency returns the original job id, and no `@purista/contracts` package is used.
- Contract guidance should prefer boundary-local consumer schemas over one oversized shared schema reused across many services.
- Security guidance should treat tenant isolation, authorization, auditability, data minimization, secret handling, and PII/prompt redaction as first-class architecture concerns.
- AI guidance should prevent accidental leakage of confidential data through prompts, completions, tool arguments, sandbox output, logs, metrics, traces, events, streams, and generated examples.

## Layering
Shared roots load first. App-local overlay roots load second. Overlays may override a shared skill of the same name, but the preferred shape is one shared `purista` skill plus app-specific overlays.

Overlays should document product-local decisions only. They should not fork core framework behavior unless the framework itself changed and the shared catalog is updated first.

## Validation
Run `npm run audit:skills` from the `purista` repo after changing this catalog.
