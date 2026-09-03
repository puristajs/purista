import { reportingV1ServiceBuilder } from '../reportingV1ServiceBuilder.js'
import { dailyStatementDueEventName } from './dailyStatementOccurrence.js'

export const dailyStatementSchedule = reportingV1ServiceBuilder
	.getScheduleBuilder('dailyStatement', 'Emit one daily statement occurrence')
	.emitEvent(dailyStatementDueEventName, {
		expression: { kind: 'cron', value: '0 6 * * *' },
		timezone: 'Europe/Berlin',
		concurrencyPolicy: 'forbid',
		missedRunPolicy: 'skip',
		idempotencyKey: 'event.id',
		enabledByDefault: false,
	})
