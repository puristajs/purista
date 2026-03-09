# SKILL: PURISTA Service Developer

This skill provides expert procedural guidance for implementing **Commands** and **Subscriptions**. It focuses on the strict technical requirements of the PURISTA builder pattern.

## 1. The "Function Keyword" Rule (CRITICAL)
In PURISTA, you **MUST NOT** use arrow functions (`=>`) for the `setCommandFunction` or `setSubscriptionFunction` handlers.
- **Why**: The framework needs to bind the execution context to the function. Arrow functions capture the lexical `this`, which breaks the framework's internal dependency injection.
- **Rule**: Always use `async function(context, payload) { ... }`.

## 2. Resource Access in Every Context
Resources (like `driver`, `db`, `registry`) are available in both Commands and Subscriptions via `context.resources`.

```typescript
.setSubscriptionFunction(async function(context, payload) {
  // Subscriptions have the same access to resources as commands
  const data = await context.resources.registry.getMetadata(payload.id)
  context.logger.info('Registry accessed in subscription')
})
```

## 3. Explicit Invocation Declaration
For better observability and security, declare which other services/commands you intend to invoke using `.canInvoke()`.

```typescript
.getCommandBuilder('processTask', '...')
.canInvoke('Sandbox', '1', 'executeBash', BashOutputSchema)
.setCommandFunction(async function(context, payload) {
  // Invocation is now tracked and typed
  const result = await context.service.Sandbox[1].executeBash({ 
    sandboxId: payload.id, 
    command: 'npm test' 
  })
})
```

## 4. Error Handling with Intent
Never throw generic `Error` objects. Always use the provided PURISTA classes to ensure proper message mapping.
- **`HandledError`**: For expected business logic failures (e.g., `NotFound`, `Unauthorized`). These are sent back to the caller.
- **`UnhandledError`**: For unexpected system failures (e.g., DB connection lost). These trigger internal alerts and generic "Internal Server Error" responses.

## Best Practices
- **Validation at the Schema Level**: Use Zod's `.refine()` or `.transform()` within the `schema.ts` to keep the handler logic clean.
- **Contextual Logging**: Always use `context.logger`. It automatically includes the `traceId`, making it possible to follow a single request across multiple microservices.
- **Side Effects**: Limit side effects in commands. If a command needs to trigger many unrelated actions, emit an event and use multiple **Subscriptions** instead.
