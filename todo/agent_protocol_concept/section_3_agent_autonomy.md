# 3. Agent Autonomy and Governance

## 3.1. Levels of Autonomy
Agents in a distributed AI system may operate under different levels of autonomy, depending on the environment, trust boundaries, and governance policies.

### Fully Autonomous
- Agents can initiate subtasks, discover and call tools, or collaborate with other agents without human or orchestrator intervention.
- Use cases: exploratory agents, AI-first automation.
- Risk: uncontrolled behavior or data leakage without constraints.

### Semi-Autonomous
- Agents can act independently but only within a predefined toolset or with human confirmation.
- Access can be limited by scopes, task types, or tenant-level policies.
- Use cases: co-pilots, assistants with integrated toolchains.

### Strictly Orchestrated
- Agents are invoked as tools or subprocesses.
- Must follow a fixed task structure or workflow.
- Cannot autonomously request data, spawn tasks, or change execution plans.
- Use cases: compliance-heavy systems, embedded workflows.

## 3.2. Capability Discovery
To support dynamic composition, agents and tools should describe their abilities in a machine-readable format.

### Registries
- Central or federated discovery systems that advertise available agents, tools, and their capabilities.
- May expose REST APIs, discovery protocols, or file-based descriptors.

### Capability Metadata
- Declares:
  - Supported message types (e.g., `task.message`, `artifact.update`)
  - Acceptable input formats (`text`, `data`, `file`)
  - Supported task types (`summarization`, `retrieval`, etc.)
  - Streaming support (`true`/`false`)
  - Latency or size constraints

## 3.3. Execution Boundaries
Execution policies define what agents are allowed to do under various conditions.

### Policy-Driven Access Control
Execution rights are determined by policies associated with agent identity, task type, and tenant context — not by conversational `role`.

Policies may enforce:
- Which tools or services an agent may call (managed through manifest `allowedTools`)
- Which concurrency pool a run belongs to (`concurrency.poolId`)
- Whether streaming is allowed (manifest `runtime` / service command configuration)

Access metadata may include:
- `allowedTools: [...]`
- `concurrency: { poolId: "triage", maxParallel: 3 }`
- `tenantScope: "org-xyz"`

Token budgets are not enforced inside the protocol. Instead, token usage travels in telemetry frames so external governance systems can act on it.

### Permission Metadata
- Policies are enforced at runtime via manifest+config, not ad-hoc tags sprinkled through the protocol.
- Examples:
  - `allowedTools: ["search", "summarize"]`
  - `retryPolicy: { strategy: "fixed", maxAttempts: 3 }`
  - `telemetry: { enableTokens: true }`

### Compliance-Aware Execution
- Agents may include or consult policy modules that:
  - Enforce tenant or user data restrictions
  - Redact sensitive context before execution
  - Validate results against pre-defined business rules

These boundaries help keep distributed systems secure, predictable, and compliant with internal and external constraints.
