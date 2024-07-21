/* eslint-disable no-console */
import path from 'node:path'

import type { Answers } from 'inquirer'
import type { Prompts } from 'node-plop'

import { getEventNames } from '../helper/getEventNames.js'
import { collectServices, installInfo } from '../helper/installInfo.js'

export const addResourcePrompts: Prompts = [
	{
		type: 'list',
		message: 'What do you want to do?',
		name: 'intention',
		choices: [
			{ value: 'add', name: 'add resource' },
			{ value: 'init', name: 'init PURISTA' },
		],
	},
	{
		type: 'list',
		message: 'What do you want to do?',
		name: 'resource',
		choices: [
			{ value: 'service', name: 'add new service' },
			{ value: 'command', name: 'add a command to existing service' },
			{ value: 'subscription', name: 'add a subscription to existing service' },
		],
	},
	{
		type: 'input',
		message(answers) {
			switch (answers.resource) {
				case 'service':
					return 'What is the name (or domain) of your new service (something like: user or account)'
				case 'command':
					return 'What is the name of the new command'
				case 'subscription':
					return 'What is the name of the new subscription'
			}
			throw new Error('Invalid input: purista add [service|command|subscription]')
		},
		name: 'name',
		validate: (input: string) => {
			const match = input.match(/^[a-zA-Z0-9\s\-_]+$/)
			if (match?.length && match[0]) {
				return true
			}
			return 'required: must match [a-zA-Z0-9 -_]'
		},
	},
	{
		type: 'input',
		message(answers) {
			switch (answers.resource) {
				case 'service':
					return `What is the matter of service "${answers.name}"`
				case 'command':
					return `What is the matter of command "${answers.name}"`
				case 'subscription':
					return `What is the matter of subscription "${answers.name}"`
			}
			throw new Error('Invalid input: purista add [service|command|subscription]')
		},
		name: 'description',
	},
	{
		type: 'list',
		message: 'Select a event to subscribe',
		name: 'subscriptionEventList',
		when: (answers: Record<string, unknown>) => answers.resource === 'subscription' && getEventNames().length > 0,
		choices: _answers => {
			return [...getEventNames(), { name: 'Add a new event', value: '' }]
		},
	},
	{
		type: 'input',
		message: 'Name of the event to listen for',
		name: 'subscriptionEventName',
		default: (answers: Record<string, unknown>) => {
			return answers.subscriptionEventList !== '' ? answers.subscriptionEventList : ''
		},
		when: (answers: Record<string, unknown>) =>
			answers.resource === 'subscription' &&
			(getEventNames().length === 0 || (answers.subscriptionEventList as string)?.trim() === ''),
	},
	{
		type: 'input',
		message: 'Name of response event',
		name: 'commandEventName',
		when: (answers: Record<string, unknown>) => answers.resource === 'command',
	},
	{
		type: 'input',
		message: 'Version number of this service',
		default: '1',
		validate: (input: string) => {
			const match = input.match(/^(\d+)$/)
			let version = 0
			if (match?.length && match[0]) {
				version = Number.parseInt(match[0])
			}
			return version > 0 || 'version must be a a positiv int value larger than 0'
		},
		name: 'version',
		when: (answers: Record<string, unknown>) => answers.resource === 'service',
	},
	{
		type: 'list',
		message: 'select a service',
		name: 'service',
		when: (answers: Record<string, unknown>) => answers.resource !== 'service',
		async choices(_answers) {
			const servicePath = path.join(process.cwd(), 'src', 'service')
			collectServices(servicePath)

			const services: Answers[] = installInfo.services.map(entry => {
				return {
					name: `${entry.name} ${entry.version}`,
					value: entry,
				}
			})

			return services
		},
	},
]
