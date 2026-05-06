import { PuristaCliPromptError } from '../../core/errors.js'
import type { ConfirmPromptRequest, InputPromptRequest, PromptAdapter, SelectPromptRequest } from '../../core/types.js'

const createPromptError = (request: InputPromptRequest | ConfirmPromptRequest | SelectPromptRequest) =>
	new PuristaCliPromptError(`Missing required value for "${request.key}" in non-interactive mode.`, {
		issues: [{ code: 'missing_input', message: request.message, path: [request.key] }],
	})

export const createNoPromptAdapter = (): PromptAdapter => ({
	input: async request => {
		if (typeof request.defaultValue === 'string') {
			return request.defaultValue
		}
		throw createPromptError(request)
	},
	confirm: async request => {
		if (typeof request.defaultValue === 'boolean') {
			return request.defaultValue
		}
		throw createPromptError(request)
	},
	select: async request => {
		if (typeof request.defaultValue === 'string') {
			return request.defaultValue
		}
		throw createPromptError(request)
	},
})
