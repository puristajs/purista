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
		const route = path.startsWith('/') ? path : '/api/v1/bank'
		const response = await fetch('http://127.0.0.1:3000' + route, { signal: AbortSignal.timeout(3000) })
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
		const hasTransforms = ['legacy-import', 'csv-export', 'legacy-http'].includes(path)
		if (path === 'account-access' || path === 'account-overview' || hasTransforms) {
			const request = (route, init = {}) =>
				fetch('http://127.0.0.1:3000' + route, { ...init, signal: AbortSignal.timeout(3000) })
			const login = async actor => {
				const response = await request('/auth/login', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ actor }),
				})
				assert.equal(response.status, 200)
				const cookie = response.headers.get('set-cookie')?.split(';', 1)[0]
				assert(cookie, 'Login did not provide a cookie')
				return (route, init = {}) => request(route, { ...init, headers: { ...init.headers, cookie } })
			}
			const history = '/api/v1/accounts/account-a/transactions'
			assert.equal((await request(history)).status, 401)
			const bob = await login('bob')
			const dana = await login('dana')
			const south = await login('danaSouth')
			assert.equal((await bob(history)).status, 200)
			assert.equal((await bob('/api/v1/accounts/account-c/transactions')).status, 403)
			const fixture = JSON.parse(await readFile(resolve(project, 'fixtures/transaction.json'), 'utf8'))
			const post = client =>
				client('/api/v1/transactions', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(fixture),
				})
			assert.equal((await post(bob)).status, 403)
			assert.equal((await post(dana)).status, 200)
			assert.equal((await post(dana)).status, 409)
			const northHistory = await (await bob(history)).json()
			assert.equal(northHistory.tenantId, 'tenant-north')
			assert.equal(northHistory.transactions.length, 1)
			assert.deepEqual(await (await south(history)).json(), {
				tenantId: 'tenant-south',
				accountId: 'account-a',
				transactions: [],
			})
			if (path === 'account-overview' || hasTransforms) {
				const overview = '/api/v1/accounts/account-a/overview'
				const northResult = await bob(overview)
				assert.equal(northResult.status, 200)
				assert.deepEqual(await northResult.json(), {
					tenantId: 'tenant-north',
					accountId: 'account-a',
					transactionCount: 1,
				})
				const southResult = await south(overview)
				assert.equal(southResult.status, 200)
				assert.deepEqual(await southResult.json(), {
					tenantId: 'tenant-south',
					accountId: 'account-a',
					transactionCount: 0,
				})
				assert.equal((await bob('/api/v1/accounts/account-c/overview')).status, 403)
			}
			if (hasTransforms) {
				const legacy = JSON.parse(await readFile(resolve(project, 'fixtures/legacy-transaction.json'), 'utf8'))
				const importLegacy = (client, payload = legacy) =>
					client('/api/v1/legacy-transactions', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(payload),
					})
				assert.equal((await importLegacy(bob)).status, 403)
				const imported = await importLegacy(dana)
				assert.equal(imported.status, 200)
				assert.equal((await imported.json()).amountMinor, 12540)
				assert.equal((await importLegacy(dana)).status, 409)
				assert.equal((await importLegacy(dana, { ...legacy, amount: '125.401' })).status, 400)
				assert.equal((await (await bob(history)).json()).transactions.length, 2)
				if (path === 'csv-export' || path === 'legacy-http') {
					const csv = await bob('/api/v1/accounts/account-a/statement.csv')
					assert.equal(csv.status, 200)
					assert.equal(csv.headers.get('content-type'), 'text/csv; charset=utf-8')
					assert.equal(csv.headers.get('content-disposition'), 'attachment; filename="statement.csv"')
					const body = await csv.text()
					assert(body.startsWith('transactionId,sourceTransactionId,bookedAt,amountMinor,currency,direction\r\n'))
					assert(body.includes('12540'))
					assert(!body.includes('tenant-north'))
					assert.equal((await bob('/api/v1/accounts/account-c/statement.csv')).status, 403)
				}
			}
			assert.equal((await bob('/auth/logout', { method: 'POST' })).status, 200)
			assert.equal((await bob(history)).status, 401)
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
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number)
assert(
	nodeMajor > 24 || (nodeMajor === 24 && nodeMinor >= 15),
	'Replay requires Node >=24.15; found ' + process.versions.node,
)
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
