# PURISTA Specs

Specs in this directory are internal planning and migration records. Public
documentation and skills must not reference these files as source material.

## Concise Specs
- Keep each spec focused on one decision, migration, or implementation slice.
- State current status near the top: `active`, `implemented`, `superseded`, or
  `historical`.
- Prefer short normative decisions, explicit non-goals, and verifiable
  acceptance checks over long exploratory background.
- Remove or replace obsolete sections once implementation has moved on.
- If historical context must remain, mark it as superseded and point to the
  current implementation or migration record.

## Knowledge Alignment
- Skills are grounded in current implementation and public handbook/API docs,
  not internal specs.
- When implementation, public docs, and a spec disagree, update the spec or mark
  it superseded before changing skills.
- Obsolete AI package, protocol, and handler-context terms may appear only in
  migration or superseded AI records. `npm run audit:knowledge` enforces the
  concrete forbidden-term list.
- After changing specs, skills, AGENTS/CLAUDE guidance, or public knowledge
  files, run:

```bash
npm run audit:skills
npm run audit:knowledge
```

## Current Active Spec Areas
- `20-agents/80-core-ai-migration-plan.md`: migration record for core-native
  agents backed by `@purista/harness`.
- `http-error-rfc9457.md`: proposed RFC 9457 HTTP error response work.
- `bridge-reliability-hardening.md`: implemented bridge reliability status
  tracker for this monorepo.
