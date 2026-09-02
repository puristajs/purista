#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { cp, mkdir, readdir, readFile, readlink, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const directory = dirname(fileURLToPath(import.meta.url))
const bankRoot = resolve(directory, '..')
const repo = resolve(bankRoot, '../..')
const contentRoot = join(repo, 'web/src/content/tutorials')
const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'))
const { values } = parseArgs({
	options: {
		chapter: { type: 'string' },
		out: { type: 'string' },
		check: { type: 'boolean' },
		retain: { type: 'boolean' },
	},
})
const digest = data => createHash('sha256').update(data).digest('hex')
const excludedArtifactNames = new Set([
	'node_modules',
	'dist',
	'.git',
	'.tutorial-proof.json',
	'coverage',
	'var',
	'.DS_Store',
])
const retainedCopyExcludedNames = new Set(['node_modules', 'dist', '.git', 'coverage', 'var', '.DS_Store'])
const exists = path =>
	stat(path).then(
		() => true,
		() => false,
	)
const recipes = [...course.chapters, ...(course.baselines ?? [])]
const baselineIds = new Set((course.baselines ?? []).map(baseline => baseline.id))
const chapters = new Map(recipes.map(chapter => [chapter.id, chapter]))
assert.equal(chapters.size, recipes.length, 'Duplicate recipe identifier')
const retainedRoot = id => join(bankRoot, baselineIds.has(id) ? 'baselines' : 'chapters', id)
const forbiddenServiceNames = new Set(
	(course.forbiddenServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()),
)
const allowedServiceNames = new Set(
	(course.allowedServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()),
)
const scaffoldServiceNames = new Set(
	(course.scaffoldServiceNames ?? []).map(name => name.replace(/[^a-z0-9]/gi, '').toLowerCase()),
)

async function assertServiceBoundaries(root) {
	const serviceRoot = join(root, 'src/service')
	if (!(await exists(serviceRoot))) return
	for (const entry of await readdir(serviceRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue
		const normalized = entry.name.replace(/[^a-z0-9]/gi, '').toLowerCase()
		assert(!forbiddenServiceNames.has(normalized), `Forbidden umbrella service directory: ${entry.name}`)
		assert(
			allowedServiceNames.has(normalized) || scaffoldServiceNames.has(normalized),
			`Service is outside the reviewed capability catalog: ${entry.name}`,
		)
	}
}

function sequence(id, seen = new Set(), active = new Set()) {
	assert(chapters.has(id), `Unknown chapter: ${id}`)
	assert(!active.has(id), `Chapter dependency cycle: ${id}`)
	if (seen.has(id)) return []
	active.add(id)
	const chapter = chapters.get(id)
	const result = chapter.requires.flatMap(parent => sequence(parent, seen, active))
	active.delete(id)
	seen.add(id)
	return [...result, chapter]
}

async function pagesFor(id) {
	return Promise.all(
		sequence(id)
			.flatMap(chapter => chapter.pages)
			.map(async page => {
				assert(/^[a-z0-9/-]+$/.test(page), `Invalid page path: ${page}`)
				const source = await readFile(join(contentRoot, `${page}.mdx`), 'utf8')
				const blocks = [...source.matchAll(/^```(\w+)([^\n]*)\n([\s\S]*?)^```\s*$/gm)].map(match => ({
					language: match[1],
					metadata: match[2],
					body: `${match[3].trimEnd()}\n`,
					title: match[2].match(/title="([^"]+)"/)?.[1],
					replay: match[2].match(/replay="([^"]+)"/)?.[1],
					write: /(?:^|\s)write(?:\s|$)/.test(match[2]),
					expect: match[2].match(/expect="([^"]+)"/)?.[1],
				}))
				for (const block of blocks) {
					assert(block.title, `${page}: code block needs an exact file/action title`)
					if (block.write)
						assert(
							['ts', 'tsx', 'json', 'yaml', 'javascript', 'css', 'html', 'md', 'dockerfile', 'sql'].includes(
								block.language,
							),
						)
					if (block.replay) {
						assert.equal(block.language, 'bash', `${page}: replay action must be shell`)
						assert(['parent', 'project', 'server', 'request'].includes(block.replay), `${page}: unknown replay action`)
					}
				}
				return { id: page, source, blocks }
			}),
	)
}

