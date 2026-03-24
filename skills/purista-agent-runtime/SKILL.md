---
name: purista-agent-runtime
description: Teach untrained models how PURISTA agent handlers run with explicit context, skills, stores, expose helpers, and runtime resources supplied at instance creation time.
topics: [agents, runtime, skills, run-state]
phases: [implementation]
---

# PURISTA Agent Runtime

## When to use this skill
Use this skill when writing or reviewing agent handler code.

## What this component/package is for
The agent runtime context gives a running agent controlled access to models, tools, resources, other agents, conversation memory, run-state, and skills.

## Core PURISTA concept
Agent runtime helpers are runtime composition surfaces, not magic prompt state. The agent definition declares what is allowed, and the running instance supplies the concrete skill resource, stores, bindings, and providers.

## Builder lifecycle
1. Declare the agent with its allowed skills, tools, models, and runtime policy.
2. Create the running instance with concrete providers, skill resources, stores, and bridges.
3. Inside the handler, use grouped context surfaces such as `context.ai`, `context.invoke`, `context.memory`, `context.io`, and `context.app` explicitly.

## Hard rules
- Use `context.invoke.expose.*` for provider-neutral external runtime bindings.
- Keep retrieval and skill loading behind `context.ai.skills`, not hidden prompt magic.
- Use `context.memory.run` for durable workflow state and `context.memory.conversation` for chat history.
- Keep prompt assembly explicit.
- Prefer `context.ai.policy.resolve(...)`, `context.ai.reflect.run(...)`, and `context.runtime.approvals.*` over handwritten local abstractions when the runtime already provides them.
- Let the runtime/provider layer own bounded invocation, timeout/retry policy, and provider-safe structured-output compilation.
- Do not hand-roll app-local timeout wrappers or strict-provider schema patches inside handlers.

## Decision rules
- Use `context.invoke.tools` for declared command invocations.
- Use `context.invoke.agents.forward` when child output should be visible to the user.
- Use `context.invoke.agents.invoke` when private worker output should stay internal and only the parent agent should narrate to the user.
- Use `context.ai.skills.search`, `context.ai.skills.load`, and `context.ai.skills.loadReferences` only when the handler actually needs those materials.

## Definition pattern
- Declare skill names with `builder.useSkills([...])`.
- Declare runtime bindings, execution policy, and stores on the agent definition.

## Implementation pattern
- Search skills by phase, topic, and query, then render only the selected documents.
- Convert neutral bindings to provider tools at the boundary, not inside domain logic.
- Use run-state plus streaming for long-running user-visible work.
- For strict structured output, rely on the provider/runtime compilation path in `packages/ai/src/providers/runtime/providerJsonSchema.ts`.
- For bounded model calls, rely on the shared invocation path in `packages/ai/src/providers/runtime/modelInvocation.ts` and provider defaults/metadata instead of local wrappers.

## Configuration pattern
- The agent definition owns declared skill names and conversation/run-state strategy.
- The concrete `SkillResource`, model providers, stores, and bridges are runtime inputs.

## Instantiation / runtime wiring
- The running agent instance must receive the concrete skill resource and any required runtime resources at `getInstance(...)`.
- If `builder.useSkills([...])` was declared but no runtime `skills` resource is supplied, that is a wiring error.
- Queue-backed agents additionally need runtime `queueBridge` support.

## Verification cues
- The handler uses declared context helpers instead of hidden globals.
- Skill names are declared on the builder and backed by a real runtime skill resource.
- Runtime wiring can name which stores, providers, and bridges are passed to the agent instance.
- Durable workflow state is in run-state, not in prompt history.

## Common mistakes / anti-patterns
- Reintroducing a knowledgebase abstraction instead of resources and skills.
- Storing workflow checkpoints in conversation history.
- Building provider-specific tools directly inside the agent instead of using `context.invoke.expose`.
- Catching provider-schema or timeout failures by fabricating domain output instead of surfacing a real recovery path.
- Teaching handler code without showing which runtime behavior is framework-owned versus app-owned.
- Teaching runtime helpers without explaining the builder declaration plus `getInstance(...)` wiring.

## How this connects to other PURISTA concepts
This skill depends on agent builders, skill resources, external runtime bindings, AI SDK adapters, conversation store, run-state, resources, and queue execution.

## Related skills
- `purista-agents-core` for deciding when an agent belongs in the design
- `purista-external-runtime-bindings` for neutral binding exposure
- `purista-ai-sdk-adapter` for AI SDK conversion at the provider boundary
- `purista-stores` for conversation and run-state boundaries
- `purista-sandbox` for isolated tool execution paths

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/handler-context.md`
- `packages/ai/src/runtime/context.ts`
- `packages/ai/src/builder/AgentBuilder.ts`
- `packages/ai/src/providers/runtime/modelInvocation.ts`
- `packages/ai/src/providers/runtime/providerJsonSchema.ts`
- `examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts`
- `examples/ai-basic/src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.ts`
