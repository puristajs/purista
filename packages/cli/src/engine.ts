import { createNoPromptAdapter } from './adapters/interactive/noPromptAdapter.js'
import { getFormatConfig } from './api/getFormatConfig.js'
import { loadPuristaConfig } from './api/loadPuristaConfig.js'
import { getCommand } from './commands/index.js'
import { askForMissingValues } from './commands/shared.js'
import type { PuristaCommandContext } from './core/command.js'
import { PuristaCliValidationError } from './core/errors.js'
import type {
	PromptAdapter,
	PuristaCommandId,
	PuristaCommandMode,
	PuristaCommandResolution,
	PuristaCommandResult,
} from './core/types.js'
import { createProjectSnapshot } from './project/createProjectSnapshot.js'

export type PuristaCliEngineOptions = {
	cwd?: string
	mode?: PuristaCommandMode
	prompt?: PromptAdapter
}

const shouldLoadProjectMetadata = (commandId: PuristaCommandId) =>
	commandId !== 'init-project' && !commandId.startsWith('export-')

export const createPuristaCliEngine = (options: PuristaCliEngineOptions = {}) => {
	const cwd = options.cwd ?? process.cwd()
	const mode = options.mode ?? 'programmatic'
	const prompt = options.prompt ?? createNoPromptAdapter()

	const createCommandContext = async (commandId: PuristaCommandId): Promise<PuristaCommandContext> => {
		const context: PuristaCommandContext = {
			cwd,
			mode,
			prompt,
			applyDefaults: true,
		}

		if (commandId !== 'init-project') {
			context.puristaConfig = await loadPuristaConfig(cwd)
		}

		if (shouldLoadProjectMetadata(commandId)) {
			if (!context.puristaConfig) {
				throw new PuristaCliValidationError(`Unable to load purista.json for command ${commandId}.`)
			}
			context.projectSnapshot = await createProjectSnapshot(context.puristaConfig, cwd)
			context.codeWriterOptions = (await getFormatConfig(cwd)).codeWriterOptions
		}

		return context
	}

	return {
		resolvePuristaCommand: async <TInput>(commandId: PuristaCommandId, input: TInput) => {
			const command = getCommand(commandId) as unknown as {
				resolve: (input: unknown, context: PuristaCommandContext) => Promise<PuristaCommandResolution<TInput, unknown>>
			}
			const context = await createCommandContext(commandId)
			return command.resolve(input, context)
		},
		runPuristaCommand: async <TInput>(commandId: PuristaCommandId, input: TInput): Promise<PuristaCommandResult> => {
			const command = getCommand(commandId) as unknown as {
				resolve: (
					input: Record<string, unknown>,
					context: PuristaCommandContext,
				) => Promise<PuristaCommandResolution<Record<string, unknown>, unknown>>
				execute: (resolvedInput: unknown, context: PuristaCommandContext) => Promise<PuristaCommandResult>
			}
			const context = await createCommandContext(commandId)
			let currentInput = input as Record<string, unknown>
			let resolution = await command.resolve(currentInput, context)

			while (resolution.missing.length > 0 && (context.mode === 'interactive' || context.applyDefaults)) {
				currentInput = await askForMissingValues(currentInput, resolution.missing, context)
				resolution = (await command.resolve(currentInput, context)) as PuristaCommandResolution<
					Record<string, unknown>,
					unknown
				>
			}

			if (resolution.missing.length > 0 || resolution.errors.length > 0 || !resolution.resolvedInput) {
				throw new PuristaCliValidationError(`Unable to resolve command ${commandId}.`, {
					command: commandId,
					issues: [
						...resolution.errors,
						...resolution.missing.map(prompt => ({
							code: 'missing_input',
							message: prompt.message,
							path: [prompt.key],
						})),
					],
				})
			}

			return command.execute(resolution.resolvedInput, context)
		},
	}
}

export const resolvePuristaCommand = async <TInput>(
	commandId: PuristaCommandId,
	input: TInput,
	options?: PuristaCliEngineOptions,
) => createPuristaCliEngine(options).resolvePuristaCommand(commandId, input)

export const runPuristaCommand = async <TInput>(
	commandId: PuristaCommandId,
	input: TInput,
	options?: PuristaCliEngineOptions,
) => createPuristaCliEngine(options).runPuristaCommand(commandId, input)
