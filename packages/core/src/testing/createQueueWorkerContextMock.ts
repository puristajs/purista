import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'
import { createQueueEnqueueProxy } from '../core/helper/createQueueEnqueueProxy.impl.js'
import { createQueueScheduleProxy } from '../core/helper/createQueueScheduleProxy.impl.js'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { getNewTraceId } from '../core/helper/getNewTraceId.impl.js'
import type { QueueRetryRequest } from '../core/QueueBridge/types/QueueRetryRequest.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { QueueJobContext } from '../core/types/queue/QueueJobContext.js'
import type { QueueMessage } from '../core/types/queue/QueueMessage.js'
import type { QueueScheduleFunction } from '../core/types/queue/QueueScheduleFunction.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import type { QueueWorkerBuilderTypes } from '../QueueWorkerBuilder/QueueWorkerBuilderTypes.js'
import type { Schema } from '../schema/index.js'
import {
	createBaseContextStubs,
	createHarnessInvocationMockProxy,
	createInvokeProxy,
	createMetricContextMock,
	createMockSpan,
	createResourceProxy,
} from './sharedContextMocks.js'

/** Infer the internal builder type configuration from a queue worker builder. */
export type QueueWorkerContextMockBuilderTypes<T> = T extends QueueWorkerBuilder<infer C> ? C : QueueWorkerBuilderTypes

/**
 * Input for {@link createQueueWorkerContextMock}.
 *
 * @group Unit test helper
 */
export type CreateQueueWorkerContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = {
	/** Queue name used on the generated message. */
	queueName: string
	/** Queue payload for the generated message. */
	payload: Payload
	/** Optional queue parameters for the generated message. */
	parameter?: Parameter
	/** Optional Sinon sandbox used to create stubs. */
	sandbox?: SinonSandbox
	/** Runtime resources exposed through the context proxy. */
	resources?: Partial<Resources>
	/** Message field overrides for specialized queue scenarios. */
	message?: Partial<QueueMessage<Payload, Parameter>>
}

/**
 * Result returned by {@link createQueueWorkerContextMock}.
 *
 * @group Unit test helper
 */
export type QueueWorkerContextMockResult<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	TBuilder extends QueueWorkerBuilder<any> = QueueWorkerBuilder<any>,
> = {
	context: QueueJobContext<
		Payload,
		Parameter,
		Resources,
		QueueWorkerContextMockBuilderTypes<TBuilder>['Invokes'],
		QueueWorkerContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList'],
		QueueWorkerContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		EmptyObject
	>
	message: QueueMessage<Payload, Parameter>
	stubs: {
		logger: Record<string, SinonStub>
		emit: FromEmitToOtherType<QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList'], SinonStub>
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
		service: QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['service']
		stream: QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['stream']
		agent: QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['agent']
		workflow: QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['workflow']
		enqueue: SinonStub
		scheduleAt: SinonStub
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
	TBuilder extends QueueWorkerBuilder<any> = QueueWorkerBuilder<any>,
>(
	builder: TBuilder,
	input: CreateQueueWorkerContextMockInput<Payload, Parameter, Resources>,
): QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder> => {
	const internalBuilder = builder as unknown as {
		invokes: QueueWorkerContextMockBuilderTypes<TBuilder>['Invokes']
		streamInvokes: QueueWorkerContextMockBuilderTypes<TBuilder>['StreamInvokes']
		emitList: QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList']
		queueInvokes: QueueInvokeList
	}
	const base = createBaseContextStubs<Resources, QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList']>(
		internalBuilder.emitList as FromEmitToOtherType<QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList'], Schema>,
		input.sandbox,
	)
	const serviceProxy = createInvokeProxy<QueueWorkerContextMockBuilderTypes<TBuilder>['Invokes']>(input.sandbox)
	const streamProxy = createInvokeProxy<QueueWorkerContextMockBuilderTypes<TBuilder>['StreamInvokes']>(input.sandbox)
	const agentProxy = createHarnessInvocationMockProxy<
		QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['agent']
	>(input.sandbox)
	const workflowProxy = createHarnessInvocationMockProxy<
		QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['workflow']
	>(input.sandbox)
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

	const context: QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context'] = {
		logger: base.logger.mock,
		metrics: createMetricContextMock<EmptyObject>(input.sandbox),
		message,
		signal: abortController.signal,
		emit: async (eventName, payload) => base.stubs.emit[eventName](eventName, payload),
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
		agent: agentProxy.api,
		workflow: workflowProxy.api,
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
			enqueue: createQueueEnqueueProxy(
				(async (queueName, payload, parameter, options) =>
					base.stubs.enqueue(queueName, payload, parameter, options)) as QueueInvokeFunction,
				internalBuilder.queueInvokes,
			),
			scheduleAt: createQueueScheduleProxy(
				(async (queueName, runAt, payload, parameter, options) =>
					base.stubs.scheduleAt(queueName, runAt, payload, parameter, options)) as QueueScheduleFunction,
				internalBuilder.queueInvokes,
			),
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
			emit: base.stubs.emit as FromEmitToOtherType<QueueWorkerContextMockBuilderTypes<TBuilder>['EmitList'], SinonStub>,
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
			service:
				serviceProxy.createApi<
					QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['service']
				>(),
			stream:
				streamProxy.createApi<
					QueueWorkerContextMockResult<Payload, Parameter, Resources, TBuilder>['context']['stream']
				>(),
			agent: agentProxy.api,
			workflow: workflowProxy.api,
			enqueue: base.stubs.enqueue,
			scheduleAt: base.stubs.scheduleAt,
		},
	}
}
