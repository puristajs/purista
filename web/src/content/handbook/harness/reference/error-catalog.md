---
title: Error catalog
description: Look up Harness error codes, categories, retry signals, and the first safe response.
order: 1420
---

All production runtime errors below extend
[`HarnessError`](/handbook/api/classes/_purista_harness.HarnessError/). Catch
`unknown`, narrow it with
[`isHarnessError(...)`](/handbook/api/functions/_purista_harness.isHarnessError/),
and use `code` for stable application routing. `category` is useful for
telemetry grouping. `retriable` describes whether the cause may be transient;
it does not authorize replaying a business side effect.

| Property | Type | Meaning |
| --- | --- | --- |
| `code` | `string` | Stable machine-readable error identity, such as `MODEL_ERROR`. |
| `category` | `ErrorCategory` | Broad operational group used for routing and dashboards. |
| `retriable` | `boolean` | Whether the cause may succeed later. Check idempotency and time budgets before retrying. |
| `message` | `string` | Diagnostic message for trusted application code. Do not expose it automatically. |
| `meta` | `Record<string, unknown> \| undefined` | Sanitized structured diagnostics. Sanitized does not mean approved for public disclosure. |
| `cause` | `unknown` | Original in-process cause. It is omitted from JSON and must remain inside the trusted boundary. |

## Configuration and contract errors

| Class and code | Category | Retriable | Typical cause | First action |
| --- | --- | --- | --- | --- |
| `HarnessConfigError` — `HARNESS_CONFIG_ERROR` | `config` | No | Invalid builder composition, missing capability, duplicate ID, or unavailable required runtime. | Fix the definition or deployment configuration; usually fail startup. |
| `ValidationError` — `VALIDATION_ERROR` | `validation` | No | Agent, workflow, tool, MCP, model-response, memory, message, or invoke-option contract failed. | Inspect `meta.where`. Correct caller input only when the failing boundary belongs to the caller; keep output failures internal. |
| `AgentNotFoundError` — `AGENT_NOT_FOUND` | `validation` | No | A workflow referenced an unregistered agent. | Fix the workflow definition. |
| `AgentLoopBudgetError` — `AGENT_LOOP_BUDGET_EXCEEDED` | `validation` | No | The default loop exceeded `maxSteps` or the default iteration limit. | Reduce the job, fix looping tool behavior, or deliberately raise the bounded limit. |
| `DelegationPolicyError` — `DELEGATION_POLICY_ERROR` | `validation` | No | A workflow called a child agent outside its delegation allowlist or budget. | Correct the workflow delegation policy or invocation. |
| `WorkflowNotFoundError` — `WORKFLOW_NOT_FOUND` | `validation` | No | Code invoked an unregistered workflow ID. | Fix the application-to-Harness route. |

`ValidationError.meta.where` identifies the boundary: `agent_input`,
`agent_output`, `workflow_input`, `workflow_output`, `tool_input`, `tool_output`,
`mcp_input`, `mcp_output`, `model_response`, memory boundaries, `message`,
`session_history`, `invoke_options`, `eval_input`, or `sandbox_options`. Public
Standard Schema issue metadata is reduced to a count and truncation flag; the
rejected value, vendor paths, and validator cause are not part of that public
issue record.

## Permissions and decision boundaries

| Class and code | Category | Retriable | Runtime behavior | First action |
| --- | --- | --- | --- | --- |
| `PermissionDeniedError` — `PERMISSION_DENIED` | `permission` | No | A coarse tool permission or immediate approval denied the action. In the default loop this is a safe tool result, so the model may continue. | Respect the denial; change authority only through the application's authorization flow. |
| `PolicyDeniedError` — `POLICY_DENIED` | `permission` | No | Governance denied, rejected approval, or found no approval provider. In the default loop this is a safe tool result. | Inspect content-free decision evidence and policy configuration. |
| `DecisionBlockedError` — `DECISION_BLOCKED` | `interceptor` | No | A content or authority interceptor deliberately blocked a protected boundary. | Respect the block; do not automatically retry unchanged content. |
| `DecisionEvaluationError` — `DECISION_EVALUATION_ERROR` | `interceptor` | No | A policy, approval, audit, or Guardrail control could not decide safely and failed closed. | Diagnose the control or dependency using `failureKind`; do not bypass it. |

The decision errors carry validated, content-free evidence. They do not carry
prompts, tool values, or reviewer comments. See
[governance evidence](/handbook/harness/secure-and-govern/record-audit-evidence/) and
[Guardrail testing](/handbook/harness/secure-and-govern/test-guardrails/).

## Model, tool, skill, and MCP errors

