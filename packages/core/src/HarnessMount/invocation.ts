import { createHash, randomUUID } from 'node:crypto'

import type {
	HarnessTargetExecutionEvent,
	HarnessTargetExecutionTerminalOutcome,
	HarnessTargetRunOutcome,
	HarnessTargetStream,
} from '@purista/harness'
import type { AnyHarnessTargetContract, HarnessTargetInput } from '@purista/harness/integrator'
import { isHarnessTargetContract } from '@purista/harness/integrator'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { CorrelationId } from '../core/types/CorrelationId.js'
import type { HarnessTransportEnvelope } from '../core/types/commandType/Command.js'
import type { InvokeFunction } from '../core/types/InvokeFunction.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { OpenStreamFunction } from '../core/types/OpenStreamFunction.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { Schema } from '../schema/index.js'
import { adaptHarnessTransportStream } from './dispatcher.js'
import type { HarnessInvokeParameter } from './invokeTypes.js'
import {
	createHarnessQueueDeliveryEnvelope,
	harnessQueueDeliveryEnvelopeSchema,
	readHarnessQueueInvocationIdentity,
} from './queueEnvelope.js'
import type { QueuedHarnessTargetReference } from './queueReferenceRegistry.js'
import { requireQueuedHarnessTargetReference } from './queueReferenceRegistry.js'
import {
	type AnyQueuedRemoteHarnessTargetContract,
	type AnyRemoteHarnessTargetContract,
	canonicalHarnessJson,
	isRemoteHarnessTargetContract,
	requireRemoteHarnessTargetContract,
} from './remoteTargetContract.js'

type TargetKind = AnyHarnessTargetContract['kind']
type AnyTargetContract = AnyHarnessTargetContract
type AnyQueuedLocalTargetReference = QueuedHarnessTargetReference<AnyTargetContract, string>
export type HarnessInvocationSource = AnyTargetContract | AnyQueuedLocalTargetReference

export type HarnessInvocationContract<Source> =
	Source extends QueuedHarnessTargetReference<infer C, string> ? C : Source extends AnyTargetContract ? Source : never

type HarnessInvocationRecord = Readonly<{
	target: AnyTargetContract
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>
	queueName: string | null
	queuePayloadSchema?: Schema
}>

const invocationDeclarations = new WeakMap<object, HarnessInvocationRecord>()
const invocationBindings = new WeakMap<object, HarnessInvocationRecord & { exportDigest: `sha256:${string}` }>()

/** Framework-owned aggregate result carrying the stable public session identity. */
export type HarnessTargetRunResult<C extends AnyTargetContract> = Readonly<{
	readonly sessionId: CorrelationId
	readonly outcome: HarnessTargetRunOutcome<C>
}>

/** Type marker carried by a declared aggregate Harness invocation. */
export type HarnessInvokeDeclaration<Source extends HarnessInvocationSource> = ((
	input: HarnessTargetInput<HarnessInvocationContract<Source>>,
	options?: HarnessInvokeParameter,
) => Promise<HarnessTargetRunResult<HarnessInvocationContract<Source>>>) & { readonly __harnessTarget: Source }

/** Queue delivery options accepted after Harness invocation parameters. */
export type HarnessEnqueueOptions = Omit<
	QueueEnqueueOptions<unknown, HarnessInvokeParameter>,
	'queueName' | 'payload' | 'parameter'
>

/** Closed queue acceptance receipt carrying the resolved Harness session. */
export type HarnessTargetQueueEnqueueResult = Readonly<QueueEnqueueResult & { readonly sessionId: CorrelationId }>

/** Type marker carried by a declared streaming Harness invocation. */
export type HarnessStreamDeclaration<Source extends HarnessInvocationSource> = ((
	input: HarnessTargetInput<HarnessInvocationContract<Source>>,
	options?: HarnessInvokeParameter,
) => Promise<HarnessExecutionStream<HarnessInvocationContract<Source>>>) & { readonly __harnessTarget: Source }

/** Cancellable exact target stream returned by an address-first invocation. */
export interface HarnessExecutionStream<C extends AnyTargetContract> extends HarnessTargetStream<C> {
	readonly sessionId: CorrelationId
}

