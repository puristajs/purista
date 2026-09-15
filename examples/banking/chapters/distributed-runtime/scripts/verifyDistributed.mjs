import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const compose = ['compose', '-f', 'compose.distributed.yaml']
const workDirectory = await mkdtemp(join(tmpdir(), 'example-bank-distributed-'))
const running = new Map()

async function freePort() {
	const server = createServer()
	server.listen(0, '127.0.0.1')
	await once(server, 'listening')
	const address = server.address()
	if (!address || typeof address === 'string') throw new Error('Could not reserve a local port')
	await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
	return address.port
}

const natsPort = await freePort()
const natsUrl = `nats://127.0.0.1:${natsPort}`
const composeEnvironment = { ...process.env, EXAMPLE_BANK_NATS_PORT: String(natsPort) }

function docker(...args) {
	const result = spawnSync('docker', args, { encoding: 'utf8', env: composeEnvironment })
	if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`)
	return `${result.stdout}${result.stderr}`
}

async function waitForHealth(role, port, child, output) {
	for (let attempt = 0; attempt < 120; attempt += 1) {
		if (child.exitCode !== null) throw new Error(`${role} exited before health was ready:\n${output()}`)
		try {
			const response = await fetch(`http://127.0.0.1:${port}/health`, {
				signal: AbortSignal.timeout(300),
			})
			if (response.ok) return
		} catch {}
		await new Promise(resolve => setTimeout(resolve, 50))
	}
	throw new Error(`${role} health endpoint did not become ready:\n${output()}`)
}

async function startRole(role, healthPort) {
	const child = spawn(process.execPath, ['--import', 'tsx', 'src/distributed.ts'], {
		env: {
			...process.env,
			PURISTA_PROCESS_ROLE: role,
			HEALTH_PORT: String(healthPort),
			NATS_URL: natsUrl,
			TRANSACTION_DB_PATH: join(workDirectory, 'transactions.sqlite'),
		},
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	let output = ''
	child.stdout.on('data', data => { output += data })
	child.stderr.on('data', data => { output += data })
	await waitForHealth(role, healthPort, child, () => output)
	const runtime = { role, healthPort, child, output: () => output }
	running.set(role, runtime)
	return runtime
}

async function stopRole(role) {
	const runtime = running.get(role)
	if (!runtime) return
	running.delete(role)
	runtime.child.kill('SIGTERM')
	const [code, signal] = await once(runtime.child, 'close')
	assert(code === 0 || signal === 'SIGTERM', `${role} did not stop cleanly:\n${runtime.output()}`)
}

async function runProbe(...args) {
	const child = spawn(process.execPath, ['--import', 'tsx', 'src/distributedProbe.ts', ...args], {
		env: { ...process.env, NATS_URL: natsUrl },
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	let stdout = ''
	let stderr = ''
	child.stdout.on('data', data => { stdout += data })
	child.stderr.on('data', data => { stderr += data })
	const [code] = await once(child, 'close')
	assert.equal(code, 0, stderr)
	const line = stdout.trim().split('\n').at(-1)
	assert(line, 'Probe did not print a JSON result')
	return JSON.parse(line)
}

async function verifyUnavailableBroker() {
	const healthPort = await freePort()
	const child = spawn(process.execPath, ['--import', 'tsx', 'src/distributed.ts'], {
		env: {
			...process.env,
			PURISTA_PROCESS_ROLE: 'transaction',
			HEALTH_PORT: String(healthPort),
			NATS_URL: natsUrl,
			TRANSACTION_DB_PATH: join(workDirectory, 'unavailable.sqlite'),
		},
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	let output = ''
	child.stderr.on('data', data => { output += data })
	const [code] = await once(child, 'close')
	assert.notEqual(code, 0)
	assert.match(output, /Distributed process could not start/)
}

try {
	docker(...compose, 'up', '-d', '--wait')
	const ports = {
		transaction: await freePort(),
		monitoring: await freePort(),
		reporting: await freePort(),
	}
	await startRole('transaction', ports.transaction)
	await startRole('monitoring', ports.monitoring)
	await startRole('reporting', ports.reporting)

	const flow = await runProbe('flow')
	assert.equal(flow.signalStored, true)
	assert.equal(flow.duplicateJobIdReused, true)
	assert.equal(flow.queueStatus, 'success')

	await stopRole('monitoring')
	const recordedWhileStopped = await runProbe('record')
	await startRole('monitoring', ports.monitoring)
	const recovered = await runProbe('wait-signal', recordedWhileStopped.transactionId)
	assert.equal(recovered.recovered, true)

	await stopRole('reporting')
	await stopRole('monitoring')
	await stopRole('transaction')
	docker(...compose, 'down', '--volumes', '--remove-orphans')
	await verifyUnavailableBroker()
	process.stdout.write('Distributed EventBridge, subscription, queue, restart, and failure checks passed.\n')
} finally {
	for (const role of [...running.keys()].reverse()) {
		await stopRole(role).catch(() => undefined)
	}
	spawnSync('docker', [...compose, 'down', '--volumes', '--remove-orphans'], {
		stdio: 'inherit', env: composeEnvironment,
	})
	await rm(workDirectory, { recursive: true, force: true })
}
