import { camelCase, pascalCase } from '../api/change-case.js'
import { convertToProjectEventCasing } from '../api/convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../api/convertToProjectFileCasing.js'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { CreateProjectInput } from '../create/types.js'

/** Create the default `.gitignore` content for generated projects. */
export const createGitIgnoreFile = () => `node_modules
dist
.DS_Store
coverage
`

/** Create the generated project README content. */
export const createReadmeFile = (input: CreateProjectInput) => `# ${input.projectName}

Generated with \`@purista/cli\`.

## Stack

- Runtime: ${input.runtime}
- Event bridge: ${input.eventBridge}
- Webserver: ${input.useWebserver ? 'enabled' : 'disabled'}
- Telemetry: ${input.telemetry === 'otel' ? 'OpenTelemetry Metrics API bootstrap' : 'not generated'}
- Linter: ${input.linter}

## Scripts

- \`${input.packageManager === 'yarn' ? 'yarn dev' : `${input.packageManager} run dev`}\`
- \`${input.packageManager === 'yarn' ? 'yarn build' : `${input.packageManager} run build`}\`
- \`${input.packageManager === 'yarn' ? 'yarn test' : `${input.packageManager} run test`}\`
- \`${input.packageManager === 'yarn' ? 'yarn export:runtime' : `${input.packageManager} run export:runtime`}\`
- \`${input.packageManager === 'yarn' ? 'yarn inspect:architecture' : `${input.packageManager} run inspect:architecture`}\` to export definitions and print a scoped, LLM-ready static architecture context
- \`${input.packageManager === 'yarn' ? 'yarn validate:architecture' : `${input.packageManager} run validate:architecture`}\` before handing off an architecture change
- \`${input.packageManager === 'yarn' ? 'yarn doctor:architecture' : `${input.packageManager} run doctor:architecture`}\` for static project checks

This project includes agent guidance files (\`AGENTS.md\`, \`CLAUDE.md\`, and \`.agents/IMPLEMENTATION.md\`). Local links under \`.agents/skills/\` and \`.claude/skills/\` point to the bundled PURISTA architecture and migration skills in \`@purista/core\`.

Attached agents keep model, skill, sandbox, durable runtime, and durable workspace stores in application bootstrap/config via \`ai.models\`, \`ai.skills\`, \`ai.sandbox\`, \`ai.runtime\`, and \`ai.workspaceStore\`. If an agent declares \`.useSkills(...)\`, bind the skill directories through \`ai.skills.bindings\`, \`ai.skills.namespaces\`, or explicitly trusted discovery. Generated agents are ephemeral by default. Use \`--durable-workspace\` only for a resumable \`setHarnessWorkflow(...)\`; it requires application-owned \`ai.runtime\` and \`ai.workspaceStore\` adapters.

Schedules are opt-in. After creating a schedule declaration, export its manifest and deploy a separate Scheduler Runtime with an application-selected provider and shared EventBridge. The scheduler owns only the clock and event publication; business services, queues, subscriptions, and agents consume the emitted event.

This project installs \`@purista/cli\` as a dev dependency. Use the local add scripts instead of a global CLI:

- \`${runScriptCommand(input, 'add:service', '<name> --description "<description>"')}\`
- \`${runScriptCommand(input, 'add:command', '<name> --service <serviceName> --service-version <version>')}\`
- \`${runScriptCommand(input, 'add:schedule', '<name> --description "<description>" --service <serviceName> --service-version <version> --event <eventName> --cron "0 2 * * *"')}\`
- \`${runScriptCommand(input, 'add:agent', '<name> --service <serviceName> --service-version <version>')}\`
- \`${runScriptCommand(input, 'add:agent', '<name> --service <serviceName> --service-version <version> --durable-workspace')}\` for a resumable workflow-backed agent
`

const runScriptCommand = (input: CreateProjectInput, script: string, args = '') => {
	const suffix = args ? ` -- ${args}` : ''
	if (input.packageManager === 'yarn') {
		return `yarn ${script}${args ? ` ${args}` : ''}`
	}
	return `${input.packageManager} run ${script}${suffix}`
}

