# PURISTA Skill Catalog Audit Wave 1

This audit classifies the shared skill catalog for the builder-memory reframe.

| Skill | Classification | Main gaps addressed in wave 1 |
| --- | --- | --- |
| purista-core | keep and rewrite | missing explicit definition/implementation/configuration/instantiation lifecycle |
| purista-application-architecture | keep and rewrite | missing mapping from capability design to builder graph |
| purista-service-builder | keep and rewrite | missing concrete ServiceBuilder lifecycle and runtime wiring |
| purista-resources | keep and rewrite | missing `defineResource(...)` plus `getInstance(...)` explanation |
| purista-schema-contracts | keep and rewrite | missing builder attachment of schemas |
| purista-command-builder | keep and rewrite | missing command definition assembly and instance execution path |
| purista-subscription-builder | keep and rewrite | missing service assembly and EventBridge runtime wiring |
| purista-stream-builder | keep and rewrite | missing stream definition assembly and runtime exposure context |
| purista-queue-builder | keep and rewrite | missing queue definition lifecycle and runtime queue bridge wiring |
| purista-queue-worker-builder | keep and rewrite | missing worker definition lifecycle and queue bridge dependence |
| purista-agents-core | keep and rewrite | missing relation to deterministic services and runtime composition |
| purista-agent-runtime | keep and rewrite | missing builder-declared skills/resources to runtime instance path |
| purista-external-runtime-bindings | keep and rewrite | missing neutral binding relation to builder-defined capabilities |
| purista-ai-sdk-adapter | keep and rewrite | missing adapter-vs-source-of-truth explanation |
| purista-http-runtime | keep and rewrite | missing transport-over-builder distinction |
| purista-stores | keep and rewrite | missing runtime store wiring explanation |
| purista-event-bridges | keep and rewrite | missing service builder to EventBridge runtime path |
| purista-queue-bridges | keep and rewrite | missing queue/worker definition to QueueBridge execution path |
| purista-sandbox | keep and rewrite | missing runtime adapter and instance wiring emphasis |
| purista-observability | keep and rewrite | missing runtime composition emphasis |
| purista-cli-scaffolding | keep and rewrite | missing scaffolding-as-builder-projection framing |
| purista-agent-testing | keep and rewrite | missing verification of runtime wiring rather than prompt-only behavior |
| purista-deployment-topologies | keep and rewrite | missing topology-after-definition framing |
| purista-mcp-a2a | keep and rewrite | missing neutral binding layering |
| purista-spec-elicitation | keep as meta skill | not a framework primitive; remains a meta planning skill |
| purista-architecture-synthesis | keep as meta skill | not a framework primitive; remains an artifact-generation skill |
| purista-implementation-planning | keep as meta skill | not a framework primitive; remains a planning skill |
| purista-skill-maintainer | keep as meta skill | catalog maintenance workflow already exists; extended with builder-memory goal |

Downstream review notes:
- `voyage/apps/server/skills/README.md` already describes `purista/skills` as the shared catalog and Voyage skills as overlays. No content change needed in wave 1.
- No blocking `starter` or `create-purista` references to the old Voyage-owned canonical skill paths were found during this pass.
