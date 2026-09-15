import { createHash } from 'node:crypto'

import type {
	ExecutionEvent,
	ExecutionTerminalOutcome,
	HarnessTargetExecutionEvent,
	HarnessTargetExecutionTerminalOutcome,
	JsonValue,
} from '@purista/harness'
import type {
	AnyHarnessTargetContract,
	HarnessTargetDispatcher,
	HarnessTargetDispatchRequest,
	HarnessTargetDispatchStream,
	HarnessTargetInput,
	HarnessTargetRouteReceiptV1,
	PersistedHarnessTargetDispatchRequest,
} from '@purista/harness/integrator'
import { isHarnessTargetContract } from '@purista/harness/integrator'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { HarnessDispatchContext, HarnessTransportEnvelope } from '../core/types/commandType/Command.js'
import type { EBMessageSenderAddress } from '../core/types/EBMessageSenderAddress.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import { canonicalHarnessJson, isRemoteHarnessTargetContract } from './remoteTargetContract.js'

const targetRouteBindings = new WeakSet<object>()

type ExactHarnessTargetDispatchStream<Target extends AnyHarnessTargetContract> = Readonly<{
	result: Promise<HarnessTargetExecutionTerminalOutcome<Target>>
	cancel(reason?: string): Promise<void>
}> &
	AsyncIterable<HarnessTargetExecutionEvent<Target>>

/** Immutable route associated with one exact local or hydrated target contract. */
export type HarnessTargetRouteBinding<Target extends AnyHarnessTargetContract = AnyHarnessTargetContract> = Readonly<{
	target: Target
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>
	exportDigest: `sha256:${string}`
	routeBindingRevision: string
	visibility: 'root' | 'dependency'
	receipt: HarnessTargetRouteReceiptV1
}>

/** Validate and freeze a dispatcher route without making it publicly callable. */
export function createHarnessTargetRouteBinding<Target extends AnyHarnessTargetContract>(
	input: Readonly<{
		target: Target
		address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>
		exportDigest: `sha256:${string}`
		routeBindingRevision: string
		visibility: 'root' | 'dependency'
	}>,
): HarnessTargetRouteBinding<Target> {
	if (
		!plainDataObject(input, ['target', 'address', 'exportDigest', 'routeBindingRevision', 'visibility']) ||
		!plainDataObject(input.address, ['serviceName', 'serviceVersion', 'serviceTarget']) ||
		!Object.values(input.address).every(value => typeof value === 'string' && value.trim() !== '') ||
		(input.visibility !== 'root' && input.visibility !== 'dependency')
	) {
		throw new TypeError('Harness target route binding is malformed.')
	}
	if (!isHarnessTargetContract(input.target) && !isRemoteHarnessTargetContract(input.target)) {
		throw new TypeError('Harness target route requires an authentic local or hydrated target contract.')
	}
	if (
		isRemoteHarnessTargetContract(input.target) &&
		(input.address.serviceName !== input.target.address.serviceName ||
			input.address.serviceVersion !== input.target.address.serviceVersion ||
			input.address.serviceTarget !== input.target.address.serviceTarget ||
			input.exportDigest !== input.target.exportDigest)
	)
		throw new TypeError('Remote Harness target route must use its generated address and export digest.')
	if (input.address.serviceTarget !== input.target.id) {
		throw new TypeError('Harness target route address does not match its contract id.')
	}
	if (!/^sha256:[0-9a-f]{64}$/.test(input.exportDigest)) {
		throw new TypeError('Harness target route requires a complete lowercase SHA-256 export digest.')
	}
	if (
		typeof input.routeBindingRevision !== 'string' ||
		input.routeBindingRevision.length === 0 ||
		/\p{Cc}/u.test(input.routeBindingRevision)
	) {
		throw new TypeError('Harness target route revision must be non-empty.')
	}
	const target = Object.freeze({ kind: input.target.kind, id: input.target.id })
	const receipt = Object.freeze({
		schemaVersion: 1 as const,
		kind: 'harness_target_route' as const,
		target,
		bindingDigest: routeBindingDigest(input.routeBindingRevision, input.target),
	})
	const binding = Object.freeze({
		target: input.target,
		address: Object.freeze({ ...input.address }),
		exportDigest: input.exportDigest,
		routeBindingRevision: input.routeBindingRevision,
		visibility: input.visibility,
		receipt,
	})
	targetRouteBindings.add(binding)
	return binding
}

