import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { getNewTraceId } from '../core/helper/getNewTraceId.impl.js'
import type { QueueRetryRequest } from '../core/QueueBridge/types/QueueRetryRequest.js'
import type { QueueJobContext } from '../core/types/queue/QueueJobContext.js'
import type { QueueMessage } from '../core/types/queue/QueueMessage.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { createBaseContextStubs, createInvokeProxy, createMockSpan, createResourceProxy } from './sharedContextMocks.js'

export type CreateQueueWorkerContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = {
	queueName: string
	payload: Payload
	parameter?: Parameter
	sandbox?: SinonSandbox
	resources?: Partial<Resources>
	message?: Partial<QueueMessage<Payload, Parameter>>
}

export type QueueWorkerContextMockResult<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = {
	context: QueueJobContext<Payload, Parameter, Resources>
	message: QueueMessage<Payload, Parameter>
	stubs: {
		logger: Record<string, SinonStub>
		emit: SinonStub
		wrapInSpan: SinonStub
		startActiveSpan: SinonStub
		getSecret: SinonStub
		setSecret: SinonStub
		removeSecret: SinonStub
		getConfig: SinonStub
		setConfig: SinonStub
		removeConfig: SinonStub
		getState: SinonStub
		setState: SinonStub
		removeState: SinonStub
		resources: Partial<Resources>
		job: {
			complete: SinonStub
			retry: SinonStub
			fail: SinonStub
			extendLease: SinonStub
			cancelRequested: SinonStub
		}
		service: QueueJobContext<Payload, Parameter, Resources>['service']
		stream: QueueJobContext<Payload, Parameter, Resources>['stream']
	}
}

const createQueueMessageMock = <Payload, Parameter>(
	input: CreateQueueWorkerContextMockInput<Payload, Parameter>,
): QueueMessage<Payload, Parameter> => ({
	id: 'queue-job-id',
	queueName: input.queueName,
	payload: input.payload,
	parameter: input.parameter,
	headers: {},
	createdAt: Date.now(),
	attempt: 1,
	maxAttempts: 3,
	leaseExpiresAt: Date.now() + 60_000,
	leaseTtlMs: 60_000,
	traceId: getNewTraceId(),
	correlationId: getNewCorrelationId(),
	...(input.message ?? {}),
})

/**
 * Create a queue worker context mock with controllable job controls.
 *
 * Use this helper when you want to test a queue worker handler directly without
 * running the worker loop.
 *
 * @group Unit test helper
 */
export const createQueueWorkerContextMock = <
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
>(
	_builder: QueueWorkerBuilder,
	input: CreateQueueWorkerContextMockInput<Payload, Parameter, Resources>,
): QueueWorkerContextMockResult<Payload, Parameter, Resources> => {
	const base = createBaseContextStubs<Resources, Record<string, never>>({} as Record<string, never>, input.sandbox)
	const serviceProxy = createInvokeProxy(input.sandbox)
	const streamProxy = createInvokeProxy(input.sandbox)
	const resourcesProxy = createResourceProxy(input.resources, base.stubs.resources)
	const message = createQueueMessageMock(input)

	const job = {
		complete: input.sandbox?.stub().resolves() ?? stub().resolves(),
		retry: input.sandbox?.stub().resolves() ?? stub().resolves(),
		fail: input.sandbox?.stub().resolves() ?? stub().resolves(),
		extendLease: input.sandbox?.stub().resolves() ?? stub().resolves(),
		cancelRequested: input.sandbox?.stub().returns(false) ?? stub().returns(false),
	}
	const abortController = new AbortController()

	const context: QueueJobContext<Payload, Parameter, Resources> = {
		logger: base.logger.mock,
		message,
		signal: abortController.signal,
		emit: async (_eventName, _payload) => undefined,
		wrapInSpan: base.stubs.wrapInSpan.callsFake((name, opts, fn) => {
			void name
			void opts
			return fn(createMockSpan(input.sandbox))
		}),
		startActiveSpan: base.stubs.startActiveSpan.callsFake((name, opts, contextValue, fn) => {
			void name
			void opts
			void contextValue
			return fn(createMockSpan(input.sandbox))
		}),
		service: serviceProxy.api,
		stream: streamProxy.api,
		secrets: {
			getSecret: base.stubs.getSecret.rejects(new Error('getSecret is not stubbed')),
			setSecret: base.stubs.setSecret.rejects(new Error('setSecret is not stubbed')),
			removeSecret: base.stubs.removeSecret.rejects(new Error('removeSecret is not stubbed')),
		},
		configs: {
			getConfig: base.stubs.getConfig.rejects(new Error('getConfig is not stubbed')),
			setConfig: base.stubs.setConfig.rejects(new Error('setConfig is not stubbed')),
			removeConfig: base.stubs.removeConfig.rejects(new Error('removeConfig is not stubbed')),
		},
		states: {
			getState: base.stubs.getState.rejects(new Error('getState is not stubbed')),
			setState: base.stubs.setState.rejects(new Error('setState is not stubbed')),
			removeState: base.stubs.removeState.rejects(new Error('removeState is not stubbed')),
		},
		queue: {
			enqueue: base.stubs.enqueue.rejects(new Error('enqueue is not stubbed')) as any,
			scheduleAt: base.stubs.scheduleAt.rejects(new Error('scheduleAt is not stubbed')) as any,
		},
		job: {
			complete: async output => job.complete(output),
			retry: async (request?: QueueRetryRequest) => job.retry(request),
			fail: async (reason: string, fatal?: boolean) => job.fail(reason, fatal),
			extendLease: async (durationMs: number) => job.extendLease(durationMs),
			cancelRequested: () => job.cancelRequested(),
			moveToDeadLetter: async (reason?: string) => job.fail(reason ?? 'dead-letter', true),
		},
		resources: resourcesProxy,
	}

	return {
		context,
		message,
		stubs: {
			logger: base.stubs.logger,
			emit: base.stubs.emit as unknown as SinonStub,
			wrapInSpan: base.stubs.wrapInSpan,
			startActiveSpan: base.stubs.startActiveSpan,
			getSecret: base.stubs.getSecret,
			setSecret: base.stubs.setSecret,
			removeSecret: base.stubs.removeSecret,
			getConfig: base.stubs.getConfig,
			setConfig: base.stubs.setConfig,
			removeConfig: base.stubs.removeConfig,
			getState: base.stubs.getState,
			setState: base.stubs.setState,
			removeState: base.stubs.removeState,
			resources: base.stubs.resources,
			job,
			service: serviceProxy.createApi<QueueJobContext<Payload, Parameter, Resources>['service']>(),
			stream: streamProxy.createApi<QueueJobContext<Payload, Parameter, Resources>['stream']>(),
		},
	}
}
