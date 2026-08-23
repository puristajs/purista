import {
	supportV1IncidentIdPayloadSchema,
	supportV1IncidentRunbookSchema,
	supportV1IncidentSnapshotSchema,
	supportV1RollbackRiskInputPayloadSchema,
	supportV1RollbackRiskJsonSchema,
	supportV1RollbackRiskOutputPayloadSchema,
	supportV1RunbookPayloadSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const assessRollbackRiskAgentBuilder = supportV1ServiceBuilder
	.getAgentQueueBuilder('assessRollbackRisk', 'Evaluates rollback safety using runbooks and deployment metadata')
	.addPayloadSchema(supportV1RollbackRiskInputPayloadSchema)
	.addOutputSchema(supportV1RollbackRiskOutputPayloadSchema)
	.addModel('primary', {
		model: 'gpt-4.1-mini',
		capabilities: ['object'] as const,
		defaults: { temperature: 0.1 },
	})
	.canInvoke('Support', '1', 'getIncidentSnapshot', {
		payloadSchema: supportV1IncidentIdPayloadSchema,
		outputSchema: supportV1IncidentSnapshotSchema,
	})
	.canInvoke('Support', '1', 'getRunbook', {
		payloadSchema: supportV1RunbookPayloadSchema,
		outputSchema: supportV1IncidentRunbookSchema,
	})
	.useSkills(['rollback-safety-review', 'change-impact-analysis'], 'incident-response-skills')
	.setSandboxPolicy({ enabled: true })
	.useBuiltInTools(false)
	.setRunFunction(async context => {
		const snapshot = await context.invoke.tools['Support.1.getIncidentSnapshot'].call({
			incidentId: context.payload.incidentId,
		})
		const runbook = await context.invoke.tools['Support.1.getRunbook'].call({ service: snapshot.service })
		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'system',
						content:
							'You are the rollback risk specialist. Treat the sandbox policy as the only place where proposed scripts may be evaluated.',
					},
					{
						role: 'user',
						content: JSON.stringify({ changeId: context.payload.changeId, snapshot, runbook }, null, 2),
					},
				],
				schema: supportV1RollbackRiskJsonSchema,
			},
			context.signal,
		)

		return supportV1RollbackRiskOutputPayloadSchema.parse(result.object)
	})
