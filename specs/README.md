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

## Lifecycle Contract

`spec-manifest.yaml` is the machine-readable lifecycle index for every
canonical Markdown spec in this directory. It is deliberately JSON-compatible
YAML so it can be checked without a parser dependency. An entry must declare:

- `status`: `proposed`, `active`, `implemented`, `superseded`, or `historical`
- the accountable `owner`, in-scope capability, and any `supersedes` or
  `dependsOn` links
- concrete `acceptance` and `verification` commands
- security/privacy, recovery/operations, public API, generated-artifact, and
  release/migration impact statements
- approval evidence for `active` and `implemented` entries

The repository does not use a document's prose status as execution authority.
`node scripts/specs-audit.mjs specs` validates the manifest, calculates a
content digest for every indexed spec, and rejects unindexed files, ambiguous
status, missing acceptance/verification details, or executable status without
approval evidence. `--write` refreshes `.readiness-report.yaml`; ordinary CI
uses the default read-only verification mode.

An implementation agent may act only on an `active` or `implemented` manifest
entry whose report decision is `approved`. `proposed`, `historical`, and
`superseded` entries are context only. This protects agents from turning
historical planning language into new behavior by accident.

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
- `20-agents/80-core-ai-migration-plan.md`: migration record for core-native
  agents backed by `@purista/harness`.
- `http-error-rfc9457.md`: proposed RFC 9457 HTTP error response work.
- `bridge-reliability-hardening.md`: implemented bridge reliability status
  tracker for this monorepo.
