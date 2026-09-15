---
title: Tenant isolation
description: Carry tenant context through trusted calls and isolate data, queues, subjects, and stores by policy rather than naming convention alone.
order: 1012
---

Tenant context can propagate through commands, streams, subscriptions, and queue
work. That propagation is useful, but it does not isolate a backing store or
broker by itself. Treat it as a trusted input to the policy, not as the policy.

## Enforce tenant scope where data is selected

For a request such as “download invoice”, take the tenant from trusted command
context, not from the request payload. Make the repository query tenant-scoped
so an accidental unscoped lookup cannot return a neighboring record.

```ts title="src/service/invoice/v1/resource/invoiceRepository.ts"
export const getInvoiceForTenant = async (
  database: Database,
  tenantId: string,
  invoiceId: string,
) => database.invoice.findFirst({
  where: { id: invoiceId, tenantId },
})
```

The handler calls it with `context.message.tenantId` after its business
authorization guard has allowed that principal, tenant, record, and action.
The database policy should enforce the same constraint where it can (for
example, row-level security or a tenant-bound connection), because application
code alone is not a containment boundary.

## Carry the context deliberately into asynchronous work

Queue messages preserve their message context. Still, a worker must enforce
scope when it reads or changes data; retries may happen long after the original
HTTP request ended. Make the tenant part of an idempotency/business key only
when it really distinguishes work.

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
await context.queue.enqueue.sendInvoiceEmail(
  { invoiceId: invoice.id },
  undefined,
  { idempotencyKey: `invoice-email:${context.message.tenantId}:${invoice.id}` },
)
```

The worker obtains the tenant from its received message and performs the same
tenant-scoped lookup before sending the email. Do not accept a replacement
tenant from the queued payload, and do not silently default a missing tenant to
one shared account.

## Select an infrastructure boundary

| Data or transport | Prefer | Notes |
| --- | --- | --- |
| Relational data | Tenant predicate plus row-level security where available | Keep the predicate in every query path, including admin exports |
| Key/value state | Per-tenant key/namespace and restrictive credentials | Namespace reduces collisions; credentials provide the boundary |
| Broker topics and queues | Tenant/environment subjects or queues with broker ACLs | Do not assume a topic name prevents a client from publishing to it |
| Files/object storage | Tenant prefix plus IAM policy on that prefix | Validate object ownership before issuing a download URL |
| High-regulation tenants | Dedicated account/project/deployment | More isolation, more operational cost |

Use a stable trusted tenant identifier in business authorization and avoid
putting it into high-cardinality metrics or unprotected logs. For each
tenant-sensitive boundary, document the enforcement mechanism and its owner.

Test cross-tenant denial: a principal for tenant A must not read, invoke,
enqueue, or subscribe to tenant B resources. Include delayed queue/retry paths,
background/administrative jobs, and exports, since those paths can otherwise
lose or misuse their original context.

Next: [chapter overview](/handbook/framework/secure-and-operate/security/).
