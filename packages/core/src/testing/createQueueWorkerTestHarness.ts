import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { QueueLease } from '../core/types/queue/QueueLease.js'
import type { QueueMessage } from '../core/types/queue/QueueMessage.js'
import type { ServiceBuilderTypes } from '../core/types/ServiceBuilderTypes.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import { getQueueBridgeMock } from '../mocks/getQueueBridge.mock.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import type { InstanceConfigType, ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'

/**
 * Infer the instance config type from a service builder.
 *
 * @group Unit test helper
 */
export type InferQueueWorkerHarnessServiceBuilderConfig<T> = T extends ServiceBuilder<infer S> ? S : never

/**
 * Boot a real service instance and execute one queue worker cycle through the
 * PURISTA worker runtime.
 *
 * Use this helper when you want to verify queue worker guards, job controls,
 * and queue bridge interactions instead of calling the handler directly.
 *
 * @group Unit test helper
 */
export const createQueueWorkerTestHarness = async <TServiceBuilder extends ServiceBuilder<ServiceBuilderTypes>>(
	serviceBuilder: TServiceBuilder,
	workerBuilder: QueueWorkerBuilder,
	options: InstanceConfigType<InferQueueWorkerHarnessServiceBuilderConfig<TServiceBuilder>> & {
		eventBridge?: EventBridge
		queueBridge?: QueueBridge
	} = {} as InstanceConfigType<InferQueueWorkerHarnessServiceBuilderConfig<TServiceBuilder>> & {
		eventBridge?: EventBridge
		queueBridge?: QueueBridge
	},
) => {
	const eventBridgeOwner = !options.eventBridge
	const queueBridgeOwner = !options.queueBridge
	const eventBridgeMock = options.eventBridge ? undefined : getEventBridgeMock()
	const queueBridgeMock = options.queueBridge ? undefined : getQueueBridgeMock()
	const eventBridge = options.eventBridge ?? eventBridgeMock?.mock
	const queueBridge = options.queueBridge ?? queueBridgeMock?.mock
	if (!eventBridge || !queueBridge) {
		throw new Error('createQueueWorkerTestHarness: failed to resolve bridges')
	}
	const service = await serviceBuilder.getInstance(eventBridge, {
		...options,
		queueBridge,
	} as any)
	const definition = await workerBuilder.getDefinition()

	return {
		service,
		eventBridge,
		queueBridge,
		stubs: {
			eventBridge: eventBridgeMock?.stubs,
			queueBridge: queueBridgeMock?.stubs,
		},
		run: async <Payload = unknown, Parameter = unknown>(message: QueueMessage<Payload, Parameter>) => {
			const lease: QueueLease = {
				id: 'lease-id',
				leaseId: 'test-lease',
				queueName: message.queueName,
				message,
				leasedAt: Date.now(),
				leaseExpiresAt: Date.now() + 60_000,
			}
			queueBridgeMock?.stubs.leaseNext.reset()
			queueBridgeMock?.stubs.ack.resetHistory()
			queueBridgeMock?.stubs.nack.resetHistory()
			queueBridgeMock?.stubs.moveToDeadLetter.resetHistory()
			queueBridgeMock?.stubs.extendLease.resetHistory()
			queueBridgeMock?.stubs.leaseNext.onFirstCall().resolves(lease)
			queueBridgeMock?.stubs.leaseNext.onSecondCall().callsFake(async () => {
				;(service as unknown as { queueWorkersShouldStop: boolean }).queueWorkersShouldStop = true
				return undefined
			})
			;(service as unknown as { queueWorkersShouldStop: boolean }).queueWorkersShouldStop = false

			await (
				service as unknown as {
					runQueueWorker: (worker: typeof definition, slot?: number) => Promise<void>
				}
			).runQueueWorker(definition, 0)

			return {
				ackCalls: queueBridgeMock?.stubs.ack.getCalls() ?? [],
				nackCalls: queueBridgeMock?.stubs.nack.getCalls() ?? [],
				deadLetterCalls: queueBridgeMock?.stubs.moveToDeadLetter.getCalls() ?? [],
				extendLeaseCalls: queueBridgeMock?.stubs.extendLease.getCalls() ?? [],
			}
		},
		destroy: async () => {
			await service.destroy()
			if (eventBridgeOwner) {
				await eventBridge.destroy()
			}
			if (queueBridgeOwner) {
				await queueBridge.destroy()
			}
		},
	}
}
