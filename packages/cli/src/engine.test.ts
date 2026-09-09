import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { PuristaCliValidationError } from './core/errors.js'
import { createPuristaCliEngine } from './engine.js'

let TEST_DIR = ''

const createMinimalProject = () => {
	TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-engine-'))
	writeFileSync(join(TEST_DIR, 'package.json'), JSON.stringify({ name: 'test-project', type: 'module' }))
	mkdirSync(join(TEST_DIR, 'src', 'service'), { recursive: true })
	writeFileSync(
		join(TEST_DIR, 'purista.json'),
		JSON.stringify({
			runtime: 'node',
			eventBridge: 'default',
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			linter: 'none',
			formatter: 'none',
			servicePath: 'src/service',
		}),
	)
	writeFileSync(
		join(TEST_DIR, 'src', 'service', 'serviceEvent.enum.ts'),
		'export enum ServiceEvent { Example = "example" }\n',
	)
}

const snapshotFiles = (directory: string): [string, string][] =>
	readdirSync(directory, { withFileTypes: true })
		.flatMap(entry =>
			entry.isDirectory()
				? snapshotFiles(join(directory, entry.name))
				: [[join(directory, entry.name), readFileSync(join(directory, entry.name), 'utf8')] as [string, string]],
		)
		.sort(([a], [b]) => a.localeCompare(b))

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
		TEST_DIR = ''
	}
})

