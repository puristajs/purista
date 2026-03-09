# SKILL: PURISTA-Developer

## 1. Intent
Implement granular, type-safe business logic via PURISTA Commands, Subscriptions, and Queue Workers.

## 2. Technical Blueprint: Command Implementation
Every command consists of a **Payload** (Body) and optional **Parameters** (Query/Header context).

```typescript
// path: src/service/[Service]/v1/command/[Name]/[Name]CommandBuilder.ts
import { myServiceBuilder } from '../../MyServiceBuilder'
import { InputSchema, ParamSchema, OutputSchema } from './schema'

export const myCommandCommandBuilder = myServiceBuilder
  .getCommandBuilder('commandName', 'description')
  .addPayloadSchema(InputSchema) // Use for the main data object
  .addParameterSchema(ParamSchema) // Use for metadata, IDs, or query-params
  .addOutputSchema(OutputSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    // payload: The data sent in the request body
    // parameter: Contextual data (e.g. resource IDs)
    const result = await context.resources.myResource.execute(payload, parameter.id)
    return result
  })
```

## 3. Accessing Service Configuration
Configuration defined in the `ServiceBuilder` is available in every handler. Use this for non-stateful primitives (e.g., retry limits, feature flags).

```typescript
.setCommandFunction(async function (context, payload) {
  // Access the typed configuration
  const { retryLimit } = context.service.config
  
  // Access shared resources
  const { db } = context.resources
})
```

## 4. Mandatory Steps for Subscriptions
Subscriptions are used for side effects and self-healing.
1.  **Selection**: Choose between `subscribeToEvent` or `subscribeToCommand`.
2.  **Logic**: Implement logic in `async function(context, payload)`.
3.  **Error Handling**: Wrap logic in `try/catch` to prevent breaking the Event Bridge cycle.

## 4. Troubleshooting Loop (Self-Correction)
If you encounter errors, check these common pitfalls:
- **"Cannot access 'this' of undefined"**: You used an arrow function. Change to `async function`.
- **"Resource X not found"**: Ensure the resource was added via `serviceBuilder.defineResource()` and provided during instantiation.
- **"Validation failed"**: Check if the payload matches the Zod schema exactly. PURISTA is strict.
- **"Event not registered"**: Ensure `.canEmit('EventName', Schema)` was called before `context.emit`.

## 5. Performance Tips
- **Minimize Payload Size**: Pass IDs rather than large objects across the Event Bridge.
- **Thin Handlers**: If a handler exceeds 50 lines, extract domain logic into a separate class in the `domain/` folder.
