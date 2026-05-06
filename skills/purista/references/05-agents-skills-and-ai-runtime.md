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

For sequential planner-style agents:
- `context.ai.createModelExecutor(...)` creates the main worker or a model-backed delegate
- `context.ai.createToolExecutorFromInvoke(...)` wraps an allowlisted invoke helper as a delegate
- `context.ai.createToolExecutorLogic(...)` is the escape hatch for genuinely custom runtime logic and should not be the default worker path
- `context.ai.createAgentExecutorFromInvoke(...)` wraps an allowlisted child agent as a delegate
- `context.plan.generate(...)` creates a plan with business-level tasks
- `context.plan.execute(plan)` runs it sequentially and emits the reserved `purista-ai:*` task artifacts
- `context.io.workflow.emitStage(...)` reports non-task workflow phases such as final synthesis after plan execution
- low-ceremony defaults: model executors can omit `id`/`description`, and planner generation can infer request/title from the current input

Forward child-agent streams deliberately:
- forward workflow progress when the parent UI needs live plan/task state
- forward tool events and handled errors when the parent UX should expose them
- do not forward child `output` artifacts into the parent result channel unless that is explicitly the intended product behavior

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