/** EventBridge-only implementation of the Harness nested-target dispatcher SPI. */
export function createEventBridgeHarnessTargetDispatcher(
	options: Readonly<{
		eventBridge: Pick<EventBridge, 'instanceId' | 'openStream'>
		sender: EBMessageSenderAddress
		bindings: readonly HarnessTargetRouteBinding[]
	}>,
): HarnessTargetDispatcher {
	const bindings = new WeakMap<object, HarnessTargetRouteBinding>()
	const persisted = new Map<string, HarnessTargetRouteBinding>()
	const addresses = new Set<string>()
	const logicalTargets = new Set<string>()
	for (const binding of options.bindings) {
		if (
			!targetRouteBindings.has(binding) ||
			binding.receipt.bindingDigest !== routeBindingDigest(binding.routeBindingRevision, binding.target) ||
			binding.receipt.target.kind !== binding.target.kind ||
			binding.receipt.target.id !== binding.target.id
		) {
			throw new TypeError('Harness target dispatcher requires an authentic finalized route binding.')
		}
		if (bindings.has(binding.target)) throw new TypeError('Harness target contract is bound more than once.')
		bindings.set(binding.target, binding)
		const addressKey = `${binding.address.serviceName}\u0000${binding.address.serviceVersion}\u0000${binding.address.serviceTarget}`
		const logicalKey = `${binding.target.kind}\u0000${binding.target.id}`
		if (addresses.has(addressKey) || logicalTargets.has(logicalKey)) {
			throw new TypeError('Harness target route address or logical target is bound more than once.')
		}
		addresses.add(addressKey)
		logicalTargets.add(logicalKey)
		const key = receiptKey(binding.receipt)
		if (persisted.has(key)) throw new TypeError('Harness target route receipt is ambiguous.')
		persisted.set(key, binding)
	}

	const assertTarget = (target: AnyHarnessTargetContract) => {
		const binding = typeof target === 'object' && target !== null ? bindings.get(target) : undefined
		if (!binding) throw new HandledError(StatusCode.NotFound, 'Harness target contract is not bound to this service.')
		return binding
	}

	return Object.freeze({
		assertTarget(target: AnyHarnessTargetContract) {
			return assertTarget(target).receipt
		},
		async open<Target extends AnyHarnessTargetContract>(request: HarnessTargetDispatchRequest<Target>) {
			const binding = assertTarget(request.target)
			return openBinding<Target>(options, binding, request.input, request.invocation, {})
		},
		async openPersisted(request: PersistedHarnessTargetDispatchRequest) {
			assertExactRouteReceipt(request.route)
			if (request.resume.runId !== request.invocation.invocationId) {
				throw new HandledError(StatusCode.Conflict, 'Persisted Harness target resume does not match its invocation.')
			}
			const binding = persisted.get(receiptKey(request.route))
			if (!binding || !sameReceipt(binding.receipt, request.route)) {
				throw new HandledError(StatusCode.Conflict, 'Persisted Harness target route no longer matches its binding.')
			}
			return openBinding(options, binding, null, request.invocation, Object.freeze({ resume: request.resume }))
		},
	}) as unknown as HarnessTargetDispatcher
}

