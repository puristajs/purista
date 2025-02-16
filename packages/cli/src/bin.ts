#!/usr/bin/env node
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import confirm from '@inquirer/confirm'
import input from '@inquirer/input'
import select from '@inquirer/select'
import { camelCase, capitalCase } from 'change-case'
import { Argument, program } from 'commander'
import { addPuristaCommand } from './api/addPuristaCommand.js'
import { addPuristaService } from './api/addPuristaService.js'
import { addPuristaSubscription } from './api/addPuristaSubscription.js'
import { ensureServiceEvent } from './api/content/manipulation/ensureServiceEvent.js'
import { getFormatConfig } from './api/getFormatConfig.js'
import { type PuristaConfig, loadPuristaConfig, puristaConfigSchema } from './api/loadPuristaConfig.js'
import { scanPuristaProject } from './api/scanPuristaProject.js'
import { puristaVersion } from './version.js'

type addComponetInput = {
	component: 'service' | 'command' | 'subscription'
	name: string
	description: string
	eventToSubscribe?: string
	responseEventName?: string
	serviceName?: string
	serviceVersion?: string
}

const main = async () => {
	const projectRootPath = process.cwd()
	let puristaConfig: PuristaConfig

	const { formatter, codeWriterOptions } = await getFormatConfig(projectRootPath)

	try {
		puristaConfig = await loadPuristaConfig()
	} catch (error) {
		if (!(error as Error).message.includes('purista.json not found')) {
			console.error('Please check if a valid purista.json file exists in your project root directory')
			process.exit(1)
		}

		const createDefaultConfig = await confirm({
			message: 'Should I create a purista.json file with default configuration?',
			default: true,
		})

		if (!createDefaultConfig) {
			process.exit(1)
		}
		const defaultConfig = puristaConfigSchema.parse({
			eventBridge: 'default',
			runtime: 'node',
			fileConvention: 'camel',
			linter: formatter === 'biome' ? 'biome' : 'none',
			servicePath: 'src/service',
			formatter,
		})

		puristaConfig = defaultConfig

		await writeFile(join(projectRootPath, 'purista.json'), JSON.stringify(defaultConfig, null, 2), 'utf-8')
	}

	const puristaProject = await scanPuristaProject(puristaConfig)

	program.name('purista').description('CLI for the PURISTA framework').version(puristaVersion)

	program
		.command('add')
		.description('Add a new service, command or subscription. ')
		.addArgument(
			new Argument('[component]', 'Type of component to add').choices(['service', 'command', 'subscription']),
		)
		.addArgument(new Argument('[name]', 'Name of component'))
		.action(async (...args: ['service' | 'command' | 'subscription' | undefined, string?]) => {
			const data: addComponetInput = {
				component: 'service',
				name: '',
				description: '',
				eventToSubscribe: undefined,
				responseEventName: undefined,
			}

			data.component =
				args?.[0] ??
				(await select({
					loop: true,
					message: 'What do you want to add?',
					choices: ['service', 'command', 'subscription'],
					default: 0,
				}))

			data.name =
				args?.[1] ??
				(await input({
					message: `Name of the ${data.component}`,
					required: true,
					validate: text => {
						if (!text.trim().length) {
							return `Please enter the name for the ${data.component}`
						}
						return true
					},
				}))

			data.description = await input({
				message: `Description of the ${data.component}`,
				required: true,
			})

			// handle creation of a new service
			if (data.component === 'service') {
				await addPuristaService({
					projectRootPath,
					puristaConfig,
					puristaProject,
					serviceName: data.name,
					serviceDescription: data.description,
					codeWriterOptions,
				})
				return
			}

			const serviceNames = Object.keys(puristaProject.services)
				.map(key => ({
					name: capitalCase(key),
					value: key,
				}))
				.sort((a, b) => a.name.localeCompare(b.name))

			data.serviceName = await select({
				loop: true,
				message: 'What service do you want to use?',
				choices: serviceNames,
			})

			const serviceVersions = Object.keys(puristaProject.services[data.serviceName])
				.map(key => ({
					name: capitalCase(key),
					value: key,
				}))
				.sort((a, b) => {
					const nameComparison = a.name.localeCompare(b.name)
					if (nameComparison !== 0) return nameComparison
					return b.value.localeCompare(a.value, undefined, { numeric: true })
				})

			if (serviceVersions.length > 1) {
				data.serviceVersion = await select({
					loop: true,
					message: `Choose the version of service ${capitalCase(data.serviceName)}`,
					choices: serviceVersions,
				})
			} else {
				data.serviceVersion = serviceVersions[0].value
			}

			data.responseEventName = await input({
				message: 'Name of the response event (optional)',
				required: false,
			})

			if (data.responseEventName?.trim().length) {
				const description = `Emitted by ${data.serviceName} v${data.serviceVersion} command ${camelCase(
					data.name,
				)}:\n${data.description}`

				await ensureServiceEvent({
					projectRootPath,
					puristaProjectConfig: puristaConfig,
					puristaProject,
					eventName: data.responseEventName,
					description,
				})
			}

			// handle creation of a new subscription
			if (data.component === 'subscription') {
				data.eventToSubscribe = await select({
					loop: true,
					message: 'What event do you want to subscribe?',
					choices: puristaProject.eventNames,
				})

				await addPuristaSubscription({
					projectRootPath,
					puristaConfig,
					subscriptionDescription: data.description,
					serviceName: data.serviceName,
					serviceVersion: data.serviceVersion,
					subscriptionName: data.name,
					responseEventName: data.responseEventName,
					eventToSubscribe: data.eventToSubscribe,
					puristaProject,
					codeWriterOptions,
				})
				return
			}

			// handle creation of a new command
			await addPuristaCommand({
				projectRootPath,
				puristaConfig,
				commandDescription: data.description,
				serviceName: data.serviceName,
				serviceVersion: data.serviceVersion,
				commandName: data.name,
				responseEventName: data.responseEventName,
				puristaProject,
				codeWriterOptions,
			})
		})

	program.parse(process.argv)
}

const controller = new AbortController()

const timeoutId = setTimeout(() => controller.abort(), 5000)

fetch('https://registry.npmjs.org/@purista/cli/latest', { signal: controller.signal })
	.then(async response => {
		clearTimeout(timeoutId)
		await response
			.json()
			.then((value: Record<string, string>) => {
				if (value.version !== puristaVersion) {
					console.error('🚨 BE AWARE!')
					console.error(`Looks like your CLI version is outdated. Your version is ${puristaVersion}`)
					console.error(`Latest version is ${value.version} - Please upgrade before you proceed!`)
					console.error('')
				} else {
					console.log(`👍 You use latest CLI version ${value.version}`)
				}
			})
			.catch(console.error)
	})
	.finally(main)
