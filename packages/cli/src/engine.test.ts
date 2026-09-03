import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { PuristaCliValidationError } from './core/errors.js'
import { createPuristaCliEngine } from './engine.js'

let TEST_DIR = ''

const createMinimalProject = () => {
	TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-engine-'))
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
