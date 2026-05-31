import type { TsConfigJson } from 'type-fest'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { PKG } from '../create/getPackageJson.js'
import {
	createAgentImplementationFile,
	createAgentsFile,
	createAmqpConfigFile,
	createBiomeConfigFile,
	createClaudeFile,
	createDaprConfigFile,
	createDefinitionsFile,
	createEslintModuleConfigFile,
	createExportDefinitionsFile,
	createGitIgnoreFile,
	createHttpConfigFile,
	createMqttConfigFile,
	createNatsConfigFile,
	createPublicIndexHtml,
	createReadmeFile,
	createServiceEventEnumFile,
} from './content.js'
import type { ProjectBlueprint } from './types.js'

const baseTsConfig: TsConfigJson = {
	compilerOptions: {
		outDir: 'dist',
		strict: true,
		ignoreDeprecations: '6.0',
		module: 'es2022',
		declaration: false,
		removeComments: false,
		emitDecoratorMetadata: true,
		experimentalDecorators: true,
		moduleResolution: 'Node',
		allowSyntheticDefaultImports: true,
		target: 'es2022',
		sourceMap: true,
		incremental: true,
		noImplicitAny: true,
		esModuleInterop: true,
		resolveJsonModule: true,
		skipLibCheck: true,
		forceConsistentCasingInFileNames: true,
		declarationMap: false,
		noFallthroughCasesInSwitch: true,
		useUnknownInCatchVariables: true,
	},
	include: ['src/**/*.ts'],
	exclude: ['node_modules', 'dist'],
}

const basePuristaConfig: Partial<PuristaConfig> = {
	$schema: 'https://purista.dev/schemas/1.12.0/schema.json',
	servicePath: 'src/service',
	agentPath: 'src/agents',
}

const basePackage: PKG = {
	private: true,
	scripts: {
		'add:service': 'purista add service',
		'add:command': 'purista add command',
		'add:subscription': 'purista add subscription',
		'add:stream': 'purista add stream',
		'add:queue': 'purista add queue',
		'add:queue-worker': 'purista add queue-worker',
		'add:agent': 'purista add agent',
	},
	dependencies: {
		'@purista/core': 'latest',
		zod: 'latest',
	},
	devDependencies: {
		'@purista/cli': 'latest',
		'@types/sinon': 'latest',
		sinon: 'latest',
		typescript: 'latest',
	},
	trustedDependencies: [],
}

const runtimeNodePackage: PKG = {
	scripts: {
		start: 'tsx src/index.ts',
		build: 'tsc',
		dev: 'tsx watch src/index.ts',
		test: 'tsc --noEmit && vitest run',
		'export:definitions': 'tsx src/exportDefinitions.ts',
		'export:asyncapi': 'tsx src/exportDefinitions.ts && purista export asyncapi --out asyncapi.json',
		'export:schedules': 'tsx src/exportDefinitions.ts && purista export schedule-manifest --out schedules.json',
		'export:kubernetes-cronjobs':
			'tsx src/exportDefinitions.ts && purista export kubernetes-cronjob --out kubernetes-cronjobs.json',
		'export:runtime': 'purista export runtime-capabilities --out purista-runtime.json',
	},
	devDependencies: {
		'@types/node': 'latest',
		tsx: 'latest',
		vitest: 'latest',
	},
	trustedDependencies: [],
}

const runtimeBunPackage: PKG = {
	scripts: {
		start: 'bun src/index.ts',
		build: 'tsc',
		dev: 'bun --watch run src/index.ts',
		test: 'tsc --noEmit && bun test',
		'export:definitions': 'bun src/exportDefinitions.ts',
		'export:asyncapi': 'bun src/exportDefinitions.ts && purista export asyncapi --out asyncapi.json',
		'export:schedules': 'bun src/exportDefinitions.ts && purista export schedule-manifest --out schedules.json',
		'export:kubernetes-cronjobs':
			'bun src/exportDefinitions.ts && purista export kubernetes-cronjob --out kubernetes-cronjobs.json',
		'export:runtime': 'purista export runtime-capabilities --out purista-runtime.json',
	},
	devDependencies: {
		'@types/bun': 'latest',
	},
	trustedDependencies: [],
}

const biomePackage: PKG = {
	scripts: {
		lint: 'npx @biomejs/biome check .',
		'lint:fix': 'npx @biomejs/biome check --write .',
	},
	devDependencies: {
		'@biomejs/biome': 'latest',
	},
	trustedDependencies: ['@biomejs/biome'],
}

const eslintPackage: PKG = {
	scripts: {
		lint: 'eslint .',
		'lint:fix': 'eslint . --fix',
	},
	devDependencies: {
		'@eslint/js': '^9.20.0',
		eslint: '^9.20.1',
		globals: '^15.15.0',
		'typescript-eslint': '^8.24.0',
	},
	trustedDependencies: [],
}