type DirectHarnessTargetClient<C extends AnyTargetContract> = Readonly<{
	run(input: HarnessTargetInput<C>, options?: HarnessInvokeParameter): Promise<HarnessTargetRunResult<C>>
	stream(input: HarnessTargetInput<C>, options?: HarnessInvokeParameter): Promise<HarnessExecutionStream<C>>
}>

export type HarnessTargetClient<Source extends HarnessInvocationSource> = DirectHarnessTargetClient<
	HarnessInvocationContract<Source>
> &
	(Source extends QueuedHarnessTargetReference<AnyTargetContract, string> | AnyQueuedRemoteHarnessTargetContract
		? Readonly<{
				enqueue(
					input: HarnessTargetInput<HarnessInvocationContract<Source>>,
					parameter?: HarnessInvokeParameter,
					options?: HarnessEnqueueOptions,
				): Promise<HarnessTargetQueueEnqueueResult>
			}>
		: unknown)

type SourceOf<T, Kind extends TargetKind> = T extends { readonly __harnessTarget: infer Source }
	? Source extends HarnessInvocationSource
		? HarnessInvocationContract<Source>['kind'] extends Kind
			? Source
			: never
		: never
	: never

type MatchingKeys<T, Kind extends TargetKind> = {
	[K in keyof T]: SourceOf<T[K], Kind> extends never ? never : K
}[keyof T]
type TargetClients<T, Kind extends TargetKind> = {
	[K in MatchingKeys<T, Kind>]: HarnessTargetClient<SourceOf<T[K], Kind>>
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

/** Register aggregate and streaming capabilities for one exact Harness target. */
export function registerHarnessInvocation<Source extends AnyRemoteHarnessTargetContract>(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	source: Source,
): { invokes: InvokeList; streamInvokes: StreamInvokeList }
export function registerHarnessInvocation<Source extends HarnessInvocationSource>(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	serviceName: string,
	serviceVersion: string,
	source: Source,
): { invokes: InvokeList; streamInvokes: StreamInvokeList }
export function registerHarnessInvocation<C extends AnyTargetContract>(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	contract: C,
): { invokes: InvokeList; streamInvokes: StreamInvokeList }
export function registerHarnessInvocation(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	...args:
		| readonly [source: AnyRemoteHarnessTargetContract]
		| readonly [serviceName: string, serviceVersion: string, source: HarnessInvocationSource]
		| readonly [serviceName: string, serviceVersion: string, serviceTarget: string, contract: AnyTargetContract]
): { invokes: InvokeList; streamInvokes: StreamInvokeList } {
	const resolved = resolveInvocationDeclaration(args)
	const { serviceName, serviceVersion, serviceTarget } = resolved.address
	const contract = resolved.target
	if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
		throw new Error(
			`canInvoke${contract.kind === 'agent' ? 'Agent' : 'Workflow'} requires non-empty service name, version and target`,
		)
	}
	const address = resolved.address
	assertInvocationTargetDeclaration(contract, address)
	const declaration = Object.freeze({ target: contract, address })
	invocationDeclarations.set(declaration, resolved)
	let binding: object | undefined
	if (isRemoteHarnessTargetContract(contract)) {
		const remote = requireRemoteHarnessTargetContract(contract)
		assertInvocationTargetBinding(contract, address, remote.exportDigest)
		binding = Object.freeze({ target: contract, address, exportDigest: remote.exportDigest })
		invocationBindings.set(binding, { ...resolved, exportDigest: remote.exportDigest })
	}
	const descriptor = Object.freeze({
		payloadSchema: undefined,
		harnessDeclaration: declaration,
		...(binding === undefined ? {} : { harnessBinding: binding }),
	})
	return {
		invokes: {
			...invokes,
			[serviceName]: {
				...(invokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(invokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: descriptor,
				},
			},
		},
		streamInvokes: {
			...streamInvokes,
			[serviceName]: {
				...(streamInvokes[serviceName] ?? {}),
				[serviceVersion]: {
					...(streamInvokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: Object.freeze({
						...descriptor,
						validateChunk: false,
						validateFinal: false,
					}),
				},
			},
		},
	}
}

function resolveInvocationDeclaration(
	args:
		| readonly [source: AnyRemoteHarnessTargetContract]
		| readonly [serviceName: string, serviceVersion: string, source: HarnessInvocationSource]
		| readonly [serviceName: string, serviceVersion: string, serviceTarget: string, contract: AnyTargetContract],
): HarnessInvocationRecord {
	if (args.length === 1) {
		const source = args[0]
		const remote = requireRemoteHarnessTargetContract(source)
		return Object.freeze({
			target: source,
			address: remote.address,
			queueName: remote.queueName,
			...(remote.queueName === null ? {} : { queuePayloadSchema: source.input }),
		})
	}

	if (args.length === 3) {
		const [serviceName, serviceVersion, source] = args
		if (isHarnessTargetContract(source) || isRemoteHarnessTargetContract(source)) {
			const address = Object.freeze({ serviceName, serviceVersion, serviceTarget: source.id })
			if (isRemoteHarnessTargetContract(source)) {
				const remote = requireRemoteHarnessTargetContract(source)
				if (
					remote.address.serviceName !== serviceName ||
					remote.address.serviceVersion !== serviceVersion ||
					remote.address.serviceTarget !== source.id
				) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						'Remote Harness invocation declaration address does not match.',
					)
				}
				return Object.freeze({
					target: source,
					address: remote.address,
					queueName: remote.queueName,
					...(remote.queueName === null ? {} : { queuePayloadSchema: source.input }),
				})
			}
			return Object.freeze({ target: source, address, queueName: null })
		}
		const queue = requireQueuedHarnessTargetReference(source)
		return Object.freeze({
			target: queue.targetContract,
			address: Object.freeze({ serviceName, serviceVersion, serviceTarget: queue.targetContract.id }),
			queueName: queue.queueName,
		})
	}

	const [serviceName, serviceVersion, serviceTarget, contract] = args
	if (isRemoteHarnessTargetContract(contract)) {
		const remote = requireRemoteHarnessTargetContract(contract)
		if (
			remote.address.serviceName !== serviceName ||
			remote.address.serviceVersion !== serviceVersion ||
			remote.address.serviceTarget !== serviceTarget
		) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Remote Harness invocation declaration address does not match.',
			)
		}
		return Object.freeze({
			target: contract,
			address: remote.address,
			queueName: remote.queueName,
			...(remote.queueName === null ? {} : { queuePayloadSchema: contract.input }),
		})
	}
	return Object.freeze({
		target: contract,
		address: Object.freeze({ serviceName, serviceVersion, serviceTarget }),
		queueName: null,
	})
}

