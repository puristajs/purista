# Implementation Guide

This project is CLI-first. Prefer generated PURISTA artifacts over manual framework skeletons.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use the local package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm`
- The short add commands below are interactive and prompt for omitted choices.
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Create agents with `npm run add:agent -- <name> --service <serviceName> --service-version <version>`.
- Create workflows with `npm run add:workflow -- <name> --service <serviceName> --service-version <version>`.
- Create tools with `npm run add:tool -- <name> --service <serviceName> --service-version <version>`.
- Create Skills with `npm run add:skill -- <name> --service <serviceName> --service-version <version>`.
- Create MCP servers with `npm run add:mcp -- <name> --service <serviceName> --service-version <version>`.
- Run the app with `npm run dev`.
- Run tests with `npm run test`.

## Project Shape
- `purista.json` defines file casing, event casing, and `servicePath`.
- Service definitions live under `src/service` unless `purista.json` says otherwise.
- Service-owned Harness definitions live under `src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}`; each service version owns one composed Harness definition.
- Portable tools use `@purista/harness`; PURISTA host tools use `ServiceBuilder.defineTool(...)`. Both live under the service-owned `harness/tool` directory.

## Interactive Artifact Creation

These short commands prompt for any omitted choices.
- New service: `npm run add:service -- <name> --description "<description>"`
- New command: `npm run add:command -- <name> --service <serviceName> --service-version <version>`
- New subscription: `npm run add:subscription -- <name> --service <serviceName> --service-version <version> --event <eventName>`
- New stream: `npm run add:stream -- <name> --service <serviceName> --service-version <version>`
- New queue: `npm run add:queue -- <name> --service <serviceName> --service-version <version>`
- New queue worker: `npm run add:queue-worker -- <name> --service <serviceName> --service-version <version> --queue <queueName>`
- New agent: `npm run add:agent -- <name> --service <serviceName> --service-version <version>`
- New workflow: `npm run add:workflow -- <name> --service <serviceName> --service-version <version>`
- New tool: `npm run add:tool -- <name> --service <serviceName> --service-version <version>`
- New Skill: `npm run add:skill -- <name> --service <serviceName> --service-version <version>`
- New MCP server: `npm run add:mcp -- <name> --service <serviceName> --service-version <version>`

After generation, edit handlers, schemas, runtime wiring, and tests to fit the domain.

## Guardrails
- Do not create alternative framework folder structures.
- Do not bypass builders for public PURISTA contracts.
- Do not add CommonJS variants. Generated PURISTA apps are ESM-only.
- Keep external systems behind resources, stores, bridges, or runtime bindings.
- Keep EventBridge and QueueBridge concerns separate.
- Keep provider packages as app-level dependencies.
