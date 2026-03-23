# Skill Catalogs

This repository ships one shared skill catalog in `skills/`.

- Each skill uses `skills/<skill-name>/SKILL.md`.
- Optional `references/`, `scripts/`, and `assets/` folders may exist beside `SKILL.md`.
- `SKILL.md` may use lightweight frontmatter for routing metadata such as `topics`, `phases`, and `requires_sandbox`.
- The shared catalog is the canonical framework-memory layer for PURISTA. Skills should teach the framework to models that do not already know PURISTA.
- Framework skills should explain definition, implementation, configuration, and instantiation explicitly.
- Use `skills/purista-skill-maintainer` when creating or updating catalog entries so the maintenance workflow stays consistent.
- Applications can combine this catalog with any other shared or app-local skill roots.

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