/** Finalize one registered declaration with its producer-owned canonical export digest. */
export function finalizeHarnessInvocationBinding(
	invokes: InvokeList,
	streamInvokes: StreamInvokeList,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	exportDigest: `sha256:${string}`,
) {
	const aggregate = invokes[serviceName]?.[serviceVersion]?.[serviceTarget] as InvocationDescriptor | undefined
	const streaming = streamInvokes[serviceName]?.[serviceVersion]?.[serviceTarget] as InvocationDescriptor | undefined
	const declaration = aggregate?.harnessDeclaration
	if (
		declaration === undefined ||
		streaming?.harnessDeclaration !== declaration ||
		!invocationDeclarations.has(declaration)
	) {
		throw new UnhandledError(StatusCode.InternalServerError, 'Harness invocation declaration is incomplete.')
	}
	const address = { serviceName, serviceVersion, serviceTarget }
	if (
		declaration.address.serviceName !== serviceName ||
		declaration.address.serviceVersion !== serviceVersion ||
		declaration.address.serviceTarget !== serviceTarget
	) {
		throw new UnhandledError(StatusCode.InternalServerError, 'Harness invocation declaration address does not match.')
	}
	assertInvocationTargetBinding(declaration.target, address, exportDigest)
	const binding = Object.freeze({ target: declaration.target, address: declaration.address, exportDigest })
	const declarationRecord = invocationDeclarations.get(declaration)
	if (!declarationRecord) {
		throw new UnhandledError(StatusCode.InternalServerError, 'Harness invocation declaration is incomplete.')
	}
	invocationBindings.set(binding, { ...declarationRecord, exportDigest })
	return {
		invokes: replaceInvocationDescriptor(invokes, serviceName, serviceVersion, serviceTarget, {
			...aggregate,
			harnessBinding: binding,
		}),
		streamInvokes: replaceInvocationDescriptor(streamInvokes, serviceName, serviceVersion, serviceTarget, {
			...streaming,
			harnessBinding: binding,
		}),
	}
}

