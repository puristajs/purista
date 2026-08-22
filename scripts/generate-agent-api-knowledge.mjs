#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const apiPath = resolve(root, 'web/src/generated/purista-api.json')
const outputPath = resolve(root, 'skills/purista/references/generated-api-index.md')
const check = process.argv.includes('--check')

if (!existsSync(apiPath)) {
	process.stderr.write(`TypeDoc JSON was not found at ${apiPath}\n`)
	process.exit(2)
}

const docs = JSON.parse(readFileSync(apiPath, 'utf8'))
/**
 * The compact API surface an otherwise untrained implementation agent needs
 * in addition to the architecture references. Keep this intentionally small:
 * TypeDoc remains the complete reference, while this document is the
 * deterministic, high-signal lookup table loaded by the canonical skill.
 */
const packageCatalog = [
	{
		section: 'Framework and scaffolding',
		packageName: '@purista/core',
		useWhen:
			'Declaring service-owned contracts, runtime wiring, queues, agents, schedules, and static architecture exports.',
		names: [
			'ServiceBuilder',
			'CommandDefinitionBuilder',
			'SubscriptionDefinitionBuilder',
			'StreamDefinitionBuilder',
			'QueueDefinitionBuilder',
			'QueueWorkerBuilder',
			'AgentQueueBuilder',
			'SchedulerBuilder',
			'SchedulerRuntime',
			'DefaultSchedulerProvider',
			'createArchitectureManifest',
			'validateArchitectureManifest',
			'exportServiceDefinitions',
			'exportScheduleManifest',
			'ServiceObservabilityContext',
		],
	},
	{
		section: 'Framework and scaffolding',
		packageName: '@purista/cli',
		useWhen:
			'Initializing or scaffolding a PURISTA application; application agents use the generated project-local CLI, while package authors use this API only to extend CLI tooling.',
		names: ['createPuristaCliEngine', 'runPuristaCommand'],
	},
	{
		section: 'HTTP projection',
		packageName: '@purista/hono-http-server',
		useWhen: 'Projecting builder-declared commands, streams, and async queue responses through Hono and OpenAPI.',
		names: ['honoV1Service'],
	},
	{
		section: 'Event bridges',
		packageName: '@purista/amqpbridge',
		useWhen: 'Connecting commands, events, subscriptions, and streams through an AMQP broker.',
		names: ['AmqpBridge'],
	},
	{
		section: 'Event bridges',
		packageName: '@purista/mqttbridge',
		useWhen: 'Connecting commands, events, subscriptions, and streams through MQTT topics.',
		names: ['MqttBridge'],
	},
	{
		section: 'Event bridges',
		packageName: '@purista/natsbridge',
		useWhen: 'Connecting commands, events, subscriptions, and streams through NATS.',
		names: ['NatsBridge'],
	},
	{
		section: 'Event bridges',
		packageName: '@purista/dapr-sdk',
		useWhen:
			'Running PURISTA through Dapr building blocks for event transport, state, config, secrets, or service invocation.',
		names: ['DaprEventBridge', 'DaprConfigStore', 'DaprSecretStore', 'DaprStateStore'],
	},
	{
		section: 'Event bridges',
		packageName: '@purista/base-http-bridge',
		useWhen:
			'Building or operating an HTTP EventBridge adapter; application HTTP APIs should use @purista/hono-http-server instead.',
		names: ['HttpEventBridge'],
	},
	{
		section: 'Queue and scheduling adapters',
		packageName: '@purista/nats-queue-bridge',
		useWhen: 'Running durable queue work on NATS JetStream, including strict idempotency when declared.',
		names: ['NatsQueueBridge'],
	},
	{
		section: 'Queue and scheduling adapters',
		packageName: '@purista/redis-queue-bridge',
		useWhen: 'Running durable queue work on Redis with strict idempotency when declared.',
		names: ['RedisQueueBridge'],
	},
	{
		section: 'Queue and scheduling adapters',
		packageName: '@purista/redis-scheduler-provider',
		useWhen:
			'Running replicated SchedulerRuntime hosts with Redis-backed distributed occurrence claims; not for business work.',
		names: ['RedisSchedulerProvider'],
	},
	{
		section: 'Config stores',
		packageName: '@purista/aws-config-store',
		useWhen: 'Supplying service configuration from AWS Systems Manager Parameter Store.',
		names: ['AWSConfigStore'],
	},
	{
		section: 'Config stores',
		packageName: '@purista/nats-config-store',
		useWhen: 'Supplying service configuration from NATS-backed storage.',
		names: ['NatsConfigStore'],
	},
	{
		section: 'Config stores',
		packageName: '@purista/redis-config-store',
		useWhen: 'Supplying service configuration from Redis-backed storage.',
		names: ['RedisConfigStore'],
	},
	{
		section: 'State stores',
		packageName: '@purista/nats-state-store',
		useWhen: 'Persisting service state in NATS-backed storage when its declared capabilities meet the requirement.',
		names: ['NatsStateStore'],
	},
	{
		section: 'State stores',
		packageName: '@purista/redis-state-store',
		useWhen: 'Persisting service state in Redis when its declared capabilities meet the requirement.',
		names: ['RedisStateStore'],
	},
	{
		section: 'Secret stores',
		packageName: '@purista/aws-secret-store',
		useWhen: 'Resolving secrets through AWS Secrets Manager.',
		names: ['AWSSecretStore'],
	},
	{
		section: 'Secret stores',
		packageName: '@purista/azure-secret-store',
		useWhen: 'Resolving secrets through Azure Key Vault.',
		names: ['AzureSecretStore'],
	},
	{
		section: 'Secret stores',
		packageName: '@purista/gcloud-secret-store',
		useWhen: 'Resolving secrets through Google Cloud Secret Manager.',
		names: ['GoogleSecretStore'],
	},
	{
		section: 'Secret stores',
		packageName: '@purista/infisical-secret-store',
		useWhen:
			'Resolving secrets through Infisical; use InfisicalClient only when building a custom Infisical integration.',
		names: ['InfisicalClient', 'InfisicalSecretStore'],
	},
	{
		section: 'Secret stores',
		packageName: '@purista/vault-secret-store',
		useWhen: 'Resolving secrets through HashiCorp Vault.',
		names: ['VaultSecretStore'],
	},
	{
		section: 'Platform helpers',
		packageName: '@purista/k8s-sdk',
		useWhen: 'Integrating builder-declared services with Kubernetes HTTP/server helpers.',
		names: ['addServiceEndpoints', 'getHttpServer'],
	},
]

