# Service Builder Lifecycle

Use this reference when the model needs the exact progression from service builder to running instance.

## Core APIs
- `new ServiceBuilder(serviceInfo)`
- `setConfigSchema(...)`
- `defineResource(...)`
- `getCommandBuilder(...)`
- `getSubscriptionBuilder(...)`
- `getStreamBuilder(...)`
- `getQueueBuilder(...)`
- `getQueueWorkerBuilder(...)`
- `addCommandDefinition(...)`
- `addSubscriptionDefinition(...)`
- `addStreamDefinition(...)`
- `addQueueDefinition(...)`
- `addQueueWorkerDefinition(...)`
- `getInstance(eventBridge, options)`

## Typical assembly shape
1. Builder file declares the service builder.
2. Child builder files define commands, subscriptions, streams, queues, or workers.
3. Service file imports child builders and calls `getDefinition()`.
4. Service file registers those definitions back onto the service builder.
5. Bootstrap code creates the runtime instance with explicit infrastructure.
