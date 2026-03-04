import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { lookupFaqInputSchema, lookupFaqOutputSchema } from './schema.js'

const defaultAnswer =
	'I could not find a dedicated FAQ article. Gather account details and route the ticket to human support.'

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
		pattern: /refund/i,
		answer: 'Refund requests require order id, reason, and purchase date for manual review.',
	},
]

export const lookupFaqCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('lookupFaq', 'Simple FAQ lookup command used as an AI tool')
	.addPayloadSchema(lookupFaqInputSchema)
	.addOutputSchema(lookupFaqOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const match = faqEntries.find(entry => entry.pattern.test(payload.question))
		const answer = match?.answer ?? defaultAnswer
		context.logger.info({ question: payload.question, answer }, 'FAQ lookup resolved')
		return { answer }
	})
