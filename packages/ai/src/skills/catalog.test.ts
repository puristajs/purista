import { access, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = new URL('../../../../', import.meta.url)
const workspaceRoot = new URL('../../../../../', import.meta.url)
const skillsRoot = new URL('../../../../skills/', import.meta.url)

const requiredSkills = [
	'purista-core',
	'purista-application-architecture',
	'purista-spec-elicitation',
	'purista-architecture-synthesis',
	'purista-implementation-planning',
	'purista-service-builder',
	'purista-command-builder',
	'purista-subscription-builder',
	'purista-stream-builder',
	'purista-queue-builder',
	'purista-queue-worker-builder',
	'purista-schema-contracts',
	'purista-agents-core',
	'purista-agent-runtime',
	'purista-agent-testing',
	'purista-external-runtime-bindings',
	'purista-ai-sdk-adapter',
	'purista-mcp-a2a',
	'purista-resources',
	'purista-stores',
	'purista-event-bridges',
	'purista-queue-bridges',
	'purista-http-runtime',
	'purista-sandbox',
	'purista-cli-scaffolding',
	'purista-observability',
	'purista-deployment-topologies',
]

const requiredSections = [
	'## When to use this skill',
	'## What this component/package is for',
	'## Hard rules',
	'## Decision rules',
	'## Recommended file/folder structure',
	'## Common implementation patterns',
	'## Common mistakes / anti-patterns',
	'## How this connects to other PURISTA concepts',
	'## Read if needed',
]

describe('canonical PURISTA skill catalog', () => {
	it('contains the required layered skill set', async () => {
		const entries = await readdir(skillsRoot, { withFileTypes: true })
		const names = entries
			.filter(entry => entry.isDirectory())
			.map(entry => entry.name)
			.sort()

		for (const skillName of requiredSkills) {
			expect(names).toContain(skillName)
		}
	})

	it('keeps every skill on the standard structure with existing references', async () => {
		for (const skillName of requiredSkills) {
			const skillPath = join(skillsRoot.pathname, skillName, 'SKILL.md')
			const content = await readFile(skillPath, 'utf8')

			for (const section of requiredSections) {
				expect(content).toContain(section)
			}

			const readIfNeeded = content.split('## Read if needed')[1] ?? ''
			const references = readIfNeeded
				.split('\n')
				.map(entry => entry.trim())
				.filter(entry => entry.startsWith('- '))
				.map(entry => entry.slice(2).replace(/^`|`$/g, ''))

			expect(references.length).toBeGreaterThan(1)

			for (const reference of references) {
				const base = reference.startsWith('specs/') ? workspaceRoot : repoRoot
				await expect(access(new URL(reference, base))).resolves.toBeUndefined()
			}
		}
	})

	it('keeps key skills aligned with current PURISTA concepts', async () => {
		const reads = async (skillName: string) => await readFile(join(skillsRoot.pathname, skillName, 'SKILL.md'), 'utf8')

		await expect(reads('purista-agent-runtime')).resolves.toContain('context.expose')
		await expect(reads('purista-external-runtime-bindings')).resolves.toContain('toAiSdkTools')
		await expect(reads('purista-agent-testing')).resolves.toContain('createAgentTestHarness')
		await expect(reads('purista-sandbox')).resolves.toContain('scope')
		await expect(reads('purista-queue-builder')).resolves.toContain('durable')
		await expect(reads('purista-resources')).resolves.toContain('resources')
		await expect(reads('purista-cli-scaffolding')).resolves.toContain('packages/cli')
	})
})
