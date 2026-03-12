# SKILL: PURISTA Infrastructure and Messaging

This skill provides expert procedural guidance on the PURISTA messaging layer, focusing on **Event Bridges**, **Queues**, **Streams**, and **Metadata-driven Event Handling**.

## 1. The Event Bridge Envelope
Every message in PURISTA is wrapped in an envelope. Understanding this is critical for debugging and cross-service communication.
- **`traceId`**: Automatically propagated across the bridge for distributed tracing.
- **`principalId`**: Optional ID of the user/process that initiated the message chain.
- **`tenantId`**: Critical for multi-tenant systems (like the Sandbox).

## 2. Advanced Event Handling in Builders
In PURISTA v1, events are not just "emitted"; they are **declared**. This allows for auto-generation of AsyncAPI documentation.

### Declaring Emitted Events
Always use `.canEmit()` in your Command or Subscription builder.
```typescript
.getCommandBuilder('myCommand', '...')
.canEmit('DataCreated', DataCreatedSchema)
.setCommandFunction(async function(context, payload) {
  // context.emit is now type-safe and verified against the schema
  await context.emit('DataCreated', { id: '123' })
})
```

## 3. Subscriptions and Streams
Subscriptions are the passive side of the Event Bridge.

### Pattern: Reconciler / Self-Healing
Use subscriptions to synchronize state after a crash or restart.
- **Trigger**: `ServiceStarted` or a custom heartbeat event.
- **Action**: Scan infrastructure (Docker/K8s) and update the **State Store**.

### Pattern: Durable Streams
If the Event Bridge supports it (e.g., NATS JetStream), subscriptions can be made **durable**.
- **Benefit**: Ensures no events are lost if the service instance is offline.
- **Implementation**: Managed at the Event Bridge configuration level or via bridge-specific builder extensions.

## 4. Queues and Load Balancing
PURISTA uses **Queue Groups** to ensure that a command or event is processed by exactly one instance of a scaled service.
- **Commands**: Always load-balanced.
- **Events**: Can be load-balanced (one instance reacts) or broadcast (all instances react).

## Best Practices
- **Subject Namespacing**: Use a unique `subjectPrefix` per environment (e.g., `prod`, `staging`) to prevent cross-contamination.
- **Idempotency is Mandatory**: Because messaging can result in "at-least-once" delivery, every handler must check if it has already processed a specific `messageId`.
- **Versioned Events**: When changing an event schema, increment the version (e.g., `DataCreated_v2`) to allow for side-by-side execution during migrations.
