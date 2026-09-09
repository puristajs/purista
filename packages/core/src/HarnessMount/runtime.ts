import { randomUUID } from 'node:crypto'

import type {
	AnyHarnessTargetContract,
	ExecutionEvent,
	ExecutionTerminalOutcome,
	HarnessInterrupt,
	Logger as HarnessLogger,
	HarnessTraceContext,
	JsonValue,
} from '@purista/harness'
import { createTelemetryShim, isHarnessError, normalizeHarnessTraceContext } from '@purista/harness'
import {
	type HostedDispatchedTargetRequest,
	type HostedHarnessInstance,
	type HostedHarnessInstanceConfig,
	type HostedTargetRequest,
	type HostOwnerToken,
	instantiateHostedHarness,
	visitHostedHarnessTargets,
} from '@purista/harness/integrator'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import { createErrorResponse } from '../core/helper/createErrorResponse.impl.js'
import { createSuccessResponse } from '../core/helper/createSuccessResponse.impl.js'
import type { Command, HarnessTransportEnvelope } from '../core/types/commandType/Command.js'
import type { EBMessage } from '../core/types/EBMessage.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { Logger } from '../core/types/Logger.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { isStreamControl } from '../core/types/stream/isStreamControl.impl.js'
import { isStreamOpenRequest } from '../core/types/stream/isStreamOpenRequest.impl.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamMessage } from '../core/types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import { createEventBridgeHarnessTargetDispatcher } from './dispatcher.js'
import type { HarnessInvokeParameter } from './invokeTypes.js'
import { canonicalHarnessJson } from './remoteTargetContract.js'
import type {
	HarnessBusinessGuardContext,
	HarnessMount,
	HarnessTargetJsonSchema,
	MountedHarnessTargetProjection,
	PuristaHostContextRequest,
	PuristaHostInvocation,
	PuristaToolContext,
} from './types.js'

type Projection = MountedHarnessTargetProjection<AnyHarnessTargetContract>
type HostedRuntime = HostedHarnessInstance<any, any, PuristaHostInvocation>
type Terminal = ExecutionTerminalOutcome<JsonValue, HarnessInterrupt>
type Event = ExecutionEvent<JsonValue>
type TargetPolicy = Readonly<{
	beforeGuards?: Readonly<
		Record<
			string,
			(context: HarnessBusinessGuardContext<Record<string, unknown>>, input: unknown) => void | Promise<void>
		>
	>
	afterGuards?: Readonly<
		Record<
			string,
			(context: HarnessBusinessGuardContext<Record<string, unknown>>, outcome: Terminal) => void | Promise<void>
		>
	>
}>
type ActiveInvocation = {
	message: Command | StreamOpenRequest
	controller: AbortController
	completed: Promise<void>
	finish: () => void
	deadline?: number
	cancel?: (reason?: string) => Promise<void>
	timer?: ReturnType<typeof setTimeout>
	dispose?: () => void
}
type Registration = Readonly<{ kind: 'command' | 'stream'; projection: Projection }>

/** Service-owned lifecycle and receiving boundary for one hosted Harness graph. */
export class HarnessMountRuntime {
	private runtime?: HostedRuntime
	private readonly registrations: Registration[] = []
	private readonly active = new Map<string, ActiveInvocation>()
	private startPromise?: Promise<void>
	private shutdownPromise?: Promise<void>
	private preflightComplete = false
	private accepting = false
	private closing = false

	constructor(
		private readonly options: Readonly<{
			serviceName: string
			serviceVersion: string
			eventBridge: EventBridge
			logger: Logger
			mount: HarnessMount
			config: HostedHarnessInstanceConfig<HarnessMount['definition']['requirements']>
			resources: Record<string, unknown>
			createHostContext: (request: PuristaHostContextRequest) => PuristaToolContext
			hostOwner: HostOwnerToken<PuristaToolContext>
			occupied?: Readonly<{
				commands: readonly string[]
				streams: readonly string[]
				events?: Readonly<Record<string, HarnessTargetJsonSchema>>
			}>
		}>,
	) {}

	private get serviceName() {
		return this.options.serviceName
	}
	private get serviceVersion() {
		return this.options.serviceVersion
	}
	private get eventBridge() {
		return this.options.eventBridge
	}
	private get logger() {
		return this.options.logger
	}
	private get mount() {
		return this.options.mount
	}
	private get resources() {
		return this.options.resources
	}

