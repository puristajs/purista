---
name: purista-migration
description: Guides safe, evidence-based migration of existing PURISTA applications across framework releases, package boundaries, generated artifacts, runtime behavior, and rollout. Use when upgrading a PURISTA app, modernizing legacy PURISTA code, or preparing a version migration.
---

# PURISTA Migration

## When To Use

Use this skill for an existing PURISTA application that must move to a new
framework version or current runtime pattern. It is an upgrade procedure, not
a greenfield design guide.

Do not use it as the primary skill for new application work: use `purista`.
Do not use it to maintain the shared framework catalog: use
`purista-skill-maintainer`.

## Safety Contract

- Work from the application checkout, its `package.json`, lockfile,
  `purista.json`, local scripts, installed packages, and published handbook.
  Never require a framework source checkout or internal planning files.
- Preserve a reproducible before-state: record the current branch or revision,
  dependency versions, available scripts, architecture export, and failing
  checks before changing code.
- Upgrade compatible `@purista/*` packages together. Do not silently mix
  framework major versions, replace adapters, change delivery guarantees, or
  regenerate hand-written files.
- Use the project-local CLI and its `add:*` scripts. Do not fetch or rely on a
  global CLI for a migration.
- Treat every new diagnostic, compile error, contract change, and operational
  behavior change as evidence to resolve—not text to suppress.

## Workflow

1. **Inventory.** Read `package.json`, the lockfile, `purista.json`, runtime
   bootstrap, service definitions, deployment manifests, and local scripts.
   Search direct `@purista/*` imports, deep imports, custom adapters, and
   client-side error parsing. Capture the baseline checks and definitions.
2. **Plan the target.** Pin the intended compatible package set and write a
   migration ledger: change, reason, affected boundary, verification, rollback
   point, and owner. Split application-code, infrastructure, and consumer
   changes; do not deploy them as one unexplained edit.
3. **Update contracts first.** Replace removed or moved imports, make schemas
   and capability declarations explicit, then update runtime wiring and
   deployment configuration. Use CLI generation only for genuinely new
   artifacts and refine its output in the existing project conventions.
4. **Prove static topology.** Export definitions with the project script, then
   run the installed CLI's `inspect`, strict `validate`, and `doctor` flows
   when the project exposes them. Correct diagnostics at their source.
5. **Prove behavior.** Run the project lint, typecheck, test, build, package,
   and integration checks that exist. Exercise changed HTTP errors, queues,
   schedules, stores, agents, and telemetry without leaking sensitive data.
6. **Roll out deliberately.** Deploy infrastructure prerequisites before code,
   canary behavior-changing boundaries, monitor the declared signals, and keep
   a tested rollback path until the migration acceptance window closes.

## Stop And Ask

Stop and request one focused decision when a target version is unknown, a
custom adapter has no compatibility evidence, a change alters a public
contract or delivery guarantee, production scheduler ownership is unclear, or
the only way forward would discard state, messages, a lockfile, or generated
application code. Report the exact evidence and the smallest blocking choice.

## Required Handoff

Hand off a migration ledger with the target versions, changed imports and
contracts, emitted diagnostics, passed checks, deployment order, monitoring
signals, rollback trigger, and unresolved risks. Never claim a safe upgrade
solely because compilation succeeded.

## Read In This Order

- `references/01-migration-workflow.md`
- `references/02-version-4.md`
- `references/03-verification-and-rollback.md`
