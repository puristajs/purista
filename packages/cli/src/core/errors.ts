import type { PuristaCommandId, PuristaCommandIssue } from './types.js'

export class PuristaCliError extends Error {
	readonly command?: PuristaCommandId
	readonly issues: PuristaCommandIssue[]
	readonly exitCode: number

	constructor(message: string, options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[]; exitCode?: number }) {
		super(message)
		this.name = 'PuristaCliError'
		this.command = options?.command
		this.issues = options?.issues ?? []
		this.exitCode = options?.exitCode ?? 1
	}
}

export class PuristaCliValidationError extends PuristaCliError {
	constructor(message: string, options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[] }) {
		super(message, { ...options, exitCode: 1 })
		this.name = 'PuristaCliValidationError'
	}
}

export class PuristaCliPromptError extends PuristaCliValidationError {
	constructor(message: string, options?: { command?: PuristaCommandId; issues?: PuristaCommandIssue[] }) {
		super(message, options)
		this.name = 'PuristaCliPromptError'
	}
}