const noop = () => undefined

type InvocationDescriptor = Readonly<{
	harnessDeclaration?: HarnessInvocationDeclaration
	harnessBinding?: HarnessInvocationBinding
}>

type HarnessInvocationDeclaration = Readonly<{
	target: AnyTargetContract
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>
}>

type HarnessInvocationBinding = Readonly<{
	target: HarnessInvocationDeclaration['target']
	address: HarnessInvocationDeclaration['address']
	exportDigest: `sha256:${string}`
}>

/** Build the `context.agent` or `context.workflow` address-first proxy. */
export function createHarnessInvocationProxy<T>(
	kind: TargetKind,
	invoke: InvokeFunction,
	openStream: OpenStreamFunction,
	enqueue?: QueueInvokeFunction,
	invokes?: InvokeList,
	address = { serviceName: '', serviceVersion: '', serviceTarget: '' },
	level = 0,
): T {
	return new Proxy(noop, {
		get(_target, property) {
			if (typeof property !== 'string' || property === 'then' || property === 'catch' || property === 'finally')
				return undefined
			if (level < 2)
				return createHarnessInvocationProxy(
					kind,
					invoke,
					openStream,
					enqueue,
					invokes,
					{
						...address,
						...(level === 0 ? { serviceName: property } : { serviceVersion: property }),
					},
					level + 1,
				)
			if (level !== 2) return undefined
			const targetAddress = { ...address, serviceTarget: property }
			const descriptor = invokes?.[targetAddress.serviceName]?.[targetAddress.serviceVersion]?.[
				targetAddress.serviceTarget
			] as InvocationDescriptor | undefined
			const declaration = descriptor?.harnessDeclaration
			const declarationRecord = declaration && invocationDeclarations.get(declaration)
			const binding = descriptor?.harnessBinding
			const bindingRecord = binding && invocationBindings.get(binding)
			const queueName = declarationRecord?.queueName ?? null
			const requireTarget = () => {
				if (binding === undefined || bindingRecord === undefined) {
					throw new UnhandledError(StatusCode.InternalServerError, 'Harness invocation target binding is incomplete.')
				}
				if (
					binding.address.serviceName !== targetAddress.serviceName ||
					binding.address.serviceVersion !== targetAddress.serviceVersion ||
					binding.address.serviceTarget !== targetAddress.serviceTarget
				) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						'Harness invocation proxy address does not match its finalized binding.',
					)
				}
				assertInvocationTargetBinding(bindingRecord.target, targetAddress, bindingRecord.exportDigest, kind)
				return bindingRecord
			}
			const requireQueueTarget = () => {
				if (declarationRecord === undefined || declarationRecord.queueName === null) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						'Harness queue invocation declaration is incomplete.',
					)
				}
				assertInvocationTargetDeclaration(declarationRecord.target, targetAddress, kind)
				return declarationRecord
			}
			return Object.freeze({
				run: async (input: unknown, options: HarnessInvokeParameter = {}) => {
					const binding = requireTarget()
					const prepared = prepareInvocation(options, binding.exportDigest)
					const response = await invoke<unknown>(targetAddress, input, prepared.parameter, prepared.harness)
					return await validateAggregateResponse(binding.target, response, prepared.sessionId, prepared.expectedRunId)
				},
				stream: async (input: unknown, options: HarnessInvokeParameter = {}) => {
					const binding = requireTarget()
					const prepared = prepareInvocation(options, binding.exportDigest)
					const raw = await openStream<
						HarnessTargetExecutionEvent<typeof binding.target>,
						HarnessTargetExecutionTerminalOutcome<typeof binding.target>
					>(targetAddress, input, prepared.parameter, prepared.harness)
					return toHarnessExecutionStream(raw, binding.target, prepared.sessionId, prepared.expectedRunId)
				},
				...(queueName && enqueue
					? {
							enqueue: async (
								input: unknown,
								parameter: HarnessInvokeParameter = {},
								options?: HarnessEnqueueOptions,
							) => {
								requireQueueTarget()
								const prepared = prepareQueueInvocation(parameter, queueName, options?.idempotencyKey)
								const envelope = createHarnessQueueDeliveryEnvelope(prepared.parameter, prepared.invocationId)
								const receipt = await enqueue(queueName, input, envelope, options)
								if (
									!exactDataObject(
										receipt,
										receipt !== null && typeof receipt === 'object' && Object.hasOwn(receipt, 'scheduledAt')
											? ['jobId', 'queueName', 'scheduledAt']
											: ['jobId', 'queueName'],
									) ||
									typeof receipt.jobId !== 'string' ||
									receipt.jobId.trim() === '' ||
									receipt.queueName !== queueName ||
									(receipt.scheduledAt !== undefined && !Number.isFinite(receipt.scheduledAt))
								) {
									throw new UnhandledError(
										StatusCode.InternalServerError,
										'Harness target queue returned an invalid acceptance receipt.',
									)
								}
								return Object.freeze({
									jobId: receipt.jobId,
									queueName: receipt.queueName,
									...(receipt.scheduledAt === undefined ? {} : { scheduledAt: receipt.scheduledAt }),
									sessionId: prepared.sessionId,
								})
							},
						}
					: {}),
			})
		},
	}) as T
}

