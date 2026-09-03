---
title: Packages and feature availability
description: Check what Harness 3 includes, what needs an additional package or service, and which setup step actually enables each feature.
order: 1410
---

Installing a package does not necessarily enable its feature. Use this page to
separate what is present, what the Harness selects by default, and what the
application must still configure or provision.

All first-party Harness 3 packages use the same major. Keep them aligned with
`@purista/harness`; do not combine a Harness 3 core package with a 1.x addon.

## Core runtime defaults

| Capability | After installing `@purista/harness` | Enable or replace it |
| --- | --- | --- |
| Models | No provider or alias is selected. Handler-only agents, deterministic workflows, and memory-only compositions need no model registry. | Install one provider package or implement `ModelProvider`, then register an alias when a default-loop agent, embedding, reranker, media operation, or model-backed memory/control uses it. |
| Harness storage | An in-memory store is created when `.storage(...)` is omitted. | Register a durable `HarnessStorage` for restart-safe sessions, runs, steps, and waits. |
| Memory | A dependency-free in-memory engine is used when `.memory(...)` is omitted. | Register a persistent engine package and any embedding or summary model references. |
| Sandbox | Auto-detection uses `bashSandbox()` when the optional `just-bash` peer is importable; otherwise it uses the files-and-bounded-search in-memory sandbox. | Register an explicit sandbox when capability or isolation guarantees matter. |
| Built-in tools | Disabled for every agent. | Add the smallest `builtinTools` allowlist on the agent. |
| TypeScript tools, skills, agents, and workflows | Included but not registered automatically. | Register definitions on the fluent builder. |
| Governance | Included but disabled until configured. | Add `.governance(...)` after tools and agents. |
| Guardrails | Not included in core. | Install and configure `@purista/harness-guardrails`. |
| Logging | `JsonLogger` at `info` to standard output. | Supply `.logger(...)` or set `PURISTA_HARNESS_LOG_LEVEL`. |
| OpenTelemetry emission | Harness instrumentation is included. | Start an application-owned OpenTelemetry SDK/exporter to send data to a backend. |

Do not rely on sandbox auto-detection in production. It is a convenience
fallback, not a declaration of process, container, network, or tenant
isolation.

## Model providers

| Package | Includes | External prerequisite | Enablement guide |
| --- | --- | --- | --- |
| `@purista/harness-openai` | OpenAI provider adapter and OpenAI SDK dependency | API access and credentials; an approved `baseURL` for a compatible endpoint | [Configure OpenAI](/handbook/harness/configure-the-runtime/openai/) |
| `@purista/harness-google` | Google Gemini provider adapter and official `@google/genai` SDK dependency | Google API key or application-owned Google SDK/Vertex deployment configuration and model access | [Configure Google Gemini](/handbook/harness/configure-the-runtime/google-gemini/) |
| `@purista/harness-anthropic` | Anthropic provider adapter and SDK dependency | API access and credentials | [Configure Anthropic](/handbook/harness/configure-the-runtime/anthropic/) |
| `@purista/harness-bedrock` | Bedrock Runtime adapter and AWS SDK dependency | AWS region, credentials, and model access | [Configure Amazon Bedrock](/handbook/harness/configure-the-runtime/amazon-bedrock/) |
| `@purista/harness-azure-foundry` | Azure AI Foundry inference adapter and Azure client dependencies | Endpoint, credentials, and deployment access | [Configure Azure AI Foundry](/handbook/harness/configure-the-runtime/azure-ai-foundry/) |
| Application-owned adapter | The core `ModelProvider` port only | SDK or HTTP client selected by the application | [Build a custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/) |

## Browser stream protocol

