---
title: Harness reference
description: Find first-party packages, optional peers, and the public API boundary quickly.
order: 1400
---

Install `@purista/harness` plus `zod` for every typed Harness application.
Provider, memory, Guardrails, MCP, and plugin packages are explicit additions;
the core package does not activate them by default.

| Package | Purpose | Extra requirement |
| --- | --- | --- |
| `@purista/harness` | Core builder/runtime | `zod` in the application. |
| `@purista/harness-openai`, `-anthropic`, `-bedrock`, `-azure-foundry` | First-party model providers | Provider credentials and service access. |
| `@purista/harness-memory-sqlite`, `-postgres`, `-redis`, `-nats` | Persistent memory | See the [memory selection guide](/handbook/harness/manage-context-and-state/memory/). |
| `@purista/harness-guardrails` | Typed policy rails | Optional privacy detector package as required. |
| `@purista/harness-guardrails-native-privacy`, `-presidio`, `-local-ner` | Sensitive-data detection | Native prebuild; Presidio service; or local model assets/Transformers. |
| `@purista/harness-agent-plugins` | Declarative Agent Plugins v1 loader | Reviewed SHA-256 and explicit bindings. |

Core optional peers: install `@modelcontextprotocol/client` for MCP and
`just-bash` for `bashSandbox()`. `@opentelemetry/api` is a peer integration
dependency, not an MCP/sandbox feature toggle. Refer to generated API docs for
types; treat `defineHarness`, `Harness`, `ModelProvider`, `HarnessStorage`,
`MemoryEngine`, `Sandbox`, and `DurableWorkspace` as the primary stable port
names. Capability declarations are compatibility contracts, not marketing
labels.

| API surface | Use it for | Do not use it for |
| --- | --- | --- |
| [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/) and [`HarnessBuilder`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/) | Composition-time registration of adapters, aliases, agents, tools, skills, and workflows. | Per-request work; build once at the application composition root. |
| [`Harness`](/handbook/api/interfaces/_purista_harness.Harness/) | Opening sessions, invoking registered agents/workflows, and orderly shutdown. | Selecting SDK credentials or enforcing caller authorization. |
| [`ModelProvider`](/handbook/api/interfaces/_purista_harness.ModelProvider/) | Implementing or injecting a provider adapter at the model boundary. | Declaring an agent's permitted capability; that belongs to the model alias. |
| [`HarnessStorage`](/handbook/api/interfaces/_purista_harness.HarnessStorage/) and [`DurableWorkspace`](/handbook/api/interfaces/_purista_harness.DurableWorkspace/) | Independent durable session/run state and artifact checkpoint ports. | A generic application database or an unverified sandbox-volume recovery claim. |
| [`MemoryEngine`](/handbook/api/interfaces/_purista_harness.MemoryEngine/) and [`Sandbox`](/handbook/api/types/_purista_harness.Sandbox/) | Application-selected scoped memory and execution/file boundaries. | Authentication, domain authorization, secret management, or automatic tenant isolation. |