/** @internal Extract exact queue capabilities from authentic address-first declarations. */
export function getHarnessQueueInvokes(invokes: InvokeList): QueueInvokeList {
	const queueInvokes: QueueInvokeList = {}
	for (const [serviceName, versions] of Object.entries(invokes)) {
		for (const [serviceVersion, targets] of Object.entries(versions)) {
			for (const [serviceTarget, rawDescriptor] of Object.entries(targets)) {
				const descriptor = rawDescriptor as InvocationDescriptor
				const declaration = descriptor.harnessDeclaration
				const record = declaration && invocationDeclarations.get(declaration)
				if (!record || record.queueName === null) continue
				if (
					record.address.serviceName !== serviceName ||
					record.address.serviceVersion !== serviceVersion ||
					record.address.serviceTarget !== serviceTarget
				) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						'Harness queue invocation declaration address does not match.',
					)
				}
				assertInvocationTargetDeclaration(record.target, record.address)
				if (queueInvokes[record.queueName] !== undefined) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						`Harness queue "${record.queueName}" is declared by more than one target.`,
					)
				}
				queueInvokes[record.queueName] = {
					payloadSchema: record.queuePayloadSchema,
					parameterSchema: harnessQueueDeliveryEnvelopeSchema,
				}
			}
		}
	}
	return Object.freeze(queueInvokes)
}

function replaceInvocationDescriptor<T extends InvokeList | StreamInvokeList>(
	list: T,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	descriptor: object,
): T {
	return {
		...list,
		[serviceName]: {
			...(list[serviceName] ?? {}),
			[serviceVersion]: {
				...(list[serviceName]?.[serviceVersion] ?? {}),
				[serviceTarget]: Object.freeze(descriptor),
			},
		},
	} as T
}

function prepareInvocation(options: HarnessInvokeParameter, exportDigest: `sha256:${string}`) {
	const { invocationId, sessionId, parameter } = prepareRootInvocation(options, false)
	const harness: HarnessTransportEnvelope = Object.freeze({
		contract: Object.freeze({ schemaVersion: 1 as const, exportDigest }),
		root: Object.freeze({ invocationId, sessionId }),
	})
	const expectedRunId = options.resume?.runId ?? options.durable?.runId
	return { expectedRunId, sessionId, parameter: Object.freeze(parameter), harness }
}