/**
 * These application import boundaries are read directly from the Core package
 * manifest. Keep the names and intent here compact: TypeDoc is the complete
 * API reference, while this generated reference prevents an installed skill
 * from teaching legacy root imports.
 */
const coreSubpathCatalog = [
	{
		path: '@purista/core',
		useWhen: 'Application builders, runtime composition, contracts, schemas, and static architecture exports.',
		names: ['ServiceBuilder', 'SchedulerBuilder', 'SchedulerRuntime'],
	},
	{
		path: '@purista/core/testing',
		useWhen: 'Test harnesses, context mocks, message mocks, and safeBind. Never use in production wiring.',
		names: ['createCommandTestHarness', 'createSubscriptionContextMock', 'safeBind'],
	},
	{
		path: '@purista/core/client',
		useWhen: 'Outbound HttpClient and generated-client ClientBuilder utilities.',
		names: ['ClientBuilder', 'HttpClient'],
	},
	{
		path: '@purista/core/adapter',
		useWhen:
			'Framework adapter authors extending bridges, stores, transports, or low-level contracts; not ordinary application handlers.',
		names: ['EventBridgeBaseClass', 'ConfigStoreBaseClass', 'StateStoreBaseClass'],
	},
]

const kinds = new Map([
	[32, 'variable'],
	[64, 'function'],
	[128, 'class'],
	[256, 'interface'],
	[2097152, 'type'],
])

const reflections = new Map()
const indexReflections = node => {
	if (typeof node?.id === 'number') reflections.set(node.id, node)
	for (const child of node?.children ?? []) indexReflections(child)
}
indexReflections(docs)