const createLocalCliUsageGuide = (input: CreateProjectInput) => `## Local CLI
- This project installs \`@purista/cli\` as a dev dependency. Use the local package scripts instead of a global \`purista\` binary.
- Runtime: \`${input.runtime}\`
- Package manager: \`${input.packageManager}\`
- Create services with \`${runScriptCommand(input, 'add:service', '<name> --description "<description>"')}\`.
- Create commands with \`${runScriptCommand(input, 'add:command', '<name> --service <serviceName> --service-version <version>')}\`.
- Create an ephemeral agent with \`${runScriptCommand(input, 'add:agent', '<name> --service <serviceName> --service-version <version>')}\`.
- Add \`--durable-workspace\` only for a resumable workflow; bind its \`ai.runtime\` and \`ai.workspaceStore\` adapters in application bootstrap.
- Run the app with \`${input.packageManager === 'yarn' ? 'yarn dev' : `${input.packageManager} run dev`}\`.
- Run tests with \`${input.packageManager === 'yarn' ? 'yarn test' : `${input.packageManager} run test`}\`.`

/** Create default coding-agent guidance for generated PURISTA projects. */
export const createAgentsFile = (input: CreateProjectInput) => `# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read \`purista.json\` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local \`@purista/cli\` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured \`servicePath\` and agent code under the configured \`agentPath\`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- Keep \`src/definitions.ts\` as the generated export inventory. The local \`add:service\` command updates it when the standard aggregation array is present.
- Before changing an existing boundary, run \`${runScriptCommand(input, 'inspect:architecture')}\` and read the scoped graph. After changing it, run \`${runScriptCommand(input, 'validate:architecture')}\`. For a reviewed public contract, persist \`purista inspect --out <artifact>\` and run \`purista diff --base <approved-artifact> --strict\`.
- A static graph does not prove a live bridge, store, scheduler, model provider, deployment, or external event producer. Do not invent missing external contracts. Multi-repository deployments must use an application-owned composition file with pinned local artifacts and \`purista compose\`.
- Schedules are opt-in. Export a schedule manifest only when this application declares schedules, and deploy its Scheduler Runtime separately from business services with an application-selected provider and shared EventBridge.
- For attached agents, keep \`ai.models\`, optional \`ai.skills\`, \`ai.sandbox\`, \`ai.runtime\`, and \`ai.workspaceStore\` bindings in service bootstrap/config. Use \`.useSkills(...)\` only with matching runtime skill bindings or explicitly trusted discovery. Agents are ephemeral by default; use \`--durable-workspace\` only for a workflow that must resume private workspace state.

${createLocalCliUsageGuide(input)}

## Skills
- Use the bundled PURISTA skill from \`.agents/skills/purista\` or \`.claude/skills/purista\`.
- Use \`.agents/skills/purista-migration\` or \`.claude/skills/purista-migration\` before upgrading this existing application to a new PURISTA release; it is not the primary skill for new features.
- These paths link to \`node_modules/@purista/core/skills/\`, so dependency updates refresh both framework skills.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Run \`${runScriptCommand(input, 'validate:architecture')}\` after a boundary change. Treat a schema compatibility result of \`unknown\` as a stop condition until an owner approves the change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
- For skill-backed agents, verify startup fails for missing skill bindings and that prompts list only skill metadata plus \`/skills/<name>/SKILL.md\`, never the \`SKILL.md\` body.
`

/** Create Claude-specific guidance that delegates to AGENTS.md. */
export const createClaudeFile = () => `# Claude Guide

Follow [AGENTS.md](./AGENTS.md) for this PURISTA project.

Use the bundled PURISTA skill linked at \`.claude/skills/purista\` before designing or changing PURISTA services, commands, subscriptions, streams, queues, workers, agents, or runtime wiring. Before an existing-application upgrade, use \`.claude/skills/purista-migration\`.
`

