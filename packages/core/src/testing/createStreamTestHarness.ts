import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { getNewEBMessageId } from '../core/helper/getNewEBMessageId.impl.js'
import { getNewInstanceId } from '../core/helper/getNewInstanceId.impl.js'
import { getNewTraceId } from '../core/helper/getNewTraceId.impl.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import type { InstanceConfigType, ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import type { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/StreamDefinitionBuilder.impl.js'
import type { Infer, InferIn } from '../schema/index.js'

/**
 * Infer the instance config type from a service builder.
 *
 * @group Unit test helper
 */
export type InferStreamHarnessServiceBuilderConfig<T> = T extends ServiceBuilder<infer S> ? S : never

/**
 * Infer the definition config type from a stream builder.
 *
 * @group Unit test helper
 */
export type InferStreamBuilderConfig<T> = T extends StreamDefinitionBuilder<any, infer C> ? C : never

const createStreamOpenRequestMock = <Payload, Parameter>(
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	payload: Payload,
	parameter: Parameter,
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
	receiver: {
		serviceName,
		serviceVersion,
		serviceTarget,
	},
	payload: {
		frameType: 'open',
		payload,
		parameter,
	},
})

/**
 * Boot a real service instance and execute one stream through the PURISTA runtime.
 *
 * Use this helper when you want to assert emitted stream frames, final payloads,
 * and guard behavior.
 *
 * @group Unit test helper
 */
export const createStreamTestHarness = async <
	TServiceBuilder extends ServiceBuilder<any>,
	TStreamBuilder extends StreamDefinitionBuilder<any, any>,
>(
	serviceBuilder: TServiceBuilder,
	streamBuilder: TStreamBuilder,
	options: InstanceConfigType<InferStreamHarnessServiceBuilderConfig<TServiceBuilder>> & {
		eventBridge?: EventBridge
	} = {} as InstanceConfigType<InferStreamHarnessServiceBuilderConfig<TServiceBuilder>> & {
		eventBridge?: EventBridge
	},
) => {
	const eventBridgeOwner = !options.eventBridge
	const eventBridgeMock = options.eventBridge ? undefined : getEventBridgeMock()
	const eventBridge = options.eventBridge ?? eventBridgeMock?.mock
	if (!eventBridge) {
		throw new Error('createStreamTestHarness: failed to resolve event bridge')
	}
	const service = await serviceBuilder.getInstance(eventBridge, options as any)
	const definition = await streamBuilder.getDefinition()
	await service.registerStream(definition)

	return {
		service,
		eventBridge,
		stubs: {
			eventBridge: eventBridgeMock?.stubs,
		},
		run: async (input: {
			payload: InferIn<InferStreamBuilderConfig<TStreamBuilder>['PayloadSchema']>
			parameter: InferIn<InferStreamBuilderConfig<TStreamBuilder>['ParamsSchema']>
		}) => {
			const info = (service as unknown as { info?: { serviceName: string; serviceVersion: string } }).info
			eventBridgeMock?.stubs.emitMessage.resetHistory()
			await service.executeStream(
				createStreamOpenRequestMock(
					info?.serviceName ?? 'service',
					info?.serviceVersion ?? '1',
					definition.streamName,
					input.payload,
					input.parameter,
				),
			)

			const frames = (eventBridgeMock?.stubs.emitMessage.getCalls().map(call => call.args[0]) ?? []).filter(
				(
					message,
				): message is StreamFrame<
					Infer<InferStreamBuilderConfig<TStreamBuilder>['ChunkSchema']>,
					Infer<InferStreamBuilderConfig<TStreamBuilder>['FinalSchema']>
				> => message?.messageType === EBMessageType.Stream,
			)
			const chunks = frames
				.filter(frame => frame.payload.frameType === 'chunk')
				.map(frame => frame.payload.chunk as Infer<InferStreamBuilderConfig<TStreamBuilder>['ChunkSchema']>)
			const finalFrame = frames.find(frame => frame.payload.frameType === 'complete')

			return {
				frames,
				chunks,
				final: finalFrame?.payload.final as Infer<InferStreamBuilderConfig<TStreamBuilder>['FinalSchema']> | undefined,
			}
		},
		destroy: async () => {
			await service.destroy()
			if (eventBridgeOwner) {
				await eventBridge.destroy()
			}
		},
	}
}
