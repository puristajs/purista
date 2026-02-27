# 4. Security and Access Control

Distributed AI systems operating across agents, tools, and services require clear and enforceable security boundaries. This includes identifying who is making a request, scoping what data they are allowed to access, and defining which agents or tools can be invoked in which contexts.

## 4.1. Identity Propagation
To enforce permissions and maintain traceability, each message must carry:

- **User Identity**
  - Unique identifier of the end user
  - May include OAuth claims, API keys, session IDs, etc.

- **Tenant Context**
  - Identifies the organizational boundary (e.g., workspace, team, customer)
  - Ensures multi-tenant safety and access segregation

- **Actor Attribution**
  - Metadata identifying the initiating agent/tool
  - Useful for audit logs and tool usage tracking

When transported inside PURISTA, these values align with existing message fields:
- `principalId` → user identity
- `tenantId` → tenant context
- `message.sender` → actor attribution (service/version/command)
- The protocol helper copies these automatically so agents do not have to re-specify them.

## 4.2. Authorization and Policy Enforcement
Security policies define what agents or tools are allowed to do, and must be enforced consistently across all transport layers.

### Policy Types
- **Agent-to-tool permissions** — Which tools may be called by which agents
- **Tool-to-data access** — What kinds of content tools can read/write
- **User-based constraints** — Rate limits, allowed task types, etc.

### Enforcement Strategies
- Inline: policies are evaluated at the point of task execution
- Centralized: external policy decision points (e.g. OPA, service mesh)
- Declarative: policies embedded as metadata (`allowedTools`, `tenantScope`)

## 4.3. Sandboxing and Trust Models
Different agents may run in different security contexts. It's important to isolate them as needed based on trust assumptions.

### Trusted vs. Untrusted Agents
- **Trusted Agents**: May access sensitive data, perform privileged actions
- **Untrusted Agents**: Restricted to public tools, non-sensitive data
- Trust is a function of identity, source, and configuration

### Isolation Techniques
- Process/container isolation
- Transport-level isolation (e.g. broker partitions)
- Context sanitization (e.g. redacting conversation history)

## 4.4. Auditing and Logging
Security must be observable.

- Each task and message should be traceable to its originator
- Logs should include: `conversationid`, `taskId`, `actor`, `tool`, `timestamp`
- Failures, retries, and denied access should be recorded for forensics

A secure AI mesh requires the same rigor as any service-oriented system — combining explicit metadata, consistent enforcement, and full observability.
