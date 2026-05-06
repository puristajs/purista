import { posix as pathPosix } from 'node:path'

export const DEFAULT_SANDBOX_WORKSPACE_ROOT = '/workspace'

export type SandboxWorkspaceLayout = {
	root: string
	repoRoot: string
	skillsRoot: string
	tmpRoot: string
	outputsRoot: string
}

export type SandboxSeedFile = {
	path: string
	content: string | Buffer
}

const normalizeRoot = (root: string) => {
	const normalized = pathPosix.normalize(root.trim() || DEFAULT_SANDBOX_WORKSPACE_ROOT)
	return normalized === '.' ? DEFAULT_SANDBOX_WORKSPACE_ROOT : normalized
}

const normalizeRelativePath = (relativePath: string) => {
	const normalized = pathPosix.normalize(relativePath.replaceAll('\\', '/')).replace(/^(\.\.\/)+/, '')
	return normalized.replace(/^\/+/, '')
}

const normalizeSkillName = (skillName: string) => normalizeRelativePath(skillName.trim()).replaceAll('/', '')

const normalizeSkillBundlePath = (relativePath: string) => {
	const raw = relativePath.replaceAll('\\', '/').replace(/^\/+/, '')
	if (raw === 'SKILL.md') {
		return raw
	}
	for (const topLevel of ['references', 'scripts', 'assets'] as const) {
		if (raw.startsWith(`${topLevel}/`)) {
			let nestedPath = normalizeRelativePath(raw.slice(topLevel.length + 1))
			while (nestedPath.startsWith(`${topLevel}/`)) {
				nestedPath = nestedPath.slice(topLevel.length + 1)
			}
			return pathPosix.join(topLevel, nestedPath)
		}
	}
	return normalizeRelativePath(pathPosix.normalize(raw))
}

export const createSandboxWorkspaceLayout = (root = DEFAULT_SANDBOX_WORKSPACE_ROOT): SandboxWorkspaceLayout => {
	const normalizedRoot = normalizeRoot(root)
	return {
		root: normalizedRoot,
		repoRoot: pathPosix.join(normalizedRoot, 'repo'),
		skillsRoot: pathPosix.join(normalizedRoot, 'skills'),
		tmpRoot: pathPosix.join(normalizedRoot, 'tmp'),
		outputsRoot: pathPosix.join(normalizedRoot, 'outputs'),
	}
}

export const toSandboxRepoPath = (
	relativePath: string,
	layout: SandboxWorkspaceLayout = createSandboxWorkspaceLayout(),
) => pathPosix.join(layout.repoRoot, normalizeRelativePath(relativePath))

export const toSandboxSkillPath = (
	skillName: string,
	relativePath: string,
	layout: SandboxWorkspaceLayout = createSandboxWorkspaceLayout(),
) => pathPosix.join(layout.skillsRoot, normalizeSkillName(skillName), normalizeRelativePath(relativePath))

export const createSandboxRepoSeedFiles = (
	files: Array<{ path: string; content: string | Buffer }>,
	layout: SandboxWorkspaceLayout = createSandboxWorkspaceLayout(),
): SandboxSeedFile[] => files.map(file => ({ path: toSandboxRepoPath(file.path, layout), content: file.content }))

export const createSandboxSkillSeedFiles = (
	skillName: string,
	files: Array<{ relativePath: string; content: string | Buffer }>,
	layout: SandboxWorkspaceLayout = createSandboxWorkspaceLayout(),
): SandboxSeedFile[] =>
	files.map(file => ({
		path: toSandboxSkillPath(skillName, normalizeSkillBundlePath(file.relativePath), layout),
		content: file.content,
	}))
