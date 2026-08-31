---
title: Record governance audit evidence
description: Persist content-free policy decisions in an application-owned store without retaining protected tool input.
order: 706
---

A governance audit sink receives a normalized record after a policy decision.
Use it when the application must retain which policy effect was evaluated,
whether it was enforced, and which run/tool occurrence it belonged to.

Harness does not provide an audit database. The application selects the store,
retention period, access policy, encryption, deletion workflow, and operational
alerts.

## 1. Implement the sink around your store

```ts title="src/policy/createGovernanceAudit.ts"
import type { DecisionExecutionContext, GovernanceAuditRecord, GovernanceAuditSink } from '@purista/harness'

export interface GovernanceDecisionStore {
	append(record: GovernanceAuditRecord, execution: DecisionExecutionContext): Promise<void>
}

export function createGovernanceAudit(store: GovernanceDecisionStore): GovernanceAuditSink {
	return {
		record: (record, execution) => store.append(record, execution),
	}
}
```

Forward `execution.signal` and honor `execution.deadline` in the concrete store
client. Do not start unbounded background writes from this callback.

The sink is an application adapter. PURISTA does not ship an audit database or
a database-specific governance sink. Implement `GovernanceDecisionStore` with
the database or append-only log already owned by the application, then inject
that implementation at the composition root.

## 2. Know what the record contains

| Field | Meaning |
| --- | --- |
| `evidence` | Stable decision/source identity, phase, ordinal, and optional content-free reason code |
| `toolId`, `callId`, `invocationId` | The exact prepared tool occurrence |
| `agentId`, `runId`, `sessionId`, `workflowId`, `step` | Correlation values for the active execution path |
| `effect` | `allow`, `deny`, `require_approval`, or `audit` |
| `enforced` | Whether this decision changed execution; `false` identifies shadow evidence |

The record deliberately omits tool input, model content, reviewer comments,
credentials, and policy-service responses. Do not enrich it with those values
in a generic sink.

## 3. Wire the sink at composition

```ts title="src/createAuditedTransferHarness.ts"
return createTransferAgentBuilder(provider)
  .governance(({ native, rule }) => ({
    defaultEffect: 'allow',
    audit: createGovernanceAudit(governanceDecisionStore),
    policies: [
      native({
        id: 'transfer-controls',
        version: '1',
        rules: [
          rule({
            id: 'large-transfer-review',
            tools: ['transfer_funds'],
            effect: 'audit',
            when: ({ input }) => input.amount > 1_000,
            reasonCode: 'large_transfer_observed',
          }),
        ],
      }),
    ],
  }))
  .build()
```

An `audit` effect admits the tool and records the decision. An `allow`, `deny`,
or `require_approval` decision also reaches the configured audit sink. In
`shadow` mode, records use `enforced: false` so operators can compare proposed
policy behavior before enforcement.

## 4. Treat missing evidence as a control failure

If the sink throws, times out, is cancelled, or cannot complete before the
decision deadline, governance fails closed. The handler does not run. This
prevents a configured evidence requirement from degrading silently.

Test an ordinary record, a shadow record, store failure, timeout, and
cancellation. Assert that the failed sink prevents the protected handler and
that persisted records contain no tool input or reviewer content.

Use application metrics and alerts for sink availability and latency. Keep
retention and access proportional to the content-free evidence; correlation
identifiers can still be sensitive operational data.

For production, define these store decisions explicitly:

| Decision | Application responsibility |
| --- | --- |
| Write guarantee | Choose whether the append must be durable before the tool may run; the configured callback itself is fail-closed |
| Uniqueness | Use `evidence.decisionId` as a stable deduplication key when the store may receive retries |
| Retention | Set a documented period and deletion workflow for operational correlation data |
| Access | Restrict readers to authorized security, compliance, and incident-response roles |
| Encryption and region | Apply the application's data-classification and residency rules |
| Monitoring | Alert on write failures, timeout, latency, and unexpected decision/effect counts |

API reference: [`GovernanceAuditSink`](/handbook/api/interfaces/_purista_harness.GovernanceAuditSink/)
and [`GovernanceAuditRecord`](/handbook/api/interfaces/_purista_harness.GovernanceAuditRecord/).