	/** Validate the complete stored projection set without creating runtime resources. */
	preflight(): void {
		if (this.preflightComplete) return
		if (!Object.isFrozen(this.mount.projections) || this.mount.projections.length === 0) {
			throw new TypeError('A mounted Harness requires a complete frozen target projection set.')
		}
		const seen = new Set<AnyHarnessTargetContract>()
		const addresses = new Set<string>()
		const commandAddresses = new Set(this.options.occupied?.commands ?? [])
		const streamAddresses = new Set(this.options.occupied?.streams ?? [])
		const events = new Map(
			Object.entries(this.options.occupied?.events ?? {}).map(([name, schema]) => [name, canonicalHarnessJson(schema)]),
		)
		visitHostedHarnessTargets(this.mount.definition, ({ target, visibility }) => {
			const matches = this.mount.projections.filter(row => row.target === target)
			const projection = matches[0]
			if (matches.length !== 1 || !projection || projection.visibility !== visibility || seen.has(target)) {
				throw new TypeError('Mounted Harness projections do not exactly cover the authentic target graph.')
			}
			seen.add(target)
			const { address, routeBinding, targetExport } = projection
			if (
				!Object.isFrozen(projection) ||
				!Object.isFrozen(projection.standardSchemas) ||
				!ownedFrozen(projection.jsonSchemas) ||
				!ownedFrozen(targetExport) ||
				!ownedFrozen(projection.policy) ||
				!ownedFrozen(routeBinding.receipt) ||
				(projection.completedEvent !== undefined &&
					(!Object.isFrozen(projection.completedEvent) ||
						!Object.isFrozen(projection.completedEvent.schema) ||
						!ownedFrozen(projection.completedEvent.jsonSchema))) ||
				!Object.isFrozen(address) ||
				!Object.isFrozen(routeBinding) ||
				address.serviceName !== this.serviceName ||
				address.serviceVersion !== this.serviceVersion ||
				address.serviceTarget !== target.id ||
				addresses.has(target.id) ||
				streamAddresses.has(target.id) ||
				(visibility === 'root' && commandAddresses.has(target.id)) ||
				projection.standardSchemas.input !== target.input ||
				projection.standardSchemas.output !== target.output ||
				routeBinding.target !== target ||
				routeBinding.visibility !== visibility ||
				canonicalHarnessJson(routeBinding.address) !== canonicalHarnessJson(address) ||
				routeBinding.exportDigest !== projection.exportDigest ||
				routeBinding.routeBindingRevision !== projection.routeBindingRevision ||
				!/^sha256:[0-9a-f]{64}$/.test(projection.exportDigest) ||
				!/^sha256:[0-9a-f]{64}$/.test(projection.routeBindingRevision) ||
				!nonempty(projection.mountRevision) ||
				targetExport.targetName !== target.id ||
				targetExport.kind !== target.kind ||
				routeBinding.receipt.target.id !== target.id ||
				routeBinding.receipt.target.kind !== target.kind
			) {
				throw new TypeError('Mounted Harness target projection has an invalid or colliding route.')
			}
			addresses.add(target.id)
			const policy = this.policyFor(projection)
			if (visibility === 'dependency') {
				if (projection.policy !== null || projection.completedEvent !== undefined || targetExport.queue !== undefined) {
					throw new TypeError('A dependency target cannot carry public root policy.')
				}
			} else {
				const descriptor = projection.policy
				if (
					!descriptor ||
					!Object.isFrozen(descriptor) ||
					canonicalHarnessJson(descriptor.beforeGuardKeys) !==
						canonicalHarnessJson(Object.keys(policy?.beforeGuards ?? {}).sort()) ||
					canonicalHarnessJson(descriptor.afterGuardKeys) !==
						canonicalHarnessJson(Object.keys(policy?.afterGuards ?? {}).sort()) ||
					descriptor.successEvent !== (projection.completedEvent?.name ?? null) ||
					descriptor.queueName !== (targetExport.queue?.name ?? null) ||
					(descriptor.durableResume === 'stored-run-owner' &&
						(!target.interrupts.includes('tool-approval') || descriptor.beforeGuardKeys.length === 0))
				) {
					throw new TypeError('Mounted Harness root policy does not match its projection.')
				}
			}
			if (projection.completedEvent) {
				const schema = canonicalHarnessJson(projection.completedEvent.jsonSchema)
				const previous = events.get(projection.completedEvent.name)
				if (previous !== undefined && previous !== schema)
					throw new TypeError('Mounted Harness completed-event schema collision.')
				events.set(projection.completedEvent.name, schema)
			}
		})
		if (seen.size !== this.mount.projections.length)
			throw new TypeError('Mounted Harness projection set contains unknown targets.')
		this.preflightComplete = true
	}

	/** Instantiate once and register roots and dependency routes only after complete preflight. */
	start(): Promise<void> {
		if (this.startPromise) return this.startPromise
		if (this.closing) return Promise.reject(new Error('Harness mount is closed.'))
		this.startPromise = this.startOnce()
		return this.startPromise
	}

	private async startOnce(): Promise<void> {
		try {
			this.preflight()
			const targetDispatcher = createEventBridgeHarnessTargetDispatcher({
				eventBridge: this.eventBridge,
				sender: {
					serviceName: this.serviceName,
					serviceVersion: this.serviceVersion,
					serviceTarget: 'harness',
					instanceId: this.eventBridge.instanceId,
				},
				bindings: this.mount.projections.map(row => row.routeBinding),
			})
			this.runtime = await instantiateHostedHarness(this.mount.definition, this.options.config, {
				hostOwner: this.options.hostOwner,
				targetDispatcher,
				projectIdentity: (invocation: PuristaHostInvocation) => invocation.identity,
				projectTraceContext: (invocation: PuristaHostInvocation) => invocation.trace,
				createHostContext: this.options.createHostContext,
				logger: hostedLogger(this.logger),
				telemetry: createTelemetryShim(),
			})
			if (this.closing) throw new Error('Harness mount closed during startup.')
			for (const projection of this.mount.projections) {
				if (projection.visibility === 'root') {
					await this.eventBridge.registerCommand(
						projection.address,
						message => this.execute(projection, message),
						{ expose: {} },
						{ durable: false, autoacknowledge: true, shared: true },
					)
					this.registrations.push({ kind: 'command', projection })
				}
				await this.eventBridge.registerStream(
					projection.address,
					message => this.executeStream(projection, message),
					{ expose: {} },
					{ durable: false, autoacknowledge: true, shared: true },
				)
				this.registrations.push({ kind: 'stream', projection })
				if (this.closing) throw new Error('Harness mount closed during startup.')
			}
			this.accepting = true
		} catch (error) {
			this.closing = true
			try {
				await this.cleanup()
			} catch {
				try {
					this.logger.error('Harness startup rollback failed.')
				} catch {
					/* Preserve the original startup failure. */
				}
			}
			throw error
		}
	}

