import { PuristaCliError } from '../../core/errors.js'
import type { OutputAdapter, PuristaCommandIssue, PuristaCommandResult } from '../../core/types.js'

const renderIssues = (issues: PuristaCommandIssue[]) => {
	for (const issue of issues) {
		const location = issue.path?.length ? ` (${issue.path.join('.')})` : ''
		console.error(`- ${issue.code}${location}: ${issue.message}`)
	}
}

const renderMutations = (result: PuristaCommandResult) => {
	for (const file of result.createdFiles) {
		console.log(`created ${file}`)
	}
	for (const file of result.updatedFiles) {
		console.log(`updated ${file}`)
	}
}

export const createTerminalOutputAdapter = (): OutputAdapter => ({
	renderResult: result => {
		renderMutations(result)
		for (const warning of result.warnings) {
			console.warn(`warning: ${warning}`)
		}
		if (!result.ok && result.errors.length) {
			renderIssues(result.errors)
		}
	},
	renderError: error => {
		if (error instanceof PuristaCliError) {
			console.error(error.message)
			if (error.issues.length) {
				renderIssues(error.issues)
			}
			return
		}

		console.error(error)
	},
})