const resolveReference = node => (node?.variant === 'reference' ? (reflections.get(node.target) ?? node) : node)

const text = parts =>
	(parts ?? [])
		.map(part => part.text ?? part.code ?? '')
		.join('')
		.replace(/\s+/g, ' ')
		.trim()

const sourceOf = node => {
	const source = node.sources?.[0] ?? node.signatures?.[0]?.sources?.[0]
	return source ? `${source.fileName}:${source.line}` : 'generated declaration'
}

const hasExample = node => {
	const tags = [
		...(node.comment?.blockTags ?? []),
		...(node.signatures ?? []).flatMap(signature => signature.comment?.blockTags ?? []),
	]
	return tags.some(tag => tag.tag === '@example')
}

/**
 * The installed skill needs a quick API selection cue, not the complete
 * TypeDoc prose. Keep a first sentence when it is useful, then cap it so the
 * generated reference remains cheap to load. The complete API docs stay the
 * source for detailed behavior and options.
 */
const conciseSummary = summary => {
	const firstSentence = summary.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? summary
	const concise = firstSentence.trim()
	return concise.length <= 280 ? concise : `${concise.slice(0, 277).trimEnd()}...`
}

const packageNodes = new Map((docs.children ?? []).filter(node => node.kind === 2).map(node => [node.name, node]))
const publishedMembers = packageNode => {
	// Core documents each declared package export as a module so its root,
	// testing, client, and adapter contracts can be complete without widening
	// the application import path. Other packages retain a single root module.
	if (packageNode.name === '@purista/core') {
		return packageNode.children?.find(candidate => candidate.name === 'index' && candidate.kind === 2)?.children ?? []
	}
	return packageNode.children ?? []
}
const entries = []
const issues = []

const publicPackageNames = readdirSync(resolve(root, 'packages'), { withFileTypes: true })
	.filter(entry => entry.isDirectory())
	.map(entry => resolve(root, 'packages', entry.name, 'package.json'))
	.filter(existsSync)
	.map(path => JSON.parse(readFileSync(path, 'utf8')))
	.filter(manifest => manifest.name?.startsWith('@purista/') && manifest.private !== true)
	.map(manifest => manifest.name)
	.sort()
const catalogPackageNames = packageCatalog.map(entry => entry.packageName).sort()
const duplicateCatalogEntries = catalogPackageNames.filter((name, index) => catalogPackageNames.indexOf(name) !== index)
const missingCatalogEntries = publicPackageNames.filter(packageName => !catalogPackageNames.includes(packageName))
const staleCatalogEntries = catalogPackageNames.filter(packageName => !publicPackageNames.includes(packageName))
if (duplicateCatalogEntries.length || missingCatalogEntries.length || staleCatalogEntries.length) {
	issues.push(
		`Package catalog mismatch: duplicate ${duplicateCatalogEntries.join(', ') || 'none'}; missing ${missingCatalogEntries.join(', ') || 'none'}; stale ${staleCatalogEntries.join(', ') || 'none'}`,
	)
}

const coreManifestPath = resolve(root, 'packages', 'core', 'package.json')
const coreManifest = JSON.parse(readFileSync(coreManifestPath, 'utf8'))
for (const entry of coreSubpathCatalog) {
	const exportPath = entry.path.replace('@purista/core', '.')
	if (!coreManifest.exports?.[exportPath]) {
		issues.push(`${entry.path} is missing from @purista/core package exports`)
		continue
	}
	const compiledEntryPath = resolve(
		root,
		`packages/core/dist/${exportPath === '.' ? 'index' : `${exportPath.slice(2)}/index`}.js`,
	)
	if (!existsSync(compiledEntryPath)) {
		issues.push(`${entry.path} compiled entrypoint is missing; run npm run build -w @purista/core first`)
		continue
	}
	const compiledExports = await import(pathToFileURL(compiledEntryPath).href)
	for (const name of entry.names) {
		if (!(name in compiledExports)) {
			issues.push(`${entry.path}.${name} is not a compiled public export`)
		}
	}
}

