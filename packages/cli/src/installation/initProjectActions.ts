/* eslint-disable no-console */
import type { Actions } from 'node-plop'

import {
	TEMPLATE_BASE,
	biomeDependencies,
	cliDependencies,
	dependencies,
	devDependencies,
	eslintDependencies,
	httpserverDependencies,
	jestDependencies,
	vitestDependencies,
} from '../config.js'
import { installDependencies } from '../helper/installDependencies.js'

export const initProjectActions: Actions = [
	answers => {
		if (!answers.initialize) {
			process.exit()
		}
		return 'Installing PURISTA 🚀'
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'package.json',
		templateFile: `${TEMPLATE_BASE}/package.json.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'readme.md',
		templateFile: `${TEMPLATE_BASE}/readme.md.hbs`,
	},
	{
		type: 'add',
		skipIfExists: true,
		path: 'tsconfig.json',
		templateFile: `${TEMPLATE_BASE}/tsconfig.json.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.isEsm) {
				return '[SKIPPED] jest test setup'
			}
		},
		skipIfExists: true,
		path: 'jest.config.js',
		templateFile: `${TEMPLATE_BASE}/jest.config.js.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (!answers.isEsm) {
				return '[SKIPPED] vitest test setup'
			}
		},
		skipIfExists: true,
		path: 'vite.config.ts',
		templateFile: `${TEMPLATE_BASE}/vite.config.ts.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.linter !== 'eslint') {
				return '[SKIPPED] lint setup'
			}
		},
		skipIfExists: true,
		path: '.eslintignore',
		templateFile: `${TEMPLATE_BASE}/eslintignore.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.linter !== 'eslint') {
				return '[SKIPPED] lint setup'
			}
		},
		skipIfExists: true,
		path: '.prettierrc',
		templateFile: `${TEMPLATE_BASE}/prettierrc.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.linter !== 'eslint' || !answers.isEsm) {
				return '[SKIPPED] lint setup'
			}
		},
		skipIfExists: true,
		path: '.eslintrc.cjs',
		templateFile: `${TEMPLATE_BASE}/eslintrc.js.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.linter !== 'eslint' || answers.isEsm) {
				return '[SKIPPED] lint setup'
			}
		},
		skipIfExists: true,
		path: '.eslintrc.js',
		templateFile: `${TEMPLATE_BASE}/eslintrc.js.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.linter !== 'biome') {
				return '[SKIPPED] biome setup'
			}
		},
		skipIfExists: true,
		path: 'biome.json',
		templateFile: `${TEMPLATE_BASE}/biome.json.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.eventBridge !== 'AmqpEventBridge') {
				return '[SKIPPED] AMQP event bridge config'
			}
		},
		skipIfExists: true,
		path: 'config/amqpBridgeConfig.ts',
		templateFile: `${TEMPLATE_BASE}/config/amqpBridgeConfig.ts.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.eventBridge !== 'MqttEventBridge') {
				return '[SKIPPED] MQTT event bridge config'
			}
		},
		skipIfExists: true,
		path: 'config/mqttBridgeConfig.ts',
		templateFile: `${TEMPLATE_BASE}/config/mqttBridgeConfig.ts.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.eventBridge !== 'NatsEventBridge') {
				return '[SKIPPED] NATS event bridge config'
			}
		},
		skipIfExists: true,
		path: 'config/natsBridgeConfig.ts',
		templateFile: `${TEMPLATE_BASE}/config/natsBridgeConfig.ts.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (answers.eventBridge === 'DaprEventBridge') {
				return '[SKIPPED] index files must be created for each service individual'
			}
		},
		skipIfExists: true,
		path: 'src/index.ts',
		templateFile: `${TEMPLATE_BASE}/src/index.ts.hbs`,
	},
	{
		type: 'add',
		skip: (answers: Record<string, string[] | string>) => {
			if (!answers.installHttpService) {
				return '[SKIPPED] http server static install'
			}
		},
		skipIfExists: true,
		path: 'public/index.html',
		templateFile: `${TEMPLATE_BASE}/public/index.html.hbs`,
	},
	async answers => {
		const deps = dependencies

		if (answers.installHttpService) {
			deps.push(...httpserverDependencies)
		}

		switch (answers.eventBridge) {
			case 'AmqpEventBridge':
				deps.push('@purista/amqpbridge')
				break
			case 'MqttEventBridge':
				deps.push('@purista/mqttbridge')
				break
			case 'NatsEventBridge':
				deps.push('@purista/natsbridge')
				break
			case 'DaprEventBridge':
				deps.push('@purista/dapr-sdk')
				break
		}

		await installDependencies(`npm install --save-prod ${deps.join(' ')}`)

		const devDeps = devDependencies

		if (answers.installCliGlobal === 'local') {
			devDeps.push(...cliDependencies)
		}

		if (!answers.isEsm) {
			devDeps.push(...jestDependencies)
		} else {
			devDeps.push(...vitestDependencies)
		}

		if (answers.linter === 'eslint') {
			if (answers.isEsm) {
				devDeps.push('eslint-plugin-vitest')
			}
			devDeps.push(...eslintDependencies)
		}

		if (answers.linter === 'biome') {
			devDeps.push(...biomeDependencies)
		}

		await installDependencies(`npm install --save-dev ${devDeps.join(' ')}`)

		if (answers.installCliGlobal === 'global') {
			await installDependencies(`npm install -g ${cliDependencies.join(' ')}`)
		}

		return 'needed packages installed'
	},
	answers => {
		if (answers.eventBridge === 'DaprEventBridge') {
		}
		return '📖 Learn more about PURISTA at https://purista.dev'
	},
]
