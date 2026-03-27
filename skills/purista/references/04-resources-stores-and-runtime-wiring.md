# Resources, Stores, and Runtime Wiring

Use this reference when explaining dependencies or bootstrapping.

## Resource rule
External collaborators belong behind `defineResource(...)`.

```ts
const service = new ServiceBuilder(serviceInfo)
  .defineResource('repository', orderRepositoryResource)
  .defineResource('mail', mailClientResource)
```

## Store rule
Use stores for explicit state categories:
- config store for resolved configuration
- secret store for secrets
- state store for runtime or workflow state
- conversation/run-state where agent runtime provides them explicitly

## Instantiation rule
Runtime wiring is where concrete infrastructure is supplied:

```ts
const instance = service.getInstance(eventBridge, {
  resources: { repository, mail },
  config,
  logger,
  stateStore,
  queueBridge,
})
```

## Anti-patterns
- hiding SDK clients in module-level singletons
- storing workflow checkpoints in prompts
- describing only handlers without the runtime inputs that make them executable
