# AI Harness Runtime

Use this reference when implementing PURISTA agents.

## Current Model
`@purista/core` uses published `@purista/harness` to integrate agents into PURISTA services. Core does not expose the removed PURISTA AI protocol and does not adapt to Vercel AI SDK UI messages.

An attached agent is represented as normal PURISTA artifacts:
- queue for controlled concurrency/background execution
- queue worker for processing queued runs
- command for aggregate calls
- stream for live SSE events

## Builder Pattern
Use the CLI first for application code:

```bash
purista add agent triage --service support --service-version 1
```

Then refine the generated builder:

```ts
const triageAgent = supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .addPayloadSchema(payloadSchema)
  .addOutputSchema(outputSchema)
  .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
  .setRunFunction(async context => {
    return await classify(context)
  })
```

Execution definitions are mutually exclusive:
- `setHarnessAgent(...)`
- `setHarnessWorkflow(...)`
- `setRunFunction(...)`

## Runtime Wiring
Applications bind concrete models at service startup:

```ts
await service.addAgentDefinition(await triageAgent.getDefinition()).getInstance(eventBridge, {
  queueBridge,
  ai: {
    telemetry: { captureContent: false },
    models: {
      primary: { provider, model: 'gpt-4.1-mini', capabilities: ['object'] },
    },
  },
})
```

Startup fails fast when aliases or capabilities are missing.

Keep telemetry ownership explicit:
- PURISTA service metrics are configured through service runtime `metrics`
- existing PURISTA tracing continues to use `spanProcessor`
- harness telemetry options are passed through `ai.telemetry`

PURISTA records service and agent wrapper metrics. `@purista/harness` owns GenAI semantic-convention metrics, model metrics, token metrics, model call spans, and tool call spans/metrics. Do not re-record token usage or model/tool metrics in PURISTA handlers.

## Handler Context
Agent handlers use:
- `context.payload` and `context.parameter`
- `context.harness.models.<alias>` with capability-gated methods
- `context.harness.events.emit(...)`
- `context.invoke.tools[...]` for declared command tools
- `context.invoke.agents[...]` for declared child-agent aggregate calls
- `context.metrics` for service-level and agent-local custom metrics declared on builders
- `context.logger`

Agent-local metrics are declared with `AgentQueueBuilder.defineMetric(...)`:

```ts
const triageAgent = supportService
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})
	.setRunFunction(async context => {
		context.metrics['app.agent.escalations'].add(1, { priority: 'high' })
		return await classify(context)
	})
```

## Streaming
AI stream endpoints emit SSE `event`/`data` chunks. The data payload follows provider-style event names:
- `response.created`
- `response.in_progress`
- `response.output_text.delta`
- `response.output_json.delta`
- `response.output_json.done`
- `response.tool_call.started`
- `response.tool_call.completed`
- `response.completed`
- `error`

OpenAPI chunk schema comes from `agentSseEventSchema`.

## Multimodal
Use harness `ContentPart` and `agentContentPartSchema` for text, image, audio, and file content. Multimodal methods are capability-gated by model aliases such as `vision_input`, `audio_input`, and `file_input`.

## Testing
Use core testing helpers:
- `createAgentTestHarness(...)`
- `createScriptedHarnessModel()`
- `createAgentContextMock(...)`

Tests should verify output validation, model capability behavior, stream chunks, and declared invoke bridges.
