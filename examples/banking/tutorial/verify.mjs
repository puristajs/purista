#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = dirname(fileURLToPath(import.meta.url))
const bankRoot = join(directory, '..')
const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'))
const retainedChapters = course.chapters.filter(chapter => chapter.status !== 'draft')

function run(command, args, cwd) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { cwd, stdio: 'inherit', env: { ...process.env, CI: '1' } })
		child.once('error', reject)
		child.once('exit', (code, signal) => {
			if (code === 0) resolve()
			else reject(new Error(`${command} ${args.join(' ')} failed (${code ?? signal})`))
		})
	})
}

async function unusedPort() {
	const probe = createServer()
	probe.listen(0, '127.0.0.1')
	await once(probe, 'listening')
	const address = probe.address()
	assert(address && typeof address !== 'string')
	await new Promise((resolve, reject) => probe.close(error => (error ? reject(error) : resolve())))
	return address.port
}

async function smokeProcessExit(project, smoke, environment = {}) {
	const child = spawn(process.execPath, ['dist/index.js'], {
		cwd: project,
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, ...environment },
	})
	let output = ''
	child.stdout.on('data', data => {
		output += data
	})
	child.stderr.on('data', data => {
		output += data
	})
	const timeout = setTimeout(() => child.kill('SIGKILL'), 10_000)
	const [code, signal] = await once(child, 'exit')
	clearTimeout(timeout)
	assert.equal(signal, null, `Compiled application did not exit cleanly: ${output}`)
	assert.equal(code, 0, `Compiled application failed: ${output}`)
	assert(output.includes(smoke.expectOutput), `Missing runtime evidence ${smoke.expectOutput}: ${output}`)
	process.stdout.write(`Compiled entry point emitted: ${smoke.expectOutput}.\n`)
}

async function smokeHttpApplication(project, smoke, environment = {}) {
	const port = await unusedPort()
	const child = spawn(process.execPath, ['dist/index.js'], {
		cwd: project,
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, ...environment, PORT: String(port) },
	})
	const exited = once(child, 'exit')
	let output = ''
	child.stdout.on('data', data => {
		output += data
	})
	child.stderr.on('data', data => {
		output += data
	})
	try {
		let response
		for (let attempt = 0; attempt < 100; attempt++) {
			assert(child.exitCode === null, `Compiled server exited before readiness: ${output}`)
			try {
				response = await fetch(`http://127.0.0.1:${port}${smoke.path}`, { signal: AbortSignal.timeout(500) })
				break
			} catch {}
			await new Promise(resolve => setTimeout(resolve, 100))
		}
		assert(response, `Compiled server did not become ready: ${output}`)
		assert.equal(response.status, 200)
		assert.deepEqual(await response.json(), smoke.expectJson)
		process.stdout.write(`Compiled entry point served ${smoke.path} over loopback HTTP.\n`)
	} finally {
		if (child.exitCode === null && child.signalCode === null) {
			child.kill('SIGTERM')
			const timeout = setTimeout(() => child.kill('SIGKILL'), 10_000)
			try {
				await exited
			} finally {
				clearTimeout(timeout)
			}
		}
	}
}

async function smokeCompiledApplication(project, chapter) {
	assert(chapter.smoke, `${chapter.id}: published recipe needs a runtime smoke contract`)
	if (chapter.smoke.type === 'process-exit')
		return smokeProcessExit(project, chapter.smoke, chapter.environment)
	if (chapter.smoke.type === 'http')
		return smokeHttpApplication(project, chapter.smoke, chapter.environment)
	assert.fail(`${chapter.id}: unknown runtime smoke type ${chapter.smoke.type}`)
}

await run(process.execPath, [join(directory, 'replay.mjs'), '--check'], bankRoot)
const scratch = await mkdtemp(join(tmpdir(), 'purista-bank-verify-'))
try {
	for (const chapter of retainedChapters) {
		const project = join(scratch, chapter.id)
		await cp(join(bankRoot, 'chapters', chapter.id), project, {
			recursive: true,
			verbatimSymlinks: true,
			filter: path => !['node_modules', 'dist', '.git'].includes(path.split(sep).at(-1)),
		})
		process.stdout.write(`\nVerify retained consumer project: ${chapter.id}\n`)
		await run('npm', ['ci', '--no-audit', '--no-fund'], project)
		await run('npm', ['test'], project)
		for (const verification of chapter.verification ?? []) {
			assert.equal(typeof verification.command, 'string', `${chapter.id}: verification command must be a string`)
			assert(Array.isArray(verification.args), `${chapter.id}: verification args must be an array`)
			await run(verification.command, verification.args, project)
		}
		await run('npm', ['run', 'build'], project)
		await smokeCompiledApplication(project, chapter)
	}
	process.stdout.write(
		`Verified ${retainedChapters.length} retained applications; ${course.plannedChapters} chapters planned.\n`,
	)
} finally {
	await rm(scratch, { recursive: true, force: true })
}
