import { ScheduleDefinitionBuilder } from './ScheduleDefinitionBuilder.impl.js'

describe('ScheduleDefinitionBuilder', () => {
	it('creates provider-neutral event schedule definitions', () => {
		const definition = new ScheduleDefinitionBuilder('monthlyBillingCycle', 'Monthly billing trigger').emitEvent(
			'billing.monthlyCycleDue',
			{
				expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
				concurrencyPolicy: 'forbid',
				missedRunPolicy: 'runOnce',
			},
		)

		expect(definition).toMatchObject({
			name: 'monthlyBillingCycle',
			targetKind: 'event',
			targetName: 'billing.monthlyCycleDue',
			concurrencyPolicy: 'forbid',
			missedRunPolicy: 'runOnce',
			enabledByDefault: true,
		})
	})
})
