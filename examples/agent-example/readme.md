# PURISTA Harness Mount Example

This example shows how native `@purista/harness` definitions live with their
owning service version and mount into PURISTA without another agent builder.

The example keeps the incident domain intentionally small:

- `triageTicket` classifies one support ticket.
- `analyzeSignals` lets the model call the `getIncidentSnapshot` and
  `getRunbook` host tools.
- `reviewRollback` is a durable workflow that returns an explicit external-wait
  interruption until an application-owned reviewer decides.
- PURISTA commands own the incident repository, review records, authorization,
  rollback execution, and receipts.

The Harness definition is
[`src/service/support/v1/harness/supportHarness.ts`](./src/service/support/v1/harness/supportHarness.ts).
It composes service-owned agent, workflow, and tool definitions, but no
credentials or deployment adapters. `ServiceBuilder.defineTool(...)` gives the
two host tools typed access to the incident repository. The Support service
mounts the Harness once with an explicit `targets` policy.

`runTriageTicketCommandBuilder` demonstrates the HTTP boundary. The native command
declares the mounted agent by its versioned address with `canInvokeAgent(...)`,
invokes it through the EventBridge, unwraps the completed output, and exposes
the command through Hono/OpenAPI. The Hono server contains no agent-specific
handler. This single demo endpoint opts into public access explicitly; production
applications should install a Hono protect middleware instead.

## Run

From this example directory:

```bash
npm install
cp .env.example .env
# Set OPENAI_API_KEY in the copied file.
npm test
npm start
```

Open <http://localhost:3000/api> and use the public `runTriageTicket` operation:

```json
{
  "ticketId": "SUP-123",
  "text": "I cannot sign in and payroll closes today."
}
```

Tests require no provider credentials. The portable `triageTicket` agent test
injects `FakeModelProvider` and runs that portable graph standalone. The mounted
service test drives `analyzeSignals` through EventBridge and proves both hosted
tools execute with service resources. The command test uses
`createCommandContextMock(...)` to stub the declared address-first agent call.

## Durable review

The review records and rollback receipts remain application state. Harness
stores only the durable workflow checkpoint and external-wait state.

1. Invoke `requestRollbackReview` to create the immutable business review.
2. Invoke the published `reviewRollback` workflow through its PURISTA address
   with a stable durable run id.
3. Handle the returned `interrupted` outcome as an approval request. It is a
   normal terminal response for this invocation, not an exception or HTTP 500.
4. An authenticated reviewer invokes `decideRollbackReview`. The command
   records the decision and signals the exact wait idempotently.
5. Invoke the workflow again with the same input and run id. It resumes and
   returns a completed `approved` or `rejected` output.
6. `executeApprovedRollback` rechecks trusted deployment state and persists an
   idempotent receipt before reporting success.

Local mode uses `localDurableExecution()` under `.local/harness`. The supplied
PostgreSQL and Kubernetes compositions replace runtime adapters without
changing the Harness definition or PURISTA mount.

## Framework capabilities shown

- native additive `defineHarness(...).addAgent(...).addWorkflow(...)` composition
- `ServiceBuilder.mountHarness(...)`
- explicit per-target mount policy
- address-first EventBridge invocation
- `ServiceBuilder.defineTool(...)` with typed service resources
- model-directed host-tool calls
- explicit `RunOutcome` completion and interruption handling
- standalone portable-agent tests, mounted host-tool tests, and mocked PURISTA command tests
- application-owned resources and durable business state
- provider, storage, sandbox, and workspace bindings at the composition root
