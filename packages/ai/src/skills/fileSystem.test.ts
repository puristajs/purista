import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { FileSkillResource, renderSkillDocuments } from './fileSystem.js'

const createSkill = async (root: string, skillName: string, content: string) => {
	const skillDir = join(root, skillName)
	await mkdir(skillDir, { recursive: true })
	await writeFile(join(skillDir, 'SKILL.md'), content, 'utf8')
}

describe('FileSkillResource', () => {
	it('lists and loads skills from the filesystem', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-skill-resource-'))
		await createSkill(
			root,
			'purista-architecture',
			`---
name: purista-architecture
description: Design PURISTA architecture.
topics:
  - architecture
  - services
requires_sandbox: false
phases:
  - architecture
  - simulation
---

Use services, commands, subscriptions, streams, and queues.`,
		)

		const resource = new FileSkillResource({ roots: [root] })
		const skills = await resource.list()
		const loaded = await resource.load('purista-architecture')

		expect(skills).toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
				description: 'Design PURISTA architecture.',
				topics: ['architecture', 'services'],
				phases: ['architecture', 'simulation'],
				requiresSandbox: false,
			}),
		])
		expect(loaded.content).toContain('Use services')
	})

	it('searches skills by metadata and body content', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-skill-search-'))
		await createSkill(
			root,
			'purista-testing',
			`---
name: purista-testing
description: Test PURISTA services and agents.
topics:
  - testing
  - agents
phases:
  - simulation
---

Use harnesses and mocks for service and agent testing.`,
		)
		await createSkill(
			root,
			'purista-sandbox',
			`---
name: purista-sandbox
description: Run tools in a sandbox.
topics:
  - sandbox
  - execution
phases:
  - architecture
requires_sandbox: true
---

Use a sandbox for scripts and shell execution.`,
		)

		const resource = new FileSkillResource({ roots: [root] })
		const result = await resource.search({
			queries: ['sandbox'],
			limit: 1,
		})

		expect(result).toHaveLength(1)
		expect(result[0]?.name).toBe('purista-sandbox')
		expect(result[0]?.requiresSandbox).toBe(true)
	})

	it('scores skills by phase and topic metadata', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-skill-selection-'))
		await createSkill(
			root,
			'purista-architecture',
			`---
name: purista-architecture
description: Design PURISTA architecture.
topics:
  - architecture
  - services
phases:
  - architecture
---

Use services and queues.`,
		)
		await createSkill(
			root,
			'purista-spec',
			`---
name: purista-spec
description: Refine product specifications.
topics:
  - spec
  - elicitation
phases:
  - spec
---

Use structured requirement discovery.`,
		)

		const resource = new FileSkillResource({ roots: [root] })
		const result = await resource.search({
			phases: ['architecture'],
			topics: ['services'],
			limit: 2,
		})

		expect(result.map(entry => entry.name)).toEqual(['purista-architecture'])
	})

	it('renders loaded skills as markdown prompt context', () => {
		expect(
			renderSkillDocuments('Relevant skills', [
				{ name: 'purista-architecture', content: 'Use services.' },
				{ name: 'purista-queues', content: 'Use durable queues.' },
			]),
		).toBe(
			'Relevant skills:\n## purista-architecture\nUse services.\n\n## purista-queues\nUse durable queues.',
		)
		expect(renderSkillDocuments('Relevant skills', [])).toBeUndefined()
	})
})
