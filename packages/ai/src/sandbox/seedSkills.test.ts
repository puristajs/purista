import { describe, expect, it, vi } from 'vitest'
import { createInlineSkillResource } from '../skills/fileSystem.js'
import { seedSandboxSkills } from './seedSkills.js'

describe('seedSandboxSkills', () => {
	it('is a no-op when the skill resource is empty', async () => {
		const adapter = {
			writeFiles: vi.fn(),
		}
		const skillResource = createInlineSkillResource({})

		const result = await seedSandboxSkills({ adapter, skillResource })

		expect(result).toEqual({
			written: 0,
			skills: [],
		})
		expect(adapter.writeFiles).not.toHaveBeenCalled()
	})

	it('writes multiple skills into isolated canonical sandbox roots', async () => {
		const adapter = {
			writeFiles: vi.fn(),
		}
		const skillResource = createInlineSkillResource({
			alpha: {
				content: '# Alpha skill\n',
				references: {
					'guide.md': 'alpha guide\n',
				},
			},
			beta: {
				content: '# Beta skill\n',
				scripts: {
					'plan.sh': '#!/usr/bin/env sh\necho beta\n',
				},
			},
		})

		const result = await seedSandboxSkills({ adapter, skillResource })

		expect(result).toEqual({
			written: 4,
			skills: ['alpha', 'beta'],
		})
		expect(adapter.writeFiles).toHaveBeenCalledWith([
			{ path: '/workspace/skills/alpha/SKILL.md', content: Buffer.from('# Alpha skill\n', 'utf8') },
			{ path: '/workspace/skills/alpha/references/guide.md', content: Buffer.from('alpha guide\n', 'utf8') },
			{ path: '/workspace/skills/beta/SKILL.md', content: Buffer.from('# Beta skill\n', 'utf8') },
			{
				path: '/workspace/skills/beta/scripts/plan.sh',
				content: Buffer.from('#!/usr/bin/env sh\necho beta\n', 'utf8'),
			},
		])
	})

	it('only writes explicitly requested skills', async () => {
		const adapter = {
			writeFiles: vi.fn(),
		}
		const skillResource = createInlineSkillResource({
			alpha: {
				content: '# Alpha skill\n',
			},
			beta: {
				content: '# Beta skill\n',
			},
		})

		const result = await seedSandboxSkills({
			adapter,
			skillResource,
			skillNames: ['beta'],
		})

		expect(result).toEqual({
			written: 1,
			skills: ['beta'],
		})
		expect(adapter.writeFiles).toHaveBeenCalledWith([
			{ path: '/workspace/skills/beta/SKILL.md', content: Buffer.from('# Beta skill\n', 'utf8') },
		])
	})

	it('normalizes seeded skill paths so bundle files cannot escape the skill root', async () => {
		const adapter = {
			writeFiles: vi.fn(),
		}
		const skillResource = createInlineSkillResource({
			'../purista': {
				content: '# Purista skill\n',
				scripts: {
					'../scripts/plan.sh': '#!/usr/bin/env sh\necho safe\n',
				},
				references: {
					'../../reference.md': 'safe reference\n',
				},
			},
		})

		const result = await seedSandboxSkills({ adapter, skillResource })

		expect(result).toEqual({
			written: 3,
			skills: ['../purista'],
		})
		expect(adapter.writeFiles).toHaveBeenCalledWith([
			{ path: '/workspace/skills/purista/SKILL.md', content: Buffer.from('# Purista skill\n', 'utf8') },
			{
				path: '/workspace/skills/purista/references/reference.md',
				content: Buffer.from('safe reference\n', 'utf8'),
			},
			{
				path: '/workspace/skills/purista/scripts/plan.sh',
				content: Buffer.from('#!/usr/bin/env sh\necho safe\n', 'utf8'),
			},
		])
	})
})
