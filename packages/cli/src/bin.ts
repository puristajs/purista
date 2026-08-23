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
		case 'schedule':
			return 'add-schedule'
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

const renderJsonOutput = (output: unknown) => {
	process.stdout.write(`${JSON.stringify(output, null, 2)}\n`)
}

const main = async () => {
	const program = new Command()
	program.name('purista').description('CLI for the PURISTA framework').version(puristaVersion)

	registerGlobalModeOptions(
		program
			.command('add')
			.description('Add a new service, command, subscription, stream, queue, queue worker, schedule, or agent.')
			.addArgument(
				new Argument('[component]', 'Type of component to add').choices([
					'service',
					'command',
					'subscription',
					'stream',
					'queue',
					'queue-worker',
					'schedule',
					'agent',
				]),
			)
			.addArgument(new Argument('[name]', 'Name of component'))
			.option('--description <description>', 'description of the component')
			.option('--service <serviceName>', 'service name')
			.option('--service-version <serviceVersion>', 'service version')
			.option('--response-event <eventName>', 'response event name')
			.option('--durable-workspace', 'generate a workflow-backed agent with durable workspace policy')
			.option('--event <eventName>', 'event to subscribe to')
			.option('--cron <expression>', 'five-field cron expression for a schedule')
			.option('--timezone <timezone>', 'IANA timezone for a schedule')
			.option('--scheduler-group <schedulerGroup>', 'scheduler deployment group')
			.option('--missed-run-policy <policy>', 'schedule recovery policy: skip, runOnce, or backfill')
			.option('--disabled', 'create a disabled schedule declaration')
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
					durableWorkspace: options.durableWorkspace,
					eventToSubscribe: options.event,
					eventToEmit: options.event,
					cronExpression: options.cron,
					timezone: options.timezone,
					schedulerGroup: options.schedulerGroup,
					missedRunPolicy: options.missedRunPolicy,
					enabledByDefault: options.disabled ? false : undefined,
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

	const registerArchitectureCommand = (
		name: 'inspect' | 'validate' | 'doctor' | 'diff' | 'compose',
		description: string,
	) => {
		const command = registerGlobalModeOptions(
			program
				.command(name)
				.description(description)
				.option('--definitions <path>', 'service definitions JSON file', 'purista.definitions.json')
				.option('--strict', 'promote static architecture warnings to errors')
				.option('--schemas <mode>', 'schema detail: fingerprints or referenced', 'fingerprints')
				.option('--view <view>', 'inspect view: manifest or agent', 'manifest')
				.option('--scope <selector...>', 'component ID, service, event, or kind selector')
				.option('--depth <count>', 'relation hops around selected scope', value => Number.parseInt(value, 10), 1)
				.option('--format <format>', 'output format: json or markdown', 'json'),
		)
		if (name === 'inspect') {
			command.option('--out <path>', 'write the static manifest to a JSON file')
		}
		if (name === 'diff') command.requiredOption('--base <path>', 'base architecture JSON artifact')
		if (name === 'compose') {
			command.requiredOption('--composition <path>', 'composition JSON file')
			command.requiredOption('--artifact <path...>', 'pinned local architecture JSON artifacts')
		}
		command.action(async options => {
			const engine = createEngineForOptions(options)
			const result = await engine.runPuristaCommand(name, {
				definitions: options.definitions,
				out: options.out,
				strict: options.strict,
				schemaMode: options.schemas,
				view: options.view,
				scope: options.scope,
				depth: options.depth,
				format: options.format,
				base: options.base,
				composition: options.composition,
				artifacts: options.artifact,
			})
			if (typeof result.output === 'string') process.stdout.write(result.output)
			else renderJsonOutput(result.output)
			if (!result.ok) {
				process.exitCode = 1
			}
		})
	}

	registerArchitectureCommand('inspect', 'Print a JSON-safe static PURISTA architecture manifest.')
	registerArchitectureCommand(
		'validate',
		'Validate static PURISTA architecture contracts without starting infrastructure.',
	)
	registerArchitectureCommand(
		'doctor',
		'Report static architecture and project-configuration diagnostics without mutating source.',
	)
	registerArchitectureCommand('diff', 'Compare a candidate architecture contract with a base artifact offline.')
	registerArchitectureCommand('compose', 'Validate explicit, pinned cross-repository architecture bindings offline.')

	registerGlobalModeOptions(
		program
			.command('export')
			.description('Export PURISTA interoperability contracts.')
			.addArgument(
				new Argument('<contract>', 'Contract to export').choices([
					'asyncapi',
					'cloudevents-schema',
					'runtime-capabilities',
					'schedule-manifest',
					'kubernetes-cronjob',
				]),
			)
			.option('--definitions <path>', 'service definitions JSON file', 'purista.definitions.json')
			.option('--out <path>', 'output JSON file')
			.option('--title <title>', 'export title')
			.option('--export-version <version>', 'exported document version')
			.option('--mode <mode>', 'runtime capability export mode')
			.option('--trigger-image <image>', 'Kubernetes CronJob trigger container image')
			.option('--trigger-command <command>', 'Kubernetes CronJob trigger command')
			.option('--trigger-arg <arg...>', 'Kubernetes CronJob trigger command argument')
			.option('--trigger-url <url>', 'Kubernetes CronJob HTTP trigger URL template')
			.option('--trigger-method <method>', 'Kubernetes CronJob HTTP trigger method')
			.option('--namespace <namespace>', 'Kubernetes namespace for CronJob manifests')
			.action(async (contract, options) => {
				const commandId =
					contract === 'asyncapi'
						? 'export-asyncapi'
						: contract === 'cloudevents-schema'
							? 'export-cloudevents-schema'
							: contract === 'schedule-manifest'
								? 'export-schedule-manifest'
								: contract === 'kubernetes-cronjob'
									? 'export-kubernetes-cronjob'
									: 'export-runtime-capabilities'
				const engine = createEngineForOptions(options)
				const result = await engine.runPuristaCommand(commandId, {
					definitions: options.definitions,
					out: options.out,
					title: options.title,
					version: options.exportVersion,
					mode: options.mode,
					triggerImage: options.triggerImage,
					triggerCommand: options.triggerCommand,
					triggerArgs: options.triggerArg,
					triggerUrl: options.triggerUrl,
					triggerMethod: options.triggerMethod,
					namespace: options.namespace,
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
			.option('--event-bridge <eventBridge>', 'event bridge')
			.option('--file-convention <fileConvention>', 'file naming convention')
			.option('--event-convention <eventConvention>', 'event naming convention')
			.option('--linter <linter>', 'linter to use')
			.option('--formatter <formatter>', 'formatter to use')
			.option('--webserver', 'include webserver support')
			.option('--no-webserver', 'do not include webserver support')
			.option('--telemetry <telemetry>', 'telemetry setup: none or otel')
			.option('--install', 'install dependencies')
			.option('--no-install', 'skip dependency installation')
			.action(async (target, options) => {
				const engine = createEngineForOptions(options)
				const result = await engine.runPuristaCommand('init-project', {
					target,
					runtime: options.runtime,
					packageManager: options.packageManager,
					eventBridge: options.eventBridge,
					fileConvention: options.fileConvention,
					eventConvention: options.eventConvention,
					linter: options.linter,
					formatter: options.formatter,
					useWebserver: options.webserver,
					telemetry: options.telemetry,
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
