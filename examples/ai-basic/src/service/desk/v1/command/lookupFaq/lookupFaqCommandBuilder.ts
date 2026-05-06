import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from './schema.js'

const defaultAnswer =
	'I could not find a dedicated article. I can still help with calculator and website-fetch tools if useful.'

const faqEntries: Array<{ pattern: RegExp; answer: string }> = [
	{
		pattern: /password|reset/i,
		answer: 'Password resets are available under Settings > Security > Reset password.',
	},
	{
		pattern: /billing|invoice/i,
		answer: 'Billing invoices are under Settings > Billing. You can download PDFs per month.',
	},
	{
		pattern: /api|token|auth|key/i,
		answer: 'API keys are managed in Settings > API Access. Rotate keys regularly and keep them in a secret store.',
	},
	{
		pattern: /queue|stream|event/i,
		answer: 'PURISTA supports command, queue, and stream workflows; choose stream for live UI updates.',
	},
	{
		pattern: /mcp|agent2agent|a2a/i,
		answer: 'Use MCP and Agent2Agent endpoints to interoperate with external AI clients and orchestration systems.',
	},
]

export const lookupFaqCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('lookupFaq', 'Simple FAQ lookup command used as an AI tool')
	.addPayloadSchema(lookupFaqInputSchema)
	.addOutputSchema(lookupFaqOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const match = faqEntries.find(entry => entry.pattern.test(payload.question))
		const answer = match?.answer ?? defaultAnswer
		context.logger.info({ question: payload.question, answer }, 'FAQ lookup resolved')
		return { answer }
	})
