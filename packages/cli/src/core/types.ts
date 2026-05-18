export const puristaCommandIds = [
	'add-service',
	'add-command',
	'add-subscription',
	'add-stream',
	'add-queue',
	'add-queue-worker',
	'add-agent',
	'export-asyncapi',
	'export-runtime-capabilities',
	'export-schedule-manifest',
	'export-kubernetes-cronjob',
	'export-cloudevents-schema',
	'init-project',
] as const

export type PuristaCommandId = (typeof puristaCommandIds)[number]

export type PuristaCommandMode = 'interactive' | 'non-interactive' | 'programmatic'

export type PuristaFileMutation = {
	path: string
	kind: 'created' | 'updated'
}

export type PuristaCommandIssue = {
	code: string
	message: string
	path?: string[]
}

export type PuristaCommandResult = {
	ok: boolean
	command: PuristaCommandId
	mode: PuristaCommandMode
	createdFiles: string[]
	updatedFiles: string[]
	warnings: string[]
	errors: PuristaCommandIssue[]
}

export type PuristaCommandResolution<TInput, TResolved> = {
	command: PuristaCommandId
	input: TInput
	resolvedInput?: TResolved
	missing: PromptRequest[]
	warnings: string[]
	errors: PuristaCommandIssue[]
}

export type PromptChoice<TValue extends string | boolean = string> = {
	name: string
	value: TValue
	description?: string
}

export type BasePromptRequest<TKey extends string = string> = {
	key: TKey
	message: string
	defaultValue?: string | boolean
	required?: boolean
}

export type InputPromptRequest<TKey extends string = string> = BasePromptRequest<TKey> & {
	type: 'input'
	validate?: (value: string) => true | string
}

export type ConfirmPromptRequest<TKey extends string = string> = BasePromptRequest<TKey> & {
	type: 'confirm'
	defaultValue?: boolean
}

export type SelectPromptRequest<
	TKey extends string = string,
	TValue extends string = string,
> = BasePromptRequest<TKey> & {
	type: 'select'
	choices: ReadonlyArray<PromptChoice<TValue>>
	defaultValue?: TValue
}

export type PromptRequest<TKey extends string = string> =
	| InputPromptRequest<TKey>
	| ConfirmPromptRequest<TKey>
	| SelectPromptRequest<TKey>

export type PromptAnswerMap = Record<string, string | boolean>

export type PromptAdapter = {
	input: (request: InputPromptRequest) => Promise<string>
	confirm: (request: ConfirmPromptRequest) => Promise<boolean>
	select: (request: SelectPromptRequest) => Promise<string>
	note?: (message: string) => Promise<void> | void
}

export type OutputAdapter = {
	renderResult: (result: PuristaCommandResult) => void
	renderError: (error: unknown) => void
}