async function sourceHashes(root, prefix = '') {
	const result = {}
	for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
		if (excludedArtifactNames.has(entry.name)) continue
		const path = join(prefix, entry.name)
		if (entry.isSymbolicLink()) {
			const target = await readlink(join(root, path))
			assert(
				!isAbsolute(target) && resolve(dirname(join(root, path)), target).startsWith(`${root}${sep}`),
				`Source symlink escapes project: ${path}`,
			)
			result[path] = `symlink:${target}`
		} else if (entry.isDirectory()) Object.assign(result, await sourceHashes(root, path))
		else result[path] = digest(await readFile(join(root, path)))
	}
	return result
}

if (values.check) {
	const checkedRecipes = values.chapter ? sequence(values.chapter) : recipes
	let verified = 0
	let verifiedBaselines = 0
	for (const chapter of checkedRecipes) {
		if (chapter.status === 'draft') continue
		const root = retainedRoot(chapter.id)
		await assertServiceBoundaries(root)
		const proofFile = join(root, '.tutorial-proof.json')
		assert(await exists(proofFile), `${chapter.id}: no completed instruction replay`)
		const proof = JSON.parse(await readFile(proofFile, 'utf8'))
		const pages = await pagesFor(chapter.id)
		assert.deepEqual(
			proof.pages,
			Object.fromEntries(pages.map(page => [page.id, digest(page.source)])),
			`${chapter.id}: instructions changed; replay again`,
		)
		assert.deepEqual(proof.files, await sourceHashes(root), `${chapter.id}: solution differs from the replay result`)
		if (baselineIds.has(chapter.id)) verifiedBaselines++
		else verified++
	}
	assert(verified > 0, 'No chapter has been replayed')
	process.stdout.write(
		`Verified instruction/source provenance for ${verified} chapter(s) and ${verifiedBaselines} baseline(s); ${course.plannedChapters} chapters planned. This check does not rerun applications.\n`,
	)
	process.exit(0)
}

assert(values.chapter && values.out, 'Use --chapter <id> --out <new-directory> [--retain], or --check')
const pages = await pagesFor(values.chapter)
const output = resolve(values.out)
assert(!(await exists(output)), 'Output directory must not exist; never overwrite another project')
assert(!output.startsWith(`${repo}${sep}`), 'Replay outside the monorepo to verify a consumer installation')
await mkdir(output, { recursive: true })
const project = join(output, 'example-bank')
const actions = []
let server
let serverExit
let lastResponse

function signalOwnedGroup(child, signal) {
	try {
		process.kill(-child.pid, signal)
	} catch (error) {
		if (error.code !== 'ESRCH') throw error
	}
}

async function requireAvailableTutorialPort() {
	const probe = createServer()
	probe.listen(3000, '127.0.0.1')
	try {
		await once(probe, 'listening')
	} catch {
		throw new Error(
			'Port 3000 is unavailable. Stop your own tutorial server before replaying; no existing process was stopped.',
		)
	}
	await new Promise((resolveClose, reject) => probe.close(error => (error ? reject(error) : resolveClose())))
}