function prepareQueueInvocation(options: HarnessInvokeParameter, queueName: string, idempotencyKey?: string) {
	return prepareRootInvocation(
		options,
		true,
		idempotencyKey === undefined ? undefined : stableQueueInvocationId(queueName, idempotencyKey),
	)
}

function prepareRootInvocation(
	options: HarnessInvokeParameter,
	includeSession: boolean,
	defaultInvocationId?: CorrelationId,
) {
	if (options.resume !== undefined && options.idempotencyKey !== undefined) {
		throw new HandledError(StatusCode.BadRequest, 'Harness resume and idempotencyKey are mutually exclusive.')
	}
	const restoredIdentity = readHarnessQueueInvocationIdentity(options)
	const invocationId = (restoredIdentity?.invocationId ?? defaultInvocationId ?? randomUUID()) as CorrelationId
	const { sessionId: suppliedSessionId, ...rest } = options
	const sessionId = (suppliedSessionId ?? invocationId) as CorrelationId
	if (restoredIdentity !== undefined && sessionId !== restoredIdentity.sessionId) {
		throw new UnhandledError(StatusCode.InternalServerError, 'Harness queue invocation identity is inconsistent.')
	}
	const parameter = Object.freeze(includeSession ? { ...rest, sessionId } : rest)
	return { invocationId, sessionId, parameter }
}

function stableQueueInvocationId(queueName: string, idempotencyKey: string): CorrelationId {
	const preimage = JSON.stringify(['purista-harness-queue-v1', queueName, idempotencyKey])
	return createHash('sha256').update(preimage).digest('hex').slice(0, 32) as CorrelationId
}

async function validateAggregateResponse<C extends AnyTargetContract>(
	target: C,
	response: unknown,
	sessionId: CorrelationId,
	expectedRunId?: string,
): Promise<HarnessTargetRunResult<C>> {
	if (
		!exactDataObject(response, ['sessionId', 'outcome']) ||
		response.sessionId !== sessionId ||
		!exactDataObject(response.outcome, outcomeKeys(response.outcome)) ||
		typeof response.outcome.runId !== 'string' ||
		response.outcome.runId.trim() === ''
	) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness aggregate response does not match its invocation identity.',
		)
	}
	const outcome = response.outcome
	if (expectedRunId !== undefined && outcome.runId !== expectedRunId) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness aggregate response does not match its requested run identity.',
		)
	}
	if (outcome.status === 'failed') throw new HandledError(StatusCode.InternalServerError, 'Harness target failed.')
	if (outcome.status === 'cancelled') throw new HandledError(StatusCode.GatewayTimeout, 'Harness target was cancelled.')
	if (outcome.status === 'completed') {
		try {
			canonicalHarnessJson(outcome.output)
		} catch {
			throw new UnhandledError(StatusCode.InternalServerError, 'Harness aggregate output is not canonical JSON.')
		}
	} else if (outcome.status === 'interrupted') {
		assertTargetInterrupt(target, outcome.interrupt)
	} else {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness aggregate response has an invalid terminal status.',
		)
	}
	const snapshot = JSON.parse(canonicalHarnessJson(outcome)) as HarnessTargetRunOutcome<C>
	return Object.freeze({ sessionId, outcome: deepFreeze(snapshot) }) as HarnessTargetRunResult<C>
}

/** Hide EventBridge frames behind the exact producer-owned Harness target stream. */
export function toHarnessExecutionStream<C extends AnyTargetContract>(
	handle: StreamHandle<HarnessTargetExecutionEvent<C>, HarnessTargetExecutionTerminalOutcome<C>>,
	_target: C,
	sessionId: CorrelationId,
	expectedRunId?: string,
): HarnessExecutionStream<C> {
	const adapted = adaptHarnessTransportStream(handle, expectedRunId)
	return Object.freeze({
		sessionId,
		result: adapted.result,
		cancel: (reason?: string) => adapted.cancel(reason),
		[Symbol.asyncIterator]: () => adapted[Symbol.asyncIterator](),
	}) as HarnessExecutionStream<C>
}

