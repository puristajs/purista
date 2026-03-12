# SKILL: PURISTA-Architect

## 1. Intent
Design decoupled, resilient, and multi-tenant system architectures using the PURISTA framework.

## 2. Pattern: The Pluggable Resource Driver
Use this pattern to decouple business logic from infrastructure (Virtualization, DB, etc.):
1.  **Define Interface**: Create a strictly typed interface in `src/types/`.
2.  **Define Resource**: Register the resource in the `ServiceBuilder` via `.defineResource<Name, Type>()`.
3.  **Inject Implementation**: Provide the concrete driver (e.g., `DockerDriver` or `TartDriver`) when instantiating the service.

## 3. Pattern: Multi-tenant Registry
To track dynamic instances (like Sandboxes):
1.  **State Store Persistence**: Map internal IDs to metadata (`organizationId`, `userId`) in the State Store.
2.  **Self-Healing**: Implement a subscription that listens for `ServiceStarted`, scans the infrastructure, and re-populates the State Store registry from discovered labels.

## 4. Pattern: Service Lifecycle & Startup
Services have lifecycle hooks for initialization and cleanup.
- **`onBeforeStart`**: Initialize resources (DB connections, Driver setup).
- **`onAfterDestroy`**: Graceful shutdown (Close connections, cleanup temp files).

```typescript
// Registered in ServiceBuilder
builder.onBeforeStart(async function() {
  await this.resources.driver.initialize()
  this.logger.info('Sandbox infrastructure ready')
})
```

## 5. Pattern: Principal-Based Authorization
Design services to be secure by default.
- **Principal Integrity**: Every message carries a `principalId`.
- **Resource Ownership**: Aggregates in the `domain/` folder should include an `ownerId`.
- **Validation**: Use **Interceptors** to verify that the `principalId` in the context matches the `ownerId` of the target resource before reaching the handler.

## 6. Pattern: The Testing Blueprint
Architects must ensure the system is testable by providing clear isolation:
- **Mock Everything**: Use `getCommandContextMock` to provide fake resources during tests.
- **Side-by-Side Tests**: Keep `.test.ts` files in the same directory as the command builders.
- **Babel for ESM**: If using modern drivers (like `execa`), ensure Jest is configured with Babel to handle ESM modules.

## 6. Troubleshooting Architectural Flaws
- **Circular Dependencies**: If Service A calls Service B, which calls Service A, use **Events (Subscriptions)** instead of Commands to break the chain.
- **Anemic Models**: If handlers contain all logic, move the business rules to **Aggregates (Plain Classes)** in the `domain/` folder.
- **Leaking Infrastructure**: If your domain classes import `execa` or `dockerode`, move those to a **Driver implementation**.

## 6. Domain Thinking (DDD)
- **Bounded Contexts**: Map each PURISTA service to a single Bounded Context.
- **Ubiquitous Language**: Command and Event names MUST reflect business operations, not technical ones (e.g., `CreateSandbox` vs `RunDockerContainer`).
