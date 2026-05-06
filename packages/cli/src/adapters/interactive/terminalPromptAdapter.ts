import confirm from '@inquirer/confirm'
import input from '@inquirer/input'
import select from '@inquirer/select'
import type { PromptAdapter } from '../../core/types.js'

export const createTerminalPromptAdapter = (): PromptAdapter => ({
	input: request =>
		input({
			message: request.message,
			default: typeof request.defaultValue === 'string' ? request.defaultValue : undefined,
			required: request.required ?? true,
			validate: request.validate,
		}),
	confirm: request =>
		confirm({
			message: request.message,
			default: typeof request.defaultValue === 'boolean' ? request.defaultValue : false,
		}),
	select: request =>
		select({
			message: request.message,
			loop: true,
			choices: request.choices,
			default: typeof request.defaultValue === 'string' ? request.defaultValue : undefined,
		}),
	note: message => {
		console.log(message)
	},
})