async function openBinding<Target extends AnyHarnessTargetContract>(
	options: Readonly<{
		eventBridge: Pick<EventBridge, 'instanceId' | 'openStream'>
		sender: EBMessageSenderAddress
	}>,
	binding: HarnessTargetRouteBinding,
	input: HarnessTargetInput<Target> | JsonValue,
	invocation: HarnessTargetDispatchRequest<Target>['invocation'],
	parameter: object,
): Promise<ExactHarnessTargetDispatchStream<Target>> {
	assertNestedInvocation(invocation)
	if (invocation.signal.aborted) {
		throw new HandledError(StatusCode.RequestTimeout, 'Harness target dispatch was cancelled before transport.')
	}
	const ttl = invocation.deadline === undefined ? undefined : Math.ceil(invocation.deadline - Date.now())
	if (ttl !== undefined && ttl <= 0) {
		throw new HandledError(StatusCode.GatewayTimeout, 'Harness target dispatch deadline expired before transport.')
	}
	const dispatch = stripHostOwnedDispatch(invocation)
	const harness: HarnessTransportEnvelope = Object.freeze({
		contract: Object.freeze({ schemaVersion: 1 as const, exportDigest: binding.exportDigest }),
		dispatch,
	})
	const trace = invocation.trace
	let stream: HarnessTargetDispatchStream<unknown, unknown> | undefined
	let aborted: boolean = invocation.signal.aborted
	const abort = () => {
		aborted = true
		if (stream !== undefined) void stream.cancel('caller_cancelled').catch(() => undefined)
	}
	invocation.signal.addEventListener('abort', abort, { once: true })
	let handle: StreamHandle<HarnessTargetExecutionEvent<Target>, HarnessTargetExecutionTerminalOutcome<Target>>
	try {
		handle = await options.eventBridge.openStream<
			HarnessTargetExecutionEvent<Target>,
			HarnessTargetExecutionTerminalOutcome<Target>
		>(
			{
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				sender: options.sender,
				receiver: binding.address,
				...(invocation.identity?.principalId === undefined ? {} : { principalId: invocation.identity.principalId }),
				...(invocation.identity?.tenantId === undefined ? {} : { tenantId: invocation.identity.tenantId }),
				...(trace === undefined ? {} : { otp: JSON.stringify(trace), traceId: trace.traceparent.slice(3, 35) }),
				payload: { frameType: 'open', payload: input, parameter },
				harness,
			},
			ttl,
		)
	} catch (error) {
		invocation.signal.removeEventListener('abort', abort)
		throw error
	}
	stream = adaptHarnessTransportStream<
		HarnessTargetExecutionEvent<Target>,
		HarnessTargetExecutionTerminalOutcome<Target>
	>(handle, invocation.invocationId, {
		parentRunId: invocation.parentRunId,
		parentInvocationId: invocation.invocationId,
	})
	if (aborted) {
		await stream.cancel('caller_cancelled').catch(() => undefined)
		invocation.signal.removeEventListener('abort', abort)
		throw new HandledError(StatusCode.RequestTimeout, 'Harness target dispatch was cancelled during transport setup.')
	}
	void stream.result.finally(() => invocation.signal.removeEventListener('abort', abort)).catch(() => undefined)
	return stream as ExactHarnessTargetDispatchStream<Target>
}

function stripHostOwnedDispatch(
	invocation: HarnessTargetDispatchRequest<AnyHarnessTargetContract>['invocation'],
): HarnessDispatchContext {
	return Object.freeze({
		sessionId: invocation.sessionId,
		invocationId: invocation.invocationId,
		rootRunId: invocation.rootRunId,
		parentRunId: invocation.parentRunId,
		...(invocation.parentAgentId === undefined
			? { parentWorkflowId: invocation.parentWorkflowId }
			: { parentAgentId: invocation.parentAgentId }),
		depth: invocation.depth,
		remainingDepth: invocation.remainingDepth,
		...(invocation.deadline === undefined ? {} : { deadline: invocation.deadline }),
		...(invocation.idempotencyKey === undefined ? {} : { idempotencyKey: invocation.idempotencyKey }),
	}) as HarnessDispatchContext
}

function assertNestedInvocation(
	invocation: HarnessTargetDispatchRequest<AnyHarnessTargetContract>['invocation'],
): void {
	const hasAgent = invocation.parentAgentId !== undefined
	const hasWorkflow = invocation.parentWorkflowId !== undefined
	if (
		hasAgent === hasWorkflow ||
		(hasAgent && (typeof invocation.parentAgentId !== 'string' || invocation.parentAgentId.trim() === '')) ||
		(hasWorkflow && (typeof invocation.parentWorkflowId !== 'string' || invocation.parentWorkflowId.trim() === ''))
	) {
		throw new HandledError(
			StatusCode.BadRequest,
			'Harness nested dispatch requires exactly one parent target identity.',
		)
	}
	for (const identifier of [
		invocation.sessionId,
		invocation.invocationId,
		invocation.rootRunId,
		invocation.parentRunId,
	]) {
		if (typeof identifier !== 'string' || identifier.trim() === '') {
			throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch identity is invalid.')
		}
	}
	if (
		!Number.isSafeInteger(invocation.depth) ||
		invocation.depth < 1 ||
		!Number.isSafeInteger(invocation.remainingDepth) ||
		invocation.remainingDepth < 0
	) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch depth is invalid.')
	}
	if (invocation.deadline !== undefined && !Number.isFinite(invocation.deadline)) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch deadline is invalid.')
	}
	if (
		invocation.idempotencyKey !== undefined &&
		(typeof invocation.idempotencyKey !== 'string' || !/^[A-Za-z0-9_.:-]{1,120}$/.test(invocation.idempotencyKey))
	) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch idempotency key is invalid.')
	}
	assertTrustedIdentity(invocation.identity)
	assertTrustedTrace(invocation.trace)
}

