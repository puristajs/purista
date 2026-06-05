# Security, Privacy, And Governance

Use this reference when designing or reviewing PURISTA systems that handle tenant data, regulated data, confidential business data, secrets, or AI/model processing.

Related public handbook material:
- `purista/web/src/content/handbook-cards/mental-model/data-control.mdx`
- `purista/web/src/content/handbook-cards/mental-model/resilience-patterns.mdx`
- `purista/web/src/content/handbook-cards/mental-model/deployment-flexibility.mdx`

## Contents
- [Core Rule](#core-rule)
- [Identity And Tenant Flow](#identity-and-tenant-flow)
- [Authorization Placement](#authorization-placement)
- [Data Minimization](#data-minimization)
- [Secret Handling](#secret-handling)
- [Observability Safety](#observability-safety)
- [AI And Model Safety](#ai-and-model-safety)
- [Multi-Tenant Data Patterns](#multi-tenant-data-patterns)
- [Audit Records](#audit-records)
- [Production Readiness Checklist](#production-readiness-checklist)

## Core Rule
Security and privacy are architecture boundaries. Do not treat them as code comments or late handler checks.

For every capability, decide:
- who may call it
- which tenant or data partition it belongs to
- which fields are public, internal, confidential, PII, regulated, or unsafe for model/provider exposure
- which guard rejects unauthorized requests before handler logic
- which resource/store enforces least-privilege access
- which data may cross events, queues, streams, logs, traces, metrics, audit records, and model prompts

## Identity And Tenant Flow
Use PURISTA message metadata intentionally:
- `principalId`: user, service, scheduler, or system actor
- `tenantId`: customer, organization, workspace, or deployment partition
- `traceId`: distributed trace lineage
- `correlationId`: request/business flow lineage
- `message.id` or queue `jobId`: transport/job identity, not user or conversation identity

Preserve `tenantId` and `principalId` across commands, emitted events, subscriptions, queue work, streams, agent runs, tool calls, child agents, and audit logs. If identity is missing for a sensitive operation, fail early with a handled authorization error.

Do not use transport ids as AI conversation ids. AI session/conversation identity is a separate runtime concern and must not replace tenant, principal, trace, or correlation metadata.

## Authorization Placement
Put access checks in boundary guards and resources:
- use `setBeforeGuardHooks(...)` on commands, subscriptions, streams, and queue workers for tenant/principal preconditions
- keep handler logic focused on business behavior after guards pass
- enforce row/document/object tenant scoping inside repositories and resources
- allowlist command tools and child agents for agent work with `canInvoke(...)` and `canInvokeAgent(...)`
- deny by default when a caller, agent, or runtime context has no explicit permission

Do not rely on a route path, frontend state, model prompt, or informal convention as an authorization boundary.

## Data Minimization
Design each schema as the minimum safe contract for that boundary:
- command payloads accept only fields needed for the operation
- events publish business facts, not full records, when broad consumers do not need full records
- subscriptions define local schemas for only the fields they consume
- queue payloads contain durable identifiers and small immutable facts, not large sensitive snapshots
- streams expose progress and final results appropriate for the caller
- OpenAPI examples and generated docs use safe placeholder data

Prefer this pattern for sensitive workflows:
1. emit an event with an id and non-sensitive summary
2. let authorized consumers fetch details through guarded commands/resources
3. keep full confidential records in the owning service store

## Secret Handling
Secrets include API keys, tokens, passwords, private certificates, provider credentials, OAuth client secrets, database URLs with credentials, and model provider keys.

Rules:
- never put secret values in source code, examples, config stores, generated fixtures, events, queues, logs, metrics, traces, prompts, completions, or screenshots
- use secret stores for business/application secrets
- deployment-time credentials may be injected by the platform, but only into bootstrap/runtime wiring or secret-store/provider setup
- config stores are for non-secret values such as URLs, feature flags, regions, and timeouts
- resources should consume secrets and expose narrow methods to handlers; handlers should not pass raw secrets around unless unavoidable

## Observability Safety
Operational telemetry must be useful without leaking data.

Safe attributes usually include:
- service name/version
- command, subscription, stream, queue, worker, or agent name
- status, retry count, duration bucket, error class, and sanitized provider code
- correlation id, trace id, run id, or job id when policy allows them

Unsafe attributes usually include:
- headers, cookies, authorization values, raw URLs with query strings
- prompts, completions, transcripts, tool arguments, attachments, sandbox stdout/stderr
- tokens, API keys, passwords, provider request/response bodies
- payload data, PII, user ids, email addresses, tenant ids, document text, medical or financial data

Custom metrics must use `ServiceBuilder.defineMetric(...)` or `AgentQueueBuilder.defineMetric(...)`, record through typed `context.metrics`, use `app.*` names, and keep attributes low-cardinality and non-sensitive.

## AI And Model Safety
Agents must not become an unbounded data exfiltration path.

Before adding an agent, decide:
- the owning service and deterministic source of truth
- which model capabilities are needed
- which tools and child agents are allowlisted
- which input fields are safe for the model
- how PII/confidential data is redacted, summarized, tokenized, or excluded
- whether sandboxing is required for file access, code execution, or MCP-style tool use
- how model output is validated before it affects canonical state
- whether prompt/completion retention is disabled or explicitly governed
- whether durable workspace replay is needed, which adapter owns encrypted
  storage, which product policy owns retention and quotas, and who schedules
  cleanup

Default guidance:
- set AI telemetry content capture off unless explicit retention and consent rules exist
- never log prompts or completions in normal logs
- never place secrets in prompts
- pass identifiers and summaries instead of complete records
- validate and sanitize model output with schemas
- apply state mutations through deterministic commands/resources

## Multi-Tenant Data Patterns
Choose the isolation pattern deliberately:
- single-tenant service instances for high-compliance or customer-dedicated deployments
- shared service instances with strict tenant guards and tenant-scoped resources for SaaS scale
- tenant-scoped store keys, repository filters, queue idempotency keys, cache keys, and audit partitions
- tenant-aware observability and alerts without exposing tenant-sensitive content

Every command, stream, queue worker, subscription, and agent that touches tenant-scoped data must have a clear tenant source and enforcement point.

## Audit Records
Audit records should answer who did what, where, when, and why the system allowed or denied it.

Include:
- actor/principal id or service identity
- tenant id or partition id when policy allows it
- operation and resource id
- decision/result
- timestamp
- correlation/trace/run/job id for investigation

Avoid storing confidential content in audit logs unless a product/legal policy requires it. If content must be stored, use an authorized encrypted store with retention rules.

## Production Readiness Checklist
- Capability owner, source of truth, tenant boundary, and data classification are named.
- Sensitive operations use `setBeforeGuardHooks(...)` or equivalent resource-level checks.
- Boundary schemas are minimized and consumer-local.
- Events and queues do not broadcast confidential records unnecessarily.
- Resources enforce tenant scoping and least privilege.
- Secrets are in secret stores or deployment secret injection, not config stores or logs.
- Logs, metrics, traces, OpenAPI examples, generated fixtures, events, streams, and queue metadata are free of secrets and PII.
- AI prompts receive only approved, minimized, redacted context.
- AI telemetry does not capture prompt/completion content by default.
- Sandbox policy is explicit for untrusted file/code/tool access.
- Durable workspace policy is explicit for resumable agent runs; sandbox
  snapshots are not treated as production durable replay.
- Workspace metadata excludes secrets, raw workspace refs in telemetry, file
  contents, prompts, completions, tool inputs, tool outputs, credentials,
  tokens, and raw headers.
- Model output is schema-validated and applied by deterministic service logic.
- Queue retries, DLQ handling, idempotency keys, and timeout budgets are defined for sensitive side effects.
- Audit records capture actor, tenant, operation, resource, decision, and correlation without leaking confidential content.
- Deployment topology has production-grade event bridge, queue bridge, state store, secret store, health checks, and observability.
