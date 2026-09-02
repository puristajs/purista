import { createHash } from 'node:crypto'

import type {
	ExecutionEvent,
	Harness,
	HarnessDefinition,
	HarnessInstanceConfig,
	HostToolBinding,
	InvokeOptions,
	ModelHandle,
	RunOutcome,
} from '@purista/harness'
import { isHarnessError } from '@purista/harness'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import { createErrorResponse } from '../core/helper/createErrorResponse.impl.js'
import { createSuccessResponse } from '../core/helper/createSuccessResponse.impl.js'
import type { Command } from '../core/types/commandType/Command.js'
import type { EBMessage } from '../core/types/EBMessage.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { Logger } from '../core/types/Logger.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { isStreamControl } from '../core/types/stream/isStreamControl.impl.js'
import { isStreamOpenRequest } from '../core/types/stream/isStreamOpenRequest.impl.js'
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamMessage } from '../core/types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type {
	HarnessBusinessGuardContext,
	HarnessCommandToolAdapter,
	HarnessHostContext,
	HarnessMount,
} from './types.js'

/** Consumer-controlled run options accepted by a mounted Harness target. */
export type HarnessInvokeParameter = Readonly<{
	sessionId?: string
	idempotencyKey?: string
	timeoutMs?: number
	metadata?: Record<string, string | number | boolean | null>
	durable?: InvokeOptions['durable']
	/** Resume one durable Harness interruption, such as a human tool approval. */
	resume?: InvokeOptions['resume']
}>

type MountedRuntime = {
	definition: HarnessDefinition<any>
	harness: Harness<any>
	registrations: Array<{ target: string; command: boolean; stream: boolean }>
}

type RuntimeTargetPolicy = Readonly<{
	beforeGuards?: Readonly<
		Record<string, (context: HarnessBusinessGuardContext<any>, input: unknown) => void | Promise<void>>
	>
	afterGuards?: Readonly<
		Record<string, (context: HarnessBusinessGuardContext<any>, outcome: RunOutcome<unknown>) => void | Promise<void>>
	>
	successEvent?: string
}>

/** Service-owned lifecycle for one or more mounted portable Harness definitions. */
export class HarnessMountRuntime {
	private readonly runtimes: MountedRuntime[] = []
	private readonly activeStreams = new Map<string, AbortController>()
	private started = false

	constructor(
		private readonly serviceName: string,
		private readonly serviceVersion: string,
		private readonly eventBridge: EventBridge,
		private readonly logger: Logger,
		private readonly mounts: readonly HarnessMount[],
		private readonly config: Omit<HarnessInstanceConfig<any, HarnessHostContext>, 'hostTools'>,
		private readonly resources: Record<string, unknown>,
	) {}

	/** Instantiate every Harness and register its explicitly published aggregate targets. */
	async start() {
		if (this.started) return
		const occupied = new Set<string>()
		try {
			for (const mount of this.mounts) {
				const harness = await mount.definition.getInstance(this.configFor(mount))
				const runtime: MountedRuntime = { definition: mount.definition, harness, registrations: [] }
				this.runtimes.push(runtime)
				for (const agentId of (mount.policy.publish.agents ?? []) as readonly string[]) {
					this.assertFreeAddress(agentId, occupied)
					await this.register(runtime, mount, 'agent', agentId)
				}
				for (const workflowId of (mount.policy.publish.workflows ?? []) as readonly string[]) {
					this.assertFreeAddress(workflowId, occupied)
					await this.register(runtime, mount, 'workflow', workflowId)
				}
			}
			this.started = true
		} catch (error) {
			await this.shutdown()
			throw error
		}
	}

	/** Resolve one model from the runtime created for the exact mounted definition. */
	getModel(definition: HarnessDefinition<any>, alias: string): ModelHandle {
		const runtime = this.runtimes.find(candidate => candidate.definition === definition)
		if (!runtime) throw new Error(`Harness definition "${definition.name}" is not mounted on this service instance.`)
		const model = (runtime.harness.models as Record<string, ModelHandle | undefined>)[alias]
		if (!model) throw new Error(`Harness model "${alias}" is not available on "${definition.name}".`)
		return model
	}

