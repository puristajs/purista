import { describe, expect, it } from 'vitest'
import { planProjectGeneration } from './planProjectGeneration.js'
import { resolveProjectBlueprints } from './resolveProjectBlueprints.js'

describe('resolveProjectBlueprints', () => {
	it('selects runtime, bridge, http and linter blueprints deterministically', () => {
		const resolution = resolveProjectBlueprints({
			target: 'example-app',
			projectName: 'example-app',
			runtime: 'node',
			eventBridge: 'amqp',
			useWebserver: true,
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			linter: 'eslint',
			formatter: 'prettier',
			packageManager: 'npm',
			installDependencies: false,
		})

		expect(resolution.selectedBlueprints).toEqual([
			'base',
			'runtime-node',
			'bridge-amqp',
			'http-node',
			'linter-eslint-module',
		])
		expect(resolution.conflicts).toEqual([])
		expect(resolution.warnings).toEqual([])
	})

	it('suppresses the bundled http server for dapr projects', () => {
		const resolution = resolveProjectBlueprints({
			target: 'example-app',
			projectName: 'example-app',
			runtime: 'node',
			eventBridge: 'dapr',
			useWebserver: true,
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			linter: 'biome',
			formatter: 'biome',
			packageManager: 'npm',
			installDependencies: false,
		})

		expect(resolution.selectedBlueprints).toEqual(['base', 'runtime-node', 'bridge-dapr', 'linter-biome'])
		expect(resolution.warnings).toContain(
			'The Dapr blueprint does not enable the bundled HTTP server. The request was ignored.',
		)
	})
})

describe('planProjectGeneration', () => {
	it('builds a stable generation plan and predicts scaffolded files', () => {
		const plan = planProjectGeneration(
			{
				target: 'example-app',
				projectName: 'example-app',
				runtime: 'bun',
				eventBridge: 'mqtt',
				useWebserver: true,
				fileConvention: 'camel',
				eventConvention: 'dotCase',
				linter: 'biome',
				formatter: 'biome',
				packageManager: 'bun',
				installDependencies: false,
			},
			{ cwd: '/tmp/workspace' },
		)

		expect(plan.targetDirectoryPath).toBe('/tmp/workspace/example-app')
		expect(plan.selectedBlueprints).toEqual(['base', 'runtime-bun', 'bridge-mqtt', 'http-bun', 'linter-biome'])
		expect(plan.installCommand).toBe('bun install')
		expect(plan.predictedFiles).toContain('src/index.ts')
		expect(plan.predictedFiles).toContain('src/http.ts')
		expect(plan.predictedFiles).toContain('AGENTS.md')
		expect(plan.predictedFiles).toContain('CLAUDE.md')
		expect(plan.predictedFiles).toContain('.agents/IMPLEMENTATION.md')
		expect(plan.predictedFiles).toContain('.agents/skills/purista')
		expect(plan.predictedFiles).toContain('.claude/skills/purista')
		expect(plan.predictedFiles).toContain('src/service/ping/v1/pingV1Service.ts')
		expect(plan.predictedFiles).toContain('src/service/ping/v1/command/ping/types.ts')

		const packageJsonFile = plan.files.find(file => file.path === 'package.json')
		expect(packageJsonFile?.type).not.toBe('symlink')
		if (packageJsonFile?.type !== 'symlink') {
			expect(packageJsonFile?.content).toContain('"@purista/mqttbridge"')
			expect(packageJsonFile?.content).toContain('"@purista/hono-http-server"')
			expect(packageJsonFile?.content).toContain('"@purista/cli"')
			expect(packageJsonFile?.content).toContain('"add:service": "purista add service"')
			expect(packageJsonFile?.content).toContain('"add:agent": "purista add agent"')
			expect(packageJsonFile?.content).toContain('"@biomejs/biome"')
		}

		const agentSkillLink = plan.files.find(file => file.path === '.agents/skills/purista')
		expect(agentSkillLink).toEqual({
			type: 'symlink',
			path: '.agents/skills/purista',
			target: '../../node_modules/@purista/core/skills/purista',
		})

		const agentsFile = plan.files.find(file => file.path === 'AGENTS.md')
		expect(agentsFile?.type).not.toBe('symlink')
		if (agentsFile?.type !== 'symlink') {
			expect(agentsFile?.content).toContain('This project installs `@purista/cli` as a dev dependency')
			expect(agentsFile?.content).toContain('Package manager: `bun`')
			expect(agentsFile?.content).toContain('bun run add:service -- <name> --description "<description>"')
			expect(agentsFile?.content).toContain('bun run dev')
		}
	})
})
