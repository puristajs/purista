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
})