/** Create implementation guidance for agentic development tools. */
export const createAgentImplementationFile = (input: CreateProjectInput) => `# Implementation Guide

This project is CLI-first. Prefer generated PURISTA artifacts over manual framework skeletons.

${createLocalCliUsageGuide(input)}

## Project Shape
- \`purista.json\` defines file casing, event casing, \`servicePath\`, and \`agentPath\`.
- Service definitions live under \`src/service\` unless \`purista.json\` says otherwise.
- Agent definitions live under \`src/agents\` unless \`purista.json\` says otherwise.

## Artifact Creation
- New service: \`${runScriptCommand(input, 'add:service', '<name> --description "<description>"')}\`
- New command: \`${runScriptCommand(input, 'add:command', '<name> --service <serviceName> --service-version <version>')}\`
- New subscription: \`${runScriptCommand(input, 'add:subscription', '<name> --service <serviceName> --service-version <version> --event <eventName>')}\`
- New stream: \`${runScriptCommand(input, 'add:stream', '<name> --service <serviceName> --service-version <version>')}\`
- New queue: \`${runScriptCommand(input, 'add:queue', '<name> --service <serviceName> --service-version <version>')}\`
- New queue worker: \`${runScriptCommand(input, 'add:queue-worker', '<name> --service <serviceName> --service-version <version> --queue <queueName>')}\`
- New event-only schedule: \`${runScriptCommand(input, 'add:schedule', '<name> --description "<description>" --service <serviceName> --service-version <version> --event <eventName> --cron "0 2 * * *"')}\`
- New agent: \`${runScriptCommand(input, 'add:agent', '<name> --service <serviceName> --service-version <version>')}\`
- Resumable workflow agent: \`${runScriptCommand(input, 'add:agent', '<name> --service <serviceName> --service-version <version> --durable-workspace')}\`

After generation, edit handlers, schemas, runtime wiring, and tests to fit the domain.

## Guardrails
- Do not create alternative framework folder structures.
- Do not bypass builders for public PURISTA contracts.
- Do not add CommonJS variants. Generated PURISTA apps are ESM-only.
- Keep external systems behind resources, stores, bridges, or runtime bindings.
- Keep EventBridge and QueueBridge concerns separate.
- Keep SchedulerRuntime separate from business services. It emits normal events only; subscriptions, queues, workers, and agents own the business work.
- Keep provider packages as app-level dependencies.
`

/** Create the explicit inventory of service builders used for static contract exports. */
export const createDefinitionsFile = (puristaConfig: Pick<PuristaConfig, 'fileConvention'>) => {
	const serviceDirectory = convertToProjectFileCasing('ping', puristaConfig)
	const serviceFileName = convertToProjectFileCasing('ping v1 service', puristaConfig)
	const serviceExportName = camelCase('ping v1 service')

	return `import { exportServiceDefinitions, type ServiceBuilder } from '@purista/core'
import { ${serviceExportName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

// The CLI appends newly generated services to this explicit static export inventory.
// Keep it free of runtime infrastructure and service instances.
export const serviceBuilders: ServiceBuilder<any>[] = [${serviceExportName}]

export const createPuristaDefinitions = () => exportServiceDefinitions(serviceBuilders)
`
}

/** Create the build-time JSON definition exporter used by CLI contract exports. */
export const createDefinitionsExporterFile = () => `import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createPuristaDefinitions } from './definitions.js'

const outPath = resolve(process.cwd(), process.argv[2] ?? 'purista.definitions.json')
const definitions = await createPuristaDefinitions()

await writeFile(outPath, JSON.stringify(definitions, null, 2) + '\\n', 'utf-8')
process.stdout.write('PURISTA definitions exported to ' + outPath + '\\n')
`

/** Create an opt-in, application-owned OpenTelemetry Metrics API setup. */
export const createTelemetryFile = () => `import { metrics } from '@opentelemetry/api'
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

/**
 * Install a process-local MeterProvider for this application.
 *
 * PURISTA only uses the OpenTelemetry API; applications own readers and
 * exporters. Replace the console exporter with an OTLP reader when deploying
 * telemetry infrastructure. Do not place request, user, tenant, prompt, or
 * payload data in metric attributes.
 */
export const initializeTelemetry = () => {
	const meterProvider = new MeterProvider({
		readers: [new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter() })],
	})
	metrics.setGlobalMeterProvider(meterProvider)

	return {
		name: 'OpenTelemetry metrics',
		destroy: async () => meterProvider.shutdown(),
	}
}
`

