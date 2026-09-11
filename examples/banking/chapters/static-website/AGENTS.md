# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local `@purista/cli` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath`. Put service-owned Harness definitions under `src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- Mount one composed Harness definition per service version with `ServiceBuilder.mountHarness(...)`. Give every agent a user-chosen purpose model alias, bind every required alias under the exact `ai.models` key, and keep optional Skills, storage, sandbox, admission, queue, and artifact bindings in service bootstrap/config. Harness reserves no alias.
- Define portable tools with `@purista/harness`. Define PURISTA host tools with `ServiceBuilder.defineTool(...)`; keep both under the service-owned `harness/tool` directory.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use the local package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm`
- The short add commands below are interactive and prompt for omitted choices.
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Create agents with `npm run add:agent -- <name> --service <serviceName> --service-version <version>`. --model-alias <purposeAlias>
- Create workflows with `npm run add:workflow -- <name> --service <serviceName> --service-version <version>`.
- Create tools with `npm run add:tool -- <name> --service <serviceName> --service-version <version>`.
- Create Skills with `npm run add:skill -- <name> --service <serviceName> --service-version <version>`.
- Create MCP servers with `npm run add:mcp -- <name> --service <serviceName> --service-version <version>`.
- Run the app with `npm run dev`.
- Run tests with `npm run test`.

## Skills
- Use the bundled PURISTA skill from `.agents/skills/purista` or `.claude/skills/purista`.
- These paths link to `node_modules/@purista/core/skills/purista`, so dependency updates refresh the framework skill.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
- For skill-backed agents, verify startup fails when the required Skill binding is absent and test the native Harness definition independently from its PURISTA mount.
