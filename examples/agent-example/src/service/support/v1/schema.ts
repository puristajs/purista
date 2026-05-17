import { z } from 'zod'

export const supportV1IncidentIdPayloadSchema = z.object({
	incidentId: z.string().min(1),
})

export const supportV1RunbookPayloadSchema = z.object({
	service: z.string().min(1),
})

export const supportV1DeploymentSchema = z.object({
	changeId: z.string().min(1),
	service: z.string().min(1),
	version: z.string().min(1),
	startedAt: z.string().datetime(),
	risk: z.enum(['low', 'medium', 'high']),
})

export const supportV1IncidentSnapshotSchema = z.object({
	incidentId: z.string().min(1),
	title: z.string().min(1),
	service: z.string().min(1),
	severity: z.enum(['sev1', 'sev2', 'sev3']),
	customerImpact: z.string().min(1),
	alerts: z.array(z.string().min(1)),
	logs: z.array(z.string().min(1)),
	deployments: z.array(supportV1DeploymentSchema),
	metrics: z.object({
		errorRatePercent: z.number(),
		latencyP95Ms: z.number(),
		affectedCustomers: z.number().int(),
	}),
})

export const supportV1IncidentRunbookSchema = z.object({
	service: z.string().min(1),
	summary: z.string().min(1),
	steps: z.array(z.string().min(1)),
	rollbackChecklist: z.array(z.string().min(1)),
	communicationTemplate: z.string().min(1),
})

export const supportV1SignalAnalysisInputPayloadSchema = supportV1IncidentIdPayloadSchema.extend({
	focus: z.string().min(1).optional(),
})

export const supportV1SignalAnalysisOutputPayloadSchema = z.object({
	rootCauseHypothesis: z.string().min(1),
	confidence: z.enum(['low', 'medium', 'high']),
	evidence: z.array(z.string().min(1)),
	nextDiagnostics: z.array(z.string().min(1)),
})

export const supportV1RollbackRiskInputPayloadSchema = supportV1IncidentIdPayloadSchema.extend({
	changeId: z.string().min(1),
})

export const supportV1RollbackRiskOutputPayloadSchema = z.object({
	riskLevel: z.enum(['low', 'medium', 'high']),
	blockers: z.array(z.string().min(1)),
	safeRollbackPlan: z.array(z.string().min(1)),
	sandboxNotes: z.string().min(1),
})

export const supportV1CoordinateIncidentInputPayloadSchema = supportV1IncidentIdPayloadSchema.extend({
	businessContext: z.string().min(1).optional(),
})

export const supportV1CreateIncidentBriefInputPayloadSchema = z.object({
	incidentId: z.string().min(1),
	severity: z.enum(['sev1', 'sev2', 'sev3']),
	summary: z.string().min(1),
	rollbackDecision: z.string().min(1),
	actionPlan: z.array(z.string().min(1)),
	customerUpdate: z.string().min(1),
})

export const supportV1CreateIncidentBriefOutputPayloadSchema = z.object({
	briefId: z.string().min(1),
	status: z.literal('stored'),
})

export const supportV1CoordinateIncidentOutputPayloadSchema = supportV1CreateIncidentBriefInputPayloadSchema.extend({
	rootCauseHypothesis: z.string().min(1),
	timeline: z.array(z.string().min(1)),
	briefId: z.string().min(1),
})

export const supportV1SignalAnalysisJsonSchema = {
	type: 'object',
	properties: {
		rootCauseHypothesis: { type: 'string' },
		confidence: { enum: ['low', 'medium', 'high'] },
		evidence: { type: 'array', items: { type: 'string' } },
		nextDiagnostics: { type: 'array', items: { type: 'string' } },
	},
	required: ['rootCauseHypothesis', 'confidence', 'evidence', 'nextDiagnostics'],
	additionalProperties: false,
}

export const supportV1RollbackRiskJsonSchema = {
	type: 'object',
	properties: {
		riskLevel: { enum: ['low', 'medium', 'high'] },
		blockers: { type: 'array', items: { type: 'string' } },
		safeRollbackPlan: { type: 'array', items: { type: 'string' } },
		sandboxNotes: { type: 'string' },
	},
	required: ['riskLevel', 'blockers', 'safeRollbackPlan', 'sandboxNotes'],
	additionalProperties: false,
}

export const supportV1CoordinateIncidentJsonSchema = {
	type: 'object',
	properties: {
		incidentId: { type: 'string' },
		severity: { enum: ['sev1', 'sev2', 'sev3'] },
		summary: { type: 'string' },
		rootCauseHypothesis: { type: 'string' },
		timeline: { type: 'array', items: { type: 'string' } },
		rollbackDecision: { type: 'string' },
		actionPlan: { type: 'array', items: { type: 'string' } },
		customerUpdate: { type: 'string' },
	},
	required: [
		'incidentId',
		'severity',
		'summary',
		'rootCauseHypothesis',
		'timeline',
		'rollbackDecision',
		'actionPlan',
		'customerUpdate',
	],
	additionalProperties: false,
}

export type SupportV1IncidentSnapshot = z.output<typeof supportV1IncidentSnapshotSchema>
export type SupportV1IncidentRunbook = z.output<typeof supportV1IncidentRunbookSchema>
export type SupportV1SignalAnalysisInputPayload = z.input<typeof supportV1SignalAnalysisInputPayloadSchema>
export type SupportV1SignalAnalysisOutputPayload = z.output<typeof supportV1SignalAnalysisOutputPayloadSchema>
export type SupportV1RollbackRiskInputPayload = z.input<typeof supportV1RollbackRiskInputPayloadSchema>
export type SupportV1RollbackRiskOutputPayload = z.output<typeof supportV1RollbackRiskOutputPayloadSchema>
export type SupportV1CoordinateIncidentInputPayload = z.input<typeof supportV1CoordinateIncidentInputPayloadSchema>
export type SupportV1CoordinateIncidentOutputPayload = z.output<typeof supportV1CoordinateIncidentOutputPayloadSchema>
export type SupportV1CreateIncidentBriefInputPayload = z.input<typeof supportV1CreateIncidentBriefInputPayloadSchema>
