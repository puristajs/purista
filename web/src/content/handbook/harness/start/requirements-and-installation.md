---
title: Requirements and installation
description: Install the core Harness runtime, one provider adapter, and the schema library used by your application.
order: 20
---

This path creates a live typed agent with OpenAI. It requires Node.js 24.15 or
newer, npm, and an OpenAI API key. The repository declares the Node requirement
in `ai-harness/package.json`; use a supported Bun runtime only after verifying
the selected provider and native dependencies in your deployment.

## Install the smallest runtime

```sh title="Install the first runnable Harness"
npm install @purista/harness @purista/harness-openai
```

`@purista/harness` is the core runtime. It does not include a live model
provider. `@purista/harness-openai` is a separately installed provider adapter.

The first agent uses Zod, so add it for the default guide path:

```sh title="Install the default Zod schema library"
npm install zod
```

## Choose the schema library your application owns

Zod is an application dependency, not a Harness public re-export. Harness
accepts any [Standard Schema](https://standardschema.dev/schema) validator at
every application validation boundary. The one additional requirement appears
only when a model must produce the value: the schema must also implement
[Standard JSON Schema](https://standardschema.dev/json-schema), so Harness can
give the provider a Draft 2020-12 description during `.build()`.

| Library | Install in the application | Validation-only boundaries | Model-facing boundaries |
| --- | --- | --- | --- |
| Zod | `npm install zod` | Use the schema directly. | Use the schema directly. |
| ArkType | `npm install arktype` | Use the schema directly. | Use the schema directly. |
| Valibot | `npm install valibot` | Use the schema directly. | Also install `@valibot/to-json-schema` and wrap only this schema with `toStandardJsonSchema(...)`. |
| Another Standard Schema validator | Install the validator selected by your application. | Use it directly when it implements Standard Schema. | Use it directly only when it also implements Standard JSON Schema; otherwise use that library's official Standard JSON Schema adapter. |

Validation-only means the application or Harness callback supplies the value:
agent input, custom-handler agent output, TypeScript-tool output, workflow
input/output, and Guardrail `valueSchema`. Model-facing means a provider creates
the value: default-loop agent output and TypeScript-tool input. Do not add a
provider-specific converter or a Harness wrapper. The original validator still
performs runtime validation; the JSON Schema projection is provider input only.

[Inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/)
maps every boundary and shows Zod, ArkType, and Valibot declarations. The
official Standard Schema compatibility lists are the authority for additional
libraries and their supported versions.

Create an application-owned environment file or configure your secret store:

```dotenv title=".env"
OPENAI_API_KEY=replace-with-a-secret
OPENAI_MODEL=gpt-5-mini
```

Keep the key out of source code, client bundles, fixtures, logs, and telemetry.
The provider adapter makes its network request from your application process.

## Before you import an advanced feature

| Feature | Extra prerequisite | Do not assume |
| --- | --- | --- |
| MCP | `@modelcontextprotocol/client` peer and an authenticated server or qualifying sandbox | Installing core enables MCP |
| `bashSandbox()` | `just-bash` peer | It provides container or VM isolation |
| Guardrails | `@purista/harness-guardrails` | A model instruction is a policy control |
| Durable memory | A memory-engine package and usually a database or broker | In-memory state survives a restart |

Install these immediately before their first use in their focused guides.

## Optional: install the implementation skill

If a coding assistant maintains this Harness application, the repository ships
an `ai-harness` skill with the same runtime, testing, privacy, and telemetry
boundaries used here. It is assistant documentation, not a deployed runtime
dependency:

```sh title="Install and verify the AI Harness skill"
npx skills add puristajs/harness --skill ai-harness
npx skills list
```

Add the agent selector required by your coding tool when applicable. Do not put
provider credentials in a skill, its references, or its verification output.

## Verify installation

Create the first agent in [the next guide](/handbook/harness/start/build-the-first-agent/). A
successful invocation returning a schema-valid object proves that the package is
installed, the provider is configured, and the model alias is wired. A missing
key or provider failure should fail the invocation; do not add a silent local
fallback for a requested live model.