describe('createPuristaCliEngine', () => {
	it('runs add-service programmatically in non-interactive mode', async () => {
		createMinimalProject()
		const engine = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'non-interactive',
		})

		const result = await engine.runPuristaCommand('add-service', {
			name: 'user',
			description: 'User service',
		})

		expect(result.ok).toBe(true)
		expect(result.command).toBe('add-service')
		expect(result.createdFiles.length + result.updatedFiles.length).toBeGreaterThan(0)
	})

	it('accepts the CLI service-version spelling when adding another service version', async () => {
		createMinimalProject()
		const engine = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'non-interactive',
		})

		const result = await engine.runPuristaCommand('add-service', {
			name: 'user',
			description: 'User service',
			serviceVersion: '2',
		})

		expect(result.ok).toBe(true)
		expect(existsSync(join(TEST_DIR, 'src', 'service', 'user', 'v2', 'userV2Service.ts'))).toBe(true)
	})

	it('fails fast when a non-interactive required value is missing', async () => {
		createMinimalProject()
		const engine = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'non-interactive',
		})

		await expect(
			engine.runPuristaCommand('add-service', {
				name: 'user',
			}),
		).rejects.toBeInstanceOf(PuristaCliValidationError)
	})

	it('runs init-project through the blueprint engine', async () => {
		TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-init-'))
		const engine = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'non-interactive',
		})

		const result = await engine.runPuristaCommand('init-project', {
			target: 'my-app',
			runtime: 'node',
			eventBridge: 'default',
			useWebserver: true,
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			linter: 'biome',
			formatter: 'biome',
			packageManager: 'npm',
			installDependencies: false,
		})

		expect(result.ok).toBe(true)
		expect(result.command).toBe('init-project')
		expect(result.createdFiles).toContain(join(TEST_DIR, 'my-app', 'src', 'index.ts'))
		expect(readFileSync(join(TEST_DIR, 'my-app', 'src', 'eventbridge.ts'), 'utf-8')).toContain('DefaultEventBridge')
		expect(readFileSync(join(TEST_DIR, 'my-app', 'src', 'http.ts'), 'utf-8')).toContain('getHttpServer')
		expect(readFileSync(join(TEST_DIR, 'my-app', 'purista.json'), 'utf-8')).toContain('"eventBridge": "default"')
	})

	it.each(['agent-first', 'workflow-first', 'harness-first'])('composes one Harness in %s order', async order => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
		if (order === 'harness-first') {
			const result = await engine.runPuristaCommand('add-harness', common)
			expect(result.createdFiles).toContain(join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.ts'))
		}
		for (const kind of order === 'workflow-first'
			? (['workflow', 'agent'] as const)
			: (['agent', 'workflow'] as const)) {
			const result = await engine.runPuristaCommand(kind === 'agent' ? 'add-agent' : 'add-workflow', {
				...common,
				name: kind === 'agent' ? 'answer ticket' : 'resolve ticket',
			})
			expect(result.ok).toBe(true)
		}
		const service = readFileSync(join(TEST_DIR, 'src/service/support/v1/supportV1Service.ts'), 'utf8')
		expect(service.match(/\.mountHarness\(/g)).toHaveLength(1)
		const harness = readFileSync(join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.ts'), 'utf8')
		expect(harness).toContain('.addAgent(answerTicketAgent)')
		expect(harness).toContain('.addWorkflow(resolveTicketWorkflow)')
		expect(existsSync(join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.test.ts'))).toBe(false)
	})

	it.each([
		'service',
		'noncanonical-arguments',
		'harness-options',
		'unresolved-root',
		'harness',
		'duplicate-path',
		'duplicate-id',
		'duplicate-symbol',
		'package',
		'wrong-mount',
		'invalid-name',
		'response-event',
	])('rejects %s before any project mutation', async failure => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
		await engine.runPuristaCommand('add-agent', { ...common, name: 'answer ticket' })
		const directory = join(TEST_DIR, 'src/service/support/v1')
		const serviceFile = join(directory, 'supportV1Service.ts')
		const harnessFile = join(directory, 'harness/supportHarness.ts')
		if (failure === 'service')
			writeFileSync(
				serviceFile,
				readFileSync(serviceFile, 'utf8').replace(
					'export const supportV1Service = supportV1ServiceBuilder',
					'export const supportV1Service = customize(supportV1ServiceBuilder)',
				),
			)
		if (failure === 'wrong-mount')
			writeFileSync(
				serviceFile,
				readFileSync(serviceFile, 'utf8').replace('.mountHarness(supportHarness)', '.mountHarness(otherHarness)'),
			)
		if (failure === 'harness') writeFileSync(harnessFile, `${readFileSync(harnessFile, 'utf8').trim()}\n.define()\n`)
		if (failure === 'duplicate-symbol')
			writeFileSync(harnessFile, `${readFileSync(harnessFile, 'utf8')}\nconst resolveTicketWorkflow = {}\n`)
		if (failure === 'noncanonical-arguments')
			writeFileSync(serviceFile, readFileSync(serviceFile, 'utf8').replace('...commandDefinitions', 'customCommand()'))
		if (failure === 'harness-options')
			writeFileSync(
				harnessFile,
				readFileSync(harnessFile, 'utf8').replace('defineHarness({ name: "support" })', 'defineHarness(options)'),
			)
		if (failure === 'unresolved-root')
			writeFileSync(
				harnessFile,
				readFileSync(harnessFile, 'utf8').replace('.addAgent(answerTicketAgent)', '.addAgent(missingAgent)'),
			)
		if (failure === 'package') writeFileSync(join(TEST_DIR, 'package.json'), '{ invalid')
		const before = snapshotFiles(TEST_DIR)
		const request = engine.runPuristaCommand(failure === 'duplicate-path' ? 'add-agent' : 'add-workflow', {
			...common,
			name:
				failure.startsWith('duplicate-') && failure !== 'duplicate-symbol'
					? 'answer ticket'
					: failure === 'invalid-name'
						? '123'
						: 'resolve ticket',
			...(failure === 'response-event' ? { responseEventName: 'completed' } : {}),
		})
		await expect(request).rejects.toThrow()
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})

	it.each([
		['add-agent', 'define agent', 'support'],
		['add-workflow', 'define workflow', 'support'],
		['add-harness', undefined, 'define'],
		['add-agent', 'answer', 'define'],
		['add-workflow', 'resolve', 'define'],
	] as const)(
		'rejects factory identifier collisions for %s %s in %s before mutation',
		async (command, name, serviceName) => {
			createMinimalProject()
			const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
			await engine.runPuristaCommand('add-service', { name: serviceName, description: 'Support' })
			const before = snapshotFiles(TEST_DIR)
			await expect(
				engine.runPuristaCommand(command, { name, serviceName, serviceVersion: '1', description: 'Help' }),
			).rejects.toThrow('collides with the imported')
			expect(snapshotFiles(TEST_DIR)).toEqual(before)
		},
	)

	it.each(['default', 'namespace'] as const)(
		'rejects an existing %s import local binding before mutation',
		async kind => {
			createMinimalProject()
			const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
			await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
			const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
			await engine.runPuristaCommand('add-agent', { ...common, name: 'answer ticket' })
			const harnessFile = join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.ts')
			const binding = kind === 'default' ? 'resolveTicketWorkflow' : '* as resolveTicketWorkflow'
			writeFileSync(harnessFile, `import ${binding} from 'node:path'\n${readFileSync(harnessFile, 'utf8')}`)
			const before = snapshotFiles(TEST_DIR)
			await expect(engine.runPuristaCommand('add-workflow', { ...common, name: 'resolve ticket' })).rejects.toThrow(
				'that identifier already exists',
			)
			expect(snapshotFiles(TEST_DIR)).toEqual(before)
		},
	)

	it.each([
		['add-command', 'add-agent'],
		['add-command', 'add-workflow'],
		['add-stream', 'add-agent'],
		['add-stream', 'add-workflow'],
	] as const)('rejects a %s target collision for %s before mutation', async (existingCommand, newCommand) => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const input = {
			name: 'resolve ticket',
			serviceName: 'support',
			serviceVersion: '1',
			description: 'Resolve a ticket',
		}
		await engine.runPuristaCommand(existingCommand, input)
		const before = snapshotFiles(TEST_DIR)
		await expect(engine.runPuristaCommand(newCommand, input)).rejects.toThrow(
			'Target id "resolveTicket" already exists',
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})

	it.each(['command', 'stream'] as const)(
		'preflights static and unresolved %s target ids without mutation',
		async kind => {
			createMinimalProject()
			const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
			await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
			const input = { name: 'resolve ticket', serviceName: 'support', serviceVersion: '1', description: 'Resolve' }
			await engine.runPuristaCommand(kind === 'command' ? 'add-command' : 'add-stream', input)
			const factory = kind === 'command' ? 'getCommandBuilder' : 'getStreamBuilder'
			const suffix = kind === 'command' ? 'Command' : 'Stream'
			const file = join(TEST_DIR, `src/service/support/v1/${kind}/resolveTicket/resolveTicket${suffix}Builder.ts`)
			const original = readFileSync(file, 'utf8')
			for (const [prefix, idExpression, error] of [
				['', '`resolveTicket`', 'Target id "resolveTicket" already exists'],
				["const targetId = 'resolveTicket' as const;\n", 'targetId', 'Target id "resolveTicket" already exists'],
				[
					'const originalId = `resolveTicket`; const targetId = (originalId);\n',
					'targetId',
					'Target id "resolveTicket" already exists',
				],
				["let targetId = 'resolveTicket';\n", 'targetId', 'Cannot statically prove'],
				['', 'getRuntimeTargetId()', 'Cannot statically prove'],
				['const targetId = otherId; const otherId = targetId;\n', 'targetId', 'Cannot statically prove'],
			]) {
				const source = original.replace(new RegExp(`${factory}\\(["']resolveTicket["']`), `${factory}(${idExpression}`)
				expect(source).not.toBe(original)
				writeFileSync(file, prefix + source)
				const before = snapshotFiles(TEST_DIR)
				await expect(engine.runPuristaCommand('add-workflow', input)).rejects.toThrow(error)
				expect(snapshotFiles(TEST_DIR)).toEqual(before)
			}
			writeFileSync(
				file,
				`const targetId = 'anotherTarget' as const;\n${original.replace(new RegExp(`${factory}\\(["']resolveTicket["']`), `${factory}(targetId`)}`,
			)
			await expect(engine.runPuristaCommand('add-workflow', input)).resolves.toMatchObject({ ok: true })
		},
	)

	it.each([
		'namespace resolveTicketWorkflow { export const value = 1 }',
		'module resolveTicketWorkflow { export const value = 1 }',
		'namespace existing { export const value = 1 }; import resolveTicketWorkflow = existing.value',
		'const { resolveTicketWorkflow } = { resolveTicketWorkflow: 1 }',
		'const [resolveTicketWorkflow] = [1]',
		'const { property: { resolveTicketWorkflow } } = { property: { resolveTicketWorkflow: 1 } }',
	])('rejects conflicting top-level binding %s without mutation', async declaration => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
		await engine.runPuristaCommand('add-agent', { ...common, name: 'answer' })
		const file = join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.ts')
		writeFileSync(file, `import * as path from 'node:path'\n${readFileSync(file, 'utf8')}\n${declaration}\n`)
		const before = snapshotFiles(TEST_DIR)
		await expect(engine.runPuristaCommand('add-workflow', { ...common, name: 'resolve ticket' })).rejects.toThrow(
			declaration.startsWith('module ') ? 'Cannot safely edit invalid TypeScript' : 'that identifier already exists',
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})

	it.each(['interface resolveTicketWorkflow {}', 'type resolveTicketWorkflow = string'])(
		'allows the distinct type-only declaration %s',
		async declaration => {
			createMinimalProject()
			const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
			await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
			const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
			await engine.runPuristaCommand('add-agent', { ...common, name: 'answer' })
			const file = join(TEST_DIR, 'src/service/support/v1/harness/supportHarness.ts')
			writeFileSync(file, `${readFileSync(file, 'utf8')}\n${declaration}\n`)
			await expect(
				engine.runPuristaCommand('add-workflow', { ...common, name: 'resolve ticket' }),
			).resolves.toMatchObject({ ok: true })
		},
	)

	it.each(['command', 'stream'] as const)('preflights %s factory access and call forms before mutation', async kind => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const input = { name: 'resolve ticket', serviceName: 'support', serviceVersion: '1', description: 'Resolve' }
		await engine.runPuristaCommand(kind === 'command' ? 'add-command' : 'add-stream', input)
		const factory = kind === 'command' ? 'getCommandBuilder' : 'getStreamBuilder'
		const suffix = kind === 'command' ? 'Command' : 'Stream'
		const file = join(TEST_DIR, `src/service/support/v1/${kind}/resolveTicket/resolveTicket${suffix}Builder.ts`)
		const original = readFileSync(file, 'utf8')
		const member = new RegExp(`supportV1ServiceBuilder\\s*\\.${factory}`)
		for (const [prefix, expression, expected] of [
			['', `supportV1ServiceBuilder['${factory}']`, 'Target id "resolveTicket" already exists'],
			['', `(supportV1ServiceBuilder.${factory})`, 'Target id "resolveTicket" already exists'],
			['', `supportV1ServiceBuilder?.['${factory}']`, 'Target id "resolveTicket" already exists'],
			['', `(supportV1ServiceBuilder['${factory}'])?.`, 'Target id "resolveTicket" already exists'],
			['', `supportV1ServiceBuilder.${factory}?.`, 'Target id "resolveTicket" already exists'],
			[
				`const method = '${factory}' as const;\n`,
				'supportV1ServiceBuilder[method]',
				'Target id "resolveTicket" already exists',
			],
			['const method = getRuntimeMethod();\n', 'supportV1ServiceBuilder[method]', 'Cannot statically prove'],
			['', `supportV1ServiceBuilder.${factory}.call`, 'Cannot statically prove'],
		]) {
			const rewritten = original.replace(member, expression)
			expect(rewritten).not.toBe(original)
			writeFileSync(file, prefix + rewritten)
			const before = snapshotFiles(TEST_DIR)
			await expect(engine.runPuristaCommand('add-workflow', input)).rejects.toThrow(expected)
			expect(snapshotFiles(TEST_DIR)).toEqual(before)
		}
	})

	it.each(['command', 'stream'] as const)('refuses detached %s factory references before mutation', async kind => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const input = { name: 'resolve ticket', serviceName: 'support', serviceVersion: '1', description: 'Resolve' }
		await engine.runPuristaCommand(kind === 'command' ? 'add-command' : 'add-stream', input)
		const factory = kind === 'command' ? 'getCommandBuilder' : 'getStreamBuilder'
		const suffix = kind === 'command' ? 'Command' : 'Stream'
		const file = join(TEST_DIR, `src/service/support/v1/${kind}/resolveTicket/resolveTicket${suffix}Builder.ts`)
		const original = readFileSync(file, 'utf8')
		const invocation = new RegExp(`supportV1ServiceBuilder\\s*\\.${factory}\\(`)
		for (const [prefix, expression] of [
			[`let make = supportV1ServiceBuilder.${factory};\n`, 'make('],
			[`const make = supportV1ServiceBuilder['${factory}'];\n`, 'make('],
			[`const { ${factory}: make } = supportV1ServiceBuilder;\n`, 'make('],
			[`let { ${factory} } = supportV1ServiceBuilder;\n`, `${factory}(`],
			[`const { ['${factory}']: make } = supportV1ServiceBuilder;\n`, 'make('],
			['const key = getRuntimeMethod(); const { [key]: make } = supportV1ServiceBuilder;\n', 'make('],
			[`let make; ({ ${factory}: make } = supportV1ServiceBuilder);\n`, 'make('],
			['const { ...methods } = supportV1ServiceBuilder;\n', `methods.${factory}(`],
			['let methods; ({ ...methods } = supportV1ServiceBuilder);\n', `methods.${factory}(`],
			['', `supportV1ServiceBuilder.${factory}.call(supportV1ServiceBuilder, `],
			['', `supportV1ServiceBuilder.${factory}.bind(supportV1ServiceBuilder)(`],
		]) {
			const rewritten = original.replace(invocation, expression)
			expect(rewritten).not.toBe(original)
			writeFileSync(file, prefix + rewritten)
			const before = snapshotFiles(TEST_DIR)
			await expect(engine.runPuristaCommand('add-workflow', input)).rejects.toThrow('Cannot statically prove')
			expect(snapshotFiles(TEST_DIR)).toEqual(before)
		}
	})

	it.each([
		['import type { supportHarness }', true],
		['import { type supportHarness }', true],
		['import type { supportHarness }', false],
		['import { type supportHarness }', false],
	] as const)('rejects %s with mounted=%s before mutation', async (typeImport, mounted) => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const common = { serviceName: 'support', serviceVersion: '1', description: 'Help' }
		await engine.runPuristaCommand('add-agent', { ...common, name: 'answer' })
		const file = join(TEST_DIR, 'src/service/support/v1/supportV1Service.ts')
		let source = readFileSync(file, 'utf8').replace('import { supportHarness }', typeImport)
		if (!mounted) source = source.replace('.mountHarness(supportHarness)', '')
		writeFileSync(file, source)
		const before = snapshotFiles(TEST_DIR)
		await expect(engine.runPuristaCommand('add-workflow', { ...common, name: 'resolve ticket' })).rejects.toThrow()
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})

	it('reports exact manual composition and leaves the first-root project untouched', async () => {
		createMinimalProject()
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-service', { name: 'support', description: 'Support' })
		const serviceFile = join(TEST_DIR, 'src/service/support/v1/supportV1Service.ts')
		writeFileSync(serviceFile, 'export const supportV1Service = customize()\n')
		const before = snapshotFiles(TEST_DIR)
		await expect(
			engine.runPuristaCommand('add-agent', {
				serviceName: 'support',
				serviceVersion: '1',
				name: 'answer',
				description: 'Answer',
			}),
		).rejects.toThrow(
			"Import { supportHarness } from './harness/supportHarness.js' and add .mountHarness(supportHarness)",
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})

	it('uses project casing, a custom service path and isolated service versions', async () => {
		createMinimalProject()
		const config = JSON.parse(readFileSync(join(TEST_DIR, 'purista.json'), 'utf8'))
		config.fileConvention = 'kebab'
		config.servicePath = 'src/domains'
		writeFileSync(join(TEST_DIR, 'purista.json'), JSON.stringify(config))
		mkdirSync(join(TEST_DIR, 'src/domains'), { recursive: true })
		writeFileSync(join(TEST_DIR, 'src/domains/service-event.enum.ts'), 'export enum ServiceEvent {}')
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		for (const serviceVersion of ['1', '2']) {
			await engine.runPuristaCommand('add-service', {
				name: 'customer support',
				description: 'Support',
				serviceVersion,
			})
			await engine.runPuristaCommand('add-harness', {
				name: 'supportDesk',
				serviceName: 'customer-support',
				serviceVersion,
			})
			await engine.runPuristaCommand('add-agent', {
				name: 'answer ticket',
				description: 'Answer',
				serviceName: 'customer-support',
				serviceVersion,
			})
			await engine.runPuristaCommand('add-workflow', {
				name: 'resolve ticket',
				description: 'Resolve',
				serviceName: 'customer-support',
				serviceVersion,
			})
			const directory = join(TEST_DIR, 'src/domains/customer-support', `v${serviceVersion}`, 'harness')
			expect(readFileSync(join(directory, 'agent/answer-ticket/answer-ticket-agent.ts'), 'utf8')).toContain(
				"defineAgent('answerTicket'",
			)
			expect(readFileSync(join(directory, 'workflow/resolve-ticket/resolve-ticket-workflow.ts'), 'utf8')).toContain(
				"defineWorkflow('resolveTicket'",
			)
			expect(readFileSync(join(directory, 'customer-support-harness.ts'), 'utf8')).toContain('supportDesk')
		}
	})

	it('rejects legacy CommonJS project generation input', async () => {
		TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-init-'))
		const engine = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'non-interactive',
		})

		await expect(
			engine.runPuristaCommand('init-project', {
				target: 'my-app',
				runtime: 'node',
				eventBridge: 'default',
				useWebserver: false,
				fileConvention: 'camel',
				eventConvention: 'dotCase',
				linter: 'biome',
				formatter: 'biome',
				type: 'commonjs',
				packageManager: 'npm',
				installDependencies: false,
			}),
		).rejects.toBeInstanceOf(PuristaCliValidationError)
	})
})
