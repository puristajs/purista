import type { AnyHarnessTargetContract } from '@purista/harness'
import { isHarnessError } from '@purista/harness'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { QueueDefinition } from '../core/types/queue/QueueDefinition.js'
import type { QueueHandlerResult } from '../core/types/queue/QueueHandlerResult.js'
import type { AnyQueueWorkerDefinition } from '../core/types/queue/QueueWorkerDefinitionList.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { finalizeHarnessInvocationBinding } from './invocation.js'
import type { HarnessInvokeParameter } from './invokeTypes.js'
import { requireHarnessTargetQueueBinding } from './queueBinding.js'
import {
	createHarnessQueueDeliveryInvokeParameter,
	harnessQueueDeliveryEnvelopeSchema,
	requireHarnessQueueDeliveryEnvelope,
} from './queueEnvelope.js'
import { createGeneratedHarnessSchema } from './remoteTargetContract.js'
import type { MountedHarnessTargetProjection } from './types.js'

type QueueRetry = Extract<QueueHandlerResult, { status: 'retry' }>

type StagedQueue = Readonly<{
	projection: MountedHarnessTargetProjection<AnyHarnessTargetContract>
	binding: ReturnType<typeof requireHarnessTargetQueueBinding>
}>

type HarnessQueueMount = Readonly<{
	policy?: Readonly<{
		targets?: Readonly<{
			agents?: Readonly<Record<string, Readonly<{ queue?: unknown }> | undefined>>
			workflows?: Readonly<Record<string, Readonly<{ queue?: unknown }> | undefined>>
		}>
	}>
	projections: readonly MountedHarnessTargetProjection<AnyHarnessTargetContract>[]
}>

const materializedQueueBindings = new WeakSet<object>()

/**
 * Materialize explicit mounted-root queue bindings into normal PURISTA definitions.
 *
 * The helper authenticates and stages every binding before touching a supplied
 * builder. It returns the same promise inputs accepted by ServiceBuilder's
 * definition lists and rejects a second materialization of any binding.
 */
export function createMountedHarnessQueueDefinitions(mount: HarnessQueueMount): Readonly<{
	queueDefinitions: readonly Promise<QueueDefinition>[]
	queueWorkerDefinitions: readonly Promise<AnyQueueWorkerDefinition>[]
}> {
	const staged = stageMountedQueues(mount)
	for (const entry of staged) {
		if (materializedQueueBindings.has(entry.binding.reference)) {
			throw new TypeError('Harness target queue binding has already been materialized.')
		}
	}

	const queueDefinitions: Promise<QueueDefinition>[] = []
	const queueWorkerDefinitions: Promise<AnyQueueWorkerDefinition>[] = []
	for (const entry of staged) {
		const { projection, binding } = entry
		materializedQueueBindings.add(binding.reference)
		binding.queue
			.addPayloadSchema(createGeneratedHarnessSchema(projection.targetExport.inputSchema))
			.addParameterSchema(harnessQueueDeliveryEnvelopeSchema)
		const declared =
			projection.target.kind === 'agent'
				? binding.worker.canInvokeAgent(
						projection.address.serviceName,
						projection.address.serviceVersion,
						projection.target as typeof projection.target & Readonly<{ kind: 'agent' }>,
					)
				: binding.worker.canInvokeWorkflow(
						projection.address.serviceName,
						projection.address.serviceVersion,
						projection.target as typeof projection.target & Readonly<{ kind: 'workflow' }>,
					)
		declared.setHandler(async (context, message) => {
			const envelope = requireHarnessQueueDeliveryEnvelope(message.parameter)
			const namespace = projection.target.kind === 'agent' ? context.agent : context.workflow
			const client = (namespace as any)[projection.address.serviceName][projection.address.serviceVersion][
				projection.address.serviceTarget
			] as { run(input: unknown, parameter: HarnessInvokeParameter): Promise<unknown> }
			try {
				const output = await client.run(message.payload, createHarnessQueueDeliveryInvokeParameter(envelope))
				return { status: 'success', output }
			} catch (error) {
				const retry = toHarnessQueueRetry(error)
				if (retry !== undefined) return retry
				throw error
			}
		})

		queueDefinitions.push(binding.queue.getDefinition())
		queueWorkerDefinitions.push(
			declared.getDefinition().then(worker => {
				const finalized = finalizeHarnessInvocationBinding(
					worker.invokes,
					worker.streamInvokes,
					projection.address.serviceName,
					projection.address.serviceVersion,
					projection.address.serviceTarget,
					projection.exportDigest,
				)
				return { ...worker, invokes: finalized.invokes, streamInvokes: finalized.streamInvokes }
			}),
		)
	}
	return Object.freeze({
		queueDefinitions: Object.freeze(queueDefinitions),
		queueWorkerDefinitions: Object.freeze(queueWorkerDefinitions),
	})
}

