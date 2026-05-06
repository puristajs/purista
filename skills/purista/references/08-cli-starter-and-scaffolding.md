# CLI, Starter, And Scaffolding

Use this reference when creating or aligning application skeletons.

## CLI First
For application-level artifacts, prefer the CLI:

```bash
purista init
purista add service <name>
purista add command <name> --service <serviceName> --service-version <version>
purista add subscription <name> --service <serviceName> --service-version <version> --event <eventName>
purista add stream <name> --service <serviceName> --service-version <version>
purista add queue <name> --service <serviceName> --service-version <version>
purista add queue-worker <name> --service <serviceName> --service-version <version> --queue <queueName>
purista add agent <name> --service <serviceName> --service-version <version>
```

Use `--non-interactive` in automation when all required values are known. Use interactive mode when the project context should drive prompts.

## Generated Shape
Generated code should:
- keep versioned service folders
- keep schemas beside their command/subscription/stream/queue/agent boundary
- import service builders rather than duplicating service setup
- update service definitions automatically
- avoid adding optional AI dependencies unless an agent is explicitly generated

## Starter And create-purista
- `starter` must remain AI-free by default.
- `create-purista` should initialize projects through CLI blueprint behavior.
- Defaults should align with current Hono/EventBridge/QueueBridge decisions.
- When framework behavior changes, update `purista` first, then starter/create-purista.

## Review Cues
- CLI generated tests compile against current APIs.
- Generated agents use `@purista/ai/testing`.
- Generated apps do not import `@purista/ai` unless they contain agents.
- Binary files and compiled CLI output are rebuilt when source templates change.
