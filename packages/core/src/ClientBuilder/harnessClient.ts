import type { HarnessTargetInput } from '@purista/harness'

import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { EBMessageBase } from '../core/types/EBMessageBase.js'
import type { InvokeFunction } from '../core/types/InvokeFunction.js'
import type { OpenStreamFunction } from '../core/types/OpenStreamFunction.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import {
	createHarnessInvocationProxy,
	finalizeHarnessInvocationBinding,
	type HarnessEnqueueOptions,
	type HarnessExecutionStream,
	type HarnessTargetQueueEnqueueResult,
	type HarnessTargetRunResult,
	registerHarnessInvocation,
} from '../HarnessMount/invocation.js'
import type { HarnessInvokeParameter } from '../HarnessMount/invokeTypes.js'
import {
	type AnyQueuedRemoteHarnessTargetContract,
	type AnyRemoteHarnessTargetContract,
	requireRemoteHarnessTargetContract,
} from '../HarnessMount/remoteTargetContract.js'

/** Transport identity supplied by the application that owns a generated client. */
export type RemoteHarnessClientOptions = Readonly<{
	senderName?: string
	identity?: Pick<EBMessageBase, 'principalId' | 'tenantId' | 'traceId' | 'otp'>
}>

/** Exact run/stream surface and nominally granted enqueue capability of a generated root. */
export type RemoteHarnessClient<C extends AnyRemoteHarnessTargetContract> = Readonly<{
	run(input: HarnessTargetInput<C>, options?: HarnessInvokeParameter): Promise<HarnessTargetRunResult<C>>
	stream(input: HarnessTargetInput<C>, options?: HarnessInvokeParameter): Promise<HarnessExecutionStream<C>>
}> &
	(C extends AnyQueuedRemoteHarnessTargetContract
		? Readonly<{
				enqueue(
					input: HarnessTargetInput<C>,
					parameter?: HarnessInvokeParameter,
					options?: HarnessEnqueueOptions,
				): Promise<HarnessTargetQueueEnqueueResult>
			}>
		: unknown)

/**
 * Connect a generated authentic target to the existing EventBridge invocation path.
 *
 * Input is forwarded unchanged. The receiver owns fresh-input validation and
 * transforms. A queued contract exposes enqueue even when no queue transport
 * was configured; using it then fails before dispatch.
 * @example
 * const support = createRemoteHarnessClient(supportTargetContract, eventBridge, queueBridge)
 * const result = await support.run({ raw: 'question' })
 */
export function createRemoteHarnessClient<const C extends AnyRemoteHarnessTargetContract>(
	contract: C,
	eventBridge: Pick<EventBridge, 'instanceId' | 'invoke' | 'openStream'>,
	queueBridge?: Pick<QueueBridge, 'enqueue'>,
	options: RemoteHarnessClientOptions = {},
): RemoteHarnessClient<C> {
	const snapshot = requireRemoteHarnessTargetContract(contract)
	const { serviceName, serviceVersion, serviceTarget } = snapshot.address
	const declared = registerHarnessInvocation({}, {}, serviceName, serviceVersion, serviceTarget, contract)
	const finalized = finalizeHarnessInvocationBinding(
		declared.invokes,
		declared.streamInvokes,
		serviceName,
		serviceVersion,
		serviceTarget,
		snapshot.exportDigest,
	)
	const sender = Object.freeze({
		serviceName: options.senderName ?? 'EventBridgeClient',
		serviceVersion: '1',
		serviceTarget: '__client_invoke__',
		instanceId: eventBridge.instanceId,
	})
	const identity = Object.freeze({ ...options.identity })
	const invoke: InvokeFunction = (receiver, payload, parameter, harness) =>
		eventBridge.invoke({
			...identity,
			sender,
			receiver,
			payload: { payload, parameter },
			harness,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		})
	const openStream: OpenStreamFunction = (receiver, payload, parameter, harness) =>
		eventBridge.openStream({
			...identity,
			sender,
			receiver,
			payload: { frameType: 'open', payload, parameter },
			harness,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		})
	const enqueue: QueueInvokeFunction = (queueName, payload, parameter, enqueueOptions) => {
		if (!queueBridge) throw new TypeError('Harness enqueue requires a configured QueueBridge.')
		const headers = { ...enqueueOptions?.headers }
		delete headers['purista.principalId']
		delete headers['purista.tenantId']
		return queueBridge.enqueue({
			...enqueueOptions,
			queueName,
			payload,
			parameter,
			headers: {
				...headers,
				...(identity.principalId ? { 'purista.principalId': identity.principalId } : {}),
				...(identity.tenantId ? { 'purista.tenantId': identity.tenantId } : {}),
			},
		})
	}
	const namespace = createHarnessInvocationProxy<
		Record<string, Record<string, Record<string, RemoteHarnessClient<C>>>>
	>(contract.kind, invoke, openStream, snapshot.queueName === null ? undefined : enqueue, finalized.invokes)
	return namespace[serviceName][serviceVersion][serviceTarget]
}
