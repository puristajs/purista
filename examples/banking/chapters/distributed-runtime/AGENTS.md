# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local `@purista/cli` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath` and agent code under the configured `agentPath`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- For attached agents, keep `ai.models`, optional `ai.skills`, `ai.sandbox`, `ai.runtime`, and `ai.workspaceStore` bindings in service bootstrap/config. Use `.useSkills(...)` only with matching runtime skill bindings or explicitly trusted discovery.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use the local package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm`
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Run the app with `npm run dev`.
- Run tests with `npm run test`.

## Skills
- Use the bundled PURISTA skill from `.agents/skills/purista` or `.claude/skills/purista`.
- These paths link to `node_modules/@purista/core/skills/purista`, so dependency updates refresh the framework skill.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
- For skill-backed agents, verify startup fails for missing skill bindings and that prompts list only skill metadata plus `/skills/<name>/SKILL.md`, never the `SKILL.md` body.
