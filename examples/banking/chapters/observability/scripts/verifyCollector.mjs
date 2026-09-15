import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { connect } from 'node:net'

const compose = ['compose', '-f', 'compose.observability.yaml']

function docker(...args) {
	const result = spawnSync('docker', args, { encoding: 'utf8' })
	if (result.status !== 0) {
		throw new Error(`${result.stdout}\n${result.stderr}`)
	}
	return `${result.stdout}${result.stderr}`
}

async function waitForCollector() {
	for (let attempt = 0; attempt < 80; attempt += 1) {
		const socket = connect({ host: '127.0.0.1', port: 4318 })
		const connected = once(socket, 'connect').then(() => true, () => false)
		const failed = once(socket, 'error').then(() => false)
		if (await Promise.race([connected, failed])) {
			socket.destroy()
			return
		}
		socket.destroy()
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	throw new Error('Collector did not open its loopback OTLP port')
}

try {
	docker(...compose, 'up', '-d')
	await waitForCollector()

	const probe = spawn(process.execPath, ['--import', 'tsx', 'src/collectorProbe.ts'], {
		env: { ...process.env, OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:4318' },
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	let probeOutput = ''
	probe.stdout.on('data', data => { probeOutput += data })
	probe.stderr.on('data', data => { probeOutput += data })
	const [code] = await once(probe, 'close')
	assert.equal(code, 0, probeOutput)
	assert.match(probeOutput, /Collector probe exported telemetry/)

	await new Promise(resolve => setTimeout(resolve, 500))
	const evidence = docker(...compose, 'logs', '--no-color', 'collector')
	for (const expected of [
		'app.transaction.recorded',
		'app.monitoring.large_debit.signals',
		'purista.command.executions',
		'purista.subscription.executions',
		'observeLargeDebit',
	]) {
		assert(evidence.includes(expected), `Collector output is missing ${expected}`)
	}
	for (const forbidden of [
		'Northwind Books',
		'account-operating',
		'tenant-example',
		'purista.tenantId',
		'purista.principalId',
	]) {
		assert(!evidence.includes(forbidden), `Collector output contains restricted value ${forbidden}`)
	}
	process.stdout.write('Collector received safe Framework and application telemetry.\n')
} finally {
	spawnSync('docker', [...compose, 'down', '--volumes', '--remove-orphans'], { stdio: 'inherit' })
}
