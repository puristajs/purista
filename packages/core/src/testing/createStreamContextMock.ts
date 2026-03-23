import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { getNewEBMessageId } from '../core/helper/getNewEBMessageId.impl.js'
import { getNewInstanceId } from '../core/helper/getNewInstanceId.impl.js'
import { getNewTraceId } from '../core/helper/getNewTraceId.impl.js'
import type { EBMessageAddress } from '../core/types/EBMessageAddress.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { StreamFunctionContext } from '../core/types/stream/StreamFunctionContext.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type { StreamWriter } from '../core/types/stream/StreamWriter.js'
import type { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/StreamDefinitionBuilder.impl.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import {
	createAgentInvokeProxy,
	createBaseContextStubs,
	createInvokeProxy,
	createMockSpan,
	createResourceProxy,
} from './sharedContextMocks.js'

/**
 * Infer the internal builder type configuration from a stream builder.
 *
 * @group Unit test helper
 */
export type StreamContextMockBuilderTypes<T> = T extends StreamDefinitionBuilder<any, infer C> ? C : never

export type CreateStreamContextMockInput<TBuilder extends StreamDefinitionBuilder<any, any>> = {
	payload: InferIn<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>
	parameter: InferIn<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>
	sandbox?: SinonSandbox
	resources?: Partial<StreamContextMockBuilderTypes<TBuilder>['Resources']>
	message?: Partial<
		StreamOpenRequest<
			Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
			Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>
		>
	>
}

export type StreamContextMockResult<TBuilder extends StreamDefinitionBuilder<any, any>> = {
	context: StreamFunctionContext<
		Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
		Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
		StreamContextMockBuilderTypes<TBuilder>['Resources'],
		StreamContextMockBuilderTypes<TBuilder>['Invokes'],
		StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		StreamContextMockBuilderTypes<TBuilder>['EmitList'],
		StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
	>
	writer: StreamWriter<
		InferIn<StreamContextMockBuilderTypes<TBuilder>['ChunkSchema']>,
		InferIn<StreamContextMockBuilderTypes<TBuilder>['FinalSchema']>
	>
	stubs: {
		logger: Record<string, SinonStub>
		emit: FromEmitToOtherType<StreamContextMockBuilderTypes<TBuilder>['EmitList'], SinonStub>
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
		enqueue: SinonStub
		scheduleAt: SinonStub
		service: StreamFunctionContext<
			Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
			Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
			StreamContextMockBuilderTypes<TBuilder>['Resources'],
			StreamContextMockBuilderTypes<TBuilder>['Invokes'],
			StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
			StreamContextMockBuilderTypes<TBuilder>['EmitList'],
			StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
			StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
		>['service']
		resources: Partial<StreamContextMockBuilderTypes<TBuilder>['Resources']>
		invokeAgent: StreamFunctionContext<
			Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
			Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
			StreamContextMockBuilderTypes<TBuilder>['Resources'],
			StreamContextMockBuilderTypes<TBuilder>['Invokes'],
			StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
			StreamContextMockBuilderTypes<TBuilder>['EmitList'],
			StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
			StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
		>['invokeAgent']
		writer: {
			write: SinonStub
			close: SinonStub
			fail: SinonStub
		}
	}
	chunks: InferIn<StreamContextMockBuilderTypes<TBuilder>['ChunkSchema']>[]
	finalValue: InferIn<StreamContextMockBuilderTypes<TBuilder>['FinalSchema']> | undefined
	failedWith: unknown[]
	cancel(reason?: string): void
}

const createStreamOpenRequestMock = <Payload, Parameter>(
	receiver: EBMessageAddress,
	payload: Payload,
	parameter: Parameter,
	input?: Partial<StreamOpenRequest<Payload, Parameter>>,
): StreamOpenRequest<Payload, Parameter> => ({
	id: getNewEBMessageId(),
	timestamp: Date.now(),
	messageType: EBMessageType.Stream,
	correlationId: getNewCorrelationId(),
	traceId: getNewTraceId(),
	principalId: 'mocked-principal-id',
	tenantId: 'mocked-tenant-id',
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: {
		serviceName: 'mocked_sender',
		serviceVersion: '1',
		serviceTarget: 'mockedSenderFunction',
		instanceId: getNewInstanceId(),
	},
	receiver,
	payload: {
		frameType: 'open',
		payload,
		parameter,
	},
	...(input ?? {}),
})

/**
 * Create a typed stream handler context mock together with a capture writer.
 *
 * Use this helper to unit test a stream handler without booting a full service
 * runtime. The returned writer records chunks, the final value, and failures.
 *
 * @group Unit test helper
 */
export const createStreamContextMock = <TBuilder extends StreamDefinitionBuilder<any, any>>(
	builder: TBuilder,
	input: CreateStreamContextMockInput<TBuilder>,
): StreamContextMockResult<TBuilder> => {
	const internalBuilder = builder as unknown as {
		streamName: string
		invokes: StreamContextMockBuilderTypes<TBuilder>['Invokes']
		streamInvokes: StreamContextMockBuilderTypes<TBuilder>['StreamInvokes']
		agentInvokes: StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
		emitList: StreamContextMockBuilderTypes<TBuilder>['EmitList']
	}

	const base = createBaseContextStubs<
		StreamContextMockBuilderTypes<TBuilder>['Resources'],
		StreamContextMockBuilderTypes<TBuilder>['EmitList']
	>(
		internalBuilder.emitList as FromEmitToOtherType<StreamContextMockBuilderTypes<TBuilder>['EmitList'], Schema>,
		input.sandbox,
	)
	const invokeProxy = createInvokeProxy<StreamContextMockBuilderTypes<TBuilder>['Invokes']>(input.sandbox)
	const streamProxy = createInvokeProxy<StreamContextMockBuilderTypes<TBuilder>['StreamInvokes']>(input.sandbox)
	const agentProxy = createAgentInvokeProxy<StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']>(input.sandbox)
	const resourcesProxy = createResourceProxy(input.resources, base.stubs.resources)

	const chunks: InferIn<StreamContextMockBuilderTypes<TBuilder>['ChunkSchema']>[] = []
	const failedWith: unknown[] = []
	let finalValue: InferIn<StreamContextMockBuilderTypes<TBuilder>['FinalSchema']> | undefined
	let cancelled = false
	const cancelHandlers: Array<(reason?: string) => void> = []

	const writerStubs = {
		write: input.sandbox?.stub() ?? stub(),
		close: input.sandbox?.stub() ?? stub(),
		fail: input.sandbox?.stub() ?? stub(),
	}

	const writer: StreamWriter<
		InferIn<StreamContextMockBuilderTypes<TBuilder>['ChunkSchema']>,
		InferIn<StreamContextMockBuilderTypes<TBuilder>['FinalSchema']>
	> = {
		get cancelled() {
			return cancelled
		},
		write: async chunk => {
			if (!cancelled) {
				chunks.push(chunk)
			}
			writerStubs.write(chunk)
		},
		close: async final => {
			finalValue = final
			writerStubs.close(final)
		},
		fail: async error => {
			failedWith.push(error)
			writerStubs.fail(error)
		},
		onCancel: cb => {
			cancelHandlers.push(cb)
		},
	}

	const context: StreamFunctionContext<
		Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
		Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
		StreamContextMockBuilderTypes<TBuilder>['Resources'],
		StreamContextMockBuilderTypes<TBuilder>['Invokes'],
		StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		StreamContextMockBuilderTypes<TBuilder>['EmitList'],
		StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
	> = {
		logger: base.logger.mock,
		message: createStreamOpenRequestMock(
			{
				serviceName: 'mocked_receiver',
				serviceVersion: '1',
				serviceTarget: internalBuilder.streamName,
				instanceId: getNewInstanceId(),
			},
			input.payload,
			input.parameter,
			input.message,
		),
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
		service: invokeProxy.api,
		stream: streamProxy.api,
		invokeAgent: agentProxy.api,
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
		resources: resourcesProxy,
	}

	return {
		context,
		writer,
		stubs: {
			...base.stubs,
			service:
				invokeProxy.createApi<
					StreamFunctionContext<
						Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
						Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
						StreamContextMockBuilderTypes<TBuilder>['Resources'],
						StreamContextMockBuilderTypes<TBuilder>['Invokes'],
						StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
						StreamContextMockBuilderTypes<TBuilder>['EmitList'],
						StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
						StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
					>['service']
				>(),
			invokeAgent:
				agentProxy.createApi<
					StreamFunctionContext<
						Infer<StreamContextMockBuilderTypes<TBuilder>['PayloadSchema']>,
						Infer<StreamContextMockBuilderTypes<TBuilder>['ParamsSchema']>,
						StreamContextMockBuilderTypes<TBuilder>['Resources'],
						StreamContextMockBuilderTypes<TBuilder>['Invokes'],
						StreamContextMockBuilderTypes<TBuilder>['StreamInvokes'],
						StreamContextMockBuilderTypes<TBuilder>['EmitList'],
						StreamContextMockBuilderTypes<TBuilder>['QueueInvokes'],
						StreamContextMockBuilderTypes<TBuilder>['AgentInvokes']
					>['invokeAgent']
				>(),
			writer: writerStubs,
		},
		chunks,
		get finalValue() {
			return finalValue
		},
		failedWith,
		cancel: reason => {
			cancelled = true
			for (const handler of cancelHandlers) {
				handler(reason)
			}
		},
	}
}