/** Create the starter `ServiceEvent` enum with the example ping event. */
export const createServiceEventEnumFile = (input: CreateProjectInput) => {
	const eventName = convertToProjectEventCasing('ping executed', {
		$schema: 'https://purista.dev/schemas/1.12.0/schema.json',
		runtime: input.runtime,
		eventBridge: input.eventBridge,
		fileConvention: input.fileConvention,
		eventConvention: input.eventConvention,
		linter: input.linter,
		formatter: input.formatter,
		servicePath: 'src/service',
		agentPath: 'src/agents',
	})

	return `export enum ServiceEvent {
	PingExecuted = '${eventName}',
}
`
}

const createDefaultEventBridgeFile = () => `import { DefaultEventBridge, type Logger } from '@purista/core'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	return eventBridge
}
`

const createAmqpEventBridgeFile = () => `import { AmqpBridge } from '@purista/amqpbridge'
import type { Logger } from '@purista/core'
import bridgeConfig from './config/amqp.js'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new AmqpBridge({ ...bridgeConfig, logger })
	await eventBridge.start()
	return eventBridge
}
`

const createMqttEventBridgeFile = () => `import type { Logger } from '@purista/core'
import { MqttBridge } from '@purista/mqttbridge'
import bridgeConfig from './config/mqtt.js'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new MqttBridge({ ...bridgeConfig, logger })
	await eventBridge.start()
	return eventBridge
}
`

const createNatsEventBridgeFile = () => `import type { Logger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'
import bridgeConfig from './config/nats.js'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new NatsBridge({ ...bridgeConfig, logger })
	await eventBridge.start()
	return eventBridge
}
`

const createDaprEventBridgeFile = () => `import type { Logger } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'
import bridgeConfig from './config/dapr.js'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new DaprEventBridge({ ...bridgeConfig, logger })
	await eventBridge.start()
	return eventBridge
}
`

/** Create event bridge runtime wiring for the selected bridge blueprint. */
export const createEventBridgeFile = (input: CreateProjectInput) => {
	switch (input.eventBridge) {
		case 'amqp':
			return createAmqpEventBridgeFile()
		case 'mqtt':
			return createMqttEventBridgeFile()
		case 'nats':
			return createNatsEventBridgeFile()
		case 'dapr':
			return createDaprEventBridgeFile()
		default:
			return createDefaultEventBridgeFile()
	}
}

/** Create the default AMQP bridge config module. */
export const createAmqpConfigFile = () => `import type { AmqpBridgeConfig } from '@purista/amqpbridge'

const amqpBridgeConfig: Partial<AmqpBridgeConfig> = {
	exchangeName: 'purista',
	url: 'amqp://localhost',
}

export default amqpBridgeConfig
`

/** Create the default MQTT bridge config module. */
export const createMqttConfigFile = () => `import type { MqttBridgeConfig } from '@purista/mqttbridge'

const mqttBridgeConfig: Partial<MqttBridgeConfig> = {
	host: 'localhost',
}

export default mqttBridgeConfig
`

/** Create the default NATS bridge config module. */
export const createNatsConfigFile = () => `import type { NatsBridgeConfig } from '@purista/natsbridge'

const natsBridgeConfig: Partial<NatsBridgeConfig> = {}

export default natsBridgeConfig
`

/** Create the default Dapr event bridge config module. */
export const createDaprConfigFile = () => `import type { DaprEventBridgeConfig } from '@purista/dapr-sdk'

const daprBridgeConfig: Partial<DaprEventBridgeConfig> = {
	pubSubName: 'pubsub',
	clientConfig: {
		baseUrl: 'http://127.0.0.1:3500',
	},
}

export default daprBridgeConfig
`

