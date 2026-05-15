import { z } from 'zod'

import { AgentQueueBuilder, ServiceBuilder, type ServiceInfoType } from '../index.js'

describe('AgentQueueBuilder', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'support',
		serviceVersion: '1',
		serviceDescription: 'Support service',
	}

	it('is available from ServiceBuilder and expands attached agents into core definitions', async () => {
		const service = new ServiceBuilder(serviceInfo)
		const agent = service.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')

		expect(agent).toBeInstanceOf(AgentQueueBuilder)

		const definition = await agent.setRunFunction(async () => ({ priority: 'normal' })).getDefinition()
		service.addAgentDefinition(definition)

		const resolved = await service.resolveDefinitions()

		expect(resolved.queues).toHaveLength(1)
		expect(resolved.queueWorkers).toHaveLength(1)
		expect(resolved.commands).toHaveLength(1)
		expect(resolved.streams).toHaveLength(1)
		expect(resolved.queues[0].queueName).toBe('agent:support:1:triageTicket')
		expect(resolved.queueWorkers[0].queueName).toBe(resolved.queues[0].queueName)
		expect(resolved.commands[0].commandName).toBe('triageTicket')
		expect(resolved.streams[0].streamName).toBe('triageTicketStream')
	})

	it('cascades resources, schemas, models, command tools and child agents into handler types', async () => {
		class TicketRepository {
			async load(ticketId: string) {
				return { ticketId, title: 'Printer is offline' }
			}
		}

		const payloadSchema = z.object({ ticketId: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ priority: z.enum(['low', 'normal', 'high']) })
		const commandPayloadSchema = z.object({ id: z.string() })
		const commandParameterSchema = z.object({ includeHistory: z.boolean() })
		const commandOutputSchema = z.object({ status: z.enum(['open', 'closed']) })
		const childPayloadSchema = z.object({ ticketId: z.string() })
		const childParameterSchema = z.object({ tenantId: z.string() })
		const childOutputSchema = z.object({ sentiment: z.enum(['negative', 'neutral', 'positive']) })

		const service = new ServiceBuilder(serviceInfo).defineResource<'repository', TicketRepository>()

		const definition = await service
			.getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
			.addPayloadSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.addModel('primary', { model: 'test-model', capabilities: ['object'] as const })
			.canInvoke('ticket', '1', 'getTicket', {
				outputSchema: commandOutputSchema,
				payloadSchema: commandPayloadSchema,
				parameterSchema: commandParameterSchema,
			})
			.canInvokeAgent('sentimentAgent', '1', {
				outputSchema: childOutputSchema,
				payloadSchema: childPayloadSchema,
				parameterSchema: childParameterSchema,
			})
			.setRunFunction(async context => {
				const ticketId: string = context.payload.ticketId
				const tenantId: string = context.parameter.tenantId
				const loaded = await context.resources.repository.load(ticketId)
				const toolResult: { status: 'open' | 'closed' } = await context.invoke.tools['ticket.1.getTicket'].call(
					{ id: loaded.ticketId },
					{ includeHistory: true },
				)
				const childResult: { sentiment: 'negative' | 'neutral' | 'positive' } = await context.invoke.agents[
					'sentimentAgent.1'
				].run({ ticketId }, { tenantId })

				expectTypeOf(context.harness.models.primary).toHaveProperty('object')
				expectTypeOf(toolResult.status).toEqualTypeOf<'open' | 'closed'>()
				expectTypeOf(childResult.sentiment).toEqualTypeOf<'negative' | 'neutral' | 'positive'>()

				return {
					priority: toolResult.status === 'open' && childResult.sentiment === 'negative' ? 'high' : 'normal',
				}
			})
			.getDefinition()

		expect(definition.manifest.models.primary.model).toBe('test-model')
		expect(definition.manifest.allowedCommands).toHaveLength(1)
		expect(definition.manifest.allowedAgents).toHaveLength(1)
	})
})