| Class and code | Category | Retriable | Typical cause | First action |
| --- | --- | --- | --- | --- |
| `ModelError` — `MODEL_ERROR` | `model` | Depends | Network, rate limit, provider outage, HTTP status, or malformed provider response. | Use `retriable` and alias retry metadata; keep provider details internal. |
| `ModelCapabilityError` — `MODEL_CAPABILITY_ERROR` | `model` | No | Alias lacks the requested capability or provider method. | Correct alias capabilities or inject a compatible provider. |
| `ToolError` — `TOOL_ERROR` | `tool` | Depends | A TypeScript or MCP tool failed. It inherits `retriable` only from a wrapped Harness error. | Inspect the tool and cause; establish effect idempotency before retry. |
| `ToolNotFoundError` — `TOOL_NOT_FOUND` | `tool` | No | Tool missing from registry/allowlist or unknown name returned by model. | Correct registration and agent allowlist; reject invented tool names. |
| `SkillNotFoundError` — `SKILL_NOT_FOUND` | `skill` | No | Agent references an unresolved skill. | Register the skill and agent binding. |
| `SkillManifestError` — `SKILL_MANIFEST_ERROR` | `config` | No | Discovery, manifest, trust, collision, or skill activation rule failed. | Correct or remove the reviewed skill before startup. |
| `McpProtocolError` — `MCP_PROTOCOL_ERROR` | `tool` | Yes | MCP connect, list, or call transport/protocol failure. | Retry within a bound only when the remote operation is safe. |
| `McpAuthError` — `MCP_AUTH_ERROR` | `tool` | Only 5xx | MCP HTTP authentication or authorization failed. | Fix credentials/authority for 401 or 403; treat only server failures as transient. |

`ModelError.retriable` is true for network failures, rate limits, provider
unavailability, HTTP 408/409/429, and 5xx responses. It is false for other
provider/client failures. Provider retry limits belong to the model alias, not
to an individual agent prompt.

## Session, state, and workspace errors

| Class and code | Category | Retriable | Typical cause | First action |
| --- | --- | --- | --- | --- |
| `SessionNotFoundError` — `SESSION_NOT_FOUND` | `session` | No | The backing store has no requested session. | Verify application routing and session lifecycle. |
| `SessionBusyError` — `SESSION_BUSY` | `session` | Yes | Concurrent run, release, or history mutation conflicts with active work. | Wait for the authoritative operation; preserve its invocation identity. |
| `StateError` — `STATE_ERROR` | `state` | Yes | Harness storage or scoped-memory adapter operation failed. | Diagnose adapter health and consistency before bounded retry. |
| `WorkspaceError` — `WORKSPACE_ERROR` | `workspace` | Depends | Workspace reference, checkpoint, lifecycle, cleanup, or backend failure. | Retry only `backend_failure` and `cleanup_pending`; otherwise reconcile the reference or deployment. |
| `WorkspaceQuotaExceededError` — `WORKSPACE_QUOTA_EXCEEDED` | `workspace` | No | Workspace or snapshot quota was exceeded. | Reduce usage, clean up safely, or raise an explicit quota. |
| `WorkspaceCleanupError` — `WORKSPACE_CLEANUP_ERROR` | `workspace` | Yes | Cleanup was partial or its backend failed. | Continue idempotent cleanup using the recorded references. |

## Sandbox, timeout, cancellation, and internal errors

| Class and code | Category | Retriable | Typical cause | First action |
| --- | --- | --- | --- | --- |
| `SandboxError` — `SANDBOX_ERROR` | `sandbox` | Yes | Filesystem or executor operation failed. | Inspect adapter evidence; do not blindly repeat a command with uncertain effects. |
| `SandboxNoExecutorError` — `SANDBOX_NO_EXECUTOR` | `sandbox` | No | A files-only sandbox received an execution request. | Configure an executor-capable sandbox or remove the command tool. |
| `SandboxPermissionDeniedError` — `SANDBOX_PERMISSION_DENIED` | `permission` | No | Scope, owner, or principal admission was rejected. | Correct verified identity/ownership policy; do not reveal owner data. |
| `SandboxConflictError` — `SANDBOX_CONFLICT` | `sandbox` | Only `checkpoint_busy` | Binding, policy, checkpoint, snapshot, or idempotency conflict. | Wait only for a busy checkpoint; reconcile other conflicts. |
| `SandboxQuotaExceededError` — `SANDBOX_QUOTA_EXCEEDED` | `sandbox` | No | Catalog, allocation, snapshot, or byte quota was exceeded. | Clean up or deliberately change the quota. |
| `SandboxStateLostError` — `SANDBOX_STATE_LOST` | `sandbox` | No | Known sandbox state cannot be attached or safely recovered. | Stop the run and follow the durable recovery/operator path. |
| `OperationTimeoutError` — `OPERATION_TIMEOUT` | `timeout` | Yes | Run, model, tool, decision, sandbox, memory, or workspace budget expired. | Stop new work and reconcile effects before deciding to retry. |
| `OperationCancelledError` — `OPERATION_CANCELLED` | `cancelled` | No | Abort signal or explicit cancellation ended the operation. | Honor cancellation and reconcile any external effect already started. |
| `InternalError` — `INTERNAL_ERROR` | `internal` | No | Unexpected Harness invariant or normalized internal failure. | Return a generic application error and diagnose with trusted telemetry. |

## Serialize only for trusted diagnostics

```ts title="src/observability/recordHarnessFailure.ts"
import { isHarnessError, serializeError } from '@purista/harness'

export function recordHarnessFailure(error: unknown): void {
	const envelope = serializeError(error)

	// Send the envelope to the application's trusted logger or telemetry sink.
	console.error({
		event: 'agent_run_failed',
		code: envelope.code,
		category: envelope.category,
		retriable: envelope.retriable,
	})

	if (isHarnessError(error)) {
		// The original error remains available in-process for a trusted sink.
		console.error(error)
	}
}
```

Do not return `envelope` from an HTTP endpoint. Unknown errors preserve their
original message during serialization, and class-specific metadata can still
contain operational identifiers that callers do not need. Use the
[application boundary guide](/handbook/harness/build-agents/errors-and-failure-behavior/)
to build a smaller public response.
