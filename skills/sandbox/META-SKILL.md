# PURISTA Meta-Skill: Framework Orchestrator

This is the primary entry point for AI agents working within the PURISTA ecosystem. Use this meta-skill to coordinate between architectural design, service implementation, and infrastructure management.

## 1. Skill Purpose
Fulfill complex backend requirements using the PURISTA framework (v1+) while maintaining strict adherence to message-based decoupling, type-safety (Zod 4), and multi-tenant isolation.

## 2. Triggering & Context
Activate this skill whenever:
- A new microservice or "Bounded Context" needs to be defined.
- A command, subscription, or background worker is requested.
- Debugging issues related to the Event Bridge, Stores, or Resource injection.

## 3. The PURISTA "Golden Rules" (Constraints)
Agents must NEVER violate these rules:
- **Rule 1: Builders over Classes.** Always use `ServiceBuilder`, `CommandBuilder`, etc. for infrastructure.
- **Rule 2: Context Binding.** Handlers **MUST** use `async function(context, payload)` syntax. NEVER use arrow functions `=>`.
- **Rule 3: Resource Isolation.** External clients (DB, Driver, API) **MUST** be injected as resources via `context.resources`.
- **Rule 4: Versioned Folders.** Always follow the `src/service/[Name]/v[Number]/` directory structure.
- **Rule 5: Declared Events.** Use `.canEmit()` for every event to enable AsyncAPI documentation.
- **Rule 6: Mandatory Testing.** Every new command **MUST** have a corresponding side-by-side `.test.ts` file using `getCommandContextMock`.

## 4. Thinking Process (Chain of Thought)
When tasked with a PURISTA development cycle, follow these steps:
1.  **Domain Analysis**: Identify the Bounded Context (Service) and the required Message (Command/Event).
2.  **Schema First**: Define the Zod input/output schemas before writing any logic.
3.  **Resource Check**: Determine if the task requires external resources. If so, verify they are defined in the `ServiceBuilder`.
4.  **Handler Implementation**: Write the orchestrator logic in the handler, delegating complex business rules to domain classes.
5.  **Event Emission**: Declare and emit the resulting domain events.

## 5. Available Specialized Sub-Skills
Consult these for deep technical implementation:
- `PURISTA-Architect`: System design and pluggable drivers.
- `PURISTA-Developer`: Hands-on Command/Subscription coding.
- `PURISTA-Advanced-Developer`: Interceptors, Hooks, Transformers, and Guards.
- `PURISTA-Infrastructure`: Event Bridge, Queues, and Streams.
- `PURISTA-Observability`: OTel, Logging, and Metrics.
- `PURISTA-Testing`: Unit testing blueprints and mock contexts.