function assertInvocationTargetBinding(
	target: AnyTargetContract,
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>,
	exportDigest: string,
	expectedKind?: TargetKind,
): void {
	assertInvocationTargetDeclaration(target, address, expectedKind)
	if (!/^sha256:[0-9a-f]{64}$/.test(exportDigest)) {
		throw new UnhandledError(StatusCode.InternalServerError, 'Harness invocation requires a complete export digest.')
	}
	if (isRemoteHarnessTargetContract(target) && exportDigest !== target.exportDigest) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Remote Harness invocation binding does not match its generated contract.',
		)
	}
}

function assertInvocationTargetDeclaration(
	target: AnyTargetContract,
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>,
	expectedKind?: TargetKind,
): void {
	if (!isHarnessTargetContract(target) && !isRemoteHarnessTargetContract(target)) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness invocation requires an authentic target contract.',
		)
	}
	if (address.serviceTarget !== target.id) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness invocation address does not match its contract id.',
		)
	}
	if (expectedKind !== undefined && target.kind !== expectedKind) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			`Harness ${expectedKind} invocation received a ${target.kind} contract.`,
		)
	}
	if (
		isRemoteHarnessTargetContract(target) &&
		(address.serviceName !== target.address.serviceName ||
			address.serviceVersion !== target.address.serviceVersion ||
			address.serviceTarget !== target.address.serviceTarget)
	)
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Remote Harness invocation binding does not match its generated contract.',
		)
}

function outcomeKeys(value: unknown): readonly string[] {
	const status = typeof value === 'object' && value !== null ? (value as { status?: unknown }).status : undefined
	switch (status) {
		case 'completed':
			return ['status', 'runId', 'output']
		case 'interrupted':
			return ['status', 'runId', 'interrupt']
		case 'failed':
		case 'cancelled':
			return ['status', 'runId', 'error']
		default:
			return []
	}
}

function exactDataObject(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) return false
	const ownKeys = Reflect.ownKeys(value)
	if (ownKeys.length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) return false
	return ownKeys.every(
		key =>
			typeof key === 'string' &&
			keys.includes(key) &&
			(() => {
				const descriptor = Object.getOwnPropertyDescriptor(value, key)
				return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
			})(),
	)
}

function assertTargetInterrupt(target: AnyTargetContract, value: unknown): void {
	if (
		!exactDataObject(value, interruptKeys(value)) ||
		typeof value.type !== 'string' ||
		!target.interrupts.includes(value.type as never)
	) {
		throw new UnhandledError(
			StatusCode.InternalServerError,
			'Harness aggregate interruption does not match its target contract.',
		)
	}
	if (value.type === 'external-wait') {
		for (const key of ['id', 'revision', 'kind', 'schemaVersion', 'definitionVersion', 'deadline']) {
			if (typeof value[key] !== 'string' || (value[key] as string).trim() === '') {
				throw new UnhandledError(StatusCode.InternalServerError, 'Harness aggregate interruption is malformed.')
			}
		}
	} else if (value.type === 'tool-approval') {
		if (
			typeof value.id !== 'string' ||
			value.id.trim() === '' ||
			typeof value.revision !== 'string' ||
			value.revision.trim() === '' ||
			!plainDataArray(value.requests) ||
			value.requests.length === 0
		) {
			throw new UnhandledError(StatusCode.InternalServerError, 'Harness aggregate interruption is malformed.')
		}
		for (const request of value.requests) assertApprovalRequest(request)
	}
	canonicalHarnessJson(value)
}

function interruptKeys(value: unknown): readonly string[] {
	if (typeof value !== 'object' || value === null) return []
	if ((value as { type?: unknown }).type === 'external-wait') {
		return ['type', 'id', 'revision', 'kind', 'schemaVersion', 'definitionVersion', 'deadline']
	}
	if ((value as { type?: unknown }).type === 'tool-approval') return ['type', 'id', 'revision', 'requests']
	return []
}

function deepFreeze<Value>(value: Value): Value {
	if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value
	for (const child of Object.values(value as object)) deepFreeze(child)
	return Object.freeze(value)
}

