---
title: Provider and adapter compatibility
description: Match model operations, persistence, sandbox, and browser protocol needs to the first-party adapter that implements them.
order: 1414
---

Select adapters by the operation and deployment guarantee your application
needs. A package being installed, or an alias listing a capability, is not
proof that the selected provider model, account, region, database, or platform
supports it.

## First-party model operations

The table describes methods implemented by the current Harness 3 adapters.
Tool use is carried by text and object operations; the selected provider model
must also support it.

| Provider package | Text | Text stream | Object | Object stream | Embeddings | Image | Speech | Video + progress |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `@purista/harness-openai` | yes | yes | yes | yes | yes | yes | yes | yes |
| `@purista/harness-google` | yes | yes | yes | yes | yes | no | no | no |
| `@purista/harness-anthropic` | yes | yes | yes | yes | no | no | no | no |
| `@purista/harness-bedrock` | yes | yes | yes | yes | no | no | no | no |
| `@purista/harness-azure-foundry` | yes | yes | yes | yes | yes | no | no | no |

No first-party adapter currently implements the provider-neutral rerank method.
Use an application-owned [`ModelProvider`](/handbook/api/interfaces/_purista_harness.ModelProvider/)
adapter when a reranking service is required. A custom provider may implement
only the methods it supports; missing methods fail explicitly.

Structured output and tool calling are mapped through each provider's native
or compatible API. Schema keyword support and individual model support can be
narrower than the adapter method. Run one live-gated compatibility test for
every deployed model and operation.

## State and memory adapters

| Need | First-party choice | Boundary |
| --- | --- | --- |
| Unit tests or disposable local work | Core in-memory Harness storage and memory | Process-local; lost on restart. |
| Single-host durable workflow and files | `localDurableExecution()` | SQLite plus local files; trusted one-host development and restart tests. |
| Replicated durable run/session state | `@purista/harness-storage-postgres` | PostgreSQL control state; pair with a compatible durable workspace when runs use files. |
| Single-host persistent memory | `@purista/harness-memory-sqlite` | Local SQLite; vector search needs the pinned native peer. |
| Shared persistent memory | `@purista/harness-memory-postgres`, `-redis`, or `-nats` | Capabilities depend on the configured backend and extensions. |

`HarnessStorage`, `MemoryEngine`, and `DurableWorkspace` are separate ports.
Do not store business records in session state or treat memory as the durable
workflow log.

## Sandbox and workspace adapters

| Adapter | Files/search | Commands/processes | Durable workspace | Intended boundary |
| --- | --- | --- | --- | --- |
| `inMemorySandbox()` | yes | no | no | Deterministic tests and safe local examples. |
| `bashSandbox()` with `just-bash` | yes | emulated Bash | no | Portable shell behavior, not OS isolation. |
| `@purista/harness-sandbox-docker` | image-dependent | yes | no initial durable checkpoint binding | One-host container isolation after daemon, image, network, and resource policy are configured. |
| `@purista/harness-sandbox-kubernetes` | image and PVC dependent | yes | yes with compatible CSI/PVC/snapshot setup | Multi-worker platform isolation and durable workspace generations. |

Capabilities describe callable operations. Isolation, network policy, tenant
separation, resource quotas, image provenance, and daemon/cluster authority
remain deployment responsibilities.

## Browser and framework adapters

`@purista/harness-ai-sdk-ui/v1` converts portable
[`ExecutionEvent`](/handbook/api/types/_purista_harness.ExecutionEvent/) values
to AI SDK UI Message Stream v1. It supports AI SDK 7 consumers and AI Elements
without a Harness-specific browser client. The adapter also maps approval
requests and parses authenticated resume decisions; the application still owns
the approval record and authorization.

PURISTA mounts Harness definitions as address-first service targets and carries
aggregate outcomes or portable streams through EventBridge. It does not change
the native definition or provider contract. See [Build AI-powered services](/handbook/framework/build-ai-powered-services/).

Use [packages and feature availability](../packages-and-feature-availability/)
for install and infrastructure prerequisites, then run the relevant contract
suite and one deployment smoke test before claiming compatibility.