	/** Stop ingress, cancel active work, remove routes in reverse order, then close once. */
	shutdown(): Promise<void> {
		if (this.shutdownPromise) return this.shutdownPromise
		this.closing = true
		this.accepting = false
		this.shutdownPromise = (async () => {
			await this.startPromise?.catch(() => undefined)
			await this.cleanup()
		})()
		return this.shutdownPromise
	}

	private async cleanup(): Promise<void> {
		this.accepting = false
		const errors: unknown[] = []
		const active = [...this.active.values()]
		for (const invocation of active) {
			invocation.controller.abort(new Error('service_shutdown'))
			try {
				await invocation.cancel?.('service_shutdown')
			} catch (error) {
				errors.push(error)
			}
		}
		for (const registration of this.registrations.splice(0).reverse()) {
			try {
				if (registration.kind === 'command') await this.eventBridge.unregisterCommand(registration.projection.address)
				else await this.eventBridge.unregisterStream(registration.projection.address)
			} catch (error) {
				errors.push(error)
			}
		}
		const runtime = this.runtime
		this.runtime = undefined
		if (runtime) {
			try {
				await runtime.close()
			} catch (error) {
				errors.push(error)
			}
		}
		await Promise.all(active.map(invocation => invocation.completed))
		if (errors.length) throw new AggregateError(errors, 'Harness mount shutdown failed.')
	}

	private policyFor(projection: Projection): TargetPolicy | undefined {
		if (projection.visibility !== 'root') return undefined
		return (
			projection.target.kind === 'agent'
				? this.mount.policy?.targets?.agents?.[projection.target.id]
				: this.mount.policy?.targets?.workflows?.[projection.target.id]
		) as TargetPolicy | undefined
	}

	private guardContext(
		projection: Projection,
		host: PuristaHostInvocation,
	): HarnessBusinessGuardContext<Record<string, unknown>> {
		return Object.freeze({
			kind: projection.target.kind,
			target: projection.target.id,
			message: host.message,
			identity: host.identity,
			resources: this.resources,
			logger: this.logger,
		})
	}

	private receive(projection: Projection, message: Command | StreamOpenRequest, aggregate: boolean) {
		if (message.messageType !== (aggregate ? EBMessageType.Command : EBMessageType.Stream))
			throw badRequest('Harness invocation message kind does not match this receiver.')
		if (!this.accepting || !this.runtime)
			throw new HandledError(StatusCode.ServiceUnavailable, 'Harness mount is not accepting invocations.')
		const envelope = parseEnvelope(message.harness)
		if (
			message.receiver.serviceName !== projection.address.serviceName ||
			message.receiver.serviceVersion !== projection.address.serviceVersion ||
			message.receiver.serviceTarget !== projection.address.serviceTarget
		) {
			throw new HandledError(StatusCode.NotFound, 'Harness target address does not match this receiver.')
		}
		if (envelope.contract.exportDigest !== projection.exportDigest)
			throw new HandledError(StatusCode.Conflict, 'Harness target export digest does not match.', {
				code: 'harness_contract_mismatch',
			})
		if (envelope.root === undefined && aggregate)
			throw badRequest('Aggregate Harness receivers accept public root invocations only.')
		if (envelope.root !== undefined && projection.visibility !== 'root')
			throw new HandledError(StatusCode.Forbidden, 'Harness dependency targets require nested dispatch.')
		const parameter = parseParameter(message.payload.parameter, envelope.root === undefined)
		const host = createHostInvocation(message, parameter.idempotencyKey ?? envelope.dispatch?.idempotencyKey)
		try {
			canonicalHarnessJson(message.payload.payload)
		} catch {
			throw badRequest('Harness target wire input must be JSON.')
		}
		return { envelope, parameter, host, runtime: this.runtime }
	}

	private activate(message: Command | StreamOpenRequest, timeoutMs?: number, deadline?: number): ActiveInvocation {
		if (this.active.has(message.correlationId))
			throw new HandledError(StatusCode.Conflict, 'Harness transport invocation is already active.')
		const controller = new AbortController()
		let finish!: () => void
		const completed = new Promise<void>(resolve => {
			finish = resolve
		})
		const invocation: ActiveInvocation = { message, controller, completed, finish }
		const effectiveDeadline = Math.min(
			deadline ?? Number.POSITIVE_INFINITY,
			timeoutMs === undefined || timeoutMs === 0 ? Number.POSITIVE_INFINITY : Date.now() + timeoutMs,
		)
		if (effectiveDeadline <= Date.now())
			throw new HandledError(StatusCode.GatewayTimeout, 'Harness invocation deadline expired.')
		if (Number.isFinite(effectiveDeadline)) {
			invocation.deadline = effectiveDeadline
			const expire = () => {
				const remaining = effectiveDeadline - Date.now()
				if (remaining <= 0) controller.abort(new Error('deadline_exceeded'))
				else {
					invocation.timer = setTimeout(expire, Math.min(remaining, 2_147_483_647))
					invocation.timer.unref?.()
				}
			}
			expire()
		}
		this.active.set(message.correlationId, invocation)
		return invocation
	}

