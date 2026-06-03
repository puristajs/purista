import { z } from 'zod'
import { QueueWorkerBuilder } from './QueueWorkerBuilder.impl.js'

describe('QueueWorkerBuilder', () => {
	it('stores and exposes before and after guard hooks by name', () => {
		const beforeGuard = async function beforeGuard() {}
		const afterGuard = async function afterGuard() {}

		const builder = new QueueWorkerBuilder('supportQueue', 'execute')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })

		expect(builder.getBeforeGuardHook('auth')).toBe(beforeGuard)
		expect(builder.getAfterGuardHook('audit')).toBe(afterGuard)
	})

	it('includes registered guard hooks in the worker definition', async () => {
		const beforeGuard = async function beforeGuard() {}
		const afterGuard = async function afterGuard() {}

		const definition = await new QueueWorkerBuilder('supportQueue', 'execute')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })
			.setHandler(async function handler() {
				return { status: 'success' as const }
			})
			.getDefinition()

		expect(definition.beforeGuards?.auth).toBe(beforeGuard)
		expect(definition.afterGuards?.audit).toBe(afterGuard)
	})

	it('includes declared handler capabilities in the worker definition', async () => {
		const payloadSchema = z.object({ id: z.string() })
		const parameterSchema = z.object({ tenantId: z.string() })
		const outputSchema = z.object({ status: z.enum(['ok', 'failed']) })
		const chunkSchema = z.object({ chunk: z.string() })
		const finalSchema = z.object({ done: z.boolean() })
		const eventSchema = z.object({ jobId: z.string() })

		const definition = await new QueueWorkerBuilder('supportQueue', 'execute')
			.canInvoke('TicketService', '1', 'loadTicket', outputSchema, payloadSchema, parameterSchema)
			.canConsumeStream('ReportService', '1', 'streamReport', chunkSchema, payloadSchema, parameterSchema, finalSchema)
			.canEnqueue('auditQueue', payloadSchema, parameterSchema)
			.canEmit('worker.done', eventSchema)
			.canInvokeAgent('triageTicket', '1', {
				outputSchema,
				payloadSchema,
				parameterSchema,
			})
			.setHandler(async function handler() {
				return { status: 'success' as const }
			})
			.getDefinition()

		expect(definition.invokes.TicketService['1'].loadTicket).toMatchObject({
			outputSchema,
			payloadSchema,
			parameterSchema,
		})
		expect(definition.streamInvokes.ReportService['1'].streamReport).toMatchObject({
			chunkSchema,
			finalSchema,
			payloadSchema,
			parameterSchema,
			validateChunk: true,
			validateFinal: true,
		})
		expect(definition.queueInvokes.auditQueue).toMatchObject({
			payloadSchema,
			parameterSchema,
		})
		expect(definition.emitList['worker.done']).toBe(eventSchema)
		expect(definition.agentInvokes).toStrictEqual([
			{
				agentName: 'triageTicket',
				serviceVersion: '1',
				outputSchema,
				payloadSchema,
				parameterSchema,
			},
		])
	})
})
