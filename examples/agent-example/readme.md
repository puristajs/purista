# PURISTA Multi-Agent Incident Response Example

This example shows a real-world, core-native PURISTA agent workflow.

The running demo uses OpenAI through `@purista/harness-openai` and reads the
API key from `.env`. Tests use `createScriptedHarnessModel` from `@purista/core`,
so CI stays provider-neutral and does not require API keys.

## Use case

The `Support` service models an incident response desk for a checkout outage:

- deterministic PURISTA command tools load incident evidence, runbooks, and store the final brief
- `analyzeSignals` reviews alerts, logs, deployments, and metrics
- `assessRollbackRisk` reviews rollback safety with a sandbox policy
- `coordinateIncidentResponse` is the parent PURISTA workflow agent: it invokes both specialist agents through declared `canInvokeAgent(...)` boundaries, calls command tools, and stores an operator brief
- the coordinator is exposed through Hono/OpenAPI as `POST /api/v1/incident-response`

## Run

```bash
cp examples/agent-example/.env.example examples/agent-example/.env
# edit examples/agent-example/.env and set OPENAI_API_KEY
npm test -w @purista/agent-example
npm start -w @purista/agent-example
```

Open <http://localhost:3000/api> and run `POST /api/v1/incident-response` from the OpenAPI UI:

```json
{
  "incidentId": "INC-2026-042",
  "businessContext": "EU checkout revenue is materially impacted during business hours."
}
```

## What it demonstrates

- `ServiceBuilder.getAgentQueueBuilder(...)`
- schema-driven payload and output types
- capability-gated model handles on `context.harness.models`
- OpenAI as the default live model provider via `.env`
- command tools through `context.invoke.tools`
- child-agent delegation through `context.invoke.agents`
- PURISTA-level workflow orchestration with independent queue/runtime boundaries for each specialist agent
- declared skills in agent manifests
- sandbox policy for risk analysis
- a deliberately service-scoped incident conversation with bounded complete-turn
  history, inactive-session expiry, and bounded run/event audit records; the
  public demo has no authenticated tenant boundary, while a multi-tenant app
  would omit `scope: 'service'` and use the tenant-safe default
- generated queue, worker, command, and stream definitions for each agent
- Hono HTTP exposure with OpenAPI documentation
- `createAgentTestHarness(...)` with a scripted model provider
- `createAgentSkillTestRuntime(...)` for skill-backed agent fixtures
- no direct application dependency on `@purista/harness`
