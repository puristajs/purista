# PURISTA Specs

Specs in this directory are the source of truth for framework development.
Implementation should follow active specs. When implementation and specs drift,
fix the implementation or update/supersede the spec before changing public docs
or user-facing skills.

User-facing skills and public documentation must not require access to internal
specs. The maintainer/development guidance may use specs to keep PURISTA itself
aligned.

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
- Specs define intended framework behavior.
- Implementation realizes the specs.
- Public handbook/API docs explain implemented behavior.
- User-facing skills teach implemented behavior without requiring spec access.
- The skill maintainer workflow may reference specs to reconcile drift.
- When implementation, public docs, and a spec disagree, fix implementation or
  update/supersede the spec before changing user-facing skills.
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
- `20-agents/88-harness-first-service-integration.md`: approved Harness-first
  service integration contract.
- `http-error-rfc9457.md`: proposed RFC 9457 HTTP error response work.
- `bridge-reliability-hardening.md`: implemented bridge reliability status
  tracker for this monorepo.
