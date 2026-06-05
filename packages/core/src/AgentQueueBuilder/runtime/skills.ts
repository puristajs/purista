import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type {
	AgentManifest,
	AgentSkillCatalogEntry,
	AgentSkillDiscoveryOptions,
	AgentSkillContext,
	AgentSkillRuntimeBinding,
	AgentSkillRuntimeOptions,
	AgentSkillRuntimeResolved,
} from '../types.js'

type SkillDeclaration = { name: string; resourceName?: string }

export async function resolveAgentRuntimeSkills(
	manifest: AgentManifest<any>,
	options: AgentSkillRuntimeOptions | undefined,
): Promise<AgentSkillRuntimeResolved> {
	const declarations = dedupeSkillDeclarations(manifest.usedSkills)
	if (declarations.length === 0) {
		return { harnessSkills: {}, catalog: [] }
	}
	const harnessSkills: AgentSkillRuntimeResolved['harnessSkills'] = {}
	const catalog: AgentSkillCatalogEntry[] = []
	for (const declaration of declarations) {
		const binding = await resolveBinding(declaration, manifest, options)
		if (!binding) {
			throw new Error(
				`Attached agent "${manifest.agentName}" requires skill "${declaration.name}" but no runtime binding was provided`,
			)
		}
		const directory = await resolveDirectory(binding, declaration, manifest)
		if (!directory || !fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
			throw new Error(
				`Attached agent "${manifest.agentName}" skill "${declaration.name}" directory is missing`,
			)
		}
		const entry = readCatalogEntry(directory, declaration, binding)
		harnessSkills[declaration.name] = {
			directory,
			trust: binding.trust ?? 'trusted',
			source: binding.source ?? declaration.resourceName,
		}
		catalog.push(entry)
	}
	return { harnessSkills, catalog }
}

export function createAgentSkillContext(catalog: readonly AgentSkillCatalogEntry[]): AgentSkillContext {
	const entries = catalog.map(entry => ({ ...entry }))
	return {
		catalog: entries,
		systemPromptFragment() {
			if (entries.length === 0) return ''
			const lines = ['', '', 'Available skills:']
			for (const entry of entries) {
				lines.push(`- ${entry.name}: ${entry.description}`)
				lines.push(`  Location: ${entry.location}`)
				if (entry.compatibility) lines.push(`  Compatibility: ${entry.compatibility}`)
			}
			lines.push('', 'Use the read tool to load /skills/<name>/SKILL.md when a skill is relevant.')
			lines.push('Relative paths in a skill are relative to /skills/<name>/.')
			return lines.join('\n')
		},
		resolve(name: string) {
			return entries.find(entry => entry.name === name)
		},
	}
}

function dedupeSkillDeclarations(usedSkills: AgentManifest<any>['usedSkills']): SkillDeclaration[] {
	const seen = new Set<string>()
	const out: SkillDeclaration[] = []
	for (const group of usedSkills) {
		for (const name of group.names) {
			if (seen.has(name)) continue
			seen.add(name)
			out.push({ name, ...(group.resourceName ? { resourceName: group.resourceName } : {}) })
		}
	}
	return out
}

async function resolveBinding(
	declaration: SkillDeclaration,
	manifest: AgentManifest<any>,
	options: AgentSkillRuntimeOptions | undefined,
): Promise<AgentSkillRuntimeBinding | undefined> {
	if (!options) return undefined
	const namespaced = declaration.resourceName
		? options.namespaces?.[declaration.resourceName]?.[declaration.name]
		: undefined
	return namespaced ?? options.bindings?.[declaration.name] ?? discoverSkillBinding(declaration, options.discovery)
}

