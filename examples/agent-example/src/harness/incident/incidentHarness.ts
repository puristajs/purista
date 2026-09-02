import { defineHarness } from '@purista/harness'
import { z } from 'zod'

import {
	supportV1IncidentIdPayloadSchema,
	supportV1IncidentRunbookSchema,
	supportV1IncidentSnapshotSchema,
	supportV1RollbackReviewActionSchema,
	supportV1RollbackReviewWorkflowOutputSchema,
	supportV1RunbookPayloadSchema,
	supportV1SignalAnalysisInputPayloadSchema,
	supportV1SignalAnalysisOutputPayloadSchema,
} from '../../service/support/v1/schema.js'

export const supportV1TriageTicketInputPayloadSchema = z.object({
	ticketId: z.string().min(1),
	text: z.string().min(1),
})

export const supportV1TriageTicketOutputPayloadSchema = z.object({
	priority: z.enum(['low', 'normal', 'high']),
	reason: z.string().min(1),
})

/**
 * Native Harness definition shared by standalone tests and the PURISTA mount.
 * It contains no provider credentials or deployment adapters.
 */
export const incidentHarness = defineHarness({ name: 'incident-support' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.hostTool('get_incident_snapshot', {
		kind: 'host',
		description: 'Load the trusted alert, log, deployment, and metric snapshot for an incident.',
		input: supportV1IncidentIdPayloadSchema,
		output: supportV1IncidentSnapshotSchema,
	})
	.hostTool('get_runbook', {
		kind: 'host',
		description: 'Load the trusted operational runbook for a service.',
		input: supportV1RunbookPayloadSchema,
		output: supportV1IncidentRunbookSchema,
	})
	.agent('triage_ticket', {
		model: 'primary',
		input: supportV1TriageTicketInputPayloadSchema,
		output: supportV1TriageTicketOutputPayloadSchema,
		updates: 'object-snapshot',
		instructions: 'Classify the support ticket as low, normal, or high priority and give one concise reason.',
	})
	.agent('analyze_signals', {
		model: 'primary',
		input: supportV1SignalAnalysisInputPayloadSchema,
		output: supportV1SignalAnalysisOutputPayloadSchema,
		updates: 'object-snapshot',
		tools: ['get_incident_snapshot'],
		instructions:
			'Call get_incident_snapshot for the supplied incident id. Use only that evidence to rank a root-cause hypothesis and propose the next diagnostics.',
	})
	.workflow('review_rollback', {
		input: supportV1RollbackReviewActionSchema,
		output: supportV1RollbackReviewWorkflowOutputSchema,
		handler: async context => {
			const action = await context.step('bind-reviewed-action-v1', async () => context.input)
			const outcome = await context.externalWait.wait({
				waitId: `rollback-review:${action.reviewId}`,
				kind: 'human_review',
				schemaVersion: 'rollback-review-v1',
				definitionVersion: 'support-v1',
				deadline: action.expiresAt,
			})
			return { status: outcome.status, reviewId: action.reviewId }
		},
	})
	.define()
