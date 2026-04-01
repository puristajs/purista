import type { Options } from 'code-block-writer'
import type { OutputAdapter, PromptAdapter, PuristaCommandId, PuristaCommandMode, PuristaCommandResolution, PuristaCommandResult } from './types.js'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { ProjectSnapshot } from '../project/createProjectSnapshot.js'

export type PuristaCommandContext = {
	cwd: string
	mode: PuristaCommandMode
	prompt: PromptAdapter
	output?: OutputAdapter
	codeWriterOptions?: Partial<Options>
	puristaConfig?: PuristaConfig
	projectSnapshot?: ProjectSnapshot
	applyDefaults?: boolean
}

export type PuristaExecutableCommand<TInput, TResolved = TInput> = {
	id: PuristaCommandId
	resolve: (input: TInput, context: PuristaCommandContext) => Promise<PuristaCommandResolution<TInput, TResolved>>
	execute: (resolvedInput: TResolved, context: PuristaCommandContext) => Promise<PuristaCommandResult>
}
