---
title: Select a model provider
description: Choose a provider by operation support, deployment boundary, and recovery behavior.
order: 230
---

Keep the agent graph provider-neutral. Bind one or more aliases in
`definition.getInstance({ models })`, then choose the provider by the operation
and deployment guarantee you need.

| Need | Choice |
| --- | --- |
| Text, tools, structured output, and streams | A first-party provider whose selected model supports all requested capabilities |
| Embeddings | A provider with `embeddings`, often a separate alias |
| Image, speech, or video | A provider with the matching media operation and an application `ArtifactStore` |
| Reranking | An application-owned `ModelProvider` unless a verified adapter implements it |
| Deterministic tests | `FakeModelProvider` from `@purista/harness/testing` |

Aliases are capability contracts. Missing capability, unknown model, or
provider incompatibility must fail explicitly; never silently select another
provider. Keep provider credentials, timeout policy, retry policy, storage,
and telemetry at the composition root.

Next: [configure model settings](./configuration-and-model-settings/) or choose a focused provider guide.
