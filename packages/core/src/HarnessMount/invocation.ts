import type { ExecutionEvent, HarnessTargetContract, RunOutcome } from '@purista/harness'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { CorrelationId } from '../core/types/CorrelationId.js'
import type { InvokeFunction } from '../core/types/InvokeFunction.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { OpenStreamFunction } from '../core/types/OpenStreamFunction.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { HarnessInvokeParameter } from './invokeTypes.js'

type TargetKind = HarnessTargetContract<'agent' | 'workflow'>['kind']
type AnyTargetContract = HarnessTargetContract<TargetKind, any, any>

/** Type marker carried by a declared aggregate Harness invocation. */
export type HarnessInvokeDeclaration<C extends AnyTargetContract> = ((
	input: C['$infer']['input'],
	options?: HarnessInvokeParameter,
) => Promise<RunOutcome<C['$infer']['output']>>) & {
	readonly __harnessTarget: C
}

/** Queue delivery options accepted after Harness invocation parameters. */
export type HarnessEnqueueOptions = Omit<
	QueueEnqueueOptions<unknown, HarnessInvokeParameter>,
	'queueName' | 'payload' | 'parameter'
>

/** Type marker carried by a declared streaming Harness invocation. */
export type HarnessStreamDeclaration<C extends AnyTargetContract> = ((
	input: C['$infer']['input'],
	options?: HarnessInvokeParameter,
) => Promise<HarnessExecutionStream<C['$infer']['output']>>) & {
	readonly __harnessTarget: C
}

/** Cancellable provider-neutral stream returned by an address-first Harness invocation. */
export interface HarnessExecutionStream<Output> extends AsyncIterable<ExecutionEvent<Output>> {
	/** EventBridge correlation id backing this stream. */
	readonly sessionId: CorrelationId
	/** Stop the remote Harness invocation and release its stream resources. */
	cancel(reason?: string): Promise<void>
}

/** Client for one address-first agent or workflow target. */
type DirectHarnessTargetClient<C extends AnyTargetContract> = Readonly<{
	/** Run until the target completes or returns a durable interrupt. */
	run(input: C['$infer']['input'], options?: HarnessInvokeParameter): Promise<RunOutcome<C['$infer']['output']>>
	/** Open the target's provider-neutral portable execution stream. */
	stream(
		input: C['$infer']['input'],
		options?: HarnessInvokeParameter,
	): Promise<HarnessExecutionStream<C['$infer']['output']>>
}>

/** Client for one address-first target, with enqueue only on a queued contract. */
export type HarnessTargetClient<C extends AnyTargetContract> = DirectHarnessTargetClient<C> &
	(C extends { readonly queue: { readonly name: string } }
		? Readonly<{
				/** Enqueue one durable run through the target's explicit native queue binding. */
				enqueue(
					input: C['$infer']['input'],
					parameter?: HarnessInvokeParameter,
					options?: HarnessEnqueueOptions,
				): Promise<QueueEnqueueResult>
			}>
		: unknown)

type ContractOf<T, Kind extends TargetKind> = T extends { readonly __harnessTarget: infer C }
	? C extends HarnessTargetContract<Kind, any, any>
		? C
		: never
	: never

type MatchingKeys<T, Kind extends TargetKind> = {
	[K in keyof T]: ContractOf<T[K], Kind> extends never ? never : K
}[keyof T]

type TargetClients<T, Kind extends TargetKind> = {
	[K in MatchingKeys<T, Kind>]: HarnessTargetClient<ContractOf<T[K], Kind>>
}

type VersionClients<T, Kind extends TargetKind> = {
	[K in keyof T as MatchingKeys<T[K], Kind> extends never ? never : K]: TargetClients<T[K], Kind>
}

/** Typed address namespace exposed in PURISTA handler contexts. */
export type HarnessInvocationClients<Invokes extends InvokeList, Kind extends TargetKind> = {
	[K in keyof Invokes as keyof VersionClients<Invokes[K], Kind> extends never ? never : K]: VersionClients<
		Invokes[K],
		Kind
	>
}