	private deactivate(invocation: ActiveInvocation): void {
		if (invocation.timer) clearTimeout(invocation.timer)
		invocation.dispose?.()
		invocation.finish()
		if (this.active.get(invocation.message.correlationId) === invocation)
			this.active.delete(invocation.message.correlationId)
	}

	private async rootRequest(
		projection: Projection,
		message: Command | StreamOpenRequest,
		received: ReturnType<HarnessMountRuntime['receive']>,
		active: ActiveInvocation,
	): Promise<HostedTargetRequest<AnyHarnessTargetContract, PuristaHostInvocation>> {
		const { envelope, parameter, host } = received
		const sessionId = envelope.root?.sessionId
		if (!sessionId) throw badRequest('Public Harness invocation requires a session.')
		const context = this.guardContext(projection, host)
		const authorize: HostedTargetRequest<AnyHarnessTargetContract, PuristaHostInvocation>['authorize'] =
			async request => {
				for (const key of projection.policy?.beforeGuardKeys ?? [])
					await callBusinessGuard(() => this.policyFor(projection)?.beforeGuards?.[key]?.(context, request.input))
				assertActive(active)
			}
		const { resume, ...ordinary } = parameter
		const options = { ...ordinary, sessionId, signal: active.controller.signal }
		const wireInput = message.payload.payload as JsonValue
		if (resume !== undefined) {
			const { idempotencyKey: _idempotencyKey, ...resumeOptions } = options
			return {
				delivery: 'resume',
				target: projection.target,
				wireInput,
				invokeOptions: {
					...resumeOptions,
					resume,
					...(projection.policy?.durableResume === 'stored-run-owner'
						? { resumeIdentity: 'stored-run-owner' as const }
						: {}),
				},
				hostInvocation: host,
				authorize,
			}
		}
		const input = await awaitActive(validatedInput(projection, wireInput), active)
		assertActive(active)
		return {
			delivery: 'fresh',
			target: projection.target,
			wireInput,
			input,
			invokeOptions: options,
			hostInvocation: host,
			authorize,
		}
	}

	private async execute(projection: Projection, message: Command) {
		let active: ActiveInvocation | undefined
		try {
			const received = this.receive(projection, message, true)
			active = this.activate(message, received.parameter.timeoutMs)
			const request = await this.rootRequest(projection, message, received, active)
			const outcome = freezeOutcome(
				await awaitActive(received.runtime.runHosted(request), active),
				received.parameter.resume?.runId ?? received.parameter.durable?.runId,
			)
			assertActive(active)
			if (outcome.status === 'failed' || outcome.status === 'cancelled') throw outcomeError(outcome)
			await this.completeRoot(projection, received.host, outcome, active)
			return createSuccessResponse(
				this.eventBridge.instanceId,
				message,
				Object.freeze({ sessionId: received.envelope.root?.sessionId, outcome }),
			)
		} catch (error) {
			const handled = invocationError(error, active)
			return createErrorResponse(this.eventBridge.instanceId, message, handled.errorCode, handled)
		} finally {
			if (active) this.deactivate(active)
		}
	}