/**
 * Convert Harness provider-admission backpressure into a native queue retry.
 *
 * This helper accepts both a local Harness error and the handled error received
 * after an address-first EventBridge invocation. Other failures return
 * `undefined` and should be rethrown by the worker.
 *
 * @example
 * ```ts
 * try {
 *   await context.agent.Knowledge['1'].answer.run(message.payload)
 *   return { status: 'success' }
 * } catch (error) {
 *   const retry = toHarnessQueueRetry(error)
 *   if (retry) return retry
 *   throw error
 * }
 * ```
 */
export function toHarnessQueueRetry(error: unknown): QueueRetry | undefined {
	if (
		isHarnessError(error) &&
		error.retriable === true &&
		(error.code === 'MODEL_ADMISSION_REJECTED' || error.code === 'AGENT_ADMISSION_REJECTED')
	) {
		return retryFromDelay(
			error.meta?.retryAfterMs,
			error.code === 'MODEL_ADMISSION_REJECTED' ? 'model_admission_rejected' : 'agent_admission_rejected',
		)
	}
	if (error instanceof HandledError && error.errorCode === StatusCode.TooManyRequests && isAdmissionData(error.data)) {
		return retryFromDelay(
			error.data.retryAfterMs,
			error.data.code === 'MODEL_ADMISSION_REJECTED' ? 'model_admission_rejected' : 'agent_admission_rejected',
		)
	}
	return undefined
}

function retryFromDelay(value: unknown, reason: string): QueueRetry | undefined {
	if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined
	return Object.freeze({
		status: 'retry',
		reason,
		delayMs: Math.ceil(value),
	})
}

function isAdmissionData(value: unknown): value is {
	code: 'MODEL_ADMISSION_REJECTED' | 'AGENT_ADMISSION_REJECTED'
	retriable: true
	retryAfterMs: number
} {
	if (!value || typeof value !== 'object') return false
	const data = value as Record<string, unknown>
	return (
		(data.code === 'MODEL_ADMISSION_REJECTED' || data.code === 'AGENT_ADMISSION_REJECTED') &&
		data.retriable === true &&
		typeof data.retryAfterMs === 'number'
	)
}

function stageMountedQueues(mount: HarnessQueueMount): readonly StagedQueue[] {
	if (!mount || typeof mount !== 'object' || !Array.isArray(mount.projections)) {
		throw new TypeError('Harness mount queue metadata is invalid.')
	}
	const staged: StagedQueue[] = []
	const queueNames = new Set<string>()
	const queueBuilders = new Set<object>()
	const workerBuilders = new Set<object>()
	for (const projection of mount.projections) {
		const configured = queueBindingFor(mount, projection)
		const projectedQueueName = projection.targetExport.queue?.name
		if (projection.visibility === 'dependency') {
			if (configured !== undefined || projectedQueueName !== undefined || projection.policy !== null) {
				throw new TypeError('Harness dependency target cannot carry queue metadata.')
			}
			continue
		}
		if (configured === undefined && projectedQueueName === undefined) continue
		if (configured === undefined || projectedQueueName === undefined) throw projectionMismatch()
		const binding = requireHarnessTargetQueueBinding(configured, projection.target)
		if (
			projection.policy?.queueName !== binding.queueName ||
			projectedQueueName !== binding.queueName ||
			projection.address.serviceTarget !== projection.target.id ||
			projection.targetExport.targetName !== projection.target.id ||
			projection.targetExport.kind !== projection.target.kind ||
			projection.standardSchemas.input !== projection.target.input
		)
			throw projectionMismatch()
		if (queueNames.has(binding.queueName) || queueBuilders.has(binding.queue) || workerBuilders.has(binding.worker))
			throw new TypeError('A mounted Harness queue or worker is bound more than once.')
		queueNames.add(binding.queueName)
		queueBuilders.add(binding.queue)
		workerBuilders.add(binding.worker)
		staged.push(Object.freeze({ projection, binding }))
	}
	return Object.freeze(staged)
}

function queueBindingFor(
	mount: HarnessQueueMount,
	projection: MountedHarnessTargetProjection<AnyHarnessTargetContract>,
) {
	const targets = mount.policy?.targets
	const group = projection.target.kind === 'agent' ? targets?.agents : targets?.workflows
	return (group as Record<string, { queue?: unknown } | undefined> | undefined)?.[projection.target.id]?.queue
}

function projectionMismatch(): TypeError {
	return new TypeError('Harness target queue projection does not match its authentic binding.')
}
