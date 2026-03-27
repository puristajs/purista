import { access, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = new URL('../../../../', import.meta.url)
const workspaceRoot = new URL('../../../../../', import.meta.url)
const skillsRoot = new URL('../../../../skills/', import.meta.url)

const requiredSkills = ['purista', 'purista-skill-maintainer']

const requiredSections = [
	'## When to use this skill',
	'## What this skill is for',
	'## Core PURISTA mental model',
	'## Hard rules',
	'## Decision rules',
	'## Definition pattern',
	'## Configuration pattern',
	'## Instantiation / runtime wiring',
	'## Verification cues',
	'## Common mistakes / anti-patterns',
	'## How to navigate this skill',
	'## Read if needed',
]

describe('canonical PURISTA skill catalog', () => {
	it('contains the canonical shared skill and maintainer meta skill', async () => {
		const entries = await readdir(skillsRoot, { withFileTypes: true })
		const names = entries
			.filter(entry => entry.isDirectory())
			.map(entry => entry.name)
			.sort()

		for (const skillName of requiredSkills) {
			expect(names).toContain(skillName)
		}
	})

	it('keeps the umbrella skill on the teaching-oriented structure with existing references', async () => {
		const skillName = 'purista'
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

		expect(references.length).toBeGreaterThan(5)

		for (const reference of references) {
			const base = reference.startsWith('references/')
				? new URL(`${skillName}/`, skillsRoot)
				: reference.startsWith('specs/')
					? workspaceRoot
					: repoRoot
			await expect(access(new URL(reference, base))).resolves.toBeUndefined()
		}
	})

	it('keeps the umbrella skill aligned with current PURISTA builder concepts', async () => {
		const reads = async (relativePath: string) =>
			await readFile(join(skillsRoot.pathname, 'purista', relativePath), 'utf8')

		await expect(reads('SKILL.md')).resolves.toContain('getInstance')
		await expect(reads('SKILL.md')).resolves.toContain('defineResource')
		await expect(reads('references/03-service-builders-and-contracts.md')).resolves.toContain('getCommandBuilder')
		await expect(reads('references/05-agents-skills-and-ai-runtime.md')).resolves.toContain('context.invoke')
		await expect(reads('references/05-agents-skills-and-ai-runtime.md')).resolves.toContain('context.ai.reply.generate')
		await expect(reads('references/07-http-sandbox-mcp-and-external-bindings.md')).resolves.toContain('sandbox')
		await expect(reads('references/09-cli-starter-and-scaffolding.md')).resolves.toContain('create-purista')
	})
})