/** Register both aggregate and streaming capabilities for one Harness target. */
export function registerHarnessInvocation<C extends AnyTargetContract>(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	contract: C,
) {
	if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
		throw new Error(
			`canInvoke${contract.kind === 'agent' ? 'Agent' : 'Workflow'} requires non-empty service name, version and target`,
		)
	}

	return {
		invokes: {
			...invokes,
			[serviceName]: {
				...(invokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(invokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: { payloadSchema: contract.input, harnessTarget: contract },
				},
			},
		},
		streamInvokes: {
			...streamInvokes,
			[serviceName]: {
				...(streamInvokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(streamInvokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: {
						payloadSchema: contract.input,
						validateChunk: false,
						validateFinal: false,
						harnessTarget: contract,
					},
				},
			},
		},
	}
}

const noop = () => {
	// Proxy target only.
}

/** Build the `context.agent` or `context.workflow` address-first proxy. */
export function createHarnessInvocationProxy<T>(
	invoke: InvokeFunction,
	openStream: OpenStreamFunction,
	enqueue?: QueueInvokeFunction,
	invokes?: InvokeList,
	address: { serviceName: string; serviceVersion: string; serviceTarget: string } = {
		serviceName: '',
		serviceVersion: '',
		serviceTarget: '',
	},
	level = 0,
): T {
	return new Proxy(noop, {
		get(_target, property) {
			if (typeof property !== 'string' || property === 'then' || property === 'catch' || property === 'finally') {
				return undefined
			}
			if (level === 0) {
				return createHarnessInvocationProxy(
					invoke,
					openStream,
					enqueue,
					invokes,
					{ ...address, serviceName: property },
					level + 1,
				)
			}
			if (level === 1) {
				return createHarnessInvocationProxy(
					invoke,
					openStream,
					enqueue,
					invokes,
					{ ...address, serviceVersion: property },
					level + 1,
				)
			}
			if (level === 2) {
				const targetAddress = { ...address, serviceTarget: property }
				const descriptor = invokes?.[targetAddress.serviceName]?.[targetAddress.serviceVersion]?.[
					targetAddress.serviceTarget
				] as { harnessTarget?: { queue?: { name?: string } } } | undefined
				const queueName = descriptor?.harnessTarget?.queue?.name
				return Object.freeze({
					run: (input: unknown, options: HarnessInvokeParameter = {}) => invoke(targetAddress, input, options),
					stream: async (input: unknown, options: HarnessInvokeParameter = {}) =>
						toHarnessExecutionStream(await openStream(targetAddress, input, options)),
					...(queueName && enqueue
						? {
								enqueue: (input: unknown, parameter: HarnessInvokeParameter = {}, options?: HarnessEnqueueOptions) =>
									enqueue(queueName, input, parameter, options),
							}
						: {}),
				})
			}
			return undefined
		},
	}) as T
}

/**
 * Hide PURISTA transport frames behind the native Harness execution stream.
 *
 * The terminal `run.finished` event is yielded before the transport-level
 * completion frame ends iteration. Transport failures reject with PURISTA
 * handled errors and stopping iteration early cancels the remote stream.
 */
export function toHarnessExecutionStream<Output>(
	handle: StreamHandle<ExecutionEvent<Output>, RunOutcome<Output>>,
): HarnessExecutionStream<Output> {
	let consumed = false
	let completed = false

	return Object.freeze({
		sessionId: handle.sessionId,
		cancel: (reason?: string) => handle.cancel(reason),
		[Symbol.asyncIterator]: async function* () {
			if (consumed) throw new Error('A Harness execution stream can only be consumed once.')
			consumed = true
			let terminal: RunOutcome<Output> | undefined
			try {
				for await (const frame of handle) {
					switch (frame.payload.frameType) {
						case 'start':
						case 'heartbeat':
							break
						case 'chunk': {
							if (!frame.payload.chunk) {
								throw new UnhandledError(StatusCode.InternalServerError, 'Harness stream returned an empty chunk.')
							}
							const event = frame.payload.chunk
							if (event.type === 'run.finished') terminal = event.outcome
							yield event
							break
						}
						case 'complete': {
							if (!terminal || !frame.payload.final) {
								throw new UnhandledError(
									StatusCode.InternalServerError,
									'Harness stream ended without its terminal outcome.',
								)
							}
							if (terminal.runId !== frame.payload.final.runId || terminal.status !== frame.payload.final.status) {
								throw new UnhandledError(
									StatusCode.InternalServerError,
									'Harness stream terminal event does not match its completion frame.',
								)
							}
							completed = true
							return
						}
						case 'error': {
							completed = true
							const error = frame.payload.error
							throw new HandledError(
								error?.status ?? StatusCode.InternalServerError,
								error?.message ?? 'Harness stream failed.',
								error?.data,
							)
						}
						case 'cancel':
							completed = true
							throw new HandledError(StatusCode.RequestTimeout, frame.payload.reason ?? 'Harness stream was cancelled.')
					}
				}
				throw new UnhandledError(StatusCode.InternalServerError, 'Harness stream closed without completion.')
			} finally {
				if (!completed) await handle.cancel('consumer stopped reading')
			}
		},
	})
}