| Package | Includes | External prerequisite | Enablement guide |
| --- | --- | --- | --- |
| `@purista/harness-ai-sdk-ui` | Versioned `/v1` conversion from portable `ExecutionEvent` values to AI SDK UI Message Stream v1, including text, tools, status, structured output, files, media progress, and tool approvals | Matching `@purista/harness@3` and `ai@7`; an HTTP transport that forwards the prescribed headers and SSE chunks | [Stream progress and use the standard browser protocol](/handbook/harness/build-agents/streaming-cancellation-and-timeouts/#4-use-ai-sdk-ui-message-stream-v1-for-a-browser) |

The adapter is transport-neutral: native Harness can return its `Response`,
while PURISTA can pass its data-only SSE events through an HTTP stream. Import
from `@purista/harness-ai-sdk-ui/v1` to pin the wire protocol explicitly.

## Memory engines

| Package or path | Availability | External prerequisite | Enablement guide |
| --- | --- | --- | --- |
| `inMemoryMemoryEngine()` | Included and selected by default | None; data is process-local | [In-memory memory](/handbook/harness/manage-context-and-state/memory/in-memory/) |
| `@purista/harness-memory-sqlite` | Separate first-party package | Writable local filesystem; optional `sqlite-vec@0.1.9` peer for vector search | [SQLite memory](/handbook/harness/manage-context-and-state/memory/sqlite/) |
| `@purista/harness-memory-postgres` | Separate first-party package including `pg` | PostgreSQL and optional extensions required by the selected capabilities | [PostgreSQL memory](/handbook/harness/manage-context-and-state/memory/postgres/) |
| `@purista/harness-memory-redis` | Separate first-party package including the Redis client | Redis with the capabilities used by the selected search mode | [Redis memory](/handbook/harness/manage-context-and-state/memory/redis/) |
| `@purista/harness-memory-nats` | Separate first-party package including NATS clients | NATS with JetStream and KeyValue | [NATS memory](/handbook/harness/manage-context-and-state/memory/nats/) |
| Application-owned engine | The core `MemoryEngine` port only | Storage/search implementation selected by the application | [Build a custom memory engine](/handbook/harness/manage-context-and-state/memory/custom-memory-engine/) |

## Harness storage and durable workspaces

| Package or path | Availability | External prerequisite | Enablement guide |
| --- | --- | --- | --- |
| In-memory Harness storage | Included and selected by default | None; state is process-local | Use for unit tests and non-recoverable single-process work. |
| `localDurableExecution()` | Included, explicitly configured | One trusted writable Node/Bun host | [Use durable workspaces](/handbook/harness/manage-context-and-state/durable-workspaces/) |
| `@purista/harness-storage-postgres` | Separate first-party package including `pg` | PostgreSQL 16+ and migration/runtime database authority | [Persist Harness state in PostgreSQL](/handbook/harness/manage-context-and-state/postgresql-harness-storage/) |
| Kubernetes durable workspace | Optional result of `@purista/harness-sandbox-kubernetes` | PVC-capable CSI driver; `VolumeSnapshotClass` for checkpoints | [Run a Kubernetes sandbox](/handbook/harness/secure-and-govern/kubernetes-sandbox/) |
| Application-owned storage/workspace | Core `HarnessStorage` and `DurableWorkspace` ports | Backend selected and operated by the application | Run the shared storage/workspace contract suites and backend recovery tests. |

PostgreSQL control state and Kubernetes workspace files are separate concerns.
Use both for replicated workflows that must resume file-bearing work. S3 is not
required by the first-party Kubernetes path.

## Guardrails and privacy detectors

| Package | Availability and role | Additional prerequisite | Enablement guide |
| --- | --- | --- | --- |
| `@purista/harness-guardrails` | Separate first-party package for typed content actions and phase flows | A configured Harness; model-backed actions also need a capable model alias | [Protect content with Guardrails](/handbook/harness/secure-and-govern/guardrails/) |
| `@purista/harness-guardrails-native-privacy` | Separate native privacy detector package | A supported prebuilt native binary/platform | [Native privacy detector](/handbook/harness/secure-and-govern/privacy-detectors/) |
| `@purista/harness-guardrails-presidio` | Separate client adapter | An application-owned, authenticated Presidio sidecar | [Presidio detector](/handbook/harness/secure-and-govern/privacy-detectors/) |
| `@purista/harness-guardrails-local-ner` | Separate local NER adapter | Optional `@huggingface/transformers@^4.2.0` peer and pre-provisioned local model assets | [Local NER detector](/handbook/harness/secure-and-govern/privacy-detectors/) |
| Application-owned detector | `SensitiveDataDetector` port from the Guardrails package | The selected detection implementation | [Custom detector](/handbook/harness/secure-and-govern/privacy-detectors/) |

## Governance and external policy engines

Governance is included in core and remains disabled until `.governance(...)`
is configured. OPA uses a focused optional first-party package. Cedar, AWS
Verified Permissions, and arbitrary policy services remain separate
application-owned integrations.

| Policy path | Availability | External prerequisite | Enablement guide |
| --- | --- | --- | --- |
| Native TypeScript policy | Included in `@purista/harness`, opt-in | None | [Build the first policy](/handbook/harness/secure-and-govern/governance-policies/build-the-first-policy/) |
| OPA Data API | Separate `@purista/harness-policy-opa` package | OPA sidecar, daemon, or service; application-owned identity, decision mapping, policy distribution, authentication, and health | [Connect Open Policy Agent](/handbook/harness/secure-and-govern/governance-policies/connect-external-policy-engine/) |
| Embedded Cedar authorizer | Application-owned evaluator | A selected Cedar runtime plus application-owned policies, schema, entities, and snapshot lifecycle | [Keep Cedar integration explicit](/handbook/harness/secure-and-govern/governance-policies/connect-external-policy-engine/#keep-cedar-and-custom-engines-separate) |
| AWS Verified Permissions | Application-owned evaluator | AWS policy store, region, credentials, SDK client, and `IsAuthorized` request mapping | [Keep Cedar integration explicit](/handbook/harness/secure-and-govern/governance-policies/connect-external-policy-engine/#keep-cedar-and-custom-engines-separate) |
| Custom policy service | Application-owned evaluator | Versioned request/response contract, authenticated client, deployment, and operations | [Compare external engine boundaries](/handbook/harness/secure-and-govern/governance-policies/connect-external-policy-engine/#keep-cedar-and-custom-engines-separate) |

The builder's `adapter(...)` helper preserves typed tool inputs; it still does
not perform network I/O or provision any engine. `opaPolicy(helpers, ...)` is
the focused OPA implementation and requires explicit input/result mapping.
Installing or operating a policy engine alone does not wire it into Harness.

## Sandboxes, MCP, and Agent Plugins

| Feature | Package or peer | What enables it | Missing or incompatible behavior |
| --- | --- | --- | --- |
| Files-and-search in-memory sandbox | Included in core | Explicit `.sandbox(inMemorySandbox())` or fallback from auto-detection | Declares `sandbox.fs` and `sandbox.text_search`; execution methods are unavailable. |
| Emulated Bash sandbox | Optional `just-bash@^3.4.1` peer | Install the peer and register `bashSandbox()` or allow auto-detection | Explicit `bashSandbox()` fails with an actionable configuration error when the peer is absent. |
| Docker sandbox | `@purista/harness-sandbox-docker` | Provision Docker/OrbStack, register the adapter, and prepare a compatible image | Package installation alone does not grant daemon access or isolation. See [local Docker sandbox](/handbook/harness/secure-and-govern/local-docker-sandbox/). |
| Kubernetes sandbox/workspace | `@purista/harness-sandbox-kubernetes` | Provision namespaced RBAC, restricted image, quota/limits/network policy, PVC CSI support, and optional snapshots; register the returned adapters | Package installation does not grant cluster authority or make a CSI driver available. See [Kubernetes sandbox](/handbook/harness/secure-and-govern/kubernetes-sandbox/). |
| Custom sandbox | Core `Sandbox` port | Implement the full lifecycle and run shared plus platform isolation tests | Build/startup rejects invalid capability/lifecycle shapes; operational isolation remains provider-specific. |
| MCP client | Optional `@modelcontextprotocol/client@^2.0.0` peer | Install the peer and register selected HTTP or stdio MCP tool definitions | MCP use fails when the client is absent; no legacy SDK or HTTP+SSE fallback is provided. |
| Agent Plugins | `@purista/harness-agent-plugins` | Install, verify package digest/trust, then bind selected skills and MCP tools | Plugins never auto-install code, expose tools, or supply credentials. |

## Observability runtime

`@opentelemetry/api@^1.9.1` is the Harness peer boundary. Exporting telemetry
requires application dependencies such as `@opentelemetry/sdk-node`, trace and
metric exporters, and a collector or backend. Follow
[Export OpenTelemetry traces and metrics](/handbook/harness/configure-the-runtime/observability/opentelemetry/)
for installation, wiring, safe capture, propagation, and shutdown.

## Verify feature enablement

For any optional capability, verify five separate states:

1. the package or peer is installed and importable on the target platform;
2. external infrastructure and credentials are available;
3. the adapter is configured and wired at the composition root;
4. Harness startup accepts the requested capabilities;
5. one focused test or smoke request produces the expected result and
   operational evidence.

A successful package installation proves only the first state.