/** Create Hono HTTP server config for generated projects. */
export const createHttpConfigFile = () => `import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

const serviceConfig = {
	enableDynamicRoutes: true,
	enableHealth: true,
	apiMountPath: '/api',
	openApi: {
		enabled: true,
		info: {
			title: 'PURISTA API',
		},
	},
} satisfies HonoServiceV1ConfigPartial

const httpConfig = {
	port: 3000,
	root: './public',
	serviceConfig,
}

export default httpConfig
`

/** Create runtime-specific Hono HTTP server bootstrap code. */
export const createHttpFile = (runtime: CreateProjectInput['runtime']) => {
	if (runtime === 'bun') {
		return `import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'
import { serveStatic } from 'hono/bun'
import httpConfig from './config/http.js'

export const getHttpServer = async (input: { eventBridge: EventBridge; logger: Logger; services: Service[] }) => {
	const honoService = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: { ...httpConfig.serviceConfig, services: input.services },
	})

	honoService.app.get(
		httpConfig.serviceConfig.apiMountPath,
		apiReference({
			pageTitle: httpConfig.serviceConfig.openApi.info.title,
			spec: {
				url: \`\${httpConfig.serviceConfig.apiMountPath}/openapi.json\`,
			},
		}),
	)

	honoService.app.get('*', serveStatic({ root: httpConfig.root }))
	honoService.openApi.addServer({
		url: \`http://localhost:\${httpConfig.port}\`,
		description: 'the local server',
	})

	await honoService.start()

	const serverInstance = Bun.serve({
		fetch: honoService.app.fetch,
		port: httpConfig.port,
	})

	return { honoService, serverInstance }
}
`
	}

	return `import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'
import httpConfig from './config/http.js'

export const getHttpServer = async (input: { eventBridge: EventBridge; logger: Logger; services: Service[] }) => {
	const honoService = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: { ...httpConfig.serviceConfig, services: input.services },
	})

	honoService.app.get(
		httpConfig.serviceConfig.apiMountPath,
		apiReference({
			pageTitle: httpConfig.serviceConfig.openApi.info.title,
			spec: {
				url: \`\${httpConfig.serviceConfig.apiMountPath}/openapi.json\`,
			},
		}),
	)

	honoService.app.get('*', serveStatic({ root: httpConfig.root }))
	honoService.openApi.addServer({ url: \`http://localhost:\${httpConfig.port}\`, description: 'the local server' })

	await honoService.start()

	const serverInstance = serve({
		fetch: honoService.app.fetch,
		port: httpConfig.port,
	})

	return { honoService, serverInstance }
}
`
}

/** Create the static landing page served by the generated Hono setup. */
export const createPublicIndexHtml = (input: CreateProjectInput) => `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${input.projectName}</title>
		<style>
			:root {
				color-scheme: light;
				font-family: 'IBM Plex Sans', system-ui, sans-serif;
				background: linear-gradient(160deg, #f6f8fb 0%, #dfeaf4 100%);
				color: #112031;
			}
			body {
				margin: 0;
				min-height: 100vh;
				display: grid;
				place-items: center;
			}
			main {
				width: min(680px, calc(100vw - 48px));
				background: rgba(255, 255, 255, 0.9);
				border: 1px solid rgba(17, 32, 49, 0.1);
				border-radius: 24px;
				padding: 32px;
				box-shadow: 0 20px 60px rgba(17, 32, 49, 0.12);
			}
			code {
				font-family: 'IBM Plex Mono', monospace;
			}
		</style>
	</head>
	<body>
		<main>
			<h1>${input.projectName}</h1>
			<p>This project was generated from the Purista blueprint engine.</p>
			<p><code>${input.runtime}</code> runtime with the <code>${input.eventBridge}</code> event bridge is ready.</p>
		</main>
	</body>
</html>
`