	private async executeStream(projection: Projection, message: StreamMessage): Promise<void> {
		if (message.messageType !== EBMessageType.Stream)
			throw badRequest('Harness stream receivers require stream messages.')
		if (isStreamControl(message)) {
			const active = this.active.get(message.correlationId)
			if (active && sameCaller(active.message, message) && message.receiver.serviceTarget === projection.target.id) {
				active.controller.abort(new Error('consumer_cancelled'))
				await active.cancel?.('consumer_cancelled')
			}
			return
		}
		if (!isStreamOpenRequest(message)) return
		let active: ActiveInvocation | undefined
		let sequence = 0
		let started = false
		let terminalPublished = false
		let directStart: Event | undefined
		let candidate: Extract<Event, { type: 'run.finished' }> | undefined
		let dispatch: HarnessTransportEnvelope['dispatch']
		try {
			const received = this.receive(projection, message, false)
			dispatch = received.envelope.dispatch
			active = this.activate(message, received.parameter.timeoutMs, dispatch?.deadline)
			let stream: AsyncIterable<Event> & { result: Promise<Terminal>; cancel(reason?: string): Promise<void> }
			if (dispatch) {
				const invocation = Object.freeze({ ...dispatch, signal: active.controller.signal })
				const base = {
					target: projection.target,
					wireInput: message.payload.payload as JsonValue,
					invocation,
					hostInvocation: received.host,
				}
				const resume = received.parameter.resume
				const request: HostedDispatchedTargetRequest<AnyHarnessTargetContract, PuristaHostInvocation> =
					resume === undefined
						? {
								...base,
								delivery: 'fresh',
								input: await awaitActive(validatedInput(projection, base.wireInput), active),
							}
						: { ...base, delivery: 'resume', resume }
				assertActive(active)
				stream = await awaitActive(received.runtime.streamDispatched(request), active)
			} else
				stream = await awaitActive(
					received.runtime.streamHosted(await this.rootRequest(projection, message, received, active)),
					active,
				)
			void stream.result.catch(() => undefined)
			let cancellation: Promise<void> | undefined
			active.cancel = reason => (cancellation ??= Promise.resolve().then(() => stream.cancel(reason)))
			const cancel = () => {
				void active?.cancel?.('receiver_cancelled').catch(() => undefined)
			}
			active.controller.signal.addEventListener('abort', cancel, { once: true })
			const signal = active.controller.signal
			active.dispose = () => signal.removeEventListener('abort', cancel)
			if (active.controller.signal.aborted) cancel()
			const expectedRunId =
				dispatch?.invocationId ?? received.parameter.resume?.runId ?? received.parameter.durable?.runId
			for await (const event of observeStream(stream, active)) {
				if (candidate) throw protocolError('Harness stream emitted an event after its direct terminal.')
				assertEventCorrelation(event, dispatch, directStart?.runId ?? expectedRunId)
				const direct = isDirectEvent(event, dispatch)
				if (direct) {
					if (event.type === 'run.started') {
						if (directStart || (expectedRunId !== undefined && event.runId !== expectedRunId))
							throw protocolError('Harness stream has an invalid direct start.')
						directStart = event
						await this.publishStreamFrame(message, projection.target.id, { frameType: 'start', sequence: sequence++ })
						started = true
					} else if (!directStart) throw protocolError('Harness stream emitted a direct event before its start.')
					if (event.runId !== directStart?.runId) throw protocolError('Harness stream emitted another direct run.')
					if (event.type === 'run.finished') {
						candidate = event
						continue
					}
				}
				if (!directStart) throw protocolError('Harness stream emitted a descendant before its direct start.')
				await this.publishStreamFrame(message, projection.target.id, {
					frameType: 'chunk',
					sequence: sequence++,
					chunk: sanitizeExecutionEvent(event),
				})
			}
			if (!directStart || !candidate) throw protocolError('Harness stream ended without its direct terminal.')
			const authoritative = freezeOutcome(await awaitActive(stream.result, active), directStart.runId)
			if (canonicalHarnessJson(candidate.outcome) !== canonicalHarnessJson(authoritative))
				throw protocolError('Harness direct terminal differs from the authoritative stream result.')
			assertActive(active)
			const outcome = sanitizeTerminal(authoritative)
			if (!dispatch) await this.completeRoot(projection, received.host, outcome, active)
			const terminal = Object.freeze({ ...candidate, outcome })
			terminalPublished = true
			await this.publishStreamFrame(message, projection.target.id, {
				frameType: 'chunk',
				sequence: sequence++,
				chunk: terminal,
			})
			await this.publishStreamFrame(message, projection.target.id, {
				frameType: 'complete',
				sequence: sequence++,
				final: outcome,
			})
		} catch (error) {
			if (terminalPublished) throw error
			await active?.cancel?.('receiver_failed').catch(() => undefined)
			try {
				const handled = invocationError(error, active)
				if (started && directStart) {
					const cancelled =
						active?.controller.signal.aborted &&
						active.controller.signal.reason instanceof Error &&
						active.controller.signal.reason.message !== 'deadline_exceeded'
					const timeout = handled.errorCode === StatusCode.GatewayTimeout
					const outcome: Terminal = Object.freeze({
						status: cancelled ? 'cancelled' : 'failed',
						runId: directStart.runId,
						error: Object.freeze({
							code: cancelled ? 'OPERATION_CANCELLED' : timeout ? 'OPERATION_TIMEOUT' : 'PURISTA_HANDLED_ERROR',
							message: handled.message,
							category: cancelled ? 'cancelled' : timeout ? 'timeout' : 'internal',
							retriable: timeout,
							meta: Object.freeze({
								status: handled.errorCode,
								...(handled.data === undefined ? {} : { data: handled.data }),
							}),
						}),
					})
					const terminal = Object.freeze({
						...(candidate ?? directStart),
						type: 'run.finished' as const,
						eventId: candidate?.eventId ?? randomUUID(),
						sequence: candidate?.sequence ?? directStart.sequence + sequence,
						at: new Date().toISOString(),
						outcome,
					})
					await this.publishStreamFrame(message, projection.target.id, {
						frameType: 'chunk',
						sequence: sequence++,
						chunk: terminal,
					})
					await this.publishStreamFrame(message, projection.target.id, {
						frameType: 'complete',
						sequence: sequence++,
						final: outcome,
					})
				} else {
					await this.publishStreamFrame(message, projection.target.id, {
						frameType: 'error',
						sequence: sequence++,
						error: {
							status: handled.errorCode,
							message: handled.message,
							isHandledError: true,
							data: handled.data,
							traceId: handled.traceId,
						},
					})
				}
			} catch {
				throw error
			}
		} finally {
			if (active) this.deactivate(active)
		}
	}

	private async completeRoot(
		projection: Projection,
		host: PuristaHostInvocation,
		outcome: Terminal,
		active: ActiveInvocation,
	) {
		if (outcome.status === 'failed' || outcome.status === 'cancelled') return
		assertActive(active)
		const context = this.guardContext(projection, host)
		for (const key of projection.policy?.afterGuardKeys ?? []) {
			assertActive(active)
			await awaitActive(
				callBusinessGuard(() => this.policyFor(projection)?.afterGuards?.[key]?.(context, outcome)),
				active,
			)
		}
		assertActive(active)
		if (outcome.status === 'completed' && projection.completedEvent) {
			const result = await projection.completedEvent.schema['~standard'].validate(outcome)
			if (result.issues || result.value !== outcome)
				throw protocolError('Harness completed-event outcome failed validation.')
			assertActive(active)
			try {
				await awaitActive(
					this.eventBridge.emitMessage({
						messageType: EBMessageType.CustomMessage,
						contentType: 'application/json',
						contentEncoding: 'utf-8',
						traceId: host.message.traceId,
						otp: host.message.otp,
						principalId: host.identity.principalId,
						tenantId: host.identity.tenantId,
						sender: { ...projection.address, instanceId: this.eventBridge.instanceId },
						eventName: projection.completedEvent.name,
						payload: outcome,
					} as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>),
					active,
				)
			} catch {
				assertActive(active)
				throw new HandledError(StatusCode.InternalServerError, 'Harness completed-event publication failed.')
			}
			assertActive(active)
		}
	}

