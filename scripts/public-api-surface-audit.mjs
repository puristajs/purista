#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const apiPath = resolve(process.cwd(), 'web/src/generated/purista-api.json')

/**
 * Application-facing package roots deliberately have a small, reviewed contract.
 * Update this table only with the corresponding API documentation, migration
 * note, and application example; this prevents accidental wildcard re-exports.
 */
const expectedExports = new Map([
	[
		'@purista/amqpbridge',
		new Set(['AmqpBridge', 'AmqpBridgeConfig', 'Encoder', 'EncoderFunctions', 'EncryptFunctions', 'Encrypter']),
	],
	['@purista/mqttbridge', new Set(['MqttBridge', 'MqttBridgeConfig'])],
	['@purista/natsbridge', new Set(['NatsBridge', 'NatsBridgeConfig', 'NatsConsumerFailureHandlingDefaults'])],
	[
		'@purista/dapr-sdk',
		new Set([
			'DaprClientConfig',
			'DaprConfigStore',
			'DaprConfigStoreConfig',
			'DaprEventBridge',
			'DaprEventBridgeConfig',
			'DaprSecretStore',
			'DaprSecretStoreConfig',
			'DaprStateStore',
			'DaprStateStoreConfig',
		]),
	],
	[
		'@purista/hono-http-server',
		new Set([
			'AnyService',
			'BindingsBase',
			'EndpointProtectMiddleware',
			'HealthFunction',
			'HonoServiceClass',
			'HonoServiceV1Config',
			'HonoServiceV1ConfigPartial',
			'ProblemDetails',
			'ProblemTypeConfig',
			'VariablesBase',
			'honoServiceV1ConfigSchema',
			'honoV1Service',
		]),
	],
])

if (!existsSync(apiPath)) {
	process.stderr.write(`API documentation JSON was not found at ${apiPath}. Run npm run build:api-docs first.\n`)
	process.exit(2)
}

const docs = JSON.parse(readFileSync(apiPath, 'utf8'))
const packages = new Map(
	(docs.children ?? []).map(entry => [entry.name, new Set((entry.children ?? []).map(child => child.name))]),
)
const issues = []

for (const [packageName, expected] of expectedExports) {
	const actual = packages.get(packageName)
	if (!actual) {
		issues.push(`${packageName}: package root is missing from TypeDoc output`)
		continue
	}

	const missing = [...expected].filter(name => !actual.has(name)).sort()
	const unexpected = [...actual].filter(name => !expected.has(name)).sort()
	if (missing.length) issues.push(`${packageName}: missing approved exports: ${missing.join(', ')}`)
	if (unexpected.length) issues.push(`${packageName}: unreviewed exports: ${unexpected.join(', ')}`)
}

if (issues.length) {
	process.stderr.write(`PURISTA public API surface audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) process.stderr.write(`- ${issue}\n`)
	process.exit(1)
}

process.stdout.write(`PURISTA public API surface audit passed for ${expectedExports.size} package roots.\n`)
