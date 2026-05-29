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
- Linter: ${input.linter}

## Scripts

- \`${input.packageManager === 'yarn' ? 'yarn dev' : `${input.packageManager} run dev`}\`
- \`${input.packageManager === 'yarn' ? 'yarn build' : `${input.packageManager} run build`}\`
- \`${input.packageManager === 'yarn' ? 'yarn test' : `${input.packageManager} run test`}\`
- \`${input.packageManager === 'yarn' ? 'yarn export:asyncapi' : `${input.packageManager} run export:asyncapi`}\`
- \`${input.packageManager === 'yarn' ? 'yarn export:schedules' : `${input.packageManager} run export:schedules`}\`

Contract exporters refresh \`purista.definitions.json\` before writing provider-neutral outputs. Update \`src/definitions.ts\` when you add service builders that should be exported.
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

/** Create `src/definitions.ts` for exporting generated service definitions. */
export const createDefinitionsFile = (input: CreateProjectInput) => {
	const puristaConfig: PuristaConfig = {
		$schema: 'https://purista.dev/schemas/1.12.0/schema.json',
		runtime: input.runtime,
		eventBridge: input.eventBridge,
		fileConvention: input.fileConvention,
		eventConvention: input.eventConvention,
		linter: input.linter,
		formatter: input.formatter,
		servicePath: 'src/service',
		agentPath: 'src/agents',
	}
	const serviceDirectory = convertToProjectFileCasing('ping', puristaConfig)
	const serviceFileName = convertToProjectFileCasing('ping v1 service', puristaConfig)
	const serviceBuilderName = camelCase('ping v1 service')

	return `import { exportServiceDefinitions } from '@purista/core'
import { ${serviceBuilderName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

export const serviceBuilders = [${serviceBuilderName}] as const

export const exportPuristaDefinitions = () => exportServiceDefinitions([...serviceBuilders])
`
}

/** Create the script that writes `purista.definitions.json`. */
export const createExportDefinitionsFile = () => `import { writeFile } from 'node:fs/promises'
import { exportPuristaDefinitions } from './definitions.js'

const definitions = await exportPuristaDefinitions()

await writeFile('purista.definitions.json', \`\${JSON.stringify(definitions, null, 2)}\\n\`, 'utf-8')
`

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

/** Create an ESLint flat config for CommonJS projects. */
export const createEslintCommonJsConfigFile = () => `import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
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
import { getEventBridge } from './eventbridge.js'
import { getHttpServer } from './http.js'
import { ${serviceExportName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

export const main = async () => {
	const logger = initLogger()
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
import { getEventBridge } from './eventbridge.js'
import { ${serviceExportName} } from './service/${serviceDirectory}/v1/${serviceFileName}.js'

export const main = async () => {
	const logger = initLogger()
	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []
	const pingService = await ${serviceExportName}.getInstance(eventBridge)
	await pingService.start()
	services.push(pingService)

	logger.info('${bridgeLabel} bridge and ping service started.')
	gracefulShutdown(logger, [eventBridge, ...services])
}

main()
`
}
