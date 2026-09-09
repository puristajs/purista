import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdir, readFile, readlink, stat } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const directory = dirname(fileURLToPath(import.meta.url))
export const bankRoot = resolve(directory, '..')
export const repoRoot = resolve(bankRoot, '../..')
export const contentRoot = join(repoRoot, 'web/src/content/tutorials')
export const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'))
export const recipes = [...course.chapters, ...(course.baselines ?? [])]
export const baselineIds = new Set((course.baselines ?? []).map(item => item.id))
export const chapters = new Map(recipes.map(item => [item.id, item]))
export const retainedRoot = id => join(bankRoot, baselineIds.has(id) ? 'baselines' : 'chapters', id)
export const digest = value => createHash('sha256').update(value).digest('hex')
const execFileAsync = promisify(execFile)
export const releaseMetadataArtifactNames = new Set(['package.json', 'package-lock.json'])
export const excludedArtifactNames = new Set([
	'node_modules',
	'dist',
	'.git',
	'.tutorial-proof.json',
	'.tutorial-alignment-proof.json',
	'coverage',
	'var',
	'.DS_Store',
])

const forbiddenServiceNames = new Set((course.forbiddenServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()))
const allowedServiceNames = new Set((course.allowedServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()))
const scaffoldServiceNames = new Set((course.scaffoldServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()))

export const enforcesV4Source = chapter =>
	chapter.status !== 'draft' || chapter.constructionSourceAligned === true || chapter.constructionVerified === true

export const exists = path => stat(path).then(() => true, () => false)

export function assertFreshReplayProof(proof, chapterId) {
	assert.equal(proof.chapter, chapterId, `${chapterId}: fresh proof belongs to another recipe`)
	const legacy = proof.kind === undefined && proof.freshReplay === undefined && proof.proofVersion === undefined
	const explicit = proof.kind === 'fresh-replay' && proof.freshReplay === true && proof.proofVersion === 2
	assert(legacy || explicit, `${chapterId}: proof does not declare a supported fresh replay format`)
	assert.match(proof.node, /^v\d+\.\d+\.\d+$/, `${chapterId}: fresh proof needs the replay Node version`)
	for (const [name, entries] of [['pages', proof.pages], ['files', proof.files]]) {
		assert(entries && typeof entries === 'object' && !Array.isArray(entries), `${chapterId}: fresh proof ${name} map is missing`)
		for (const [path, value] of Object.entries(entries)) {
			assert.equal(typeof path, 'string')
			assert(typeof value === 'string' && (/^[a-f0-9]{64}$/.test(value) || value.startsWith('symlink:')), `${chapterId}: invalid ${name} digest for ${path}`)
		}
	}
	assert(Array.isArray(proof.actions) && proof.actions.length > 0, `${chapterId}: fresh proof action evidence is missing`)
	for (const action of proof.actions) {
		assert.equal(typeof action.page, 'string', `${chapterId}: fresh proof action page is missing`)
		const variants = ['write', 'command', 'server', 'responseChecked'].filter(key => Object.hasOwn(action, key))
		assert.equal(variants.length, 1, `${chapterId}: fresh proof action has an invalid shape`)
	}
}

export async function readTrackedFreshReplayProof(chapterId) {
	const proofPath = join(retainedRoot(chapterId), '.tutorial-proof.json')
	const repositoryPath = relative(repoRoot, proofPath).split(sep).join('/')
	const source = await readFile(proofPath, 'utf8')
	let trackedSource
	try {
		trackedSource = (await execFileAsync('git', ['show', `HEAD:${repositoryPath}`], { cwd: repoRoot, encoding: 'utf8' })).stdout
	} catch (error) {
		throw new Error(`${chapterId}: fresh proof is not anchored in the checked-out Git revision`, { cause: error })
	}
	assert.equal(source, trackedSource, `${chapterId}: fresh proof differs from the checked-out Git revision`)
	const proof = JSON.parse(source)
	assertFreshReplayProof(proof, chapterId)
	return { proof, source }
}

export function sequence(id, seen = new Set(), active = new Set()) {
	assert(chapters.has(id), `Unknown chapter: ${id}`)
	assert(!active.has(id), `Chapter dependency cycle: ${id}`)
	if (seen.has(id)) return []
	active.add(id)
	const chapter = chapters.get(id)
	const result = (chapter.replayRequires ?? chapter.requires).flatMap(parent => sequence(parent, seen, active))
	active.delete(id)
	seen.add(id)
	return [...result, chapter]
}

export function readFrontmatter(source, page) {
	const match = source.match(/^---\n([\s\S]*?)\n---\n/)
	assert(match, `${page}: required frontmatter is missing`)
	const fields = new Map(match[1].split('\n').map(line => line.match(/^([a-zA-Z][\w-]*):\s*(.+)$/)).filter(Boolean).map(([, key, value]) => [key, value.trim()]))
	for (const field of ['title', 'description', 'order', 'kind', 'status']) assert(fields.get(field), `${page}: frontmatter requires ${field}`)
	assert(/^\d+$/.test(fields.get('order')), `${page}: frontmatter order must be an integer`)
	return fields
}

