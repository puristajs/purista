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
- `reviewRollback` is a recoverable Harness workflow attached to the same service. It suspends on a generic external wait and resumes from PostgreSQL after an application-owned decision.
- `requestRollbackReview`, `decideRollbackReview`, and `executeApprovedRollback` own the review record, reviewer decision, immutable execution claim, trusted-state recheck, idempotent side effect, and receipt outside Harness.
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

Local mode is the default and uses `localDurableExecution()` under
`.local/harness`. It requires no PostgreSQL or Kubernetes service and keeps
command execution disabled.

## Durable rollback review flow

The review example deliberately separates the generic workflow wait from the
business review system:

1. Call `requestRollbackReview` with a stable `reviewId`, incident/change IDs,
   target revision, requester, and expiry. The command returns the immutable
   action digest.
2. Call the attached `reviewRollback` agent with the exact same payload. It
   persists its durable checkpoint and returns `{ status: "waiting" }` through
   the application `onSuspended` handoff.
3. An authenticated application reviewer calls `decideRollbackReview`. The
   command records the decision first and signals the exact Harness wait using
   `decisionId` as its idempotency key.
4. Deliver the same `reviewRollback` payload again. The same durable run resumes
   and returns `approved` or `rejected` without repeating completed steps.
5. For an approved review, call `executeApprovedRollback` with the review ID,
   action digest, and target revision. The command claims the immutable action,
   rechecks the trusted deployment revision immediately before execution, and
   persists one reusable receipt.

The in-memory review repository is for local development. Both replicated
modes use a separate application-owned PostgreSQL table. Harness storage never
becomes the reviewer database or side-effect receipt store.

## Run two local replicas

Docker Compose uses one PostgreSQL database and two application processes. It
keeps sandbox files/search process-local, so it demonstrates distributed
sessions, durable workflow coordination, waits, and fencing without requiring
a Kubernetes cluster:

```sh
export OPENAI_API_KEY=replace-me
docker compose -f examples/agent-example/deployment/compose.yaml up --build
```

Use <http://localhost:3000/api> or <http://localhost:3001/api>. Both replicas
share Harness run state and application review records. Durable file recovery
is intentionally not enabled in this topology.

## Deploy on Kubernetes

The manifests under `deployment/kubernetes` run two application replicas and
give the application service account namespaced authority to create restricted
sandbox Pods, PVCs, ConfigMap control records, and VolumeSnapshots. They also
include Pod Security namespace labels, sandbox quota/limits, default-deny
network policy, probes, graceful shutdown, and a separate no-authority sandbox
service account.

Read [deployment/kubernetes/README.md](./deployment/kubernetes/README.md)
before applying the manifests. The application image, sandbox image, database
URL, API key, CSI storage class, snapshot class, and exact egress destinations
are deployment-owned inputs. No S3-compatible service is required.

## What it demonstrates

- `ServiceBuilder.getAgentQueueBuilder(...)`
- schema-driven payload and output types
- capability-gated model handles on `context.harness.models`
- OpenAI as the default live model provider via `.env`
- command tools through `context.invoke.tools`
- child-agent delegation through `context.invoke.agents`
- PURISTA-level workflow orchestration with independent queue/runtime boundaries for each specialist agent
- exactly one shared Harness runtime per Support service instance, containing every attached Harness agent and workflow
- local, PostgreSQL/local-sandbox, and PostgreSQL/Kubernetes composition without changing definitions
- application-owned durable review records, decisions, claims, receipts, and resume delivery
- declared skills in agent manifests
- sandbox policy for risk analysis
- generated queue, worker, command, and stream definitions for each agent
- Hono HTTP exposure with OpenAPI documentation
- `createAgentTestHarness(...)` with a scripted model provider
- `createAgentSkillTestRuntime(...)` for skill-backed agent fixtures
- explicit Harness adapter dependencies only at the application composition boundary
