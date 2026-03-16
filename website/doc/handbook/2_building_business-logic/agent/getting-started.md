---
title: Quick Start
description: Fast-track guide to building and running your first PURISTA agent.
order: 203701
---

# Quick Start

Get from zero to a running agent in 5 minutes.

## 1. Scaffold

Use the CLI to create a new agent skeleton.

```bash
purista add agent SupportAgent
```

## 2. Define

We define a simple agent that uses OpenAI to answer questions.

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder, generateText } from '@purista/ai'
import { z } from 'zod'

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'A helpful assistant'
})
  .addPayloadSchema(z.object({ prompt: z.string() }))
  .defineModel('openai:gpt-4o-mini')
  .setHandler(async (context, payload) => {
    const model = context.models['openai:gpt-4o-mini']

    const answer = await generateText({
      model,
      request: { prompt: payload.prompt },
      onTextDelta: (delta) => context.stream.sendChunk(delta)
    })

    return { message: answer }
  })
  .build()
```

### Developer's Map

This structural overview helps you identify which parts of the API handle **Definition** vs. **Runtime Injection**.

```text
📦 Agent Lifecycle & Architecture
├── 🏗️ AgentBuilder (Design Time / "The Blueprint")
│   ├── 📝 .addPayloadSchema()         // The input data contract (Zod)
│   ├── 🤖 .defineModel()              // Required capabilities (text, json, RAG)
│   ├── 🛠️ .canInvoke()                // Commands allowed as tools
│   ├── 📢 .canEmit()                  // Events this agent can trigger
│   ├── 🧠 .persistConversation()      // Memory strategy (Presets: user/agent)
│   ├── 📚 .useKnowledgeAdapter()      // RAG source aliases
│   ├── 📡 .exposeAsHttpEndpoint()     // REST/SSE bridge for Frontend
│   └── 🔗 .canInvokeAgent()           // Dependency link in Command/Subscription
│
├── 🚀 .getInstance() (Runtime / "The Injection")
│   ├── 🔌 models: { ... }             // Concrete AiSdkProviders (OpenAI, etc.)
│   ├── 💾 conversationStore:          // Persistence backend (Redis, In-Memory)
│   ├── 📖 knowledgeAdapters: { ... }  // Concrete RAG backends (Pinecone, etc.)
│   └── 🏎️ poolConfig:                 // Concurrency & Rate limiting per pool
│
├── ⚡ Handler Context (Inside the Handler / "The Toolbox")
│   ├── 📡 context.stream              // Helpers: .sendChunk(), .sendReasoning()
│   ├── 🔧 context.tools.invoke        // Typed access to allowed commands
│   ├── 📜 context.conversation        // High-level: .addUser(), .buildPromptInput()
│   ├── 🔎 context.knowledge           // Typed: .query(), .upsert()
│   └── 🤖 context.agents              // Orchestration: .runText() / .runObject()
│
└── 📤 Background & Workers
    └── 📥 QueueBridge / AIWorker      // Async job orchestration
```

## Architecture Guidance: Agent-as-a-Service

Use **services** for deterministic/fast domain logic and **agents** for LLM-powered, slower, cost-sensitive workloads.

- Service: validation, persistence, domain events, strict SLAs.
- Agent: reasoning, tool orchestration, adaptive responses.
- Bridge them through `canInvokeAgent(...)` and `context.invokeAgent...` to keep observability and policy boundaries explicit.

## 3. Bootstrap

Provide the concrete model provider and start the instance in your entry point.

```ts title="src/index.ts"
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const provider = new AiSdkProvider({
  model: openai('gpt-4o-mini'),
  systemPrompt: 'You are a professional support engineer.'
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: { 'openai:gpt-4o-mini': provider }
})

await supportAgentInstance.start()
```

## 4. Invoke via Command

Following the PURISTA pattern, you typically call your agent from within a command.

```ts title="src/services/support/v1/command/ask.ts"
export const askCommand = supportServiceBuilder
  .getCommandBuilder('ask', 'Asks the agent')
  .canInvokeAgent('supportAgent', '1') // Register the agent dependency
  .setCommandFunction(async (context, payload) => {
    // Call the agent and wait for the final result
    const result = await context.invokeAgent.supportAgent['1']
      .call({ prompt: payload.prompt })
      .final()

    return result.message
  })
```

By using `canInvokeAgent`, PURISTA handles the event bridge routing and traces automatically.
