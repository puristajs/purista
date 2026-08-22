#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

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

/**
 * Runtime values that application code may import from `@purista/core`.
 * Types remain deliberately broad because builders expose their typed contract
 * vocabulary from this root. Everything else must use an explicit expert
 * subpath: `/testing`, `/client`, or `/adapter`.
 */
const expectedCoreRuntimeExports = new Set([
	'AgentQueueBuilder',
	'AgentRunError',
	'CommandDefinitionBuilder',
	'DefaultConfigStore',
	'DefaultEventBridge',
	'DefaultLogger',
	'DefaultQueueBridge',
	'DefaultSchedulerProvider',
	'DefaultSecretStore',
	'DefaultStateStore',
	'EBMessageType',
	'HandledError',
	'PuristaSpanName',
	'PuristaSpanTag',
	'QueueDefinitionBuilder',
	'QueueWorkerBuilder',
	'ScheduleDefinitionBuilder',
	'SchedulerBuilder',
	'SchedulerRuntime',
	'Service',
	'ServiceBuilder',
	'StatusCode',
	'StreamDefinitionBuilder',
	'SubscriptionDefinitionBuilder',
	'UnhandledError',
	'createArchitectureManifest',
	'exportCloudEventsSchema',
	'exportScheduleManifest',
	'exportServiceDefinitions',
	'extendApi',
	'fromCloudEvent',
	'getNewInstanceId',
	'getNewTraceId',
	'gracefulShutdown',
	'initLogger',
	'isCustomMessage',
	'toCloudEvent',
	'toJSONSchema',
	'validate',
	'validateArchitectureManifest',
])

const rootCoreIndexPath = resolve(process.cwd(), 'packages/core/src/index.ts')
const issues = []

if (!existsSync(apiPath)) {
	process.stderr.write(`API documentation JSON was not found at ${apiPath}. Run npm run build:api-docs first.\n`)
	process.exit(2)
}

if (existsSync(rootCoreIndexPath)) {
	const rootCoreIndex = readFileSync(rootCoreIndexPath, 'utf8')
	const wildcardInternalTypeExports = rootCoreIndex.match(/export\s+type\s+\*\s+from\s+['"]\.\/core\//g) ?? []
	if (wildcardInternalTypeExports.length) {
		issues.push(
			`@purista/core: application root must enumerate application types; found internal wildcard type exports: ${wildcardInternalTypeExports.join(', ')}`,
		)
	}
}

const docs = JSON.parse(readFileSync(apiPath, 'utf8'))
const packages = new Map(
	(docs.children ?? []).map(entry => [entry.name, new Set((entry.children ?? []).map(child => child.name))]),
)

const coreEntryPath = resolve(process.cwd(), 'packages/core/dist/index.js')
if (!existsSync(coreEntryPath)) {
	issues.push('@purista/core: compiled entrypoint is missing; run npm run build -w @purista/core first')
} else {
	const actual = new Set(Object.keys(await import(pathToFileURL(coreEntryPath).href)))
	const missing = [...expectedCoreRuntimeExports].filter(name => !actual.has(name)).sort()
	const unexpected = [...actual].filter(name => !expectedCoreRuntimeExports.has(name)).sort()
	if (missing.length) issues.push(`@purista/core: missing approved runtime exports: ${missing.join(', ')}`)
	if (unexpected.length) issues.push(`@purista/core: unreviewed runtime exports: ${unexpected.join(', ')}`)

	const subpathRuntimeExports = new Set()
	for (const subpath of ['testing', 'client', 'adapter']) {
		const entryPath = resolve(process.cwd(), `packages/core/dist/${subpath}/index.js`)
		if (!existsSync(entryPath)) {
			issues.push(`@purista/core/${subpath}: compiled entrypoint is missing`)
			continue
		}
		for (const name of Object.keys(await import(pathToFileURL(entryPath).href))) {
			if (!actual.has(name)) subpathRuntimeExports.add(name)
		}
	}

	const collectFiles = directory =>
		readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
			const path = join(directory, entry.name)
			return entry.isDirectory() ? collectFiles(path) : entry.isFile() ? [path] : []
		})
	const handbookRoot = resolve(process.cwd(), 'web/src/content/handbook')
	const coreImportPattern = /import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+['"]@purista\/core['"]/g
	for (const file of collectFiles(handbookRoot).filter(path => path.endsWith('.md'))) {
		const source = readFileSync(file, 'utf8')
		for (const match of source.matchAll(coreImportPattern)) {
			const names = match[1]
				.split(',')
				.map(entry => entry.trim())
				.filter(entry => entry && !entry.startsWith('type '))
				.map(entry => entry.split(/\s+as\s+/)[0].trim())
			const moved = names.filter(name => subpathRuntimeExports.has(name))
			if (moved.length) {
				issues.push(
					`${file.replace(`${process.cwd()}/`, '')}: imports subpath API from @purista/core: ${moved.join(', ')}`,
				)
			}
		}
	}
}

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

process.stdout.write(
	`PURISTA public API surface audit passed for @purista/core and ${expectedExports.size} adapter package roots.\n`,
)
