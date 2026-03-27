# Agents, Skills, and AI Runtime

Use this reference when the task involves model-driven behavior or conversational systems.

## Agent placement rule
Use an agent when reasoning, conversation, tool use, or iterative synthesis is the primary behavior. Keep canonical truth mutation in deterministic commands or coordinators.

## Runtime rule
The runtime context is explicit:
- `context.ai` for models, reply helpers, reflection, and skills
- `context.invoke` for tools, commands, agents, and exposed bindings
- `context.memory` for conversation and run-state
- `context.io` for streaming and artifacts

## Skill-loading rule
The agent definition declares the allowed skill names. The runtime supplies the actual `SkillResource`.

```ts
builder.useSkills(['purista', 'voyage-agent-loop'])
```

## Public reply rule
- `context.ai.reply.compose(...)` for internal draft text
- `context.ai.reply.generate(...)` for streamed public model replies
- `context.ai.reply.publish(...)` for streamed deterministic public replies

## Anti-patterns
- using agents as a substitute for service boundaries
- leaking provider-specific tool logic into domain handlers
- persisting canonical state only in conversation history
