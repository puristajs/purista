import { describe, expect, it } from 'vitest'

import {
	createSandboxRepoSeedFiles,
	createSandboxSkillSeedFiles,
	createSandboxWorkspaceLayout,
	DEFAULT_SANDBOX_WORKSPACE_ROOT,
	toSandboxRepoPath,
	toSandboxSkillPath,
} from './workspaceLayout.js'

describe('workspaceLayout', () => {
	it('creates the canonical sandbox workspace layout', () => {
		expect(createSandboxWorkspaceLayout()).toEqual({
			root: DEFAULT_SANDBOX_WORKSPACE_ROOT,
			repoRoot: '/workspace/repo',
			skillsRoot: '/workspace/skills',
			tmpRoot: '/workspace/tmp',
			outputsRoot: '/workspace/outputs',
		})
	})

	it('maps repo and skill paths into stable sandbox locations', () => {
		expect(toSandboxRepoPath('specs/spec.md')).toBe('/workspace/repo/specs/spec.md')
		expect(toSandboxSkillPath('purista-core', 'scripts/plan.sh')).toBe('/workspace/skills/purista-core/scripts/plan.sh')
	})

	it('creates seed files for repo and skill bundles', () => {
		expect(createSandboxRepoSeedFiles([{ path: 'architecture/index.md', content: '# Architecture' }])).toEqual([
			{ path: '/workspace/repo/architecture/index.md', content: '# Architecture' },
		])
		expect(
			createSandboxSkillSeedFiles('purista-core', [
				{ relativePath: 'SKILL.md', content: '# Skill' },
				{ relativePath: 'references/guide.md', content: 'guide' },
			]),
		).toEqual([
			{ path: '/workspace/skills/purista-core/SKILL.md', content: '# Skill' },
			{ path: '/workspace/skills/purista-core/references/guide.md', content: 'guide' },
		])
	})
})
