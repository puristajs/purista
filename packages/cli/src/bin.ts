#!/usr/bin/env node
import { Argument, Command, Option } from 'commander'
import { getCommandMode } from './adapters/argv/getCommandMode.js'
import { createTerminalPromptAdapter } from './adapters/interactive/terminalPromptAdapter.js'
import { createTerminalOutputAdapter } from './adapters/output/terminalOutput.js'
import { PuristaCliError } from './core/errors.js'
import { createPuristaCliEngine } from './engine.js'
import { puristaVersion } from './version.js'

const mapAddComponentToCommand = (component: string) => {
	switch (component) {
		case 'service':
			return 'add-service'
		case 'command':
			return 'add-command'
		case 'subscription':
			return 'add-subscription'
		case 'stream':
			return 'add-stream'
		case 'queue':
			return 'add-queue'
		case 'queue-worker':
			return 'add-queue-worker'
		case 'agent':
			return 'add-agent'
		default:
			throw new PuristaCliError(`Unsupported component "${component}".`)
	}
}

const createEngineForOptions = (options: {
	interactive?: boolean
	nonInteractive?: boolean
	yes?: boolean
	defaults?: boolean
}) => {
	const mode = getCommandMode(options)
	return createPuristaCliEngine({
		cwd: process.cwd(),
		mode,
		prompt: mode === 'interactive' ? createTerminalPromptAdapter() : undefined,
	})
}

const registerGlobalModeOptions = (command: Command) => {
	command.addOption(new Option('--interactive', 'force interactive prompts'))
	command.addOption(new Option('--non-interactive', 'disable prompts and fail on missing values'))
	command.addOption(new Option('--yes', 'run non-interactively using explicit defaults only'))
	command.addOption(new Option('--defaults', 'apply explicit defaults without prompting'))
	return command
}

const main = async () => {
	const program = new Command()
	program.name('purista').description('CLI for the PURISTA framework').version(puristaVersion)

	registerGlobalModeOptions(
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
			.option('--description <description>', 'description of the component')
			.option('--service <serviceName>', 'service name')
			.option('--service-version <serviceVersion>', 'service version')
			.option('--response-event <eventName>', 'response event name')
			.option('--event <eventName>', 'event to subscribe to')
			.option('--queue <queueName>', 'queue name')
			.option('--worker-name <workerName>', 'queue worker name')
			.option('--worker-description <workerDescription>', 'queue worker description')
			.option('--worker-mode <workerMode>', 'worker mode')
			.option('--interval-ms <intervalMs>', 'worker interval in milliseconds')
			.option('--max-parallel-handlers <maxParallelHandlers>', 'maximum parallel handlers')
			.option('--with-producer', 'create producer command for queue')
			.option('--without-producer', 'do not create producer command for queue')
			.option('--producer-command-name <producerCommandName>', 'producer command name')
			.option('--producer-command-description <producerCommandDescription>', 'producer command description')
			.option('--producer-response-event <producerResponseEventName>', 'producer response event name')
			.action(async (component, name, options) => {
				if (!component) {
					throw new PuristaCliError('Component type is required. Use interactive mode or specify a component.')
				}

				const commandId = mapAddComponentToCommand(component)
				const engine = createEngineForOptions(options)
				const result = await engine.runPuristaCommand(commandId, {
					name,
					description: options.description,
					serviceName: options.service,
					serviceVersion: options.serviceVersion,
					responseEventName: options.responseEvent,
					eventToSubscribe: options.event,
					queueName: options.queue,
					workerName: options.workerName,
					workerDescription: options.workerDescription,
					workerMode: options.workerMode,
					intervalMs: options.intervalMs,
					maxParallelHandlers: options.maxParallelHandlers,
					createProducer: options.withProducer ? true : options.withoutProducer ? false : undefined,
					producerCommandName: options.producerCommandName,
					producerCommandDescription: options.producerCommandDescription,
					producerResponseEventName: options.producerResponseEvent,
				})

				createTerminalOutputAdapter().renderResult(result)
			}),
	)

	registerGlobalModeOptions(
		program
			.command('init')
			.description('Create a new PURISTA project.')
			.argument('[target]', 'target directory')
			.option('--runtime <runtime>', 'runtime to use')
			.option('--package-manager <packageManager>', 'package manager to use')
			.option('--type <type>', 'module type')
			.option('--event-bridge <eventBridge>', 'event bridge')
			.option('--file-convention <fileConvention>', 'file naming convention')
			.option('--event-convention <eventConvention>', 'event naming convention')
			.option('--linter <linter>', 'linter to use')
			.option('--formatter <formatter>', 'formatter to use')
			.option('--webserver', 'include webserver support')
			.option('--no-webserver', 'do not include webserver support')
			.option('--install', 'install dependencies')
			.option('--no-install', 'skip dependency installation')
			.action(async (target, options) => {
				const engine = createEngineForOptions(options)
				const result = await engine.runPuristaCommand('init-project', {
					target,
					runtime: options.runtime,
					packageManager: options.packageManager,
					type: options.type,
					eventBridge: options.eventBridge,
					fileConvention: options.fileConvention,
					eventConvention: options.eventConvention,
					linter: options.linter,
					formatter: options.formatter,
					useWebserver: options.webserver,
					installDependencies: options.install,
				})

				createTerminalOutputAdapter().renderResult(result)
			}),
	)

	try {
		await program.parseAsync(process.argv)
	} catch (error) {
		createTerminalOutputAdapter().renderError(error)
		process.exit(error instanceof PuristaCliError ? error.exitCode : 1)
	}
}

main()
