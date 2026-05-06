# Skill Catalogs

This repository ships one shared framework skill catalog in `skills/`.

## Canonical Model
- `skills/purista/` is the single shared framework skill for PURISTA.
- `skills/purista-skill-maintainer/` is the meta skill for maintaining that catalog.
- Applications may add overlay skills, but core framework knowledge should stay in the shared `purista` skill references.
- Repo-local `skills/` is the source of truth. Installed copies in `$CODEX_HOME/skills` are mirrors and should be refreshed from here when drift appears.

## Filesystem Layout
- Each skill uses `skills/<skill-name>/SKILL.md`.
- Optional `references/`, `scripts/`, and `assets/` folders may exist beside `SKILL.md`.
- `SKILL.md` stays compact and navigational.
- Detailed framework material belongs in `skills/purista/references/`.

## Content Expectations
- Split architecture guidance from implementation guidance.
- Split package guidance from component/builder guidance.
- Prefer CLI-generated skeletons whenever possible; document lower-level builder usage as the refinement path.
- Keep current platform decisions visible: Hono as active HTTP runtime, EventBridge/QueueBridge separation, optional `@purista/ai`, and harness-backed AI agents.
- Contract guidance should prefer boundary-local consumer schemas over one oversized shared schema reused across many services.

## Layering
Shared roots load first. App-local overlay roots load second. Overlays may override a shared skill of the same name, but the preferred shape is one shared `purista` skill plus app-specific overlays.

Overlays should document product-local decisions only. They should not fork core framework behavior unless the framework itself changed and the shared catalog is updated first.
