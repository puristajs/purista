import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '../../..')
const steps = JSON.parse(await readFile(resolve(here, 'steps.json'), 'utf8'))
const args = process.argv.slice(2)
const report = message => process.stdout.write(`${message}\n`)
const option = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const to = option('--to') ?? steps.at(-1).id
const last = steps.findIndex(step => step.id === to)
assert(last >= 0, 'Unknown checkpoint: ' + to)

/** Fail when the file a learner copies differs from the executable snapshot. */
async function checkDocs() {
	let count = 0
	for (const step of steps) {
		for (const file of step.files) {
			const source = await readFile(resolve(here, 'steps', step.id, file.path), 'utf8')
			const page = await readFile(resolve(repo, 'web/src/content/tutorials', file.page + '.mdx'), 'utf8')
			const title = 'title="' + file.path + '"'
			const blocks = [...page.matchAll(/\x60\x60\x60[^\n]*\n([\s\S]*?)\n\x60\x60\x60/g)]
			const matching = blocks.filter(block => block[0].split('\n')[0].includes(title))
			assert(
				matching.some(block => block[1].trimEnd() === source.trimEnd()),
				step.id + ': documented file differs: ' + file.path + ' in ' + file.page,
			)
			count++
		}
	}
	report(`Documentation matches ${count} checkpoint files.`)
}

function run(command, parameters, cwd) {
	report(`> ${[command, ...parameters].join(' ')}`)
	const result = spawnSync(command, parameters, {
		cwd,
		stdio: 'inherit',
		env: { ...process.env, npm_config_fetch_retries: '0' },
	})
	if (result.error) throw result.error
	assert.equal(result.status, 0, command + ' failed in ' + cwd)
}

/** Exercise the documented network entry point, then stop only our child. */
async function probe(project, path) {
	const child = spawn(process.execPath, ['dist/index.js'], {
		cwd: project,
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	let logs = ''
	child.stdout.on('data', chunk => {
		logs += chunk
	})
	child.stderr.on('data', chunk => {
		logs += chunk
	})
	const stopped = new Promise(resolve => child.once('exit', resolve))
	try {
		const deadline = Date.now() + 10_000
		while (!logs.includes('Example Bank is listening')) {
			assert(child.exitCode === null, 'Server exited before readiness: ' + logs)
			assert(Date.now() < deadline, 'Server did not start: ' + logs)
			await new Promise(resolve => setTimeout(resolve, 50))
		}
		// Let socket errors (for example, an occupied port) reach the child first.
		await new Promise(resolve => setTimeout(resolve, 100))
		assert(child.exitCode === null, 'Server could not bind its port: ' + logs)
		const response = await fetch('http://127.0.0.1:3000' + path, { signal: AbortSignal.timeout(3000) })
		assert.equal(response.status, 200, path + ' did not return 200')
		const body = await response.json()
		if (path === '/health') assert.deepEqual(body, { status: 200, message: 'OK' })
		if (path === '/api/v1/bank') assert.deepEqual(body, { name: 'Example Bank', currency: 'EUR' })
		if (path === '/api/v1/accounts/account-a/transactions') {
			assert.deepEqual(body, { accountId: 'account-a', transactions: [] })
			const fixture = JSON.parse(await readFile(resolve(project, 'fixtures/transaction.json'), 'utf8'))
			const post = payload =>
				fetch('http://127.0.0.1:3000/api/v1/transactions', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(payload),
					signal: AbortSignal.timeout(3000),
				})
			const recorded = await post(fixture)
			assert.equal(recorded.status, 200)
			const saved = await recorded.json()
			assert.equal((await post(fixture)).status, 409)
			assert.equal((await post({ ...fixture, sourceTransactionId: 'bad-amount', amountMinor: -1 })).status, 400)
			const history = await fetch('http://127.0.0.1:3000' + path, { signal: AbortSignal.timeout(3000) })
			assert.deepEqual(await history.json(), { accountId: 'account-a', transactions: [saved] })
		}
		report(`HTTP checkpoint passed: ${path}`)
	} finally {
		child.kill('SIGTERM')
		const timer = setTimeout(() => child.kill('SIGKILL'), 5000)
		await stopped
		clearTimeout(timer)
	}
}

await checkDocs()
if (args.includes('--check-docs')) process.exit(0)
assert(option('--out'), 'Supply --out with a NEW directory outside the repository.')
const target = resolve(option('--out'))
assert(!existsSync(target), 'Refusing to overwrite an existing directory: ' + target)
await mkdir(dirname(target), { recursive: true })
run(
	'npx',
	[
		'--yes',
		'--package=@purista/cli@3.2.4',
		'--package=@purista/core@3.2.4',
		'purista',
		'init',
		target,
		'--runtime',
		'node',
		'--event-bridge',
		'default',
		'--package-manager',
		'npm',
		'--no-webserver',
		'--no-install',
		'--defaults',
		'--non-interactive',
	],
	dirname(target),
)

for (const step of steps.slice(0, last + 1)) {
	// The first compiler configuration is installed before dependencies/tests.
	if (step.id !== 'project') {
		for (const [command, ...parameters] of step.commands) run(command, parameters, target)
	}
	for (const file of step.files) {
		const destination = resolve(target, file.path)
		await mkdir(dirname(destination), { recursive: true })
		await writeFile(destination, await readFile(resolve(here, 'steps', step.id, file.path)))
	}
	if (step.id === 'project') {
		for (const [command, ...parameters] of step.commands) run(command, parameters, target)
	}
	run('npm', ['test'], target)
	run('npm', ['run', 'build'], target)
	if (args.includes('--verify-http') && step.probe) await probe(target, step.probe)
	report(`Verified checkpoint: ${step.id}`)
}
report(`Ready: ${target}\nRun npm run dev there to continue building.`)
