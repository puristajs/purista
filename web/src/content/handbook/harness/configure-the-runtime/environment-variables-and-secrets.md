---
title: Environment variables and secrets
description: Keep provider credentials and deployment configuration at the application boundary.
order: 220
---

The Harness does not discover provider credentials for you. The application
resolves a key, workload identity, endpoint, or AWS credential chain and passes
the resulting configuration to the provider adapter in the composition root.

| Provider | Typical application-owned values |
| --- | --- |
| OpenAI | `OPENAI_API_KEY`, optional `OPENAI_MODEL`, optional endpoint/base URL |
| Anthropic | `ANTHROPIC_API_KEY`, selected model |
| Amazon Bedrock | AWS SDK credential chain, `AWS_REGION`, model access policy |
| Azure AI Foundry | `AZURE_AI_ENDPOINT` plus API key or Azure credential |

## Safe loading rules

- Resolve secrets once at startup or from your approved secret store.
- Fail startup or the first controlled request when a required value is absent;
  do not substitute a different provider or local model silently.
- Keep provider keys out of browser code, agent instructions, tool output,
  logs, traces, fixtures, and error messages.
- Use a workload identity or managed credential when the deployment platform
  supports one. The provider-specific guide names the adapter input.

## Verify without exposing secrets

Log only the configured alias and provider ID where that is permitted. A
bounded live call verifies credential resolution and network policy. A fake
provider verifies application wiring without reading a secret or leaving the
network.

For secret-store integration and regulated deployment controls, use the
Framework security and configuration guidance alongside the provider guide.
