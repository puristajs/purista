#!/usr/bin/env node
import { existsSync, readdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import confirm from '@inquirer/confirm'
import input from '@inquirer/input'
import select from '@inquirer/select'
import { Argument, program } from 'commander'
import { addPuristaAgent } from './api/addPuristaAgent.js'
import { addPuristaCommand } from './api/addPuristaCommand.js'
import { addPuristaQueue } from './api/addPuristaQueue.js'
import { addPuristaQueueWorker } from './api/addPuristaQueueWorker.js'
import { addPuristaService } from './api/addPuristaService.js'
import { addPuristaStream } from './api/addPuristaStream.js'
import { addPuristaSubscription } from './api/addPuristaSubscription.js'
import { camelCase, capitalCase } from './api/change-case.js'
import { ensureServiceEvent } from './api/content/manipulation/ensureServiceEvent.js'
import { convertToProjectFileCasing } from './api/convertToProjectFileCasing.js'
import { getFormatConfig } from './api/getFormatConfig.js'
import { loadPuristaConfig, type PuristaConfig, puristaConfigSchema } from './api/loadPuristaConfig.js'
import { scanPuristaProject } from './api/scanPuristaProject.js'
import { puristaVersion } from './version.js'

type addComponetInput = {
	component: 'service' | 'command' | 'subscription' | 'stream' | 'queue' | 'queue-worker' | 'agent'
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
		.description('Add a new service, command, subscription, stream, queue, queue worker, or agent.')
		.addArgument(
			new Argument('[component]', 'Type of component to add').choices([
				'service',
				'command',
				'subscription',
				'stream',
				'queue',
				'queue-worker',
				'agent',
			]),
		)
		.addArgument(new Argument('[name]', 'Name of component'))
		.action(
			async (
				...args: [
					'service' | 'command' | 'subscription' | 'stream' | 'queue' | 'queue-worker' | 'agent' | undefined,
					string?,
				]
			) => {
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
						choices: ['service', 'command', 'subscription', 'stream', 'queue', 'queue-worker', 'agent'],
						default: 'service',
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

				if (!Object.keys(puristaProject.services).length) {
					console.error('No services found. Please add a service first.')
					process.exit(1)
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
					if (!serviceVersions.length) {
						console.error(`No versions found for service ${capitalCase(data.serviceName)}.`)
						process.exit(1)
					}
					data.serviceVersion = serviceVersions[0].value
				}

				if (data.component === 'agent') {
					await addPuristaAgent({
						projectRootPath,
						puristaConfig,
						puristaProject: puristaProject,
						serviceName: data.serviceName,
						serviceVersion: data.serviceVersion,
						agentName: data.name,
						agentDescription: data.description,
						codeWriterOptions,
					})
					return
				}

				if (data.component === 'queue') {
					const defaultWorkerName = `${camelCase(data.name)}Worker`
					const workerName = await input({
						message: 'Name of the queue worker (default derived)',
						required: true,
						default: defaultWorkerName,
					})

					const workerDescription = await input({
						message: 'Description of the queue worker',
						required: true,
						default: data.description,
					})

					const workerMode = (await select({
						loop: true,
						message: 'Select worker mode',
						choices: [
							{ name: 'continuous', value: 'continuous' },
							{ name: 'interval', value: 'interval' },
							{ name: 'sequential', value: 'sequential' },
						],
						default: 'continuous',
					})) as 'continuous' | 'interval' | 'sequential'

					let intervalMs: number | undefined
					if (workerMode === 'interval') {
						const intervalInput = await input({
							message: 'Interval in milliseconds',
							default: '60000',
							required: true,
							validate: text => {
								const value = Number.parseInt(text, 10)
								return Number.isNaN(value) || value <= 0 ? 'Enter a positive integer' : true
							},
						})
						intervalMs = Number.parseInt(intervalInput, 10)
					}

					const maxParallelInput = await input({
						message: 'Max parallel handlers',
						default: '1',
						required: true,
						validate: text => {
							const value = Number.parseInt(text, 10)
							return Number.isNaN(value) || value <= 0 ? 'Enter a positive integer' : true
						},
					})
					const maxParallelHandlers = Number.parseInt(maxParallelInput, 10)

					let producerOptions:
						| { commandName: string; commandDescription: string; responseEventName?: string }
						| undefined
					const scaffoldProducer = await confirm({
						message: 'Create a producer command that enqueues jobs?',
						default: true,
					})
					if (scaffoldProducer) {
						const commandName = await input({
							message: 'Name of the producer command',
							required: true,
							default: `${data.name} producer`,
						})
						const commandDescription = await input({
							message: 'Description of the producer command',
							required: true,
						})
						const responseEventName = await input({
							message: 'Name of the response event (optional)',
							required: false,
						})

						if (responseEventName?.trim().length) {
							const description = `Emitted by ${data.serviceName} v${data.serviceVersion} command ${camelCase(
								commandName,
							)}:\n${commandDescription}`

							await ensureServiceEvent({
								projectRootPath,
								puristaProjectConfig: puristaConfig,
								puristaProject,
								eventName: responseEventName,
								description,
							})
						}

						producerOptions = {
							commandName,
							commandDescription,
							responseEventName: responseEventName?.trim() ? responseEventName : undefined,
						}
					}

					await addPuristaQueue({
						projectRootPath,
						puristaConfig,
						puristaProject,
						serviceName: data.serviceName,
						serviceVersion: data.serviceVersion,
						queueName: data.name,
						queueDescription: data.description,
						worker: {
							name: workerName,
							description: workerDescription,
							mode: workerMode,
							intervalMs,
							maxParallelHandlers,
						},
						producer: producerOptions,
						codeWriterOptions,
					})

					return
				}

				if (data.component === 'queue-worker') {
					const queueRoot = join(
						projectRootPath,
						puristaConfig.servicePath,
						convertToProjectFileCasing(data.serviceName, puristaConfig),
						`v${data.serviceVersion}`,
						'queue',
					)

					if (!existsSync(queueRoot)) {
						console.error('No queues found for the selected service. Create a queue first.')
						process.exit(1)
					}

					const queueDirs = readdirSync(queueRoot, { withFileTypes: true })
						.filter(entry => entry.isDirectory())
						.map(entry => entry.name)
					if (!queueDirs.length) {
						console.error('No queues found for the selected service. Create a queue first.')
						process.exit(1)
					}

					const queueName = await select({
						loop: true,
						message: 'Select the queue to attach a worker to',
						choices: queueDirs.map(dir => ({ name: capitalCase(dir), value: dir })),
					})

					const workerMode = (await select({
						loop: true,
						message: 'Select worker mode',
						choices: [
							{ name: 'continuous', value: 'continuous' },
							{ name: 'interval', value: 'interval' },
							{ name: 'sequential', value: 'sequential' },
						],
						default: 'continuous',
					})) as 'continuous' | 'interval' | 'sequential'

					let intervalMs: number | undefined
					if (workerMode === 'interval') {
						const intervalInput = await input({
							message: 'Interval in milliseconds',
							default: '60000',
							required: true,
							validate: text => {
								const value = Number.parseInt(text, 10)
								return Number.isNaN(value) || value <= 0 ? 'Enter a positive integer' : true
							},
						})
						intervalMs = Number.parseInt(intervalInput, 10)
					}

					const maxParallelInput = await input({
						message: 'Max parallel handlers',
						default: '1',
						required: true,
						validate: text => {
							const value = Number.parseInt(text, 10)
							return Number.isNaN(value) || value <= 0 ? 'Enter a positive integer' : true
						},
					})
					const maxParallelHandlers = Number.parseInt(maxParallelInput, 10)

					await addPuristaQueueWorker({
						projectRootPath,
						puristaConfig,
						puristaProject,
						serviceName: data.serviceName,
						serviceVersion: data.serviceVersion,
						queueName,
						workerName: data.name,
						workerDescription: data.description,
						mode: workerMode,
						intervalMs,
						maxParallelHandlers,
						codeWriterOptions,
					})

					return
				}

				// handle creation of a new subscription
				if (data.component === 'subscription') {
					if (!puristaProject.eventNames.length) {
						console.error('No service events found. Create or register events before adding a subscription.')
						process.exit(1)
					}

					data.eventToSubscribe = await select({
						loop: true,
						message: 'What event do you want to subscribe?',
						choices: puristaProject.eventNames,
					})

					const responseEventName = await input({
						message: 'Name of the response event (optional)',
						required: false,
					})

					if (responseEventName?.trim().length) {
						const description = `Emitted by ${data.serviceName} v${data.serviceVersion} subscription ${camelCase(
							data.name,
						)}:\n${data.description}`

						await ensureServiceEvent({
							projectRootPath,
							puristaProjectConfig: puristaConfig,
							puristaProject,
							eventName: responseEventName,
							description,
						})
					}

					await addPuristaSubscription({
						projectRootPath,
						puristaConfig,
						subscriptionDescription: data.description,
						serviceName: data.serviceName,
						serviceVersion: data.serviceVersion,
						subscriptionName: data.name,
						responseEventName: responseEventName?.trim() ? responseEventName : undefined,
						eventToSubscribe: data.eventToSubscribe,
						puristaProject,
						codeWriterOptions,
					})
					return
				}

				if (data.component === 'stream') {
					const responseEventName = await input({
						message: 'Name of the response event (optional)',
						required: false,
					})

					if (responseEventName?.trim().length) {
						const description = `Emitted by ${data.serviceName} v${data.serviceVersion} stream ${camelCase(
							data.name,
						)}:\n${data.description}`

						await ensureServiceEvent({
							projectRootPath,
							puristaProjectConfig: puristaConfig,
							puristaProject,
							eventName: responseEventName,
							description,
						})
					}

					await addPuristaStream({
						projectRootPath,
						puristaConfig,
						streamDescription: data.description,
						serviceName: data.serviceName,
						serviceVersion: data.serviceVersion,
						streamName: data.name,
						responseEventName: responseEventName?.trim() ? responseEventName : undefined,
						puristaProject,
						codeWriterOptions,
					})
					return
				}

				// handle creation of a new command
				const responseEventName = await input({
					message: 'Name of the response event (optional)',
					required: false,
				})

				if (responseEventName?.trim().length) {
					const description = `Emitted by ${data.serviceName} v${data.serviceVersion} command ${camelCase(
						data.name,
					)}:\n${data.description}`

					await ensureServiceEvent({
						projectRootPath,
						puristaProjectConfig: puristaConfig,
						puristaProject,
						eventName: responseEventName,
						description,
					})
				}

				await addPuristaCommand({
					projectRootPath,
					puristaConfig,
					commandDescription: data.description,
					serviceName: data.serviceName,
					serviceVersion: data.serviceVersion,
					commandName: data.name,
					responseEventName: responseEventName?.trim() ? responseEventName : undefined,
					puristaProject,
					codeWriterOptions,
				})
			},
		)

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
