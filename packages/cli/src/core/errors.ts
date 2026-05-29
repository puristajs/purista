import type { PuristaCommandId, PuristaCommandIssue } from './types.js'

/** Base error type thrown by the programmatic CLI API. */
export class PuristaCliError extends Error {
	/** Command active when the error occurred, if known. */
	readonly command?: PuristaCommandId
	/** Structured validation or execution issues associated with the error. */
	readonly issues: PuristaCommandIssue[]
	/** Suggested process exit code for terminal adapters. */
	readonly exitCode: number

	/** Creates a CLI error with optional command context and structured issues. */
	constructor(
		message: string,
		options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[]; exitCode?: number },
	) {
		super(message)
		this.name = 'PuristaCliError'
		this.command = options?.command
		this.issues = options?.issues ?? []
		this.exitCode = options?.exitCode ?? 1
	}
}

/** Error thrown when command input or project state cannot be resolved. */
export class PuristaCliValidationError extends PuristaCliError {
	/** Creates a validation error with a terminal-friendly exit code. */
	constructor(message: string, options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[] }) {
		super(message, { ...options, exitCode: 1 })
		this.name = 'PuristaCliValidationError'
	}
}

/** Error thrown by prompt adapters when interactive input cannot be collected. */
export class PuristaCliPromptError extends PuristaCliValidationError {
	/** Creates a prompt error with optional command context and issues. */
	constructor(message: string, options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[] }) {
		super(message, options)
		this.name = 'PuristaCliPromptError'
	}
}
