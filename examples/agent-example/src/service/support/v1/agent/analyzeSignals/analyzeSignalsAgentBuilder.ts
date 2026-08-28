import {
	supportV1IncidentIdPayloadSchema,
	supportV1IncidentSnapshotSchema,
	supportV1SignalAnalysisInputPayloadSchema,
	supportV1SignalAnalysisJsonSchema,
	supportV1SignalAnalysisOutputPayloadSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const analyzeSignalsAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('analyzeSignals', 'Finds the most likely incident cause from alerts, logs, and metrics')
	.addPayloadSchema(supportV1SignalAnalysisInputPayloadSchema)
	.addOutputSchema(supportV1SignalAnalysisOutputPayloadSchema)
	.addModel('primary', {
		capabilities: ['object'] as const,
		defaults: { temperature: 0.1 },
	})
	.canInvoke('Support', '1', 'getIncidentSnapshot', {
		payloadSchema: supportV1IncidentIdPayloadSchema,
		outputSchema: supportV1IncidentSnapshotSchema,
	})
	.useSkills(['incident-log-analysis', 'hypothesis-ranking'], 'incident-response-skills')
	.useBuiltInTools(false)
	.setRunFunction(async context => {
		const snapshot = await context.invoke.tools['Support.1.getIncidentSnapshot'].call({
			incidentId: context.payload.incidentId,
		})
		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'system',
						content:
							'You are the incident signals analyst. Use only the supplied alerts, logs, deployments, and metrics.',
					},
					{
						role: 'user',
						content: JSON.stringify({ focus: context.payload.focus, snapshot }, null, 2),
					},
				],
				schema: supportV1SignalAnalysisJsonSchema,
			},
			context.signal,
		)

		return supportV1SignalAnalysisOutputPayloadSchema.parse(result.object)
	})
