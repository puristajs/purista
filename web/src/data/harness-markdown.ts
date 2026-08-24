export type HarnessMarkdownPage = {
	id: string
	title: string
	description: string
	body: string
}

export const harnessMarkdownPages: HarnessMarkdownPage[] = [
	{
		id: 'index',
		title: 'PURISTA AI Harness',
		description: 'A production-oriented harness for typed models, tools, agents, memory, evaluation, and observability.',
		body: `PURISTA AI Harness organizes AI capability as explicit application architecture instead of ad hoc prompt calls.

Use it when an application needs typed tool boundaries, model capability routing, memory control, reproducible tests, and observable agent behavior.

## Core Ideas

- Define models by capability, not by scattered provider calls.
- Let the harness normalize provider outcomes, finish reasons, and retry metadata.
- Expose tools with typed input and output contracts.
- Build agents as named, testable runtime components.
- Add local durable checkpoints when long-running workflows must resume after restart.
- Keep prompts, tools, memory, and policy boundaries reviewable.
- Treat security, privacy, and evaluation as part of the architecture.

## Recommended Path

1. Start with the harness mental model.
2. Define provider models and capability names.
3. Add narrow tools with explicit schemas.
4. Compose agents around business use cases.
5. Add tests and evaluations before production rollout.
6. Connect observability and review failure paths.`,
	},
	{
		id: 'get-started',
		title: 'Get Started With AI Harness',
		description: 'Create a typed harness, register models and tools, and compose the first agent.',
		body: `A harness starts from explicit runtime definitions. Keep the first version small: one model, one or two tools, and one agent with a clear business purpose.

\`\`\`typescript
import { defineHarness, openai } from '@purista/harness'

const harness = defineHarness({ name: 'support' })
  .models({
    fast: {
      provider: openai({ apiKey }),
      model: 'gpt-4o-mini',
      capabilities: ['object'],
      retry: true,
    },
  })
  .tools({
    searchDocs: {
      description: 'Search approved internal documentation.',
      input: z.object({ query: z.string() }),
      output: z.object({ results: z.array(z.string()) }),
      run: async ({ query }) => searchDocs(query),
    },
  })
  .agents({
    supportAgent: {
      model: 'fast',
      tools: ['searchDocs'],
      instructions: 'Answer only from approved documentation.',
    },
  })
\`\`\`

Prefer a narrow first agent over a generic assistant. The harness should make the allowed behavior obvious in code review.`,
	},
	{
		id: 'architecture',
		title: 'AI Harness Architecture',
		description: 'How models, tools, memory, agents, and runtime boundaries relate to each other.',
		body: `The harness separates provider access from application decisions.

## Components

- Models represent provider-backed inference capabilities.
- Tools expose controlled business operations.
- Agents combine instructions, model selection, tools, memory, and policy.
- Runtime adapters connect agents to HTTP, queues, jobs, or application flows.
- Optional durable runtime adapters checkpoint workflow progress locally and resume from the last committed step.
- Evaluation and observability close the production feedback loop.

## Design Rule

Keep every boundary explicit. A model should not decide which private system it can call; the agent definition and tool registry decide that.`,
	},
	{
		id: 'guardrails',
		title: 'Guardrails | AI Harness',
		description: 'Add typed, observable input, output, retrieval, tool, and sensitive-data guardrails to Harness default-loop agents.',
		body: `@purista/harness-guardrails is an optional addon for the Harness default agent loop. It uses a portable NVIDIA NeMo-shaped configuration vocabulary while keeping providers, credentials, vector stores, authorization, and business rules application-owned.

## Sensitive data

Use \`rails.config.sensitive_data_detection\` for exact entity, mask-token, and score-threshold policy, then bind an injected \`SensitiveDataDetector\` through \`createSensitiveDataActions({ detector })\`. YAML never contains detector endpoints, credentials, recognizers, cloud settings, or fallbacks.

- \`@purista/harness-guardrails-presidio\` calls original Presidio \`POST /analyze\` only through an application-owned authenticated internal HTTP(S) gateway. It supports Presidio deployment-side recognizers and converts Python code-point offsets to JavaScript UTF-16 indexes.
- \`@purista/harness-guardrails-native-privacy\` is local Rust/Node-API recognition for \`EMAIL_ADDRESS\`, \`PHONE_NUMBER\`, \`CREDIT_CARD\`, \`IP_ADDRESS\`, \`IBAN_CODE\`, \`US_SSN\`, and \`URL\`. Its prebuilds are tested under Node.js and Bun on macOS, Linux glibc, and Windows; unsupported platforms fail without a fallback.

Sensitive-data inspection is content-free and fail-closed. It creates a nested \`harness.sensitive_data.inspect\` GUARDRAIL span and inspection/duration metrics, but no model, token, or cost attributes. A nested standard LLM span remains the authoritative token/cost record for a model-backed check.

## What it protects

- Input before instructions, history, or a model call.
- Output before validation, persistence, or tool dispatch.
- TypeScript, MCP, and built-in tool input before permission, governance, validation, and side effects.
- Tool output before it returns to the model.
- Application-owned retrieval through an explicit filter call.

## Default setup

\`\`\`yaml
models:
  - type: main
    engine: harness
    model: assistant
rails:
  input:
    flows: [remove-secret-marker]
  tool_input:
    flows: [approve-transfer]
\`\`\`

\`\`\`typescript
const rails = defineGuardrails({
  config: await loadGuardrailsConfig('./guardrails'),
  modelAliases: { main: 'assistant' },
  actions: {
    'remove-secret-marker': {
      evaluate: ({ value }) => ({
        decision: 'transform',
        target: 'user_message',
        value: redact(value),
        reasonCode: 'secret_redacted',
      }),
    },
    'approve-transfer': {
      evaluate: ({ value }) => isApproved(value)
        ? { decision: 'allow' }
        : { decision: 'block', reasonCode: 'approval_required' },
    },
  },
})

const guardedSupport = rails.attach({
  model: 'assistant',
  instructions: 'Help safely.',
  tools: ['transfer_money'],
})
\`\`\`

## Workflow, tool, and skill boundary

A workflow gets automatic protection whenever it delegates to an attached default-loop agent. Retrieval remains application-owned, so filter chunks explicitly before giving them to an agent. Skills are mounted files; when an agent opens a skill through the built-in \`read\` tool, normal tool rails apply. The addon intentionally rejects custom-handler agents and does not intercept direct model calls, because those callers own their own model and tool lifecycle.

\`\`\`typescript
const chunks = await searchApprovedKnowledge(ctx.input.question)
const safeChunks = await rails.filterRetrievedChunks(chunks, {
  workflowId: ctx.workflowId,
  runId: ctx.runId,
  sessionId: ctx.sessionId,
  models: ctx.models,
  signal: ctx.signal,
  logger: ctx.log,
})

return ctx.agents.support({ question: ctx.input.question, context: safeChunks })
\`\`\`

## Observable by default

Each evaluation creates an \`evaluate_guardrail {id}\` OpenInference \`GUARDRAIL\` span plus a decision counter and duration histogram. Block is a successful control decision; an invalid action or timeout is an error. A model-backed check creates a nested standard LLM span containing provider, model, and reported input/output/total token usage. This makes safety-model spend attributable without recording content or inventing token counts or prices.

Use guardrails alongside Zod schemas, agent tool allowlists, permissions, governance, and business authorization. They control content and execution flow; they do not replace identity or deterministic business rules.`,
	},
	{
		id: 'adapters',
		title: 'AI Harness Adapters',
		description: 'Connect harness agents to runtime entry points without leaking provider-specific details.',
		body: `Adapters expose agents to application runtimes such as HTTP, service commands, queues, or scheduled jobs.

Use adapters to keep transport concerns outside the agent body. The agent should not know whether it was triggered by an API request, background job, or operator workflow.

Model providers use the same core outcome and retry shape across adapters. Short provider outages and rate limits can be retried actively; long provider retry windows are surfaced as typed metadata so queues or workers decide when to run again.

## Recommendations

- Validate input before invoking an agent.
- Preserve trace and correlation IDs.
- Keep user/session identity in trusted context, not prompt text.
- Route long \`retryAfterMs\` model errors through queue or workflow retry policy.
- Return streaming output only when the client workflow benefits from partial progress.
- Use queued execution for long-running or retryable work.`,
	},
	{
		id: 'memory',
		title: 'AI Harness Memory',
		description: 'Use memory deliberately with retention, scope, and privacy boundaries.',
		body: `Memory is architecture, not storage decoration.

Use memory only when the use case needs continuity across turns, sessions, or tasks. Define scope and retention explicitly.

## Safe Defaults

- Store the minimum useful context.
- Keep PII and confidential data out unless the business case and controls are explicit.
- Prefer summaries over raw transcripts.
- Separate tenant, user, and workflow scopes.
- Make deletion and audit behavior clear.`,
	},
	{
		id: 'durability',
		title: 'AI Harness Durability',
		description: 'Persist workflow progress, state, context checkpoints, leases, and workspace files.',
		body: `Durability is optional and adapter-based.

Use \`localDurableExecution({ root })\` when a workflow must survive process restarts without adding external infrastructure immediately. The bundle wires a SQLite state store, durable runtime, context checkpoint store, local workspace store, and host-directory sandbox under one root.

## What Gets Persisted

- Session state, messages, runs, and run events.
- Durable workflow checkpoints and leases.
- Context checkpoints written through \`ctx.checkpoints\`.
- Workspace files for active runs and checkpoint snapshots.

## Production Rule

Checkpoint only deterministic boundaries. External writes should be idempotent and recorded before the workflow commits the next durable checkpoint.`,
	},
	{
		id: 'security',
		title: 'AI Harness Security',
		description: 'Protect data, tools, and model interactions with explicit boundaries.',
		body: `Security starts at the tool boundary.

Agents should never receive broad ambient authority. Give each agent only the tools and data required for its use case.

## Production Checklist

- Redact secrets and sensitive payload fields before model calls.
- Keep authorization decisions outside the model.
- Use typed schemas for all tool inputs and outputs.
- Log metadata and decisions without leaking confidential content.
- Treat tool output as untrusted input when it returns external data.
- Add prompt-injection tests for agents that read user or third-party content.`,
	},
	{
		id: 'testing',
		title: 'AI Harness Testing',
		description: 'Test harness behavior with deterministic tools, mocked models, and regression cases.',
		body: `Test agents like production application code.

Use mocked models for deterministic paths and evaluation datasets for behavioral quality. Keep tool tests separate from model-behavior tests.

## What To Test

- Tool schema validation.
- Authorization and data minimization.
- Expected tool selection.
- Failure and retry behavior.
- Prompt-injection resistance.
- Output shape and refusal behavior for unsafe requests.`,
	},
	{
		id: 'evaluations',
		title: 'AI Harness Evaluations',
		description: 'Use evaluations to measure quality, safety, and regressions before rollout.',
		body: `Evaluations turn agent behavior into a release signal.

Create datasets from real use cases, support tickets, workflow traces, and known failure modes. Keep expected outcomes explicit.

## Evaluation Dimensions

- Correctness against approved sources.
- Tool-use precision.
- Privacy and data leakage prevention.
- Refusal behavior.
- Latency and cost.
- Stability across model upgrades.`,
	},
	{
		id: 'observability',
		title: 'AI Harness Observability',
		description: 'Trace model calls, tool use, failures, cost, and safety signals.',
		body: `Production agents need operational visibility.

Capture enough telemetry to debug behavior without logging sensitive data.

## Useful Signals

- Agent name and version.
- Model and provider.
- Provider finish status, normalized finish reason, retry kind, and retry-after metadata.
- Tool calls and outcomes.
- Token and cost estimates.
- Latency by model and tool.
- Safety filters and refusal decisions.
- Correlation IDs across PURISTA service calls.`,
	},
	{
		id: 'usage',
		title: 'AI Harness Usage Patterns',
		description: 'Choose the right execution style for interactive, background, and workflow-driven AI.',
		body: `Pick execution style from the user workflow.

- Use direct request/response for short deterministic work.
- Use streaming when partial output improves the user experience.
- Use queue-backed execution for long-running work or model failures that return deferred retry metadata.
- Use workflow orchestration for multi-step business processes with durable state.
- Use local durable checkpoints when a workflow must survive process restarts.

The model response mode should be an explicit application decision, not an implementation accident.`,
	},
	{
		id: 'use-cases',
		title: 'AI Harness Use Cases',
		description: 'Common production use cases for typed, observable AI agents.',
		body: `Good harness use cases have clear boundaries and measurable outcomes.

Examples:

- Support assistants limited to approved documentation.
- Back-office workflow copilots with audited tool calls.
- Document classification with typed output.
- Review assistants for policy, security, or compliance checks.
- Data enrichment pipelines with queue-backed retries.

Avoid generic assistants with broad system access. Start from one business workflow and expand deliberately.`,
	},
	{
		id: 'before-you-ship',
		title: 'Before You Ship AI Harness',
		description: 'Production readiness checklist for AI Harness applications.',
		body: `Before shipping, verify architecture, security, operations, and evaluation signals.

## Checklist

- Agent purpose and allowed tools are documented.
- Tool schemas are narrow and validated.
- Secrets and PII are redacted or blocked before model calls.
- Authorization is enforced outside the model.
- Logs avoid confidential payloads.
- Regression evaluations cover known failure modes.
- Model upgrades have a repeatable evaluation path.
- Runtime metrics include latency, errors, tokens, and cost.
- Fallback behavior is defined for provider failures.`,
	},
]

export function getHarnessMarkdownPage(id: string) {
	return harnessMarkdownPages.find(page => page.id === id)
}
