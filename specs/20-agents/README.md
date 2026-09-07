# Agent specifications

**Status:** active routing index.

[88-harness-first-service-integration.md](./88-harness-first-service-integration.md)
is the single authoritative PURISTA contract for Harness v4 integration. This
directory contains no alternative agent architecture or retained historical
implementation plan.

## Contract summary

- Native `@purista/harness` factories and immutable catalogs own AI definitions.
- A service mounts one Harness definition with
  `ServiceBuilder.mountHarness(...)`; Core owns its lifecycle.
- `.addAgent(...)`, `.addWorkflow(...)`, and catalog roots define public
  callable targets. Recursive tools, Skills, MCP servers, agents, and workflows
  remain dependencies until explicitly promoted to roots.
- Every PURISTA agent, workflow, and subagent call uses an exact address and the
  EventBridge. Same-process execution has no local fallback.
- Harness target contracts carry exact input, validated-input, output, update,
  and reachable-interrupt inference.
- `ai.model` binds `primary`; `ai.models` adds the exact non-primary aliases.
  Storage and memory accept optional production adapters and become mandatory
  only when compiled requirements demand them.
- Host-aware tools expose only builder-declared PURISTA resources and
  operations. Workflows receive only explicitly declared typed tool invokers.
- Hono protection middleware authenticates and establishes trusted principal
  and tenant identity. Command, stream, subscription, workflow, mounted-root,
  and resource guards enforce business authorization.
- The release is a clean break. Runtime packages contain no compatibility,
  legacy, or migration path.

## Ownership

Harness implementation and standalone behavior follow the companion Harness
specification. PURISTA implementation, CLI generation, service metadata, HTTP
projection, examples, tutorials, documentation, and tests follow spec 88.
User-facing skills must be derived from implemented public APIs and handbook
content rather than requiring this internal specification.