for (const surface of packageCatalog) {
	const packageNode = packageNodes.get(surface.packageName)
	if (!packageNode) {
		issues.push(`TypeDoc package ${surface.packageName} is missing`)
		continue
	}

	for (const name of surface.names) {
		const exportedNode = publishedMembers(packageNode).find(candidate => candidate.name === name)
		const node = resolveReference(exportedNode)
		if (!node || !kinds.has(node.kind)) {
			issues.push(`${surface.packageName}.${name} is not a documented public export`)
			continue
		}

		const summary = text(node.comment?.summary ?? node.signatures?.[0]?.comment?.summary)
		if (summary.length < 40) {
			issues.push(`${surface.packageName}.${name} needs a useful TypeDoc summary (at least 40 characters)`)
		}
		if (['class', 'function'].includes(kinds.get(node.kind)) && !hasExample(node)) {
			issues.push(`${surface.packageName}.${name} needs a TypeDoc @example`)
		}

		entries.push({
			section: surface.section,
			packageName: surface.packageName,
			name,
			kind: kinds.get(node.kind),
			summary: conciseSummary(summary),
			source: sourceOf(node),
		})
	}
}

if (issues.length) {
	process.stderr.write(`Agent API knowledge contract failed:\n${issues.map(issue => `- ${issue}`).join('\n')}\n`)
	process.exit(1)
}

const digest = createHash('sha256').update(JSON.stringify({ packageCatalog, entries })).digest('hex').slice(0, 16)
const catalogSections = Array.from(new Set(packageCatalog.map(entry => entry.section)))

const lines = [
	'# Generated Agent API Reference',
	'',
	'<!-- Generated from the published API catalog; do not edit manually. -->',
	`<!-- typedoc-digest: ${digest} -->`,
	'',
	'This reference covers every published `@purista/*` package. Use it in an installed skill to select the package and primary API for an application. It intentionally omits framework implementation paths, internal helpers, and release tooling. Follow the other skill references for ownership and distributed-system decisions.',
	'',
	'## Contents',
	'',
	'- [Package selection](#package-selection)',
	'- [Core import boundaries](#core-import-boundaries)',
	...catalogSections.map(section => `- [${section}](#${section.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')})`),
	'- [Use this reference safely](#use-this-reference-safely)',
	'',
	'## Core Import Boundaries',
	'',
	...coreSubpathCatalog.map(
		entry => `- \`${entry.path}\`: ${entry.useWhen} Key APIs: ${entry.names.map(name => `\`${name}\``).join(', ')}.`,
	),
	'',
	'## Package selection',
	'',
	'| Package | Use when | Primary validated API |',
	'| --- | --- | --- |',
	...packageCatalog.map(
		entry => `| \`${entry.packageName}\` | ${entry.useWhen} | ${entry.names.map(name => `\`${name}\``).join(', ')} |`,
	),
	'',
	...catalogSections.flatMap(section => {
		const sectionEntries = entries.filter(entry => entry.section === section)
		if (!sectionEntries.length) return []
		return [
			`## ${section}`,
			'',
			'| Package | API | Kind | Purpose |',
			'| --- | --- | --- | --- |',
			...sectionEntries.map(
				entry =>
					`| \`${entry.packageName}\` | \`${entry.name}\` | ${entry.kind} | ${entry.summary.replaceAll('|', '\\|')} |`,
			),
			'',
		]
	}),
	'## Use this reference safely',
	'',
	'- Prefer the package and API listed here over a guessed package name or a deep import.',
	'- Application code normally imports from a package root. Low-level bridge or adapter construction is for package authors unless the public handbook explicitly directs it.',
	'- A missing entry is a reason to consult the public PURISTA handbook or package API docs, never to invent a replacement API.',
	'',
]

const output = lines.join('\n')
if (check) {
	if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== output) {
		process.stderr.write('Generated agent API knowledge is stale. Run npm run generate:agent-api-knowledge.\n')
		process.exit(1)
	}
	process.stdout.write('Generated agent API knowledge is current.\n')
	process.exit(0)
}

writeFileSync(outputPath, output, 'utf8')
process.stdout.write(`Generated ${outputPath}\n`)
