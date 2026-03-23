# PURISTA Builder Lifecycle

Use this reference when the model needs a compact but explicit explanation of how PURISTA applications are assembled.

## Canonical lifecycle
1. Create a versioned `ServiceBuilder`.
2. Attach config schema with `setConfigSchema(...)`.
3. Declare runtime collaborators with `defineResource(...)`.
4. Derive child builders from the service builder.
5. Add schemas and implementation functions to those child builders.
6. Call `getDefinition()` on each child builder.
7. Register those definitions back on the service builder.
8. Call `getInstance(eventBridge, options)` to create the running service.

## Definition vs implementation
- Definition lives in builder files and schema files.
- Implementation lives in handler functions passed to `setCommandFunction(...)`, `setSubscriptionFunction(...)`, `setStreamFunction(...)`, or worker handlers.

## Configuration vs instantiation
- Configuration shape is declared in the builder with `setConfigSchema(...)`.
- Concrete config values, stores, bridges, and resources are supplied when the runtime creates the instance.
