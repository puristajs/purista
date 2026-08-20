import {
	supportV1CoordinateIncidentInputPayloadSchema,
	supportV1CoordinateIncidentJsonSchema,
	supportV1CoordinateIncidentOutputPayloadSchema,
	supportV1CreateIncidentBriefInputPayloadSchema,
	supportV1CreateIncidentBriefOutputPayloadSchema,
	supportV1IncidentIdPayloadSchema,
	supportV1IncidentRunbookSchema,
	supportV1IncidentSnapshotSchema,
	supportV1RollbackRiskInputPayloadSchema,
	supportV1RollbackRiskOutputPayloadSchema,
	supportV1RunbookPayloadSchema,
	supportV1SignalAnalysisInputPayloadSchema,
	supportV1SignalAnalysisOutputPayloadSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const coordinateIncidentResponseAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('coordinateIncidentResponse', 'Coordinates a multi-agent incident response workflow')
	.addPayloadSchema(supportV1CoordinateIncidentInputPayloadSchema)
	.addOutputSchema(supportV1CoordinateIncidentOutputPayloadSchema)
	.addModel('primary', {
		model: 'gpt-4.1-mini',
		capabilities: ['object'] as const,
		defaults: { temperature: 0.2 },
	})
	.canInvoke('Support', '1', 'getIncidentSnapshot', {
		payloadSchema: supportV1IncidentIdPayloadSchema,
		outputSchema: supportV1IncidentSnapshotSchema,
	})
	.canInvoke('Support', '1', 'getRunbook', {
		payloadSchema: supportV1RunbookPayloadSchema,
		outputSchema: supportV1IncidentRunbookSchema,
	})
	.canInvoke('Support', '1', 'createIncidentBrief', {
		payloadSchema: supportV1CreateIncidentBriefInputPayloadSchema,
		outputSchema: supportV1CreateIncidentBriefOutputPayloadSchema,
	})
	.canInvokeAgent('analyzeSignals', '1', {
		payloadSchema: supportV1SignalAnalysisInputPayloadSchema,
		outputSchema: supportV1SignalAnalysisOutputPayloadSchema,
	})
	.canInvokeAgent('assessRollbackRisk', '1', {
		payloadSchema: supportV1RollbackRiskInputPayloadSchema,
		outputSchema: supportV1RollbackRiskOutputPayloadSchema,
	})
	.useSkills(['incident-command', 'customer-communication', 'rollback-decisioning'], 'incident-response-skills')
	// Incident conversations can be revisited for weeks, but their durable
	// transcript, run summaries, and event trail must not grow without bound.
	// History retention is complete-turn based; it does not approximate model
	// tokens or change the provider's transient context-window selection.
	.setConversation('incidentId', {
		scope: 'service',
		retention: {
			idleTtlMs: 30 * 24 * 60 * 60_000,
			history: { maxTurns: 50, maxBytes: 256_000 },
			runs: { maxPerSession: 20 },
			events: { maxPerRun: 500 },
		},
	})
	.setExecutionProfile('longRunning', { maxRuntimeMs: 10 * 60_000, strict: true })
	.exposeAsHttpEndpoint('POST', 'incident-response', { streamingMode: 'aggregate' })
	.makeEndpointPublic()
	.setRunFunction(async context => {
		const snapshot = await context.invoke.tools['Support.1.getIncidentSnapshot'].call({
			incidentId: context.payload.incidentId,
		})
		const runbook = await context.invoke.tools['Support.1.getRunbook'].call({ service: snapshot.service })
		const primaryChange = snapshot.deployments[0]
		const signalAnalysis = await context.invoke.agents['analyzeSignals.1'].run({
			incidentId: context.payload.incidentId,
			focus: 'Find the most likely customer-impacting cause and cite concrete evidence.',
		})
		const rollbackRisk = await context.invoke.agents['assessRollbackRisk.1'].run({
			incidentId: context.payload.incidentId,
			changeId: primaryChange?.changeId ?? 'unknown',
		})
		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'system',
						content:
							'You are the incident commander. Produce an operator-ready plan based on deterministic tools and specialist agent findings.',
					},
					{
						role: 'user',
						content: JSON.stringify(
							{ businessContext: context.payload.businessContext, snapshot, runbook, signalAnalysis, rollbackRisk },
							null,
							2,
						),
					},
				],
				schema: supportV1CoordinateIncidentJsonSchema,
			},
			context.signal,
		)
		const draft = supportV1CreateIncidentBriefInputPayloadSchema.parse(result.object)
		const plan = supportV1CoordinateIncidentOutputPayloadSchema.omit({ briefId: true }).parse(result.object)
		const stored = await context.invoke.tools['Support.1.createIncidentBrief'].call(draft)

		return supportV1CoordinateIncidentOutputPayloadSchema.parse({
			...plan,
			briefId: stored.briefId,
		})
	})
