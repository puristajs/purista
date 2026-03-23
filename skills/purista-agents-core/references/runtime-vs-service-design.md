Keep agents at the orchestration layer.

- Services own business invariants and durable state transitions.
- Resources own external system integration.
- Agents decide, summarize, route, or synthesize on top of those deterministic building blocks.

If a requirement can be implemented as a plain command plus resources, prefer that before adding a new agent.