function assertTrustedIdentity(value: unknown): void {
	if (value === undefined) return
	if (!plainDataFields(value, [], ['tenantId', 'principalId'])) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch identity is invalid.')
	}
	for (const field of ['tenantId', 'principalId']) {
		const entry = value[field]
		if (entry !== undefined && (typeof entry !== 'string' || entry.trim() === '' || entry.length > 256)) {
			throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch identity is invalid.')
		}
	}
}

function assertTrustedTrace(value: unknown): void {
	if (value === undefined) return
	if (!plainDataFields(value, ['traceparent'], ['tracestate'])) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch trace context is invalid.')
	}
	const match =
		typeof value.traceparent === 'string'
			? /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/.exec(value.traceparent)
			: null
	if (
		match === null ||
		match[1] === 'ff' ||
		match[2] === '00000000000000000000000000000000' ||
		match[3] === '0000000000000000' ||
		(value.tracestate !== undefined && !validTraceState(value.tracestate))
	) {
		throw new HandledError(StatusCode.BadRequest, 'Harness nested dispatch trace context is invalid.')
	}
}

function validTraceState(value: unknown): value is string {
	if (typeof value !== 'string' || value.length === 0 || value.length > 512 || /[\r\n]/.test(value)) return false
	const members = value.split(',')
	if (members.length > 32) return false
	const keys = new Set<string>()
	for (const rawMember of members) {
		const member = rawMember.trim()
		const equals = member.indexOf('=')
		if (equals <= 0 || equals !== member.lastIndexOf('=')) return false
		const key = member.slice(0, equals).trim()
		const entry = member.slice(equals + 1).trim()
		const keyValid =
			/^[a-z][a-z0-9_\-*/]{0,255}$/.test(key) || /^[a-z0-9][a-z0-9_\-*/]{0,240}@[a-z][a-z0-9_\-*/]{0,13}$/.test(key)
		if (
			!keyValid ||
			keys.has(key) ||
			entry.length === 0 ||
			entry.length > 256 ||
			entry.startsWith(' ') ||
			entry.endsWith(' ') ||
			!/^[\x20-\x2b\x2d-\x3c\x3e-\x7e]+$/.test(entry)
		)
			return false
		keys.add(key)
	}
	return true
}

/** Adapt EventBridge frames into one replayable Harness stream with an authoritative result. */
export function adaptHarnessTransportStream<
	Event extends ExecutionEvent,
	Outcome extends ExecutionTerminalOutcome<unknown, unknown>,
