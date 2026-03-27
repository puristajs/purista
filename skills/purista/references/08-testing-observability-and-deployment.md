# Testing, Observability, and Deployment

Use this reference when validating or operationalizing a PURISTA app.

## Testing rule
Test the declared boundary and runtime wiring, not just raw handler logic.
- service builders should be instantiated with realistic runtime inputs
- agent tests should verify context surfaces, skill/resource wiring, and reply behavior

## Observability rule
Tracing, logging, and metrics belong to the runtime composition and boundary instrumentation, not scattered ad hoc inside every handler.

## Deployment rule
Deployment topology is downstream of the capability graph. Choose the topology after the service, queue, and transport boundaries are clear.

## Anti-patterns
- provider or deployment assumptions baked into builder definitions
- tests that validate only prompt prose but not runtime behavior