function assertApprovalRequest(value: unknown): void {
	const required = [
		'approvalId',
		'runId',
		'agentRunId',
		'agentId',
		'invocationId',
		'step',
		'toolId',
		'callId',
		'input',
		'demands',
	]
	const optional = ['parentRunId', 'parentInvocationId', 'workflowId']
	if (!exactDataObjectFields(value, required, optional)) throw malformedApproval()
	for (const key of required.slice(0, 8)) {
		if (key === 'step') continue
		if (typeof value[key] !== 'string' || (value[key] as string).trim() === '') throw malformedApproval()
	}
	if (
		!Number.isSafeInteger(value.step) ||
		(value.step as number) < 0 ||
		(value.parentRunId === undefined) !== (value.parentInvocationId === undefined) ||
		!['parentRunId', 'parentInvocationId', 'workflowId'].every(
			key => value[key] === undefined || validIdentifier(value[key]),
		) ||
		!plainDataArray(value.demands) ||
		value.demands.length === 0
	)
		throw malformedApproval()
	canonicalHarnessJson(value.input)
	for (const demand of value.demands) {
		if (
			!exactDataObjectFields(demand, ['decisionId', 'source', 'phase'], ['reasonCode']) ||
			typeof demand.decisionId !== 'string' ||
			!/^decision_[0-9a-f]{64}$/.test(demand.decisionId) ||
			typeof demand.phase !== 'string' ||
			!decisionPhases.has(demand.phase) ||
			(demand.reasonCode !== undefined &&
				(typeof demand.reasonCode !== 'string' || !/^[a-z][a-z0-9_]{0,63}$/.test(demand.reasonCode)))
		)
			throw malformedApproval()
		const source = demand.source
		if (
			!exactDataObjectFields(source, ['kind', 'id'], ['version', 'ruleId']) ||
			typeof source.kind !== 'string' ||
			!decisionSourceKinds.has(source.kind) ||
			typeof source.id !== 'string' ||
			!validConfigurationIdentifier(source.id) ||
			!['version', 'ruleId'].every(key => source[key] === undefined || validConfigurationIdentifier(source[key]))
		)
			throw malformedApproval()
	}
}

const decisionPhases = new Set([
	'input',
	'before_model',
	'after_model',
	'output',
	'tool_input',
	'permission',
	'policy',
	'approval',
	'tool_output',
	'exposure',
	'retrieval',
])
const decisionSourceKinds = new Set(['permission', 'policy', 'exposure', 'interceptor', 'guardrail'])

function validIdentifier(value: unknown): value is string {
	return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,255}$/.test(value)
}

function validConfigurationIdentifier(value: unknown): value is string {
	return (
		typeof value === 'string' &&
		Array.from(value).length >= 1 &&
		Array.from(value).length <= 128 &&
		!/\p{Cc}/u.test(value)
	)
}

function exactDataObjectFields(
	value: unknown,
	required: readonly string[],
	optional: readonly string[],
): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const keys = Reflect.ownKeys(value)
	const allowed = new Set([...required, ...optional])
	return (
		required.every(key => Object.hasOwn(value, key)) &&
		keys.every(key => {
			if (typeof key !== 'string' || !allowed.has(key)) return false
			const descriptor = Object.getOwnPropertyDescriptor(value, key)
			return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
		}) &&
		(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
	)
}

function plainDataArray(value: unknown): value is readonly unknown[] {
	if (
		!Array.isArray(value) ||
		Object.getPrototypeOf(value) !== Array.prototype ||
		Object.keys(value).length !== value.length
	)
		return false
	return Reflect.ownKeys(value).every(
		key =>
			key === 'length' ||
			(typeof key === 'string' &&
				/^(0|[1-9]\d*)$/.test(key) &&
				(() => {
					const descriptor = Object.getOwnPropertyDescriptor(value, key)
					return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
				})()),
	)
}

function malformedApproval(): UnhandledError {
	return new UnhandledError(StatusCode.InternalServerError, 'Harness tool-approval interruption is malformed.')
}
