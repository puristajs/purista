#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

const readDockerContextHost = () => {
	const probe = spawnSync('docker', ['context', 'inspect', '--format', '{{json .Endpoints.docker.Host}}'], {
		encoding: 'utf8',
	})
	if (probe.error || probe.status !== 0) {
		return undefined
	}

	const raw = probe.stdout.trim()
	if (!raw) {
		return undefined
	}

	try {
		const parsed = JSON.parse(raw)
		return typeof parsed === 'string' && parsed.length > 0 ? parsed : undefined
	} catch {
		return undefined
	}
}

const resolveDockerHost = () => {
	if (process.env.DOCKER_HOST) {
		return process.env.DOCKER_HOST
	}

	const contextHost = readDockerContextHost()
	if (contextHost) {
		return contextHost
	}

	const socketCandidates = [
		`${homedir()}/.orbstack/run/docker.sock`,
		`${homedir()}/.colima/default/docker.sock`,
		'/var/run/docker.sock',
	]

	for (const socketPath of socketCandidates) {
		if (existsSync(socketPath)) {
			return `unix://${socketPath}`
		}
	}

	return undefined
}

const [command, ...args] = process.argv.slice(2)
if (!command) {
	process.stderr.write('runWithDockerHost requires a command argument\n')
	process.exit(1)
}

const dockerHost = resolveDockerHost()
const env = dockerHost && !process.env.DOCKER_HOST ? { ...process.env, DOCKER_HOST: dockerHost } : { ...process.env }

if (dockerHost && !process.env.DOCKER_HOST) {
	process.stderr.write(`Using auto-detected DOCKER_HOST=${dockerHost}\n`)
}

const result = spawnSync(command, args, {
	stdio: 'inherit',
	env,
	shell: process.platform === 'win32',
})

if (result.error) {
	process.stderr.write(`${result.error.message}\n`)
	process.exit(1)
}

process.exit(result.status ?? 1)