/** Registry of built-in project blueprints used by `planProjectGeneration`. */
export const projectBlueprintRegistry: Record<string, ProjectBlueprint> = {
	base: {
		id: 'base',
		description: 'Base app shell, shared config and example service.',
		tags: ['base', 'project'],
		create: context => ({
			files: [
				{ path: '.gitignore', content: createGitIgnoreFile() },
				{ path: 'README.md', content: createReadmeFile(context) },
				{ path: 'AGENTS.md', content: createAgentsFile(context) },
				{ path: 'CLAUDE.md', content: createClaudeFile() },
				{ path: '.agents/IMPLEMENTATION.md', content: createAgentImplementationFile(context) },
				{
					type: 'symlink',
					path: '.agents/skills/purista',
					target: '../../node_modules/@purista/core/skills/purista',
				},
				{
					type: 'symlink',
					path: '.claude/skills/purista',
					target: '../../node_modules/@purista/core/skills/purista',
				},
				{ path: 'src/definitions.ts', content: createDefinitionsFile(context) },
				{ path: 'src/exportDefinitions.ts', content: createExportDefinitionsFile() },
				{ path: 'src/service/serviceEvent.enum.ts', content: createServiceEventEnumFile(context) },
			],
			packageJson: basePackage,
			tsconfig: baseTsConfig,
			puristaConfig: basePuristaConfig,
			generatorSteps: [
				{
					type: 'example-service',
					serviceName: 'ping',
					serviceDescription: 'Simple health and connectivity service',
					serviceVersion: '1',
					commandName: 'ping',
					commandDescription: `Ping through the ${context.eventBridge} blueprint`,
				},
			],
		}),
	},
	'runtime-node': {
		id: 'runtime-node',
		description: 'Node.js runtime scripts and TS defaults.',
		tags: ['runtime', 'node'],
		create: () => ({
			packageJson: runtimeNodePackage,
			tsconfig: {
				compilerOptions: {
					types: ['node'],
				},
			},
		}),
	},
	'runtime-bun': {
		id: 'runtime-bun',
		description: 'Bun runtime scripts and TS defaults.',
		tags: ['runtime', 'bun'],
		create: () => ({
			packageJson: runtimeBunPackage,
			tsconfig: {
				compilerOptions: {
					types: ['bun'],
				},
			},
		}),
	},
	'bridge-default': {
		id: 'bridge-default',
		description: 'In-memory default event bridge.',
		tags: ['bridge', 'default'],
		create: () => ({
			packageJson: {
				dependencies: {},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'bridge-amqp': {
		id: 'bridge-amqp',
		description: 'AMQP bridge wiring.',
		tags: ['bridge', 'amqp'],
		create: () => ({
			files: [{ path: 'src/config/amqp.ts', content: createAmqpConfigFile() }],
			packageJson: {
				dependencies: {
					'@purista/amqpbridge': 'latest',
				},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'bridge-mqtt': {
		id: 'bridge-mqtt',
		description: 'MQTT bridge wiring.',
		tags: ['bridge', 'mqtt'],
		create: () => ({
			files: [{ path: 'src/config/mqtt.ts', content: createMqttConfigFile() }],
			packageJson: {
				dependencies: {
					'@purista/mqttbridge': 'latest',
				},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'bridge-nats': {
		id: 'bridge-nats',
		description: 'NATS bridge wiring.',
		tags: ['bridge', 'nats'],
		create: () => ({
			files: [{ path: 'src/config/nats.ts', content: createNatsConfigFile() }],
			packageJson: {
				dependencies: {
					'@purista/natsbridge': 'latest',
				},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'bridge-dapr': {
		id: 'bridge-dapr',
		description: 'Dapr event bridge wiring.',
		tags: ['bridge', 'dapr'],
		create: () => ({
			files: [{ path: 'src/config/dapr.ts', content: createDaprConfigFile() }],
			packageJson: {
				dependencies: {
					'@purista/dapr-sdk': 'latest',
				},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'http-node': {
		id: 'http-node',
		description: 'Node HTTP server blueprint.',
		tags: ['http', 'node'],
		dependencies: ['runtime-node'],
		conflicts: ['bridge-dapr'],
		create: context => ({
			files: [
				{ path: 'src/config/http.ts', content: createHttpConfigFile() },
				{ path: 'public/index.html', content: createPublicIndexHtml(context) },
			],
			packageJson: {
				dependencies: {
					'@purista/hono-http-server': 'latest',
					'@scalar/hono-api-reference': 'latest',
				},
				devDependencies: {
					'@hono/node-server': 'latest',
				},
				trustedDependencies: [],
			},
		}),
	},
	'http-bun': {
		id: 'http-bun',
		description: 'Bun HTTP server blueprint.',
		tags: ['http', 'bun'],
		dependencies: ['runtime-bun'],
		conflicts: ['bridge-dapr'],
		create: context => ({
			files: [
				{ path: 'src/config/http.ts', content: createHttpConfigFile() },
				{ path: 'public/index.html', content: createPublicIndexHtml(context) },
			],
			packageJson: {
				dependencies: {
					'@purista/hono-http-server': 'latest',
					'@scalar/hono-api-reference': 'latest',
					hono: 'latest',
				},
				devDependencies: {},
				trustedDependencies: [],
			},
		}),
	},
	'linter-biome': {
		id: 'linter-biome',
		description: 'Biome linter and formatter.',
		tags: ['linter', 'biome'],
		create: () => ({
			files: [{ path: 'biome.json', content: createBiomeConfigFile() }],
			packageJson: biomePackage,
		}),
	},
	'linter-eslint-module': {
		id: 'linter-eslint-module',
		description: 'ESLint config for ESM projects.',
		tags: ['linter', 'eslint', 'module'],
		create: () => ({
			files: [{ path: 'eslint.config.mjs', content: createEslintModuleConfigFile() }],
			packageJson: eslintPackage,
		}),
	},
}
