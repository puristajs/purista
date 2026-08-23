import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { runPuristaCommand } from '../engine.js'

const definitions = {
	version: '4.0.0-test',
	services: {
		Billing: {
			'1': {
				description: 'Billing boundaries',
				deprecated: false,
				commands: {},
				subscriptions: {},
				queues: {},
				queueWorkers: {
					orphan: {
						name: 'orphan',
						queueName: 'absent',
						mode: 'continuous',
						maxParallelHandlers: 1,
						invokes: {},
						streamInvokes: {},
						emitList: {},
						queueInvokes: {},
						agentInvokes: [],
					},
				},
			},
		},
	},
}

describe('architecture commands', () => {
	it('inspects and validates definitions through the same static Core diagnostic', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-architecture-'))
		try {
			writeFileSync(join(dir, 'purista.json'), JSON.stringify({ eventBridge: 'default' }))
			writeFileSync(join(dir, 'definitions.json'), JSON.stringify(definitions))

			const inspected = await runPuristaCommand(
				'inspect',
				{ definitions: 'definitions.json', out: 'architecture.json' },
				{ cwd: dir },
			)
			expect(inspected.ok).toBe(true)
			expect(inspected.output).toMatchObject({ kind: 'purista.architecture' })
			expect(inspected.createdFiles).toEqual([join(dir, 'architecture.json')])
			expect(JSON.parse(readFileSync(join(dir, 'architecture.json'), 'utf8'))).toMatchObject({
				kind: 'purista.architecture',
			})
			const agentView = await runPuristaCommand(
				'inspect',
				{ definitions: 'definitions.json', view: 'agent', scope: ['service:Billing/1'] },
				{ cwd: dir },
			)
			expect(agentView.output).toMatchObject({ kind: 'purista.architecture.context' })
			const diff = await runPuristaCommand(
				'diff',
				{ definitions: 'definitions.json', base: 'architecture.json' },
				{ cwd: dir },
			)
			expect(diff).toMatchObject({ ok: true, output: { kind: 'purista.architecture.diff', changes: [] } })
			const artifact = JSON.parse(readFileSync(join(dir, 'architecture.json'), 'utf8'))
			writeFileSync(
				join(dir, 'composition.json'),
				JSON.stringify({
					kind: 'purista.architecture.composition',
					version: '1.0.0',
					artifacts: [{ id: 'billing', digest: artifact.digest }],
					bindings: [],
				}),
			)
			const composed = await runPuristaCommand(
				'compose',
				{ composition: 'composition.json', artifacts: ['architecture.json'] },
				{ cwd: dir },
			)
			expect(composed).toMatchObject({
				ok: true,
				output: { kind: 'purista.architecture.composition.diagnostics', diagnostics: [] },
			})

			const validated = await runPuristaCommand('validate', { definitions: 'definitions.json' }, { cwd: dir })
			expect(validated.ok).toBe(false)
			expect(validated.errors).toEqual(
				expect.arrayContaining([expect.objectContaining({ code: 'PURISTA_ARCH_QUEUE_WORKER_UNKNOWN_QUEUE' })]),
			)
			expect(validated.output).toMatchObject({ kind: 'purista.architecture.diagnostics' })

			const doctor = await runPuristaCommand('doctor', { definitions: 'definitions.json' }, { cwd: dir })
			expect(doctor.output).toMatchObject({
				kind: 'purista.doctor',
				mode: 'static',
				checks: { puristaConfig: 'loaded' },
			})
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})

	it('keeps inspect and validate independent from project configuration and reports doctor checks', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'purista-architecture-'))
		try {
			writeFileSync(join(dir, 'definitions.json'), JSON.stringify(definitions))

			await expect(
				runPuristaCommand('inspect', { definitions: 'definitions.json' }, { cwd: dir }),
			).resolves.toMatchObject({
				ok: true,
			})
			await expect(
				runPuristaCommand('validate', { definitions: 'definitions.json' }, { cwd: dir }),
			).resolves.toMatchObject({
				output: { kind: 'purista.architecture.diagnostics' },
			})

			const doctor = await runPuristaCommand('doctor', { definitions: 'definitions.json' }, { cwd: dir })
			expect(doctor.output).toMatchObject({
				checks: { definitions: 'loaded', puristaConfig: 'missing' },
			})

			const missingDefinitions = await runPuristaCommand('doctor', { definitions: 'missing.json' }, { cwd: dir })
			expect(missingDefinitions).toMatchObject({
				ok: false,
				output: {
					checks: { definitions: 'missing', puristaConfig: 'missing' },
				},
			})
			expect((missingDefinitions.output as { diagnostics: unknown[] }).diagnostics).toEqual(
				expect.arrayContaining([expect.objectContaining({ code: 'PURISTA_DOCTOR_DEFINITIONS_MISSING' })]),
			)
			expect(existsSync(join(dir, 'missing.json'))).toBe(false)
		} finally {
			rmSync(dir, { recursive: true, force: true })
		}
	})
})
