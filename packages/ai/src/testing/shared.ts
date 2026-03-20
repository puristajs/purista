import type { AgentProtocolEnvelope } from '../protocol/types.js'

type SpyImplementation<Args extends unknown[], Return> = (...args: Args) => Return

export type TestSpy<Args extends unknown[] = unknown[], Return = unknown> = ((...args: Args) => Return) & {
	calls: Args[]
	setImplementation(implementation: SpyImplementation<Args, Return>): TestSpy<Args, Return>
	reset(): TestSpy<Args, Return>
}

export const createTestSpy = <Args extends unknown[], Return>(
	implementation: SpyImplementation<Args, Return>,
): TestSpy<Args, Return> => {
	let currentImplementation = implementation

	const spy = ((...args: Args) => {
		spy.calls.push(args)
		return currentImplementation(...args)
	}) as TestSpy<Args, Return>

	spy.calls = []
	spy.setImplementation = nextImplementation => {
		currentImplementation = nextImplementation
		return spy
	}
	spy.reset = () => {
		spy.calls = []
		return spy
	}

	return spy
}

export const createStrictAsyncSpy = <Args extends unknown[], Return>(name: string): TestSpy<Args, Promise<Return>> =>
	createTestSpy(async (..._args: Args) => {
		throw new Error(`${name} is not stubbed`)
	})

export const createResolvedAsyncSpy = <Args extends unknown[], Return>(value: Return): TestSpy<Args, Promise<Return>> =>
	createTestSpy(async (..._args: Args) => value)

export const createDefaultMessage = (
	overrides?: Partial<{
		id: string
		correlationId: string
		principalId?: string
		tenantId?: string
		sender: {
			serviceName: string
			serviceVersion: string
			serviceTarget: string
			instanceId: string
		}
	}>,
) => ({
	id: overrides?.id ?? 'test-message',
	correlationId: overrides?.correlationId ?? 'test-correlation',
	principalId: overrides?.principalId ?? 'test-principal',
	tenantId: overrides?.tenantId ?? 'test-tenant',
	sender: {
		serviceName: overrides?.sender?.serviceName ?? 'test-service',
		serviceVersion: overrides?.sender?.serviceVersion ?? '1',
		serviceTarget: overrides?.sender?.serviceTarget ?? 'run',
		instanceId: overrides?.sender?.instanceId ?? 'test-instance',
	},
})

export const envelopesToAsyncIterator = async function* (envelopes: AgentProtocolEnvelope[]) {
	for (const envelope of envelopes) {
		yield envelope
	}
}