	/** Unregister published addresses, then close each Harness runtime. */
	async shutdown() {
		const failures: unknown[] = []
		for (const runtime of [...this.runtimes].reverse()) {
			for (const registration of [...runtime.registrations].reverse()) {
				const address = {
					serviceName: this.serviceName,
					serviceVersion: this.serviceVersion,
					serviceTarget: registration.target,
				}
				if (registration.command) {
					try {
						await this.eventBridge.unregisterCommand(address)
					} catch (error) {
						failures.push(error)
					}
				}
				if (registration.stream) {
					try {
						await this.eventBridge.unregisterStream(address)
					} catch (error) {
						failures.push(error)
					}
				}
			}
			const result = await runtime.harness.shutdown()
			failures.push(...result.errors)
		}
		this.runtimes.length = 0
		for (const controller of this.activeStreams.values()) controller.abort(new Error('service_shutdown'))
		this.activeStreams.clear()
		this.started = false
		if (failures.length > 0) throw new AggregateError(failures, 'Harness mount shutdown failed.')
	}

	private configFor(mount: HarnessMount): HarnessInstanceConfig<any, HarnessHostContext> {
		const models = Object.fromEntries(
			Object.keys(mount.definition.catalog.models).map(alias => [alias, this.config.models[alias]]),
		)
		const hostTools = Object.fromEntries(
			Object.entries(mount.policy.hostTools ?? {}).map(([id, binding]) => [
				id,
				isCommandToolAdapter(binding) ? this.commandToolBinding(binding) : binding,
			]),
		)
		return {
			...this.config,
			models,
			...(Object.keys(hostTools).length > 0 ? { hostTools } : {}),
		} as HarnessInstanceConfig<any, HarnessHostContext>
	}

	private commandToolBinding(adapter: HarnessCommandToolAdapter): HostToolBinding<any, any, HarnessHostContext> {
		return async (context, input) => {
			const mapped = adapter.mapInput?.(input) ?? { payload: input, parameter: {} }
			const output = await this.eventBridge.invoke({
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				traceId: context.host.request.traceId,
				principalId: context.host.identity.principalId,
				tenantId: context.host.identity.tenantId,
				sender: {
					serviceName: this.serviceName,
					serviceVersion: this.serviceVersion,
					serviceTarget: context.toolId,
					instanceId: this.eventBridge.instanceId,
				},
				receiver: {
					serviceName: adapter.serviceName,
					serviceVersion: adapter.serviceVersion,
					serviceTarget: adapter.serviceTarget,
				},
				payload: { payload: mapped.payload, parameter: mapped.parameter ?? {} },
			})
			return adapter.mapOutput ? adapter.mapOutput(output) : output
		}
	}

	private assertFreeAddress(target: string, occupied: Set<string>) {
		if (occupied.has(target)) {
			throw new Error(`Harness target address "${target}" is published more than once.`)
		}
		occupied.add(target)
	}

	private async register(runtime: MountedRuntime, mount: HarnessMount, kind: 'agent' | 'workflow', target: string) {
		const definition = mount.definition
		const catalog = kind === 'agent' ? definition.catalog.agents : definition.catalog.workflows
		if (!(target in catalog)) throw new Error(`Harness ${kind} "${target}" does not exist in "${definition.name}".`)
		const policy = (
			kind === 'agent' ? mount.policy.targets?.agents?.[target] : mount.policy.targets?.workflows?.[target]
		) as RuntimeTargetPolicy | undefined
		const registration = { target, command: false, stream: false }
		runtime.registrations.push(registration)

		await this.eventBridge.registerCommand(
			{ serviceName: this.serviceName, serviceVersion: this.serviceVersion, serviceTarget: target },
			async message => this.execute(runtime.harness, kind, target, message, policy),
			{ expose: {} },
			{ durable: false, autoacknowledge: true, shared: true },
		)
		registration.command = true
		await this.eventBridge.registerStream(
			{ serviceName: this.serviceName, serviceVersion: this.serviceVersion, serviceTarget: target },
			async message => this.executeStream(runtime.harness, kind, target, message, policy),
			{ expose: {} },
			{ durable: false, autoacknowledge: true, shared: true },
		)
		registration.stream = true
	}