>(
	handle: StreamHandle<Event, Outcome>,
	expectedRunId?: string,
	directCorrelation: 'root' | Readonly<{ parentRunId: string; parentInvocationId: string }> = 'root',
): HarnessTargetDispatchStream<unknown, unknown> & AsyncIterable<Event> & { readonly result: Promise<Outcome> } {
	const events: Event[] = []
	const readers: Array<() => void> = []
	let done = false
	let failure: unknown
	let consumed = false
	let resolveResult!: (outcome: Outcome) => void
	let rejectResult!: (error: unknown) => void
	const result = new Promise<Outcome>((resolve, reject) => {
		resolveResult = resolve
		rejectResult = reject
	})
	void result.catch(() => undefined)

	const wake = () => {
		for (const reader of readers.splice(0)) reader()
	}
	const fail = (error: unknown) => {
		if (done) return
		failure = error
		done = true
		rejectResult(error)
		wake()
	}
	const push = (event: Event) => {
		events.push(event)
		wake()
	}

	void (async () => {
		let candidate: Extract<Event, { type: 'run.finished' }> | undefined
		let directRunId = expectedRunId
		let sawDirectStart = false
		let complete: Outcome | undefined
		let sawComplete = false
		try {
			for await (const frame of sanitizedTransportFrames(handle)) {
				if (sawComplete) throw protocolError('Harness stream emitted a frame after transport completion.')
				if (candidate !== undefined && frame.payload.frameType !== 'complete') {
					throw protocolError('Harness stream emitted a frame after its direct terminal event.')
				}
				switch (frame.payload.frameType) {
					case 'start':
					case 'heartbeat':
						break
					case 'chunk': {
						const event = frame.payload.chunk
						if (!event) throw protocolError('Harness stream returned an empty event frame.')
						const hasParentRun = event.parentRunId !== undefined
						const hasParentInvocation = event.parentInvocationId !== undefined
						if (
							hasParentRun !== hasParentInvocation ||
							(hasParentRun &&
								(typeof event.parentRunId !== 'string' ||
									event.parentRunId.trim() === '' ||
									typeof event.parentInvocationId !== 'string' ||
									event.parentInvocationId.trim() === ''))
						) {
							throw protocolError('Harness stream event has invalid parent correlation.')
						}
						const claimsKnownDirectRun =
							event.runId === expectedRunId || (directRunId !== undefined && event.runId === directRunId)
						if (
							claimsKnownDirectRun &&
							(directCorrelation === 'root'
								? hasParentRun
								: !hasParentRun ||
									event.parentRunId !== directCorrelation.parentRunId ||
									event.parentInvocationId !== directCorrelation.parentInvocationId)
						) {
							throw protocolError('Harness stream direct event has invalid parent correlation.')
						}
						const direct =
							directCorrelation === 'root'
								? !hasParentRun && (directRunId === undefined || event.runId === directRunId)
								: hasParentRun &&
									event.runId === expectedRunId &&
									event.parentRunId === directCorrelation.parentRunId &&
									event.parentInvocationId === directCorrelation.parentInvocationId
						const directStart = event.type === 'run.started' && direct
						if (directStart) {
							if (sawDirectStart) throw protocolError('Harness stream contains duplicate direct run starts.')
							if (directRunId !== undefined && event.runId !== directRunId) {
								throw protocolError('Harness stream contains another direct root run.')
							}
							directRunId = event.runId
							sawDirectStart = true
						}
						const directFinish = event.type === 'run.finished' && direct
						if (directFinish) {
							if (candidate !== undefined) throw protocolError('Harness stream contains duplicate terminal events.')
							if (directRunId !== undefined && event.runId !== directRunId) {
								throw protocolError('Harness stream terminal belongs to another root run.')
							}
							directRunId = event.runId
							candidate = event as Extract<Event, { type: 'run.finished' }>
						} else {
							push(event)
						}
						break
					}
					case 'complete':
						if (frame.payload.final === undefined)
							throw protocolError('Harness stream completed without a final outcome.')
						complete = frame.payload.final
						sawComplete = true
						break
					case 'error': {
						const error = frame.payload.error
						if (!isHandledStreamError(error)) {
							throw new HandledError(StatusCode.InternalServerError, 'Harness EventBridge stream failed.')
						}
						throw new HandledError(error.status, error.message, error?.data)
					}
					case 'cancel':
						throw new HandledError(StatusCode.RequestTimeout, frame.payload.reason ?? 'Harness stream was cancelled.')
				}
			}
			if (!sawDirectStart || !candidate || !complete || !sawComplete)
				throw protocolError('Harness stream ended without its terminal outcome.')
			if (complete.runId !== directRunId)
				throw protocolError('Harness stream completion belongs to another direct run.')
			const canonicalOutcome = canonicalHarnessJson(complete)
			if (canonicalHarnessJson(candidate.outcome) !== canonicalOutcome) {
				throw protocolError('Harness stream terminal event does not match transport completion.')
			}
			const authoritative = deepFreeze(JSON.parse(canonicalOutcome)) as Outcome
			const terminal = deepFreeze({
				...JSON.parse(canonicalHarnessJson(candidate)),
				outcome: authoritative,
			}) as Event
			push(terminal)
			done = true
			resolveResult(authoritative)
			wake()
		} catch (error) {
			fail(error)
		}
	})()

	return Object.freeze({
		result,
		cancel: (reason?: string) => handle.cancel(reason),
		[Symbol.asyncIterator]() {
			if (consumed) throw new TypeError('A Harness execution stream can only be consumed once.')
			consumed = true
			return (async function* () {
				while (true) {
					if (events.length > 0) yield events.shift() as Event
					else if (failure !== undefined) throw failure
					else if (done) return
					else await new Promise<void>(resolve => readers.push(resolve))
				}
			})()
		},
	}) as HarnessTargetDispatchStream<unknown, unknown> & AsyncIterable<Event> & { readonly result: Promise<Outcome> }
}

