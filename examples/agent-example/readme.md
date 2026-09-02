# PURISTA Harness Mount Example

This example shows how one native `@purista/harness` definition runs standalone
and mounts into a PURISTA service without an additional agent builder.

The example keeps the incident domain intentionally small:

- `triage_ticket` classifies one support ticket.
- `analyze_signals` lets the model call the `get_incident_snapshot` host tool.
- `review_rollback` is a durable workflow that returns an explicit external-wait
  interruption until an application-owned reviewer decides.
- PURISTA commands own the incident repository, review records, authorization,
  rollback execution, and receipts.

The Harness definition is
[`src/harness/incident/incidentHarness.ts`](./src/harness/incident/incidentHarness.ts).
It contains schemas, host-tool contracts, agents, and the workflow, but no
credentials or deployment adapters. The Support service publishes selected
targets and binds the host tools in
[`src/service/support/v1/harness/incidentMount.ts`](./src/service/support/v1/harness/incidentMount.ts).

`triageTicketCommandBuilder` demonstrates the HTTP boundary. The native command
declares the mounted agent by its versioned address with `canInvokeAgent(...)`,
invokes it through the EventBridge, unwraps the completed output, and exposes
the command through Hono/OpenAPI. The Hono server contains no agent-specific
handler.

## Run

```bash
cp examples/agent-example/.env.example examples/agent-example/.env
# Set OPENAI_API_KEY in the copied file.
npm test -w @purista/agent-example
npm start -w @purista/agent-example
```

Open <http://localhost:3000/api> and use the public `triageTicket` operation:

```json
{
  "ticketId": "SUP-123",
  "text": "I cannot sign in and payroll closes today."
}
```

Tests require no provider credentials. The Harness test injects
`FakeModelProvider` and runs the definition standalone. The command test uses
`createCommandContextMock(...)` to stub the declared address-first agent call.

## Durable review

The review records and rollback receipts remain application state. Harness
stores only the durable workflow checkpoint and external-wait state.

1. Invoke `requestRollbackReview` to create the immutable business review.
2. Invoke the published `review_rollback` workflow through its PURISTA address
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

- native `defineHarness(...).define()` composition
- `ServiceBuilder.mountHarness(...)`
- explicit agent and workflow publication
- address-first EventBridge invocation
- `commandAsHarnessTool(...)` with trusted caller identity
- model-directed host-tool calls
- explicit `RunOutcome` completion and interruption handling
- standalone Harness tests and mocked PURISTA command tests
- application-owned resources and durable business state
- provider, storage, sandbox, and workspace bindings at the composition root