	private async execute(
		harness: Harness<any>,
		kind: 'agent' | 'workflow',
		target: string,
		message: Command,
		policy?: RuntimeTargetPolicy,
	) {
		try {
			const parameter = parseParameter(message.payload.parameter)
			const context = this.guardContext(kind, target, message)
			await runBeforeGuards(policy, context, message.payload.payload)
			const session = await harness.getSession(sessionKey(message, parameter.sessionId), {
				identity: {
					...(message.tenantId ? { tenantId: message.tenantId } : {}),
					...(message.principalId ? { principalId: message.principalId } : {}),
				},
			})
			const options: InvokeOptions = {
				hostContext: hostContext(message, this.logger),
				...(parameter.idempotencyKey ? { idempotencyKey: parameter.idempotencyKey } : {}),
				...(parameter.timeoutMs !== undefined ? { timeoutMs: parameter.timeoutMs } : {}),
				...(parameter.metadata ? { metadata: parameter.metadata } : {}),
				...(parameter.durable ? { durable: parameter.durable } : {}),
				...(parameter.resume ? { resume: parameter.resume } : {}),
			}
			const invoker = (kind === 'agent' ? session.agents[target] : session.workflows[target]) as
				| { run(input: unknown, options?: InvokeOptions): Promise<unknown> }
				| undefined
			if (!invoker) throw new Error(`Mounted Harness ${kind} "${target}" is unavailable.`)
			const outcome = (await invoker.run(message.payload.payload, options)) as RunOutcome<unknown>
			await runAfterGuards(policy, context, outcome)
			return createSuccessResponse(
				this.eventBridge.instanceId,
				message,
				outcome,
				outcome.status === 'completed' ? policy?.successEvent : undefined,
			)
		} catch (error) {
			const handled = toHandledError(error)
			if (handled.errorCode >= 500) this.logger.error({ err: handled }, handled.message)
			else this.logger.warn({ err: handled }, handled.message)
			return createErrorResponse(this.eventBridge.instanceId, message, handled.errorCode, handled)
		}
	}

