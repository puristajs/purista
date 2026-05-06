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
		expect(toSandboxSkillPath('purista', 'scripts/plan.sh')).toBe('/workspace/skills/purista/scripts/plan.sh')
	})

	it('normalizes repo and skill paths so they cannot escape the canonical roots', () => {
		expect(toSandboxRepoPath('../specs/../architecture/index.md')).toBe('/workspace/repo/architecture/index.md')
		expect(toSandboxSkillPath('../purista', '../../scripts/plan.sh')).toBe('/workspace/skills/purista/scripts/plan.sh')
	})

	it('creates seed files for repo and skill bundles', () => {
		expect(createSandboxRepoSeedFiles([{ path: 'architecture/index.md', content: '# Architecture' }])).toEqual([
			{ path: '/workspace/repo/architecture/index.md', content: '# Architecture' },
		])
		expect(
			createSandboxSkillSeedFiles('purista', [
				{ relativePath: 'SKILL.md', content: '# Skill' },
				{ relativePath: 'references/guide.md', content: 'guide' },
			]),
		).toEqual([
			{ path: '/workspace/skills/purista/SKILL.md', content: '# Skill' },
			{ path: '/workspace/skills/purista/references/guide.md', content: 'guide' },
		])
	})

	it('supports custom sandbox workspace roots', () => {
		const layout = createSandboxWorkspaceLayout('/tmp/purista-sandbox')
		expect(layout).toEqual({
			root: '/tmp/purista-sandbox',
			repoRoot: '/tmp/purista-sandbox/repo',
			skillsRoot: '/tmp/purista-sandbox/skills',
			tmpRoot: '/tmp/purista-sandbox/tmp',
			outputsRoot: '/tmp/purista-sandbox/outputs',
		})
		expect(toSandboxRepoPath('docs/spec.md', layout)).toBe('/tmp/purista-sandbox/repo/docs/spec.md')
		expect(toSandboxSkillPath('purista', 'scripts/plan.sh', layout)).toBe(
			'/tmp/purista-sandbox/skills/purista/scripts/plan.sh',
		)
	})
})
