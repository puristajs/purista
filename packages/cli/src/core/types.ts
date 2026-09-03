/** Ordered list of command identifiers supported by the programmatic CLI engine. */
export const puristaCommandIds = [
	'add-service',
	'add-command',
	'add-subscription',
	'add-stream',
	'add-queue',
	'add-queue-worker',
	'add-agent',
	'add-workflow',
	'export-asyncapi',
	'export-runtime-capabilities',
	'export-schedule-manifest',
	'export-kubernetes-cronjob',
	'export-cloudevents-schema',
	'init-project',
] as const

/** Command identifiers accepted by the programmatic CLI engine. */
export type PuristaCommandId = (typeof puristaCommandIds)[number]

/** Controls how unresolved command input is completed before execution. */
export type PuristaCommandMode = 'interactive' | 'non-interactive' | 'programmatic'

/** Describes one file path changed by a CLI command. */
export type PuristaFileMutation = {
	/** Path relative to the project root. */
	path: string
	/** Whether the command created a new file or updated an existing file. */
	kind: 'created' | 'updated'
}

/** A validation or execution issue reported by a CLI command. */
export type PuristaCommandIssue = {
	/** Stable machine-readable issue code. */
	code: string
	/** Human-readable issue text. */
	message: string
	/** Optional path to the input field that caused the issue. */
	path?: string[]
}

/** Result returned after a CLI command has executed. */
export type PuristaCommandResult = {
	/** `true` when command execution completed without blocking errors. */
	ok: boolean
	/** Command that produced this result. */
	command: PuristaCommandId
	/** Mode used while resolving and executing the command. */
	mode: PuristaCommandMode
	/** Files created by the command, relative to the project root. */
	createdFiles: string[]
	/** Files updated by the command, relative to the project root. */
	updatedFiles: string[]
	/** Non-fatal messages that callers may show to users. */
	warnings: string[]
	/** Blocking or non-blocking issues collected during command execution. */
	errors: PuristaCommandIssue[]
}

/** Output of command input resolution before execution. */
export type PuristaCommandResolution<TInput, TResolved> = {
	/** Command being resolved. */
	command: PuristaCommandId
	/** Raw caller-provided input. */
	input: TInput
	/** Fully resolved input, present when no required fields are missing. */
	resolvedInput?: TResolved
	/** Prompts still required before command execution can continue. */
	missing: PromptRequest[]
	/** Non-fatal resolution warnings. */
	warnings: string[]
	/** Validation issues found while resolving input. */
	errors: PuristaCommandIssue[]
}

/** One selectable prompt option. */
export type PromptChoice<TValue extends string | boolean = string> = {
	/** Label displayed to a human user. */
	name: string
	/** Value returned when the choice is selected. */
	value: TValue
	/** Optional help text for interactive prompt UIs. */
	description?: string
}

/** Shared fields used by prompt requests. */
export type BasePromptRequest<TKey extends string = string> = {
	/** Input object key populated by the answer. */
	key: TKey
	/** Prompt shown to the user. */
	message: string
	/** Default value used by programmatic or interactive defaults. */
	defaultValue?: string | boolean
	/** Whether the answer must be provided before execution. */
	required?: boolean
}

/** Text input prompt request. */
export type InputPromptRequest<TKey extends string = string> = BasePromptRequest<TKey> & {
	type: 'input'
	/** Optional validator returning `true` for valid values or an error string. */
	validate?: (value: string) => true | string
}

/** Boolean confirmation prompt request. */
export type ConfirmPromptRequest<TKey extends string = string> = BasePromptRequest<TKey> & {
	type: 'confirm'
	defaultValue?: boolean
}

/** Single-choice prompt request. */
export type SelectPromptRequest<
	TKey extends string = string,
	TValue extends string = string,
> = BasePromptRequest<TKey> & {
	type: 'select'
	/** Available choices for the prompt. */
	choices: ReadonlyArray<PromptChoice<TValue>>
	defaultValue?: TValue
}

/** Union of prompt requests emitted by CLI command resolution. */
export type PromptRequest<TKey extends string = string> =
	| InputPromptRequest<TKey>
	| ConfirmPromptRequest<TKey>
	| SelectPromptRequest<TKey>

/** Programmatic answer map keyed by prompt `key`. */
export type PromptAnswerMap = Record<string, string | boolean>

/** Adapter used by the engine when it must collect missing input. */
export type PromptAdapter = {
	/** Resolve a text input prompt. */
	input: (request: InputPromptRequest) => Promise<string>
	/** Resolve a boolean prompt. */
	confirm: (request: ConfirmPromptRequest) => Promise<boolean>
	/** Resolve a single-select prompt. */
	select: (request: SelectPromptRequest) => Promise<string>
	/** Optional non-blocking informational message. */
	note?: (message: string) => Promise<void> | void
}

/** Adapter for rendering CLI results and errors in custom hosts. */
export type OutputAdapter = {
	/** Render a successful or failed command result. */
	renderResult: (result: PuristaCommandResult) => void
	/** Render an exception thrown by the engine or command implementation. */
	renderError: (error: unknown) => void
}
