---
title: Build AI-powered services
description: Build model-assisted business behavior as a normal PURISTA service boundary, then choose the execution, runtime, delivery, and safety controls it needs.
order: 390
---

An attached agent is a normal, versioned PURISTA service capability. Its
contract is validated, it receives the same trusted message identity, resources,
metrics, queues, streams, HTTP projection, and authorization boundary as other
service behavior. The Harness runs the model-facing part behind that boundary.

Use this chapter when a business outcome benefits from a model but must still be
contracted, observable, testable, and safe to run in a service. Use the
[AI Harness handbook](/handbook/harness/start/) to create model providers,
tools, skills, MCP connections, workflows, memory, guardrails, and evaluations.

| Contract question | Attached-agent answer |
| --- | --- |
| Who initiates it? | A caller invokes the generated command, stream, or queued execution surface. |
| What is selected? | One service-owned attached-agent definition and one runtime model alias/capability binding. |
| Who waits? | Command callers wait for a bounded result, stream callers for frames, and queued callers for acceptance only. |
| What is the normal result? | Schema-validated output or stream/result events according to the selected execution shape. |
| What stays decoupled? | The service contract stays provider/model agnostic; the composition root injects concrete model adapters and runtime storage. |

```mermaid title="One attached agent expands into normal PURISTA boundaries"
flowchart LR
  Caller[Caller] --> C[Generated command]
  Caller --> S[Generated stream]
  C -->|short result| R[Attached agent runtime]
  C -->|response mode| Q[Generated queue]
  Q --> W[Generated worker]
  W --> R
  S --> R
  R --> H[Harness session and model binding]
  H --> O[Validated output or run events]
  O --> C
  O --> S
  O --> Q
```

## Choose the caller outcome first

| Caller needs | Use | Start here |
| --- | --- | --- |
| A small typed result during this request | Generated command / aggregate HTTP projection | [Build the first attached agent](/handbook/framework/build-ai-powered-services/build-the-first-attached-agent/) |
| Progress while the connection is alive | Generated stream / streaming HTTP projection | [Choose command, stream, or queued execution](/handbook/framework/build-ai-powered-services/choose-command-stream-or-queued-execution/) |
| Work that may outlive the request or retry | Generated queue and worker | [Manage sessions, workspaces, and durable work](/handbook/framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work/) |
| A reaction after queued completion | Queue result policy and a normal subscription | [Publish results and react through subscriptions](/handbook/framework/build-ai-powered-services/publish-results-and-react-through-subscriptions/) |
| Multi-step reasoning or an approval pause | Attached Harness workflow plus application-owned review handoff | [Coordinate workflows and human review](/handbook/framework/build-ai-powered-services/coordinate-workflows-and-human-review/) |

## Lifecycle and ownership

1. A service creates an `AgentQueueBuilder` and declares schemas, model
   requirements, allowed reach, and exactly one execution implementation.
2. `getDefinition()` creates one command, stream, queue, and worker around that
   contract. `addAgentDefinition(...)` registers all four with the service.
3. `getInstance(eventBridge, { ai: { models: … } })` builds one shared Harness
   runtime for all attached agents and workflows on that service instance.
   Every declared model alias must have a compatible binding.
4. A command, stream, or worker invokes the runtime with validated input and
   trusted PURISTA context. The runtime validates the final output.
5. A response/result policy may turn the command into queue acceptance and
   publish or persist queue completion metadata. These side effects are not an
   atomic outbox transaction with the model or domain action.

If `ai.models` is absent for a service with attached agents, service creation
fails. A provider package, credentials, provider configuration, persistent
Harness storage, a durable workspace, and a queue bridge are separate enablement
steps—not effects of declaring an agent.

## Continue by the task in front of you

| You need to… | Read |
| --- | --- |
| Generate, register, run, and verify one agent | [Build the first attached agent](/handbook/framework/build-ai-powered-services/build-the-first-attached-agent/) |
| Look up every builder option and runtime binding | [Configure AgentBuilder and runtime binding](/handbook/framework/build-ai-powered-services/configure-agent-builder-and-runtime-binding/) |
| Use resources, stores, tools, skills, metrics, identity, or cancellation | [Use tools, skills, resources, stores, and context](/handbook/framework/build-ai-powered-services/use-tools-skills-resources-stores-and-context/) |
| Expose or call the generated capability | [Expose and invoke an attached agent](/handbook/framework/build-ai-powered-services/expose-and-invoke-an-attached-agent/) |
| Protect identity and business actions | [Secure the service boundary](/handbook/framework/build-ai-powered-services/secure-the-service-boundary/) |
| Add content rails, tool policy, approval, or audit | [Configure governance and Guardrails](/handbook/framework/build-ai-powered-services/configure-governance-and-guardrails/) |
| Isolate files and processes | [Configure sandbox ownership and sharing](/handbook/framework/build-ai-powered-services/configure-sandbox-ownership-and-sharing/) |
| Prove deterministic service flow | [Test an AI-powered service deterministically](/handbook/framework/build-ai-powered-services/test-an-ai-powered-service-deterministically/) |
| Deploy replicated services with PostgreSQL/Kubernetes and safe telemetry | [Deploy and observe AI-powered services](/handbook/framework/build-ai-powered-services/deploy-and-observe-ai-powered-services/) |

The next page builds the smallest working attached agent and explains exactly
which Framework and Harness pieces must be available.
