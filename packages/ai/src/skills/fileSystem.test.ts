import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { FileSkillResource } from './fileSystem.js'

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
---

Use harnesses and mocks for service and agent testing.`,
		)
		await createSkill(
			root,
			'purista-sandbox',
			`---
name: purista-sandbox
description: Run tools in a sandbox.
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
})
