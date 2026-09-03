---
title: Configure the AI Harness runtime
description: Keep provider credentials, model capability declarations, defaults, and infrastructure wiring in one composition root.
order: 200
---

Configure the Harness before adding agent complexity. The runtime definition is
where an application selects providers, assigns stable aliases, sets bounded
defaults, and wires optional infrastructure.

## Choose a configuration task

| Need | Guide |
| --- | --- |
| Defaults, validation, timeouts, retries, and model settings | [Configuration and model settings](/handbook/harness/configure-the-runtime/configuration-and-model-settings/) |
| Direct text, object, embedding, reranking, and media operations | [Call model operations](/handbook/harness/configure-the-runtime/call-model-operations/) |
| Environment values and secret ownership | [Environment variables and secrets](/handbook/harness/configure-the-runtime/environment-variables-and-secrets/) |
| Select a provider | [Provider selection](/handbook/harness/configure-the-runtime/provider-selection/) |
| Configure OpenAI, Google Gemini, Anthropic, Bedrock, or Azure | The focused provider guides below |
| Connect an application-owned model gateway | [Build a custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/) |
| Configure logs, traces, and metrics | [Observe the runtime](/handbook/harness/configure-the-runtime/observability/) |

## What the base install provides

`@purista/harness` provides the provider-neutral runtime and its public ports.
It does not select a live model provider or create credentials. Install one
first-party provider package and wire it under an alias before invoking a
model-backed agent.

| Provider | Focused guide |
| --- | --- |
| OpenAI and compatible Chat Completions endpoints | [OpenAI](/handbook/harness/configure-the-runtime/openai/) |
| Google Gemini | [Google Gemini](/handbook/harness/configure-the-runtime/google-gemini/) |
| Anthropic | [Anthropic](/handbook/harness/configure-the-runtime/anthropic/) |
| Amazon Bedrock | [Amazon Bedrock](/handbook/harness/configure-the-runtime/amazon-bedrock/) |
| Azure AI Foundry | [Azure AI Foundry](/handbook/harness/configure-the-runtime/azure-ai-foundry/) |
| Application-owned provider | [Custom model provider](/handbook/harness/configure-the-runtime/custom-model-provider/) |

For application-owned retrieval and grounded answers, see
[Build grounded retrieval](/handbook/harness/configure-the-runtime/grounded-retrieval/).

The standalone provider guides own installation, credentials, minimal wiring,
verification, and production boundaries. Do not copy their setup into agents or
workflows.