export function assertPublishedDependencySpec(projectId, packageName, version) {
	assert.equal(typeof version, 'string', `${projectId}: ${packageName} must have a version`)
	assert(!/^(?:file|link|workspace|copy|portal|patch):|^(?:\.\.?[/\\]|[/\\])/.test(version), `${projectId}: ${packageName} must use a published npm range`)
	assert.notEqual(version, 'latest', `${projectId}: ${packageName} must use an explicit published range`)
	if (packageName.startsWith('@purista/')) assert.equal(version, '^4.0.0', `${projectId}: ${packageName} must use the PURISTA v4 range`)
}

export function assertV4Source(source, page, enforce = true) {
	if (!enforce) return
	assert(!/\bsrc\/harness\//.test(source), `${page}: tutorial references forbidden top-level src/harness`)
	assert(!/HarnessMount\.[cm]?[jt]sx?/.test(source), `${page}: tutorial references a removed HarnessMount file`)
	assert(!/\bBankingService\b/.test(source), `${page}: tutorial uses the forbidden umbrella BankingService`)
	assert(!/\bagentPath\b|\bsrc\/agents\b|\battached agents\b/i.test(source), `${page}: source references the removed top-level agent layout`)
	if (page.endsWith('AGENTS.md')) {
		assert(source.includes('src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}'), `${page}: generated guidance misses the service-owned Harness layout`)
		assert(source.includes('singular `ai.model`'), `${page}: generated guidance misses the primary model binding`)
	}
	if (page.endsWith('.agents/IMPLEMENTATION.md')) {
		assert(source.includes('src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}'), `${page}: implementation guidance misses the service-owned Harness layout`)
		assert(source.includes('ServiceBuilder.defineTool(...)'), `${page}: implementation guidance misses PURISTA host tools`)
	}
}

export const requiredGeneratedScripts = {
	'add:service': 'purista add service',
	'add:command': 'purista add command',
	'add:subscription': 'purista add subscription',
	'add:stream': 'purista add stream',
	'add:queue': 'purista add queue',
	'add:queue-worker': 'purista add queue-worker',
	'add:agent': 'purista add agent',
	'add:workflow': 'purista add workflow',
	'add:tool': 'purista add tool',
	'add:skill': 'purista add skill',
	'add:mcp': 'purista add mcp',
}

export function assertGeneratedPackageScripts(projectId, packageJson) {
	for (const [name, command] of Object.entries(requiredGeneratedScripts))
		assert.equal(packageJson.scripts?.[name], command, `${projectId}: generated npm script ${name} drifted`)
}

function parseBlocks(source, page) {
	const blocks = [...source.matchAll(/^```(\w+)([^\n]*)\n([\s\S]*?)^```\s*$/gm)].map(match => {
		const metadata = match[2]
		const block = {
			language: match[1], metadata, body: `${match[3].trimEnd()}\n`,
			title: metadata.match(/title="([^"]+)"/)?.[1], replay: metadata.match(/replay="([^"]+)"/)?.[1],
			write: /(?:^|\s)write(?:\s|$)/.test(metadata), expect: metadata.match(/expect="([^"]+)"/)?.[1],
		}
		assert(block.title, `${page}: code block needs an exact file/action title`)
		if (block.replay) {
			assert.equal(block.language, 'bash', `${page}: replay action must be shell`)
			assert(['parent', 'project', 'server', 'request'].includes(block.replay), `${page}: unknown replay action`)
		}
		if (block.write) assert(['ts', 'tsx', 'json', 'yaml', 'javascript', 'css', 'html', 'md', 'dotenv', 'dockerfile', 'sql'].includes(block.language), `${page}: unsupported write fence language`)
		return block
	})
	let serverActive = false
	for (const block of blocks) {
		if (block.replay === 'server') serverActive = true
		if (block.replay === 'request') assert(serverActive, `${page}: request replay action requires a server action earlier on the same page`)
	}
	return blocks
}

export function publicInstallCommand(command) {
	return /(?:npm\s+(?:install|i|create)|npx\s+(?:--yes\s+)?(?:--package(?:=|\s+)))/.test(command)
}