function run(body, cwd) {
	return new Promise((resolveRun, reject) => {
		const child = spawn('bash', ['-e', '-o', 'pipefail', '-c', body], {
			cwd,
			detached: true,
			env: { ...process.env, CI: '1', PURISTA_TUTORIAL_REPOSITORY: repo },
			stdio: ['ignore', 'pipe', 'pipe'],
		})
		let stdout = ''
		child.stdout.on('data', data => {
			stdout += data
			process.stdout.write(data)
		})
		child.stderr.on('data', data => process.stderr.write(data))
		let forceStop
		const timer = setTimeout(() => {
			signalOwnedGroup(child, 'SIGTERM')
			forceStop = setTimeout(() => signalOwnedGroup(child, 'SIGKILL'), 10_000)
		}, 300_000)
		child.once('error', error => {
			clearTimeout(timer)
			clearTimeout(forceStop)
			reject(error)
		})
		child.once('close', (code, signal) => {
			clearTimeout(timer)
			clearTimeout(forceStop)
			if (code === 0) resolveRun(stdout)
			else reject(new Error(`Instruction failed (code ${code}, signal ${signal}):\n${body}`))
		})
	})
}

async function stopServer() {
	if (!server) return
	signalOwnedGroup(server, 'SIGTERM')
	const timer = setTimeout(() => signalOwnedGroup(server, 'SIGKILL'), 10_000)
	try {
		await serverExit
	} finally {
		clearTimeout(timer)
		server = undefined
	}
}

try {
	for (const page of pages) {
		process.stdout.write(`\nFollow ${page.id}\n`)
		for (const block of page.blocks) {
			if (block.write) {
				const target = resolve(project, block.title)
				assert(!isAbsolute(block.title) && target.startsWith(`${project}${sep}`), 'File edit escapes the project')
				assert(!relative(project, target).split(sep).includes('node_modules'), 'Do not patch dependencies')
				await mkdir(dirname(target), { recursive: true })
				await writeFile(target, block.body)
				actions.push({ page: page.id, write: block.title })
			} else if (block.replay === 'server') {
				await stopServer()
				await requireAvailableTutorialPort()
				server = spawn('bash', ['-e', '-c', block.body], {
					cwd: project,
					detached: true,
					stdio: ['ignore', 'pipe', 'pipe'],
				})
				server.stdout.on('data', data => process.stdout.write(data))
				server.stderr.on('data', data => process.stderr.write(data))
				serverExit = once(server, 'close')
				// Readiness is a real request; retries are bounded and never authorize killing another listener.
				let ready = false
				for (let attempt = 0; attempt < 60; attempt++) {
					assert(server.exitCode === null, 'Documented server exited before accepting a request')
					try {
						const response = await fetch('http://127.0.0.1:3000/health', { signal: AbortSignal.timeout(500) })
						if (response.ok) {
							ready = true
							break
						}
					} catch {}
					await new Promise(resolveWait => setTimeout(resolveWait, 100))
				}
				assert(ready, 'Server did not become ready')
				actions.push({ page: page.id, server: block.body })
			} else if (block.replay) {
				lastResponse = await run(block.body, block.replay === 'parent' ? output : project)
				actions.push({ page: page.id, command: block.body })
			} else if (block.expect === 'json') {
				assert.deepEqual(
					JSON.parse(lastResponse),
					JSON.parse(block.body),
					`${page.id}: request differs from the shown result`,
				)
				actions.push({ page: page.id, responseChecked: true })
			}
		}
		await stopServer()
	}
	await assertServiceBoundaries(project)
	const proof = {
		chapter: values.chapter,
		node: process.version,
		pages: Object.fromEntries(pages.map(page => [page.id, digest(page.source)])),
		files: await sourceHashes(project),
		actions,
	}
	await writeFile(join(project, '.tutorial-proof.json'), `${JSON.stringify(proof, null, 2)}\n`)
	if (values.retain) {
		const target = retainedRoot(values.chapter)
		assert(!(await exists(target)), 'Retained solution already exists; review it before replacing it')
		await mkdir(dirname(target), { recursive: true })
		await cp(project, target, {
			recursive: true,
			verbatimSymlinks: true,
			filter: path => !retainedCopyExcludedNames.has(path.split(sep).at(-1)),
		})
		process.stdout.write(`Retained the replay result in ${relative(repo, target)}\n`)
	}
	process.stdout.write(`Completed ${actions.length} documented actions from ${pages.length} pages in ${project}\n`)
} finally {
	await stopServer()
}
