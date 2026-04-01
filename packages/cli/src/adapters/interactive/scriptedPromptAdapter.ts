import { PuristaCliPromptError } from '../../core/errors.js'
import type { PromptAdapter, PromptAnswerMap } from '../../core/types.js'

export const createScriptedPromptAdapter = (answers: PromptAnswerMap): PromptAdapter => ({
	input: async request => {
		const value = answers[request.key]
		if (typeof value === 'string') {
			return value
		}
		if (typeof request.defaultValue === 'string') {
			return request.defaultValue
		}
		throw new PuristaCliPromptError(`Missing scripted answer for "${request.key}".`)
	},
	confirm: async request => {
		const value = answers[request.key]
		if (typeof value === 'boolean') {
			return value
		}
		if (typeof request.defaultValue === 'boolean') {
			return request.defaultValue
		}
		throw new PuristaCliPromptError(`Missing scripted answer for "${request.key}".`)
	},
	select: async request => {
		const value = answers[request.key]
		if (typeof value === 'string') {
			return value
		}
		if (typeof request.defaultValue === 'string') {
			return request.defaultValue
		}
		throw new PuristaCliPromptError(`Missing scripted answer for "${request.key}".`)
	},
})