function discoverSkillBinding(
	declaration: SkillDeclaration,
	options: false | AgentSkillDiscoveryOptions | undefined,
): AgentSkillRuntimeBinding | undefined {
	if (!options) return undefined
	const projectRoot = path.resolve(options.projectRoot ?? process.env['PWD'] ?? '.')
	const trustedRoots = new Set((options.trustedProjectRoots ?? []).map(root => path.resolve(root)))
	const roots: Array<{ directory: string; trust: 'project' | 'user'; source: string; trusted: boolean }> = []
	if (options.includeProjectAgentsDir ?? true) {
		roots.push({
			directory: path.join(projectRoot, '.agents', 'skills'),
			trust: 'project',
			source: 'project_agents',
			trusted: trustedRoots.has(projectRoot),
		})
	}
	if (options.includeProjectClientDir) {
		roots.push({
			directory: path.join(projectRoot, '.codex', 'skills'),
			trust: 'project',
			source: 'project_client',
			trusted: trustedRoots.has(projectRoot),
		})
	}
	if (options.includeClaudeCompatDir) {
		roots.push({
			directory: path.join(projectRoot, '.claude', 'skills'),
			trust: 'project',
			source: 'project_claude',
			trusted: trustedRoots.has(projectRoot),
		})
	}
	if (options.includeUserAgentsDir) {
		roots.push({ directory: path.join(os.homedir(), '.agents', 'skills'), trust: 'user', source: 'user_agents', trusted: true })
	}
	if (options.includeUserClientDir) {
		roots.push({ directory: path.join(os.homedir(), '.codex', 'skills'), trust: 'user', source: 'user_client', trusted: true })
	}
	for (const root of roots) {
		if (!root.trusted) continue
		const directory = findDiscoveredSkillDirectory(root.directory, declaration.name, {
			maxDepth: options.maxDepth ?? 6,
			maxDirectories: options.maxDirectories ?? 2000,
		})
		if (directory) return { directory, trust: root.trust, source: root.source }
	}
	return undefined
}

function findDiscoveredSkillDirectory(
	root: string,
	name: string,
	options: { maxDepth: number; maxDirectories: number },
): string | undefined {
	let visited = 0
	const walk = (directory: string, depth: number): string | undefined => {
		if (visited >= options.maxDirectories || depth > options.maxDepth || !fs.existsSync(directory)) return undefined
		visited += 1
		const skillPath = path.join(directory, 'SKILL.md')
		if (fs.existsSync(skillPath)) {
			const frontmatter = readFrontmatter(fs.readFileSync(skillPath, 'utf8'))
			return frontmatter['name'] === name ? directory : undefined
		}
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			if (!entry.isDirectory() || shouldSkipDiscoveryDirectory(entry.name)) continue
			const found = walk(path.join(directory, entry.name), depth + 1)
			if (found) return found
		}
		return undefined
	}
	return walk(root, 0)
}

function shouldSkipDiscoveryDirectory(name: string): boolean {
	return ['.git', 'node_modules', 'dist', 'build', '.next', '.astro'].includes(name)
}

async function resolveDirectory(
	binding: AgentSkillRuntimeBinding,
	declaration: SkillDeclaration,
	manifest: AgentManifest<any>,
): Promise<string | undefined> {
	if ('directory' in binding) return path.resolve(binding.directory)
	const resolved = await binding.resolver({
		name: declaration.name,
		resourceName: declaration.resourceName,
		serviceName: manifest.serviceName,
		serviceVersion: manifest.serviceVersion,
		agentName: manifest.agentName,
	})
	return resolved ? path.resolve(resolved.directory) : undefined
}

function readCatalogEntry(directory: string, declaration: SkillDeclaration, binding: AgentSkillRuntimeBinding): AgentSkillCatalogEntry {
	const skillPath = path.join(directory, 'SKILL.md')
	if (!fs.existsSync(skillPath)) {
		throw new Error(`Attached agent skill "${declaration.name}" is missing SKILL.md`)
	}
	const content = fs.readFileSync(skillPath, 'utf8')
	const frontmatter = readFrontmatter(content)
	const name = frontmatter['name'] ?? declaration.name
	const description = frontmatter['description']
	if (name !== declaration.name || !description) {
		throw new Error(`Attached agent skill "${declaration.name}" has invalid SKILL.md frontmatter`)
	}
	return {
		name,
		description,
		location: `/skills/${name}/SKILL.md`,
		mountPath: `/skills/${name}`,
		...(declaration.resourceName ? { resourceName: declaration.resourceName } : {}),
		...(frontmatter['compatibility'] ? { compatibility: frontmatter['compatibility'] } : {}),
		trust: binding.trust ?? 'trusted',
		...(binding.source ? { source: binding.source } : {}),
	}
}

function readFrontmatter(content: string): Record<string, string> {
	if (!content.startsWith('---\n')) return {}
	const end = content.indexOf('\n---', 4)
	if (end < 0) return {}
	const result: Record<string, string> = {}
	for (const line of content.slice(4, end).split('\n')) {
		const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
		if (match?.[1] && match[2] !== undefined) result[match[1]] = match[2].trim()
	}
	return result
}
