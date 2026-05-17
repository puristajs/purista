import type {
	SupportV1CreateIncidentBriefInputPayload,
	SupportV1IncidentRunbook,
	SupportV1IncidentSnapshot,
} from '../service/support/v1/schema.js'

export class IncidentRepository {
	private readonly snapshots: Record<string, SupportV1IncidentSnapshot> = {
		'INC-2026-042': {
			incidentId: 'INC-2026-042',
			title: 'Checkout payment failures after gateway rollout',
			service: 'checkout-api',
			severity: 'sev2',
			customerImpact: 'Roughly 18% of card payments fail for EU customers during checkout.',
			alerts: [
				'payment_authorization_error_rate above 15% for 12 minutes',
				'checkout_api p95 latency above 2200ms',
				'card_declined_error spike started two minutes after gateway rollout',
			],
			logs: [
				'14:04Z deploy checkout-api change CHG-8821 completed on canary and eu-west workers',
				'14:06Z gateway adapter returned invalid idempotency key for retry attempt',
				'14:07Z payment_authorization_error_rate increased from 0.8% to 18.4%',
				'14:13Z support volume for checkout failures increased by 42 tickets',
			],
			deployments: [
				{
					changeId: 'CHG-8821',
					service: 'checkout-api',
					version: '2026.05.15-rc.3',
					startedAt: '2026-05-15T14:02:00.000Z',
					risk: 'medium',
				},
			],
			metrics: {
				errorRatePercent: 18.4,
				latencyP95Ms: 2240,
				affectedCustomers: 1260,
			},
		},
	}

	private readonly runbooks: Record<string, SupportV1IncidentRunbook> = {
		'checkout-api': {
			service: 'checkout-api',
			summary: 'Stabilize checkout first, then reconcile failed payment intents.',
			steps: [
				'Freeze further checkout-api deployments.',
				'Compare the latest gateway adapter change against the previous production version.',
				'If payment failures exceed 5% for more than 10 minutes, roll back the gateway adapter.',
				'Reprocess failed payment intents only after authorization errors return below 1%.',
			],
			rollbackChecklist: [
				'Confirm no database migration is coupled to the gateway adapter change.',
				'Disable canary promotion before rollback.',
				'Roll back eu-west workers first, then global workers.',
				'Keep idempotency-key validation enabled during rollback.',
			],
			communicationTemplate:
				'We are seeing elevated payment failures for some EU checkout attempts and are rolling back the suspected gateway change.',
		},
	}

	private readonly briefs: SupportV1CreateIncidentBriefInputPayload[] = []

	async getSnapshot(incidentId: string): Promise<SupportV1IncidentSnapshot> {
		const snapshot = this.snapshots[incidentId]
		if (!snapshot) {
			throw new Error(`Unknown incident "${incidentId}"`)
		}
		return snapshot
	}

	async getRunbook(service: string): Promise<SupportV1IncidentRunbook> {
		const runbook = this.runbooks[service]
		if (!runbook) {
			throw new Error(`Unknown service runbook "${service}"`)
		}
		return runbook
	}

	async createBrief(input: SupportV1CreateIncidentBriefInputPayload) {
		this.briefs.push(input)
		return {
			briefId: `BRIEF-${this.briefs.length.toString().padStart(3, '0')}`,
			status: 'stored' as const,
		}
	}
}
