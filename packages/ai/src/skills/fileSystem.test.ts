import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
	createInlineSkillResource,
	createLayeredFileSkillResource,
	FileSkillResource,
	renderSkillDocuments,
	renderSkillReferences,
	resolveLayeredSkillRoots,
} from './fileSystem.js'

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
		await mkdir(join(root, 'purista-architecture', 'references'), { recursive: true })
		await mkdir(join(root, 'purista-architecture', 'scripts'), { recursive: true })
		await mkdir(join(root, 'purista-architecture', 'assets'), { recursive: true })
		await writeFile(
			join(root, 'purista-architecture', 'references', 'decision-matrix.md'),
			'Pick commands for synchronous work and queues for durable work.',
			'utf8',
		)
		await writeFile(join(root, 'purista-architecture', 'scripts', 'lint.sh'), '#!/usr/bin/env sh\necho lint\n', 'utf8')
		await writeFile(join(root, 'purista-architecture', 'assets', 'diagram.txt'), 'diagram', 'utf8')

		const resource = new FileSkillResource({ roots: [root] })
		const skills = await resource.list()
		const loaded = await resource.load('purista-architecture')
		const references = await resource.loadReferences('purista-architecture')
		const bundle = await resource.loadBundle('purista-architecture')

		expect(skills).toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
				description: 'Design PURISTA architecture.',
				topics: ['architecture', 'services'],
				phases: ['architecture', 'simulation'],
				requiresSandbox: false,
				references: ['decision-matrix.md'],
				scripts: ['lint.sh'],
				assets: ['diagram.txt'],
			}),
		])
		expect(loaded.content).toContain('Use services')
		expect(references).toEqual([
			expect.objectContaining({
				relativePath: 'references/decision-matrix.md',
			}),
		])
		expect(bundle.files.map(file => file.relativePath)).toEqual([
			'SKILL.md',
			'assets/diagram.txt',
			'references/decision-matrix.md',
			'scripts/lint.sh',
		])
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

	it('supports mixed roots and local overlays', async () => {
		const canonicalRoot = await mkdtemp(join(tmpdir(), 'purista-skill-canonical-'))
		const localRoot = await mkdtemp(join(tmpdir(), 'purista-skill-local-'))
		await createSkill(
			canonicalRoot,
			'purista-core',
			`---
name: purista-core
description: Core framework guidance.
topics:
  - core
phases:
  - architecture
---

Canonical core guidance.`,
		)
		await createSkill(
			localRoot,
			'voyage-agent-loop',
			`---
name: voyage-agent-loop
description: App-local execution discipline.
topics:
  - discipline
phases:
  - architecture
---

Local application rules.`,
		)

		const resource = new FileSkillResource({ roots: [canonicalRoot, localRoot] })
		const listed = await resource.list()
		const result = await resource.search({
			phases: ['architecture'],
			topics: ['discipline'],
			limit: 5,
		})

		expect(listed.map(entry => entry.name)).toEqual(['purista-core', 'voyage-agent-loop'])
		expect(result.map(entry => entry.name)).toEqual(['voyage-agent-loop', 'purista-core'])
	})

	it('prefers later roots as overlays when a skill exists more than once', async () => {
		const canonicalRoot = await mkdtemp(join(tmpdir(), 'purista-skill-overlay-canonical-'))
		const localRoot = await mkdtemp(join(tmpdir(), 'purista-skill-overlay-local-'))
		await createSkill(
			canonicalRoot,
			'purista-core',
			`---
name: purista-core
description: Canonical guidance.
topics:
  - core
phases:
  - architecture
---

Canonical body.`,
		)
		await createSkill(
			localRoot,
			'purista-core',
			`---
name: purista-core
description: Local overlay.
topics:
  - core
phases:
  - architecture
---

Local overlay body.`,
		)

		const resource = new FileSkillResource({ roots: [canonicalRoot, localRoot] })
		const loaded = await resource.load('purista-core')

		expect(loaded.description).toBe('Local overlay.')
		expect(loaded.content).toContain('Local overlay body.')
	})

	it('resolves layered roots in canonical then overlay order and removes duplicates', () => {
		expect(
			resolveLayeredSkillRoots({
				canonicalRoots: [' /canonical/framework ', '/canonical/framework', '/canonical/extra'],
				overlayRoots: ['/app/local', ' /app/local '],
			}),
		).toEqual(['/canonical/framework', '/canonical/extra', '/app/local'])
	})

	it('creates a layered skill resource with canonical roots first and overlays second', async () => {
		const canonicalRoot = await mkdtemp(join(tmpdir(), 'purista-skill-helper-canonical-'))
		const localRoot = await mkdtemp(join(tmpdir(), 'purista-skill-helper-local-'))
		await createSkill(
			canonicalRoot,
			'purista-core',
			`---
name: purista-core
description: Canonical framework guidance.
topics:
  - architecture
phases:
  - architecture
---

Canonical body.`,
		)
		await createSkill(
			localRoot,
			'purista-core',
			`---
name: purista-core
description: Local overlay guidance.
topics:
  - architecture
phases:
  - architecture
---

Overlay body.`,
		)

		const resource = createLayeredFileSkillResource({
			canonicalRoots: [canonicalRoot],
			overlayRoots: [localRoot],
		})

		await expect(resource.load('purista-core')).resolves.toEqual(
			expect.objectContaining({
				description: 'Local overlay guidance.',
				content: 'Overlay body.',
			}),
		)
	})

	it('supports inline typed skill resources', async () => {
		const resource = createInlineSkillResource({
			'spec-elicitation': {
				content: 'Ask for missing requirements first.',
			},
			'architecture-synthesis': {
				content: 'Map requirements into services and queues.',
				references: {
					'decision-matrix.md': 'Prefer queues for durable work.',
				},
			},
		})

		await expect(resource.list()).resolves.toEqual([
			expect.objectContaining({ name: 'architecture-synthesis' }),
			expect.objectContaining({ name: 'spec-elicitation' }),
		])
		await expect(resource.load('architecture-synthesis')).resolves.toEqual(
			expect.objectContaining({
				name: 'architecture-synthesis',
				content: 'Map requirements into services and queues.',
			}),
		)
		await expect(resource.loadReferences('architecture-synthesis')).resolves.toEqual([
			expect.objectContaining({
				relativePath: 'references/decision-matrix.md',
			}),
		])
		await expect(resource.loadBundle('architecture-synthesis')).resolves.toEqual(
			expect.objectContaining({
				files: expect.arrayContaining([
					expect.objectContaining({ relativePath: 'SKILL.md' }),
					expect.objectContaining({ relativePath: 'references/decision-matrix.md' }),
				]),
			}),
		)
	})

	it('renders loaded skills as markdown prompt context', () => {
		expect(
			renderSkillDocuments('Relevant skills', [
				{ name: 'purista-architecture', content: 'Use services.' },
				{ name: 'purista-queues', content: 'Use durable queues.' },
			]),
		).toBe('Relevant skills:\n## purista-architecture\nUse services.\n\n## purista-queues\nUse durable queues.')
		expect(renderSkillDocuments('Relevant skills', [])).toBeUndefined()
	})

	it('renders skill references as markdown prompt context', () => {
		expect(
			renderSkillReferences('Relevant references', [
				{
					skillName: 'purista-architecture',
					relativePath: 'references/queues.md',
					content: 'Use queues for durable work.',
				},
			]),
		).toBe('Relevant references:\n## purista-architecture / references/queues.md\nUse queues for durable work.')
		expect(renderSkillReferences('Relevant references', [])).toBeUndefined()
	})
})
