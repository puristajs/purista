# Skill Catalogs

This repository ships one shared framework skill catalog in `skills/`.

## Canonical model
- `skills/purista/` is the single shared framework skill for PURISTA.
- `skills/purista-skill-maintainer/` is the meta skill for maintaining that catalog.
- Applications may add overlay skills, but they should not split core framework knowledge back into many sibling framework skills.

## Filesystem layout
- Each skill uses `skills/<skill-name>/SKILL.md`.
- Optional `references/`, `scripts/`, and `assets/` folders may exist beside `SKILL.md`.
- `SKILL.md` may use lightweight frontmatter for routing metadata such as `topics`, `phases`, and `requires_sandbox`.

## Content expectations
- The shared `purista` skill is the canonical framework-memory layer for models that do not already know PURISTA.
- `SKILL.md` should stay compact and route the model to deeper `references/` documents.
- The skill should teach definition, implementation, configuration, and instantiation explicitly.
- Contract guidance should prefer boundary-local consumer schemas over one oversized shared schema reused across many services.
- Use `skills/purista-skill-maintainer` when creating or updating catalog entries so the maintenance workflow stays consistent.

## Layering
- Shared roots load first.
- App-local overlay roots load second.
- Overlays may override a shared skill of the same name, but the preferred app shape is one shared `purista` skill plus app-specific overlays.

Recommended loading pattern:

- shared roots first
- application-local overlay roots second

With `createLayeredFileSkillResource(...)`, later overlay roots override earlier roots when a skill name exists in both places.

Recommended application bootstrap:

```ts
import { createLayeredFileSkillResource } from '@purista/ai'

const skills = createLayeredFileSkillResource({
  canonicalRoots: [new URL('../skills', import.meta.url).pathname],
  overlayRoots: [new URL('./skills', import.meta.url).pathname],
})
```
