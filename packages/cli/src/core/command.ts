import type { Options } from 'code-block-writer'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { ProjectSnapshot } from '../project/createProjectSnapshot.js'
import type {
	OutputAdapter,
	PromptAdapter,
	PuristaCommandId,
	PuristaCommandMode,
	PuristaCommandResolution,
	PuristaCommandResult,
} from './types.js'

/** Runtime context passed to CLI command resolvers and executors. */
export type PuristaCommandContext = {
	/** Project root or command working directory. */
	cwd: string
	/** Resolution mode selected for this command run. */
	mode: PuristaCommandMode
	/** Prompt adapter used when required values are missing. */
	prompt: PromptAdapter
	/** Optional output adapter for host-specific rendering. */
	output?: OutputAdapter
	/** Formatting options forwarded to generated TypeScript writers. */
	codeWriterOptions?: Partial<Options>
	/** Loaded `purista.json` configuration when the command needs project context. */
	puristaConfig?: PuristaConfig
	/** Snapshot of existing services, events, queues, workers, and agents. */
	projectSnapshot?: ProjectSnapshot
	/** Whether the command may apply defaults for missing values. */
	applyDefaults?: boolean
}

/** Definition contract implemented by commands registered in the CLI engine. */
export type PuristaExecutableCommand<TInput, TResolved = TInput> = {
	/** Stable command identifier. */
	id: PuristaCommandId
	/** Validate and complete raw command input. */
	resolve: (input: TInput, context: PuristaCommandContext) => Promise<PuristaCommandResolution<TInput, TResolved>>
	/** Execute the command with resolved input. */
	execute: (resolvedInput: TResolved, context: PuristaCommandContext) => Promise<PuristaCommandResult>
}