export function assertPublicInstallCommands(source, page) {
	const commands = [...source.matchAll(/^```bash[^\n]*\n([\s\S]*?)^```\s*$/gm)].map(match => match[1])
	for (const command of commands.filter(publicInstallCommand)) {
		assert(!/(?:@latest\b|workspace:|file:|link:|copy:|portal:|patch:)/.test(command), `${page}: public install command uses an unpinned/private package form`)
		assert(!/@purista\/[A-Za-z0-9_-]+(?=[\s\\`]|$)/.test(command), `${page}: PURISTA installs must include an explicit version`)
		assert(!/\bnpm\s+create\s+purista(?=[\s\\`]|$)/.test(command), `${page}: PURISTA create must include an explicit version`)
		for (const match of command.matchAll(/@purista\/[A-Za-z0-9_-]+@([^\s\\`]+)/g))
			assert(/^4(?:\.\d+\.\d+)?$/.test(match[1]) || /^\^4\.0\.0$/.test(match[1]), `${page}: PURISTA install must use v4, received ${match[0]}`)
		for (const match of command.matchAll(/\bnpm\s+create\s+purista@([^\s\\`]+)/g))
			assert.equal(match[1], '3.0.0', `${page}: PURISTA create must use the published create-purista 3.0.0 release`)
	}
}

export async function pagesFor(id) {
	const pages = []
	for (const chapter of sequence(id)) {
		for (const page of chapter.pages) {
			assert(/^[a-z0-9/-]+$/.test(page), `Invalid page path: ${page}`)
			const source = await readFile(join(contentRoot, `${page}.mdx`), 'utf8')
			readFrontmatter(source, page)
			assertV4Source(source, page, enforcesV4Source(chapter))
			assertPublicInstallCommands(source, page)
			const blocks = parseBlocks(source, page)
			const packageWrites = blocks.filter(block => block.language === 'json' && block.title === 'package.json' && block.write)
			if (packageWrites.length) {
				const packageJson = (await readFile(join(retainedRoot(chapter.id), 'package.json'), 'utf8')).trimEnd()
				for (const block of packageWrites) assert.equal(block.body.trimEnd(), packageJson, `${page}: package.json write fence differs from ${chapter.id}`)
			}
			pages.push({ id: page, chapter, source, blocks, hasPackageWrite: packageWrites.length > 0 })
		}
	}
	return pages
}

export function writeTarget(block) {
	if (!block.write) return undefined
	if (block.title === 'package.json' || block.title.includes('/') || /\.[A-Za-z0-9]+$/.test(block.title)) return block.title
	return undefined
}

export async function sourceHashes(root, enforceV4Source, prefix = '') {
	const result = {}
	for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
		if (excludedArtifactNames.has(entry.name)) continue
		const path = join(prefix, entry.name)
		if (releaseMetadataArtifactNames.has(path)) continue
		if (enforceV4Source) {
			assert(path !== 'src/harness' && !path.startsWith(`src/harness${sep}`), `Top-level Harness path is forbidden: ${path}`)
			assert(!/HarnessMount\.[cm]?[jt]sx?$/.test(path), `HarnessMount file is forbidden: ${path}`)
		}
		if (entry.isSymbolicLink()) {
			const target = await readlink(join(root, path))
			assert(!isAbsolute(target) && resolve(dirname(join(root, path)), target).startsWith(`${root}${sep}`), `Source symlink escapes project: ${path}`)
			result[path] = `symlink:${target}`
		} else if (entry.isDirectory()) Object.assign(result, await sourceHashes(root, enforceV4Source, path))
		else {
			const content = await readFile(join(root, path))
			if (enforceV4Source && /(?:\.[cm]?[jt]sx?|\.json|\.md)$/.test(path)) assertV4Source(content.toString('utf8'), path)
			result[path] = digest(content)
		}
	}
	return result
}

export async function assertServiceBoundaries(root, enforceV4Source) {
	if (enforceV4Source) assert(!(await exists(join(root, 'src/harness'))), 'Top-level src/harness is forbidden')
	const serviceRoot = join(root, 'src/service')
	if (!(await exists(serviceRoot))) return
	for (const entry of await readdir(serviceRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue
		const normalized = entry.name.replace(/[^a-z0-9]/gi, '').toLowerCase()
		if (enforceV4Source) assert(!forbiddenServiceNames.has(normalized), `Forbidden umbrella service directory: ${entry.name}`)
		assert(allowedServiceNames.has(normalized) || scaffoldServiceNames.has(normalized), `Service is outside the reviewed capability catalog: ${entry.name}`)
	}
}

export function actionRecords(pages) {
	return pages.flatMap(page => page.blocks.flatMap(block => {
		if (block.write) return [{ page: page.id, write: block.title, body: block.body }]
		if (block.replay) return [{ page: page.id, command: block.body, replay: block.replay }]
		if (block.expect) return [{ page: page.id, expect: block.expect, body: block.body }]
		return []
	}))
}

export function isPublicInstallAction(command) {
	return publicInstallCommand(command)
}

export function relativeTarget(root, target) {
	const resolved = resolve(root, target)
	assert(!isAbsolute(target) && resolved.startsWith(`${root}${sep}`), `Write target escapes project: ${target}`)
	assert(!relative(root, resolved).split(sep).includes('node_modules'), `Write target enters node_modules: ${target}`)
	return resolved
}
