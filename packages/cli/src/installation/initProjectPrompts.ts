/* eslint-disable no-console */
import type { Prompts } from 'node-plop'

export const initProjectPrompts: Prompts = [
	{
		type: 'list',
		message: 'What do you want to do?',
		name: 'intention',
		choices: [
			{ value: 'add', name: 'add ressource' },
			{ value: 'init', name: 'init PURISTA' },
		],
	},
	{
		type: 'confirm',
		message: 'Initialize PURISTA in current folder',
		name: 'initialize',
	},
	{
		type: 'list',
		message: 'What do you want to do?',
		name: 'isEsm',
		choices: [
			{ value: true, name: 'esm module' },
			{ value: false, name: 'commonjs' },
		],
		when(answers) {
			return answers.initialize
		},
	},
	{
		type: 'list',
		name: 'installCliGlobal',
		message: 'Install PURISTA cli globally?',
		when(answers) {
			return answers.initialize
		},
		choices: [
			{ name: 'install as global npm module', value: 'global', checked: true },
			{ name: 'as local module in this project only', value: 'local' },
			{ name: 'no install', value: 'none' },
		],
	},
	{
		type: 'list',
		name: 'linter',
		message: 'Choose code prettier & linter',
		when(answers) {
			return answers.initialize
		},
		choices: [
			{ name: 'ESlint & prettier', value: 'eslint', checked: true },
			{ name: 'Biome', value: 'biome' },
		],
	},
	{
		type: 'list',
		message: 'Which messaging system should be used',
		name: 'eventBridge',
		when(answers) {
			return answers.initialize
		},
		choices: [
			{ value: 'DefaultEventBridge', name: 'Default In-Memory', checked: true },
			{ value: 'AmqpEventBridge', name: 'AMQP eventbridge (RabbitMQ)' },
			{ value: 'MqttEventBridge', name: 'MQTT eventbridge (mosquitto)' },
			{ value: 'NatsEventBridge', name: 'NATS eventbridge' },
			{ value: 'DaprEventBridge', name: 'Dapr eventbridge' },
		],
	},
	{
		type: 'confirm',
		message: 'Should the @purista/httpserver package be installed, to automatically provide a REST api server?',
		name: 'installHttpService',
		when(answers) {
			return answers.initialize && answers.eventBridge !== 'DaprEventBridge'
		},
	},
]
