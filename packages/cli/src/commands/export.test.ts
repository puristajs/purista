import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { runPuristaCommand } from '../engine.js'

describe('export command', () => {
	it('exports AsyncAPI from a definitions fixture without runtime services', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-export-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))
			writeFileSync(join(dir, 'definitions.json'), JSON.stringify({ version: '2.2.0', services: {} }))

			const result = await runPuristaCommand(
				'export-asyncapi',
				{ definitions: 'definitions.json', out: 'asyncapi.json', title: 'Fixture', version: '1.0.0' },
				{ cwd: dir },
			)

			expect(result.ok).toBe(true)
			expect(JSON.parse(readFileSync(join(dir, 'asyncapi.json'), 'utf-8'))).toMatchObject({
				asyncapi: '3.0.0',
				info: { title: 'Fixture', version: '1.0.0' },
			})
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})

	it('exports definition-only runtime capabilities from purista config', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-capabilities-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))

			const result = await runPuristaCommand(
				'export-runtime-capabilities',
				{ out: 'runtime.json', mode: 'definition-only' },
				{ cwd: dir },
			)

			expect(result.ok).toBe(true)
			expect(JSON.parse(readFileSync(join(dir, 'runtime.json'), 'utf-8'))).toMatchObject({
				mode: 'definition-only',
				eventBridge: { name: 'DefaultEventBridge' },
				queueBridge: { name: 'DefaultQueueBridge' },
			})
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})

	it('exports the CloudEvents mapping schema without service definitions', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-cloudevents-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))

			const result = await runPuristaCommand('export-cloudevents-schema', { out: 'cloudevents.json' }, { cwd: dir })

			expect(result.ok).toBe(true)
			expect(JSON.parse(readFileSync(join(dir, 'cloudevents.json'), 'utf-8'))).toMatchObject({
				title: 'PURISTA CloudEvents Mapping',
				required: ['specversion', 'id', 'source', 'type'],
			})
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})

	it('exports Kubernetes CronJob manifests from service definitions', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-kubernetes-cronjob-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))
			writeFileSync(
				join(dir, 'definitions.json'),
				JSON.stringify({
					version: '2.2.0',
					services: {
						BillingService: {
							'1': {
								commands: {},
								subscriptions: {},
								streams: {},
								queues: {},
								queueWorkers: {},
								schedules: {
									monthlyBilling: {
										name: 'monthlyBilling',
										targetKind: 'event',
										targetName: 'billing.monthly.due',
										targetServiceName: 'BillingService',
										targetServiceVersion: '1',
										expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
										concurrencyPolicy: 'forbid',
										missedRunPolicy: 'runOnce',
										enabledByDefault: true,
									},
								},
							},
						},
					},
				}),
			)

			const result = await runPuristaCommand(
				'export-kubernetes-cronjob',
				{
					definitions: 'definitions.json',
					out: 'cronjobs.json',
					triggerImage: 'curlimages/curl:8.8.0',
					triggerUrl: 'https://purista.example.test/schedules/{{targetKind}}/{{targetName}}',
				},
				{ cwd: dir },
			)

			expect(result.ok).toBe(true)
			expect(JSON.parse(readFileSync(join(dir, 'cronjobs.json'), 'utf-8'))).toMatchObject([
				{
					apiVersion: 'batch/v1',
					kind: 'CronJob',
					metadata: {
						name: 'monthlybilling',
						annotations: {
							'purista.dev/schedule-name': 'monthlyBilling',
							'purista.dev/target-kind': 'event',
							'purista.dev/target-name': 'billing.monthly.due',
						},
					},
					spec: {
						schedule: '0 2 1 * *',
						timeZone: 'Europe/Berlin',
						concurrencyPolicy: 'Forbid',
					},
				},
			])
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})

	it('rejects Kubernetes CronJob export without exactly one trigger shape', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-kubernetes-cronjob-invalid-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))
			writeFileSync(join(dir, 'definitions.json'), JSON.stringify({ version: '2.2.0', services: {} }))

			await expect(
				runPuristaCommand(
					'export-kubernetes-cronjob',
					{ definitions: 'definitions.json', out: 'cronjobs.json', triggerImage: 'curlimages/curl:8.8.0' },
					{ cwd: dir },
				),
			).rejects.toThrow('Unable to resolve command export-kubernetes-cronjob')

			await expect(
				runPuristaCommand(
					'export-kubernetes-cronjob',
					{
						definitions: 'definitions.json',
						out: 'cronjobs.json',
						triggerImage: 'curlimages/curl:8.8.0',
						triggerCommand: '/app/trigger',
						triggerUrl: 'https://purista.example.test',
					},
					{ cwd: dir },
				),
			).rejects.toThrow('Unable to resolve command export-kubernetes-cronjob')
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})
})