	private async publishStreamFrame(message: StreamOpenRequest, target: string, payload: StreamFrame['payload']) {
		await this.eventBridge.emitMessage({
			messageType: EBMessageType.Stream,
			correlationId: message.correlationId,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: message.traceId,
			otp: message.otp,
			principalId: message.principalId,
			tenantId: message.tenantId,
			sender: {
				serviceName: this.serviceName,
				serviceVersion: this.serviceVersion,
				serviceTarget: target,
				instanceId: this.eventBridge.instanceId,
			},
			receiver: message.sender,
			payload,
		} as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
	}
}

function parseEnvelope(value: unknown): HarnessTransportEnvelope {
	if (
		!plainFields(value, ['contract'], ['root', 'dispatch']) ||
		Object.hasOwn(value, 'root') === Object.hasOwn(value, 'dispatch')
	)
		throw badRequest('Harness receiver requires exactly one root or nested envelope.')
	if (
		!plainFields(value.contract, ['schemaVersion', 'exportDigest']) ||
		value.contract.schemaVersion !== 1 ||
		typeof value.contract.exportDigest !== 'string' ||
		!/^sha256:[0-9a-f]{64}$/.test(value.contract.exportDigest)
	)
		throw badRequest('Harness target contract envelope is invalid.')
	if (Object.hasOwn(value, 'root')) {
		if (!plainFields(value.root, ['sessionId']) || !nonempty(value.root.sessionId))
			throw badRequest('Harness root envelope is invalid.')
	} else {
		const dispatch = value.dispatch
		if (
			!plainFields(
				dispatch,
				['sessionId', 'rootRunId', 'parentRunId', 'invocationId', 'depth', 'remainingDepth'],
				['parentAgentId', 'parentWorkflowId', 'deadline', 'idempotencyKey'],
			) ||
			Object.hasOwn(dispatch, 'parentAgentId') === Object.hasOwn(dispatch, 'parentWorkflowId') ||
			!['sessionId', 'rootRunId', 'parentRunId', 'invocationId'].every(key => nonempty(dispatch[key])) ||
			!nonempty(dispatch.parentAgentId ?? dispatch.parentWorkflowId) ||
			!Number.isSafeInteger(dispatch.depth) ||
			Number(dispatch.depth) < 1 ||
			!Number.isSafeInteger(dispatch.remainingDepth) ||
			Number(dispatch.remainingDepth) < 0 ||
			(Object.hasOwn(dispatch, 'deadline') &&
				(!Number.isSafeInteger(dispatch.deadline) || Number(dispatch.deadline) <= 0)) ||
			(Object.hasOwn(dispatch, 'idempotencyKey') && !nonempty(dispatch.idempotencyKey))
		)
			throw badRequest('Harness nested envelope is invalid.')
	}
	return value as HarnessTransportEnvelope
}

function parseParameter(value: unknown, nested: boolean): HarnessInvokeParameter {
	if (!plainFields(value, [], nested ? ['resume'] : ['idempotencyKey', 'timeoutMs', 'metadata', 'durable', 'resume']))
		throw badRequest('Harness invocation parameters are invalid.')
	if (Object.hasOwn(value, 'resume') && (value.resume === undefined || Object.hasOwn(value, 'idempotencyKey')))
		throw badRequest('Harness resume forbids an idempotency key.')
	if (
		value.timeoutMs !== undefined &&
		(typeof value.timeoutMs !== 'number' || !Number.isSafeInteger(value.timeoutMs) || value.timeoutMs < 0)
	)
		throw badRequest('Harness invocation timeout is invalid.')
	return value as HarnessInvokeParameter
}

function createHostInvocation(message: Command | StreamOpenRequest, idempotencyKey?: string): PuristaHostInvocation {
	for (const identity of [message.tenantId, message.principalId])
		if (identity !== undefined && (!nonempty(identity) || identity.length > 256))
			throw badRequest('Harness authenticated identity is invalid.')
	let trace: HarnessTraceContext | undefined
	if (message.otp !== undefined) {
		let value: unknown
		try {
			value = JSON.parse(message.otp)
		} catch {
			throw badRequest('Harness W3C trace context is invalid.')
		}
		if (
			!plainFields(value, ['traceparent'], ['tracestate']) ||
			typeof value.traceparent !== 'string' ||
			!/^(?!ff)[0-9a-f]{2}-(?!0{32})[0-9a-f]{32}-(?!0{16})[0-9a-f]{16}-[0-9a-f]{2}$/.test(value.traceparent) ||
			(value.tracestate !== undefined && typeof value.tracestate !== 'string')
		)
			throw badRequest('Harness W3C trace context is invalid.')
		try {
			trace = normalizeHarnessTraceContext({
				traceparent: value.traceparent,
				...(typeof value.tracestate === 'string' ? { tracestate: value.tracestate } : {}),
			})
		} catch {
			throw badRequest('Harness W3C trace context is invalid.')
		}
	}
	return Object.freeze({
		message,
		identity: Object.freeze({
			...(message.tenantId === undefined ? {} : { tenantId: message.tenantId }),
			...(message.principalId === undefined ? {} : { principalId: message.principalId }),
		}),
		...(trace === undefined ? {} : { trace }),
		...(idempotencyKey === undefined ? {} : { idempotencyKey }),
	})
}

async function validatedInput(projection: Projection, wireInput: JsonValue): Promise<JsonValue> {
	try {
		const result = await projection.standardSchemas.input['~standard'].validate(wireInput)
		if (result.issues) throw badRequest('Harness target input is invalid.')
		canonicalHarnessJson(result.value)
		return result.value as JsonValue
	} catch (error) {
		if (error instanceof HandledError) throw error
		throw badRequest('Harness target input is invalid.')
	}
}

function freezeOutcome(value: unknown, expectedRunId?: string): Terminal {
	if (
		!plainFields(value, ['status', 'runId'], ['output', 'interrupt', 'error']) ||
		!nonempty(value.runId) ||
		(expectedRunId !== undefined && expectedRunId !== value.runId)
	)
		throw protocolError('Harness terminal outcome has invalid run identity.')
	const field =
		value.status === 'completed'
			? 'output'
			: value.status === 'interrupted'
				? 'interrupt'
				: value.status === 'failed' || value.status === 'cancelled'
					? 'error'
					: undefined
	if (!field || !plainFields(value, ['status', 'runId', field]))
		throw protocolError('Harness terminal outcome is invalid.')
	canonicalHarnessJson(value)
	return freezeJson(value) as Terminal
}

function freezeJson<Value>(value: Value): Value {
	if (value !== null && typeof value === 'object') {
		for (const child of Object.values(value)) freezeJson(child)
		Object.freeze(value)
	}
	return value
}

function assertEventCorrelation(
	event: Event,
	dispatch: HarnessTransportEnvelope['dispatch'],
	expectedRunId?: string,
): void {
	if (!nonempty(event.runId) || !nonempty(event.eventId) || !Number.isSafeInteger(event.sequence) || event.sequence < 0)
		throw protocolError('Harness stream event correlation is invalid.')
	if (
		dispatch &&
		event.parentRunId === dispatch.parentRunId &&
		event.parentInvocationId === dispatch.invocationId &&
		event.runId !== dispatch.invocationId
	)
		throw protocolError('Harness nested direct event has an invalid run id.')
	const hasRun = event.parentRunId !== undefined
	const hasInvocation = event.parentInvocationId !== undefined
	// Child task activity uses parentRunId as an event payload on the direct run.
	const childActivity = event.type === 'child_task.started' || event.type === 'child_task.settled'
	if (
		!childActivity &&
		(hasRun !== hasInvocation || (hasRun && (!nonempty(event.parentRunId) || !nonempty(event.parentInvocationId))))
	)
		throw protocolError('Harness event has invalid parent correlation.')
	if (expectedRunId !== undefined && event.runId === expectedRunId && !isDirectEvent(event, dispatch))
		throw protocolError('Harness direct event has mismatched parent correlation.')
}

function isDirectEvent(event: Event, dispatch: HarnessTransportEnvelope['dispatch']): boolean {
	if (dispatch)
		return (
			event.runId === dispatch.invocationId &&
			event.parentRunId === dispatch.parentRunId &&
			event.parentInvocationId === dispatch.invocationId
		)
	return (
		event.parentInvocationId === undefined &&
		(event.parentRunId === undefined || event.type === 'child_task.started' || event.type === 'child_task.settled')
	)
}

function sameCaller(left: Command | StreamOpenRequest, right: StreamMessage): boolean {
	return (
		left.principalId === right.principalId &&
		left.tenantId === right.tenantId &&
		left.sender.instanceId === right.sender.instanceId &&
		left.sender.serviceName === right.sender.serviceName &&
		left.sender.serviceVersion === right.sender.serviceVersion &&
		left.sender.serviceTarget === right.sender.serviceTarget
	)
}
function assertActive(active: ActiveInvocation): void {
	if (active.deadline !== undefined && Date.now() >= active.deadline && !active.controller.signal.aborted)
		active.controller.abort(new Error('deadline_exceeded'))
	if (!active.controller.signal.aborted) return
	const timeout =
		active.controller.signal.reason instanceof Error && active.controller.signal.reason.message === 'deadline_exceeded'
	throw new HandledError(
		timeout ? StatusCode.GatewayTimeout : StatusCode.RequestTimeout,
		timeout ? 'Harness invocation deadline expired.' : 'Harness invocation was cancelled.',
	)
}
function plainFields(
	value: unknown,
	required: readonly string[],
	optional: readonly string[] = [],
): value is Record<string, unknown> {
	if (
		typeof value !== 'object' ||
		value === null ||
		Array.isArray(value) ||
		![Object.prototype, null].includes(Object.getPrototypeOf(value))
	)
		return false
	if (required.some(key => !Object.hasOwn(value, key))) return false
	return Reflect.ownKeys(value).every(key => {
		if (typeof key !== 'string' || ![...required, ...optional].includes(key)) return false
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value')
	})
}
function nonempty(value: unknown): value is string {
	return typeof value === 'string' && value.trim() !== ''
}
function badRequest(message: string): HandledError {
	return new HandledError(StatusCode.BadRequest, message)
}
function protocolError(message: string): HandledError {
	return new HandledError(StatusCode.InternalServerError, message)
}
function outcomeError(outcome: Extract<Terminal, { status: 'failed' | 'cancelled' }>): HandledError {
	return new HandledError(
		outcome.status === 'cancelled' ? StatusCode.GatewayTimeout : StatusCode.InternalServerError,
		outcome.status === 'cancelled' ? 'Harness target was cancelled.' : 'Harness target failed.',
	)
}
function toHandledError(error: unknown): HandledError {
	if (error instanceof HandledError) return error
	if (isHarnessError(error)) {
		const conflict =
			/RESUME|REVISION|REPLAY|IDEMPOTENCY|IDENTITY|ROUTE_RECEIPT/.test(error.code) ||
			error.meta?.reason === 'session_identity_mismatch' ||
			error.code === 'SESSION_BUSY'
		const status = conflict
			? StatusCode.Conflict
			: /ADMISSION_REJECTED/.test(error.code)
				? StatusCode.TooManyRequests
				: error.category === 'validation'
					? StatusCode.BadRequest
					: error.category === 'permission' || error.code === 'DECISION_BLOCKED'
						? StatusCode.Forbidden
						: error.category === 'timeout'
							? StatusCode.GatewayTimeout
							: StatusCode.InternalServerError
		return new HandledError(status, status >= 500 ? 'Harness execution failed.' : error.message, {
			code: error.code,
			retriable: error.retriable,
			...(typeof error.meta?.retryAfterMs === 'number' ? { retryAfterMs: error.meta.retryAfterMs } : {}),
		})
	}
	return new HandledError(StatusCode.InternalServerError, 'Harness execution failed.')
}

function hostedLogger(logger: Logger): HarnessLogger {
	return Object.freeze({
		trace: logger.trace.bind(logger),
		debug: logger.debug.bind(logger),
		info: logger.info.bind(logger),
		warn: logger.warn.bind(logger),
		error: logger.error.bind(logger),
		fatal: logger.fatal.bind(logger),
		child: (bindings: Record<string, unknown>) => hostedLogger(logger.getChildLogger(bindings)),
	})
}

function ownedFrozen(value: unknown): boolean {
	if (value === null || typeof value !== 'object') return true
	if (!Object.isFrozen(value)) return false
	return Object.values(value).every(ownedFrozen)
}

function sanitizeTerminal(outcome: Terminal): Terminal {
	if (outcome.status === 'completed' || outcome.status === 'interrupted') return outcome
	return Object.freeze({
		status: outcome.status,
		runId: outcome.runId,
		error: sanitizedExecutionError(outcome.status === 'cancelled'),
	})
}

function sanitizedExecutionError(cancelled = false) {
	return Object.freeze({
		code: cancelled ? 'OPERATION_CANCELLED' : 'INTERNAL_ERROR',
		message: cancelled ? 'Harness execution was cancelled.' : 'Harness execution failed.',
		category: cancelled ? 'cancelled' : 'internal',
		retriable: false,
	})
}

function sanitizeExecutionEvent(event: Event): Event {
	if (event.type === 'run.finished')
		return Object.freeze({ ...event, outcome: sanitizeTerminal(freezeOutcome(event.outcome, event.runId)) })
	if (
		(event.type === 'agent.finished' || event.type === 'tool.finished' || event.type === 'child_task.settled') &&
		event.error !== undefined
	) {
		return Object.freeze({
			...event,
			error: sanitizedExecutionError(event.type === 'child_task.settled' && event.status === 'cancelled'),
		})
	}
	return event
}

async function callBusinessGuard(guard: () => void | Promise<void>): Promise<void> {
	try {
		await guard()
	} catch (error) {
		if (error instanceof HandledError) throw error
		throw new HandledError(StatusCode.InternalServerError, 'Harness business guard failed.')
	}
}

function invocationError(error: unknown, active?: ActiveInvocation): HandledError {
	if (active !== undefined) {
		try {
			assertActive(active)
		} catch (cancellation) {
			return toHandledError(cancellation)
		}
	}
	return toHandledError(error)
}

async function awaitActive<Value>(pending: Promise<Value>, active: ActiveInvocation): Promise<Value> {
	const signal = active.controller.signal
	let rejectAbort!: (error: unknown) => void
	const aborted = new Promise<never>((_resolve, reject) => {
		rejectAbort = reject
	})
	const onAbort = () => {
		try {
			assertActive(active)
		} catch (error) {
			rejectAbort(error)
		}
	}
	signal.addEventListener('abort', onAbort, { once: true })
	if (signal.aborted) onAbort()
	try {
		return await Promise.race([pending, aborted])
	} finally {
		signal.removeEventListener('abort', onAbort)
	}
}

async function* observeStream(
	stream: AsyncIterable<Event> & { result: Promise<Terminal> },
	active: ActiveInvocation,
): AsyncIterable<Event> {
	// A result rejection must interrupt a blocked iterator.next(), but a fulfilled
	// result must still wait for complete terminal/event validation.
	const resultFailure = new Promise<never>((_resolve, reject) => {
		void stream.result.catch(reject)
	})
	void resultFailure.catch(() => undefined)
	const iterator = stream[Symbol.asyncIterator]()
	let ended = false
	try {
		while (true) {
			const next = await awaitActive(Promise.race([iterator.next(), resultFailure]), active)
			if (next.done) {
				ended = true
				return
			}
			yield next.value
		}
	} finally {
		if (!ended) {
			// An async iterator may be stuck in its pending next call; requesting
			// return must not block receiver failure or shutdown on that same call.
			void Promise.resolve()
				.then(() => iterator.return?.())
				.catch(() => undefined)
			void active.cancel?.('receiver_stopped').catch(() => undefined)
		}
	}
}