async function* sanitizedTransportFrames<Chunk, Final>(handle: StreamHandle<Chunk, Final>) {
	try {
		for await (const frame of handle) yield frame
	} catch {
		throw new HandledError(StatusCode.InternalServerError, 'Harness EventBridge stream failed.')
	}
}

function isHandledStreamError(value: unknown): value is Readonly<{
	status: StatusCode
	message: string
	isHandledError: true
	data?: unknown
	traceId?: string
}> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) return false
	const required = ['status', 'message', 'isHandledError']
	const allowed = new Set([...required, 'data', 'traceId'])
	const keys = Reflect.ownKeys(value)
	if (required.some(key => !Object.hasOwn(value, key))) return false
	if (
		keys.some(key => {
			if (typeof key !== 'string' || !allowed.has(key)) return true
			const descriptor = Object.getOwnPropertyDescriptor(value, key)
			return descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')
		})
	)
		return false
	const error = value as Record<string, unknown>
	return (
		error.isHandledError === true &&
		typeof error.status === 'number' &&
		statusCodeValues.has(error.status) &&
		typeof error.message === 'string' &&
		(error.traceId === undefined || typeof error.traceId === 'string')
	)
}

const statusCodeValues = new Set(
	Object.values(StatusCode).filter((value): value is number => typeof value === 'number'),
)

function deepFreeze<Value>(value: Value): Value {
	if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value
	for (const child of Object.values(value as object)) deepFreeze(child)
	return Object.freeze(value)
}

function protocolError(message: string): HandledError {
	return new HandledError(StatusCode.InternalServerError, message)
}

function receiptKey(receipt: HarnessTargetRouteReceiptV1): string {
	return `${receipt.target.kind}\u0000${receipt.target.id}\u0000${receipt.bindingDigest}`
}

function sameReceipt(left: HarnessTargetRouteReceiptV1, right: HarnessTargetRouteReceiptV1): boolean {
	return canonicalHarnessJson(left) === canonicalHarnessJson(right)
}

function assertExactRouteReceipt(receipt: HarnessTargetRouteReceiptV1): void {
	if (
		!plainDataObject(receipt, ['schemaVersion', 'kind', 'target', 'bindingDigest']) ||
		receipt.schemaVersion !== 1 ||
		receipt.kind !== 'harness_target_route' ||
		!plainDataObject(receipt.target, ['kind', 'id']) ||
		(receipt.target.kind !== 'agent' && receipt.target.kind !== 'workflow') ||
		typeof receipt.target.id !== 'string' ||
		receipt.target.id.trim() === '' ||
		typeof receipt.bindingDigest !== 'string' ||
		!/^sha256:[0-9a-f]{64}$/.test(receipt.bindingDigest)
	) {
		throw new HandledError(StatusCode.Conflict, 'Persisted Harness target route receipt is invalid.')
	}
}

function plainDataObject(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) return false
	const own = Reflect.ownKeys(value)
	if (own.length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) return false
	if (own.some(key => typeof key !== 'string' || !keys.includes(key))) return false
	return own.every(key => {
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
	})
}

function plainDataFields(
	value: unknown,
	required: readonly string[],
	optional: readonly string[],
): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) return false
	const allowed = new Set([...required, ...optional])
	const keys = Reflect.ownKeys(value)
	if (required.some(key => !Object.hasOwn(value, key))) return false
	return keys.every(key => {
		if (typeof key !== 'string' || !allowed.has(key)) return false
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
	})
}

function routeBindingDigest(revision: string, target: AnyHarnessTargetContract): string {
	return `sha256:${createHash('sha256')
		.update(
			canonicalHarnessJson([
				'harness.target-route-binding.v1',
				'purista.eventbridge',
				revision,
				target.kind,
				target.id,
			]),
		)
		.digest('hex')}`
}
