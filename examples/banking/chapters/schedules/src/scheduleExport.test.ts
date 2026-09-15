import { readFile } from 'node:fs/promises'
import { expect, test } from 'vitest'

test('exports the suspended daily schedule contract', async () => {
	const manifest = JSON.parse(await readFile('purista.schedules.json', 'utf-8'))
	expect(manifest).toMatchObject({
		title: 'Example Bank schedules',
		version: '1.0.0',
		schedules: [{
			name: 'dailyStatement',
			targetKind: 'event',
			targetServiceName: 'Reporting',
			targetServiceVersion: '1',
			targetName: 'reporting.daily-statement.due.v1',
			expression: { kind: 'cron', value: '0 6 * * *' },
			timezone: 'Europe/Berlin',
			concurrencyPolicy: 'forbid',
			missedRunPolicy: 'skip',
			idempotencyKey: 'event.id',
			enabledByDefault: false,
		}],
	})
})