	private async executeStream(
		harness: Harness<any>,
		kind: 'agent' | 'workflow',
		target: string,
		message: StreamMessage,
		policy?: RuntimeTargetPolicy,
	) {
		if (isStreamControl(message)) {
			this.activeStreams.get(message.correlationId)?.abort(new Error(message.payload.reason ?? 'consumer_cancelled'))
			return
		}
		if (!isStreamOpenRequest(message)) return

		const controller = new AbortController()
		this.activeStreams.set(message.correlationId, controller)
		let sequence = 0
		try {
			await this.publishStreamFrame(message, target, { frameType: 'start', sequence: sequence++ })
			const parameter = parseParameter(message.payload.parameter)
			const context = this.guardContext(kind, target, message)
			await runBeforeGuards(policy, context, message.payload.payload)
			const session = await harness.getSession(sessionKey(message, parameter.sessionId), {
				identity: {
					...(message.tenantId ? { tenantId: message.tenantId } : {}),
					...(message.principalId ? { principalId: message.principalId } : {}),
				},
			})
			const options: InvokeOptions = {
				signal: controller.signal,
				hostContext: hostContext(message, this.logger),
				...(parameter.idempotencyKey ? { idempotencyKey: parameter.idempotencyKey } : {}),
				...(parameter.timeoutMs !== undefined ? { timeoutMs: parameter.timeoutMs } : {}),
				...(parameter.metadata ? { metadata: parameter.metadata } : {}),
				...(parameter.durable ? { durable: parameter.durable } : {}),
				...(parameter.resume ? { resume: parameter.resume } : {}),
			}
			const invoker = (kind === 'agent' ? session.agents[target] : session.workflows[target]) as
				| { stream(input: unknown, options?: InvokeOptions): AsyncIterable<ExecutionEvent<unknown>> }
				| undefined
			if (!invoker) throw new Error(`Mounted Harness ${kind} "${target}" is unavailable.`)

			let outcome: RunOutcome<unknown> | undefined
			for await (const event of invoker.stream(message.payload.payload, options)) {
				if (event.type === 'run.finished') outcome = event.outcome
				await this.publishStreamFrame(message, target, { frameType: 'chunk', sequence: sequence++, chunk: event })
			}
			if (!outcome) throw new Error(`Mounted Harness ${kind} "${target}" ended without a terminal outcome.`)
			await runAfterGuards(policy, context, outcome)
			if (outcome.status === 'completed' && policy?.successEvent) {
				await this.publishSuccessEvent(message, kind, target, policy.successEvent, outcome)
			}
			await this.publishStreamFrame(message, target, { frameType: 'complete', sequence: sequence++, final: outcome })
		} catch (error) {
			if (controller.signal.aborted) {
				await this.publishStreamFrame(message, target, {
					frameType: 'cancel',
					sequence: sequence++,
					reason: controller.signal.reason instanceof Error ? controller.signal.reason.message : 'consumer_cancelled',
				})
				return
			}
			const handled = toHandledError(error)
			await this.publishStreamFrame(message, target, {
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
		} finally {
			this.activeStreams.delete(message.correlationId)
		}
	}

	private guardContext(
		kind: 'agent' | 'workflow',
		target: string,
		message: Command | StreamOpenRequest,
	): HarnessBusinessGuardContext<Record<string, unknown>> {
		return Object.freeze({
			kind,
			target,
			message,
			identity: Object.freeze({
				...(message.tenantId ? { tenantId: message.tenantId } : {}),
				...(message.principalId ? { principalId: message.principalId } : {}),
			}),
			resources: this.resources,
			logger: this.logger,
		})
	}

	private async publishSuccessEvent(
		message: StreamOpenRequest,
		kind: 'agent' | 'workflow',
		target: string,
		eventName: string,
		outcome: RunOutcome<unknown>,
	) {
		await this.eventBridge.emitMessage({
			messageType: EBMessageType.CustomMessage,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: message.traceId,
			principalId: message.principalId,
			tenantId: message.tenantId,
			sender: {
				serviceName: this.serviceName,
				serviceVersion: this.serviceVersion,
				serviceTarget: target,
				instanceId: this.eventBridge.instanceId,
			},
			eventName,
			payload: outcome,
		} as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
		this.logger.debug({ kind, target, eventName }, 'published mounted Harness success event')
	}

	private async publishStreamFrame(message: StreamOpenRequest, target: string, payload: StreamFrame['payload']) {
		await this.eventBridge.emitMessage({
			messageType: EBMessageType.Stream,
			correlationId: message.correlationId,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: message.traceId,
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
		} as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
	}
}

function parseParameter(value: unknown): HarnessInvokeParameter {
	if (value === undefined || value === null) return {}
	if (typeof value !== 'object' || Array.isArray(value)) {
		throw new HandledError(StatusCode.BadRequest, 'Harness invocation parameters must be an object.')
	}
	return value as HarnessInvokeParameter
}

function sessionKey(message: Command | StreamOpenRequest, requested: string | undefined) {
	return createHash('sha256')
		.update(
			JSON.stringify([
				message.tenantId ?? null,
				message.principalId ?? null,
				requested ?? message.correlationId ?? message.id,
			]),
		)
		.digest('hex')
}

function hostContext(message: Command | StreamOpenRequest, logger: Logger): HarnessHostContext {
	return Object.freeze({
		identity: Object.freeze({
			...(message.tenantId ? { tenantId: message.tenantId } : {}),
			...(message.principalId ? { principalId: message.principalId } : {}),
		}),
		request: Object.freeze({
			...(message.traceId ? { traceId: message.traceId } : {}),
			correlationId: message.correlationId,
		}),
		logger,
	})
}

async function runBeforeGuards(
	policy: RuntimeTargetPolicy | undefined,
	context: HarnessBusinessGuardContext<any>,
	input: unknown,
) {
	await Promise.all(Object.values(policy?.beforeGuards ?? {}).map(guard => guard(context, input)))
}

async function runAfterGuards(
	policy: RuntimeTargetPolicy | undefined,
	context: HarnessBusinessGuardContext<any>,
	outcome: RunOutcome<unknown>,
) {
	await Promise.all(Object.values(policy?.afterGuards ?? {}).map(guard => guard(context, outcome)))
}

function isCommandToolAdapter(value: unknown): value is HarnessCommandToolAdapter {
	return Boolean(value && typeof value === 'object' && (value as { kind?: unknown }).kind === 'purista-command')
}

function toHandledError(error: unknown) {
	if (error instanceof HandledError) return error
	if (isHarnessError(error)) {
		const status =
			error.category === 'validation'
				? StatusCode.BadRequest
				: error.category === 'permission'
					? StatusCode.Forbidden
					: error.category === 'timeout'
						? StatusCode.GatewayTimeout
						: StatusCode.InternalServerError
		return new HandledError(status, error.message, { code: error.code, retriable: error.retriable })
	}
	return HandledError.fromError(error)
}