/** Create the generated Biome config. */
export const createBiomeConfigFile = () => `{
	"$schema": "https://biomejs.dev/schemas/2.4.15/schema.json",
	"assist": { "actions": { "source": { "organizeImports": "off" } } },
	"files": {
		"includes": [
			"**",
			"!**/node_modules/**/*",
			"!**/dist/**/*",
			"!**/.agents/skills/**/*",
			"!**/.claude/skills/**/*"
		]
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true
		}
	},
	"formatter": {
		"enabled": false,
		"formatWithErrors": false,
		"attributePosition": "auto",
		"indentStyle": "tab",
		"indentWidth": 2,
		"lineWidth": 120,
		"lineEnding": "lf"
	},
	"javascript": {
		"formatter": {
			"enabled": false,
			"quoteStyle": "single",
			"arrowParentheses": "asNeeded",
			"bracketSameLine": false,
			"bracketSpacing": true,
			"jsxQuoteStyle": "double",
			"quoteProperties": "asNeeded",
			"semicolons": "asNeeded",
			"trailingCommas": "all",
			"lineWidth": 120,
			"indentWidth": 2,
			"indentStyle": "tab"
		},
		"linter": {
			"enabled": true
		}
	},
	"json": {
		"formatter": {
			"enabled": false,
			"trailingCommas": "none"
		}
	}
}
`

/** Create an ESLint flat config for ESM projects. */
export const createEslintModuleConfigFile = () => `import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
		},
	},
]
`

/** Create `src/index.ts` with event bridge, service startup, optional HTTP, and shutdown wiring. */
export const createEntrypointFile = (input: CreateProjectInput, puristaConfig: PuristaConfig) => {
	const serviceDirectory = convertToProjectFileCasing('ping', puristaConfig)
	const serviceFileName = convertToProjectFileCasing('ping v1 service', puristaConfig)
	const serviceExportName = camelCase('ping v1 service')
	const bridgeLabel = pascalCase(input.eventBridge)
	const telemetryImport = input.telemetry === 'otel' ? "import { initializeTelemetry } from './telemetry.js'\n" : ''
	const telemetryStart = input.telemetry === 'otel' ? '\tconst telemetry = initializeTelemetry()\n' : ''
	const telemetryShutdown = input.telemetry === 'otel' ? '\t\ttelemetry,\n' : ''

	if (input.useWebserver) {
		const shutdownServerSnippet =
			input.runtime === 'bun'
				? `{
			name: \`\${honoService.serviceInfo.serviceName} \${honoService.serviceInfo.serviceVersion} close socket\`,
			destroy: async () => {
				await serverInstance.stop()
			},
		},`
				: `{
			name: \`\${honoService.serviceInfo.serviceName} \${honoService.serviceInfo.serviceVersion} close socket\`,
			destroy: async () => {
				await new Promise<void>((resolve, reject) => {
					serverInstance.close(error => {
						if (error) {
							reject(error)
							return
						}
						resolve()
					})
				})
			},
		},`

		return `import { type Service, gracefulShutdown, initLogger } from '@purista/core'
${telemetryImport}
import { getEventBridge } from './eventbridge.js'
import { getHttpServer } from './http.js'
import { ${serviceExportName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

export const main = async () => {
	const logger = initLogger()
	${telemetryStart}
	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []
	const pingService = await ${serviceExportName}.getInstance(eventBridge)
	await pingService.start()
	services.push(pingService)

	const { honoService, serverInstance } = await getHttpServer({
		logger,
		eventBridge,
		services,
	})

	logger.info('${bridgeLabel} bridge and HTTP server started.')

	gracefulShutdown(logger, [
	${telemetryShutdown}
		honoService.prepareDestroy(),
		eventBridge,
		...services,
		${shutdownServerSnippet}
		honoService,
	])
}

main()
`
	}

	return `import { type Service, gracefulShutdown, initLogger } from '@purista/core'
${telemetryImport}
import { getEventBridge } from './eventbridge.js'
import { ${serviceExportName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

export const main = async () => {
	const logger = initLogger()
	${telemetryStart}
	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []
	const pingService = await ${serviceExportName}.getInstance(eventBridge)
	await pingService.start()
	services.push(pingService)

	logger.info('${bridgeLabel} bridge and ping service started.')
	gracefulShutdown(logger, [${input.telemetry === 'otel' ? 'telemetry, ' : ''}eventBridge, ...services])
}

main()
`
}
