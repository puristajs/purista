import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { z } from 'zod'

const supportServiceInfo = {
	serviceName: 'Support',
	serviceVersion: '1',
	serviceDescription: 'Support ticket triage with a core PURISTA agent',
} as const satisfies ServiceInfoType

export const triagePayloadSchema = z.object({
	ticketId: z.string().min(1),
	text: z.string().min(1),
})

export const triageOutputSchema = z.object({
	priority: z.enum(['low', 'normal', 'high']),
	reason: z.string().min(1),
})

const triageJsonSchema = {
	type: 'object',
	properties: {
		priority: { enum: ['low', 'normal', 'high'] },
		reason: { type: 'string' },
	},
	required: ['priority', 'reason'],
	additionalProperties: false,
}

export const supportServiceBuilder = new ServiceBuilder(supportServiceInfo)

export const triageAgentBuilder = supportServiceBuilder
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets by urgency')
	.addPayloadSchema(triagePayloadSchema)
	.addOutputSchema(triageOutputSchema)
	.addModel('primary', {
		model: 'support-triage',
		capabilities: ['object'] as const,
		defaults: { temperature: 0 },
	})
	.setRunFunction(async context => {
		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'user',
						content: `Classify ticket ${context.payload.ticketId}: ${context.payload.text}`,
					},
				],
				schema: triageJsonSchema,
			},
			context.signal,
		)

		return triageOutputSchema.parse(result.object)
	})

export const triageAgentDefinition = await triageAgentBuilder.getDefinition()

supportServiceBuilder.addAgentDefinition(triageAgentDefinition)

if (import.meta.url === `file://${process.argv[1]}`) {
	const definitions = await supportServiceBuilder.resolveDefinitions()
	process.stdout.write(
		JSON.stringify(
			{
				service: supportServiceInfo.serviceName,
				agent: triageAgentDefinition.manifest.agentName,
				queue: definitions.queues[0]?.queueName,
				command: definitions.commands[0]?.commandName,
				stream: definitions.streams[0]?.streamName,
			},
			null,
			2,
		),
	)
	process.stdout.write('\n')
}
