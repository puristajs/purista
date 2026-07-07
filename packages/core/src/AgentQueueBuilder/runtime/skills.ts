import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type {
	AgentManifest,
	AgentSkillCatalogEntry,
	AgentSkillContext,
	AgentSkillDiscoveryOptions,
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
		const binding = await resolveBinding(declaration, options)
		if (!binding) {
			throw new Error(
				`Attached agent "${manifest.agentName}" requires skill "${declaration.name}" but no runtime binding was provided`,
			)
		}
		const directory = await resolveDirectory(binding, declaration, manifest)
		if (!directory || !(await isDirectory(directory))) {
			throw new Error(`Attached agent "${manifest.agentName}" skill "${declaration.name}" directory is missing`)
		}
		const entry = await readCatalogEntry(directory, declaration, binding)
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
	options: AgentSkillRuntimeOptions | undefined,
): Promise<AgentSkillRuntimeBinding | undefined> {
	if (!options) return undefined
	const namespaced = declaration.resourceName
		? options.namespaces?.[declaration.resourceName]?.[declaration.name]
		: undefined
	return (
		namespaced ?? options.bindings?.[declaration.name] ?? (await discoverSkillBinding(declaration, options.discovery))
	)
}

async function discoverSkillBinding(
	declaration: SkillDeclaration,
	options: false | AgentSkillDiscoveryOptions | undefined,
): Promise<AgentSkillRuntimeBinding | undefined> {
	if (!options) return undefined
	const projectRoot = path.resolve(options.projectRoot ?? process.env.PWD ?? '.')
	const trustedRoots = new Set((options.trustedProjectRoots ?? []).map(root => path.resolve(root)))
	const projectRoots = options.includeAncestorProjectDirs ? ancestorDirectories(projectRoot) : [projectRoot]
	const roots: Array<{ directory: string; trust: 'project' | 'user'; source: string; trusted: boolean }> = []
	for (const root of projectRoots) {
		const trusted = trustedRoots.has(root)
		if (options.includeProjectAgentsDir ?? true) {
			roots.push({
				directory: path.join(root, '.agents', 'skills'),
				trust: 'project',
				source: 'project_agents',
				trusted,
			})
		}
		if (options.includeProjectClientDir) {
			roots.push({
				directory: path.join(root, '.codex', 'skills'),
				trust: 'project',
				source: 'project_client',
				trusted,
			})
		}
		if (options.includeClaudeCompatDir) {
			roots.push({
				directory: path.join(root, '.claude', 'skills'),
				trust: 'project',
				source: 'project_claude',
				trusted,
			})
		}
	}
	if (options.includeUserAgentsDir) {
		roots.push({
			directory: path.join(os.homedir(), '.agents', 'skills'),
			trust: 'user',
			source: 'user_agents',
			trusted: true,
		})
	}
	if (options.includeUserClientDir) {
		roots.push({
			directory: path.join(os.homedir(), '.codex', 'skills'),
			trust: 'user',
			source: 'user_client',
			trusted: true,
		})
	}
	for (const root of roots) {
		if (!root.trusted) continue
		const directory = await findDiscoveredSkillDirectory(root.directory, declaration.name, {
			maxDepth: options.maxDepth ?? 6,
			maxDirectories: options.maxDirectories ?? 2000,
		})
		if (directory) return { directory, trust: root.trust, source: root.source }
	}
	return undefined
}

/** Project root and every ancestor up to the filesystem root, nearest first. */
function ancestorDirectories(start: string): string[] {
	const out: string[] = []
	let current = path.resolve(start)
	for (;;) {
		out.push(current)
		const parent = path.dirname(current)
		if (parent === current) break
		current = parent
	}
	return out
}

async function findDiscoveredSkillDirectory(
	root: string,
	name: string,
	options: { maxDepth: number; maxDirectories: number },
): Promise<string | undefined> {
	let visited = 0
	const walk = async (directory: string, depth: number): Promise<string | undefined> => {
		if (visited >= options.maxDirectories || depth > options.maxDepth) return undefined
		const entries = await readDirEntries(directory)
		if (!entries) return undefined
		visited += 1
		if (entries.some(entry => entry.isFile() && entry.name === 'SKILL.md')) {
			const frontmatter = readFrontmatter(await fs.readFile(path.join(directory, 'SKILL.md'), 'utf8'))
			return frontmatter.name === name ? directory : undefined
		}
		for (const entry of entries) {
			if (!entry.isDirectory() || shouldSkipDiscoveryDirectory(entry.name)) continue
			const found = await walk(path.join(directory, entry.name), depth + 1)
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

async function readCatalogEntry(
	directory: string,
	declaration: SkillDeclaration,
	binding: AgentSkillRuntimeBinding,
): Promise<AgentSkillCatalogEntry> {
	const skillPath = path.join(directory, 'SKILL.md')
	const content = await readFileOrUndefined(skillPath)
	if (content === undefined) {
		throw new Error(`Attached agent skill "${declaration.name}" is missing SKILL.md`)
	}
	const frontmatter = readFrontmatter(content)
	const name = frontmatter.name ?? declaration.name
	const description = frontmatter.description
	if (name !== declaration.name || !description) {
		throw new Error(`Attached agent skill "${declaration.name}" has invalid SKILL.md frontmatter`)
	}
	return {
		name,
		description,
		location: `/skills/${name}/SKILL.md`,
		mountPath: `/skills/${name}`,
		...(declaration.resourceName ? { resourceName: declaration.resourceName } : {}),
		...(frontmatter.compatibility ? { compatibility: frontmatter.compatibility } : {}),
		trust: binding.trust ?? 'trusted',
		...(binding.source ? { source: binding.source } : {}),
	}
}

function readFrontmatter(content: string): Record<string, string> {
	// Normalize CRLF/CR so SKILL.md authored on any platform parses identically.
	const normalized = content.replace(/\r\n?/g, '\n')
	if (!normalized.startsWith('---\n')) return {}
	const end = normalized.indexOf('\n---', 4)
	if (end < 0) return {}
	const result: Record<string, string> = {}
	for (const line of normalized.slice(4, end).split('\n')) {
		const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
		if (match?.[1] && match[2] !== undefined) result[match[1]] = match[2].trim()
	}
	return result
}

async function readDirEntries(directory: string) {
	try {
		return await fs.readdir(directory, { withFileTypes: true })
	} catch {
		return undefined
	}
}

async function isDirectory(target: string): Promise<boolean> {
	try {
		return (await fs.stat(target)).isDirectory()
	} catch {
		return false
	}
}

async function readFileOrUndefined(target: string): Promise<string | undefined> {
	try {
		return await fs.readFile(target, 'utf8')
	} catch {
		return undefined
	}
}
