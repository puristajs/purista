import { existsSync } from 'node:fs'
import { join } from 'node:path'
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

/** Options for creating a reusable programmatic PURISTA CLI engine. */
export type PuristaCliEngineOptions = {
	/** Project root used for config loading, project scanning, and generated file writes. */
	cwd?: string
	/** Input resolution mode. Defaults to `programmatic`. */
	mode?: PuristaCommandMode
	/** Prompt adapter used when commands need missing values. */
	prompt?: PromptAdapter
}

const shouldLoadProjectMetadata = (commandId: PuristaCommandId) =>
	commandId !== 'init-project' &&
	!commandId.startsWith('export-') &&
	!['inspect', 'validate', 'doctor', 'diff', 'compose'].includes(commandId)

/**
 * Create a programmatic CLI engine bound to a working directory and prompt adapter.
 *
 * @example
 * ```ts
 * const cli = createPuristaCliEngine({ cwd: '/workspace/my-app' })
 * await cli.runPuristaCommand('add-command', {
 *   serviceName: 'user',
 *   serviceVersion: '1',
 *   commandName: 'create user',
 *   commandDescription: 'Create a user account',
 * })
 * ```
 */
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

		const isStaticArchitectureCommand = ['inspect', 'validate', 'doctor', 'diff', 'compose'].includes(commandId)
		if (commandId !== 'init-project' && !isStaticArchitectureCommand) {
			context.puristaConfig = await loadPuristaConfig(cwd)
		}
		if (commandId === 'doctor' && existsSync(join(cwd, 'purista.json'))) {
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

/**
 * Resolve a CLI command without writing files.
 *
 * Use this to preview missing prompts, validation issues, and resolved defaults.
 */
export const resolvePuristaCommand = async <TInput>(
	commandId: PuristaCommandId,
	input: TInput,
	options?: PuristaCliEngineOptions,
) => createPuristaCliEngine(options).resolvePuristaCommand(commandId, input)

/**
 * Resolve and execute a CLI command in one call.
 *
 * @example
 * ```ts
 * await runPuristaCommand('add-service', {
 *   serviceName: 'billing',
 *   serviceDescription: 'Owns billing workflows',
 * })
 * ```
 */
export const runPuristaCommand = async <TInput>(
	commandId: PuristaCommandId,
	input: TInput,
	options?: PuristaCliEngineOptions,
) => createPuristaCliEngine(options).runPuristaCommand(commandId, input)
