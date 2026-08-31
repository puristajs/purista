import {
	createTelemetryShim,
	type Harness,
	type ModelAlias,
	type RunEvent,
	type Session,
	type SessionOptions,
	type TelemetryShim,
} from '@purista/harness'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { Schema } from '../../schema/index.js'
import { validate } from '../../schema/index.js'
import type {
	AgentDefinition,
	AgentDurableWorkspacePolicy,
	AgentManifest,
	AgentModelBinding,
	AgentRuntimeInvocationInput,
	AgentRuntimeStreamInvocationInput,
	AgentSandboxPolicy,
	AgentSkillRuntimeResolved,
	AgentSuspendedNotice,
	ResolvedAgentRuntimeModelBindings,
} from '../types.js'
import { createAgentHandlerContext } from './context.js'
import { createAgentValidationError, toAgentRuntimeError } from './errors.js'
import { createAgentRunEvent } from './events.js'
import { deriveAgentRunIdentity } from './identity.js'
import { createHandlerModelBindings } from './modelBindings.js'
import { type AttachedHarnessRegistration, translateHarnessRunEvent } from './serviceHarness.js'
import { createAgentSkillContext } from './skills.js'
import { createProviderSseEvent } from './sseEvents.js'

export type CreateAgentExecutorInput<Models extends Record<string, AgentModelBinding>> = {
	definition: AgentDefinition<any>
	manifest: AgentManifest<Models>
	harness?: Harness<any>
	registration: AttachedHarnessRegistration
	resolvedModels: ResolvedAgentRuntimeModelBindings<Models>
	onSuspended?: (notice: AgentSuspendedNotice) => Promise<unknown> | unknown
	skillRuntime?: AgentSkillRuntimeResolved
	logger?: PuristaLogger
	sandboxPolicy?: AgentSandboxPolicy
}

type RuntimeInvocationOptions = {
	readonly signal: AbortSignal
	readonly timeoutMs?: number
	readonly idempotencyKey: string
	readonly durable?: { readonly runId: string; readonly workspacePolicy?: AgentDurableWorkspacePolicy }
}

/** The runtime has a data-driven agent name after the typed builder has emitted its definition. */
type RuntimeInvoker = {
	run(input: unknown, options: RuntimeInvocationOptions): Promise<unknown>
	stream(input: unknown, options: RuntimeInvocationOptions): AsyncIterable<RunEvent>
}

type RuntimeSession = {
	readonly agents: Readonly<Record<string, RuntimeInvoker>>
	readonly workflows: Readonly<Record<string, RuntimeInvoker>>
}

function runtimeSession(session: Session<any>): RuntimeSession {
	return session as unknown as RuntimeSession
}

export function createAgentExecutor<Models extends Record<string, AgentModelBinding>>(
	input: CreateAgentExecutorInput<Models>,
) {
	return new HarnessBackedAgentExecutor(input)
}

class HarnessBackedAgentExecutor<Models extends Record<string, AgentModelBinding>> {
	private readonly harness?: Harness<any>
	private readonly harnessEntryId: string
	private readonly resolvedModels: Record<string, ModelAlias>
	private readonly logger?: PuristaLogger
	private readonly telemetry: TelemetryShim

	constructor(private readonly input: CreateAgentExecutorInput<Models>) {
		this.logger = input.logger
		this.telemetry = createTelemetryShim()
		this.harnessEntryId = input.registration.entryId
		this.resolvedModels = input.resolvedModels
		this.harness = input.harness
	}

	async executeAggregate(input: AgentRuntimeInvocationInput) {
		try {
			const result = await this.execute(input, false)
			return result.output
		} catch (error) {
			throw toAgentRuntimeError(error)
		}
	}

	async executeStream(input: AgentRuntimeStreamInvocationInput) {
		try {
			const controller = new AbortController()
			let sequenceNumber = 0
			input.writer.onCancel(reason => controller.abort(reason))
			const result = await this.execute({ ...input, signal: controller.signal }, true, async event => {
				const chunk = createProviderSseEvent(event, sequenceNumber + 1)
				if (!chunk) {
					return
				}
				sequenceNumber += 1
				await input.writer.write(chunk)
			})
			await input.writer.close(result.output)
		} catch (error) {
			await input.writer.fail(toAgentRuntimeError(error))
		}
	}

	async shutdown() {
		// The owning PURISTA service closes its one shared Harness runtime.
	}

	private async execute(
		input: AgentRuntimeInvocationInput,
		streaming: boolean,
		emit?: (event: ReturnType<typeof createAgentRunEvent>) => Promise<void>,
	) {
		const signal = input.signal ?? new AbortController().signal
		let identity: ReturnType<typeof deriveAgentRunIdentity>
		try {
			identity = deriveAgentRunIdentity({
				manifest: this.input.manifest,
				message: input.message,
				payload: input.payload,
			})
		} catch {
			throw createAgentValidationError()
		}
		const sessionIdentity =
			identity.tenantId || identity.principalId
				? {
						...(identity.tenantId ? { tenantId: identity.tenantId } : {}),
						...(identity.principalId ? { principalId: identity.principalId } : {}),
					}
				: undefined
		const validatedInput = await validateInput(this.input.definition.payloadSchema, input.payload)
		const sandboxOwner = this.input.sandboxPolicy?.owner
			? await this.input.sandboxPolicy.owner({
					identity,
					input: validatedInput as import('@purista/harness').JsonValue,
				})
			: undefined
		const session = await this.getSession(identity.harnessSessionId, {
			...(sessionIdentity ? { identity: sessionIdentity } : {}),
			...(sandboxOwner ? { sandboxOwner } : {}),
		})
		const emitWrapped = async (event: RunEvent) => {
			await emit?.(createAgentRunEvent(identity, translateHarnessRunEvent(event, this.input.registration)))
		}

		let validated: unknown
		let suspended = false
		try {
			let output: unknown
			try {
				if (this.input.definition.execution.kind === 'runFunction') {
					const handlerModels = createHandlerModelBindings(this.resolvedModels, {
						runId: identity.runId,
						agentId: this.input.manifest.agentName,
						emit: emitWrapped,
					})
					const context = createAgentHandlerContext({
						payload: validatedInput,
						parameter: input.parameter,
						identity,
						appContext: input.appContext,
						metrics: input.appContext.metrics as never,
						session,
						models: handlerModels,
						skills: this.input.skillRuntime
							? createAgentSkillContext(this.input.skillRuntime.catalog)
							: createAgentSkillContext([]),
						commandTools: this.input.manifest.allowedCommands,
						agentTools: this.input.manifest.allowedAgents,
						serviceName: this.input.manifest.serviceName,
						emitEvent: emitWrapped,
						logger: this.resolvePuristaLogger(input.appContext),
						telemetry: this.telemetry,
						signal,
					})
					output = await this.input.definition.execution.handler(context)
				} else if (this.input.definition.execution.kind === 'harnessAgent') {
					const runtime = runtimeSession(session)
					const agentId = this.harnessEntryId
					output = streaming
						? await this.streamHarnessCall(
								session,
								validatedInput,
								emitWrapped,
								'agent',
								signal,
								identity.transportMessageId,
							)
						: await runtime.agents[agentId].run(validatedInput, {
								signal,
								...(this.input.manifest.execution.timeoutMs !== undefined
									? { timeoutMs: this.input.manifest.execution.timeoutMs }
									: {}),
								idempotencyKey: identity.transportMessageId,
							})
				} else {
					const runtime = runtimeSession(session)
					const workflowId = this.harnessEntryId
					const durable = this.input.manifest.durability
						? {
								runId: identity.runId,
								...(this.input.manifest.workspacePolicy?.policy
									? { workspacePolicy: this.input.manifest.workspacePolicy.policy }
									: {}),
							}
						: undefined
					output = streaming
						? await this.streamHarnessCall(
								session,
								validatedInput,
								emitWrapped,
								'workflow',
								signal,
								identity.transportMessageId,
								durable,
							)
						: await runtime.workflows[workflowId].run(validatedInput, {
								signal,
								...(this.input.manifest.execution.timeoutMs !== undefined
									? { timeoutMs: this.input.manifest.execution.timeoutMs }
									: {}),
								idempotencyKey: identity.transportMessageId,
								...(durable ? { durable } : {}),
							})
				}
			} catch (error) {
				if (!isExternalWaitPending(error) || !this.input.onSuspended) throw error
				suspended = true
				output = await this.input.onSuspended({
					runId: identity.runId,
					serviceName: this.input.manifest.serviceName,
					serviceVersion: this.input.manifest.serviceVersion,
					agentName: this.input.manifest.agentName,
					wait: error.snapshot,
				})
			}

			if (!suspended && this.input.definition.execution.kind !== 'runFunction') {
				await this.disposeTerminalSandbox(session)
			}
			validated = await validateOutput(this.input.definition.outputSchema, output)
			await emitSuccessEvent(this.input.manifest, input.appContext, validated)
			if (!suspended && this.input.definition.execution.kind === 'runFunction') {
				await this.disposeTerminalSandbox(session)
			}
		} catch (error) {
			if (this.isTerminalHarnessFailure(error)) {
				await this.disposeTerminalSandbox(session)
			}
			try {
				await session.release()
			} catch {
				// Cleanup must not replace the execution failure used by queue retry
				// handling. Do not log adapter errors that may contain private data.
				this.logger?.warn('Failed to release the Harness session after an agent invocation failed.')
			}
			throw error
		}
		await session.release()
		return { identity, output: validated }
	}

	private async disposeTerminalSandbox(session: Session<any>): Promise<void> {
		if (this.input.manifest.session.mode !== 'ephemeral' || !this.harness) return
		try {
			await session.disposeSandbox()
		} catch {
			// A terminal result is already persisted by Harness. Cleanup remains
			// retryable and must never replace that result or its original error.
			this.logger?.warn('Sandbox cleanup is pending after an attached agent terminal outcome.')
		}
	}

	private isTerminalHarnessFailure(error: unknown): boolean {
		if (this.input.definition.execution.kind === 'runFunction') return false
		return Boolean(
			error &&
				typeof error === 'object' &&
				'retriable' in error &&
				(error as { retriable?: unknown }).retriable === false,
		)
	}

	private async getSession(sessionId: string, options?: SessionOptions): Promise<Session<any>> {
		if (this.harness) {
			return this.harness.getSession(sessionId, options)
		}
		if (this.input.manifest.session.mode === 'conversation') {
			this.logger?.warn(
				`Attached agent "${this.input.manifest.agentName}" uses conversation session mode but has no harness session (no models configured); conversation memory and history are not persisted`,
			)
		}
		return createLocalSession(sessionId)
	}

	private async streamHarnessCall(
		session: Session<any>,
		payload: unknown,
		emitWrapped: (event: RunEvent) => Promise<void>,
		kind: 'agent' | 'workflow',
		signal: AbortSignal,
		idempotencyKey: string,
		durable?: { runId: string; workspacePolicy?: AgentDurableWorkspacePolicy },
	) {
		let output: unknown
		let finished = false
		const runtime = runtimeSession(session)
		const entryId = this.harnessEntryId
		const stream =
			kind === 'agent'
				? runtime.agents[entryId].stream(payload, {
						signal,
						...(this.input.manifest.execution.timeoutMs !== undefined
							? { timeoutMs: this.input.manifest.execution.timeoutMs }
							: {}),
						idempotencyKey,
					})
				: runtime.workflows[entryId].stream(payload, {
						signal,
						...(this.input.manifest.execution.timeoutMs !== undefined
							? { timeoutMs: this.input.manifest.execution.timeoutMs }
							: {}),
						idempotencyKey,
						...(durable ? { durable } : {}),
					})

		for await (const event of stream as AsyncIterable<RunEvent>) {
			await emitWrapped(event)
			if (event.type === 'run.finished') {
				finished = true
				if (event.error) {
					throw createHarnessRunError(event.error)
				}
				output = 'output' in event ? event.output : undefined
			}
		}

		if (!finished) {
			throw new Error(`Agent ${kind} stream ended before a run.finished event was emitted`)
		}
		return output
	}

	private resolvePuristaLogger(appContext: Record<string, unknown>) {
		return (appContext.logger as PuristaLogger | undefined) ?? this.logger ?? createNoopPuristaLogger()
	}
}

function createLocalSession(id: string): Session<any> {
	return {
		id,
		agents: {},
		workflows: {},
		childTasks: {
			get: async () => undefined,
			list: async () => [],
		},
		memory: {
			read: async () => undefined,
			write: async () => undefined,
			delete: async () => undefined,
			list: async () => ({ records: [] }),
			search: async () => [],
		},
		history: {
			list: async () => [],
		},
		getRunSummary: async () => undefined,
		clearHistory: async () => undefined,
		replaceHistory: async () => undefined,
		disposeSandbox: async () => undefined,
		release: async () => undefined,
		destroy: async () => undefined,
	}
}

/** Error raised when a harness run terminates with a serialized error. */
export class AgentRunError extends Error {
	readonly code: string
	readonly category: string
	readonly retriable: boolean
	readonly meta?: Record<string, unknown>

	constructor(error: {
		code: string
		category: string
		retriable: boolean
		message: string
		meta?: Record<string, unknown>
	}) {
		super(error.message)
		this.name = 'AgentRunError'
		this.code = error.code
		this.category = error.category
		this.retriable = error.retriable
		this.meta = error.meta
	}
}

function createHarnessRunError(error: {
	code: string
	category: string
	retriable: boolean
	message: string
	meta?: Record<string, unknown>
}): AgentRunError {
	return new AgentRunError(error)
}

async function validateOutput(schema: Schema | undefined, output: unknown) {
	if (!schema) {
		return output
	}
	const result = await validate(schema, output)
	if (!result.success) {
		throw createAgentValidationError()
	}
	return result.data
}

async function validateInput(schema: Schema | undefined, input: unknown) {
	if (!schema) return input
	const result = await validate(schema, input)
	if (!result.success) {
		throw createAgentValidationError()
	}
	return result.data
}

async function emitSuccessEvent(manifest: AgentManifest, appContext: Record<string, unknown>, output: unknown) {
	if (!manifest.successEventName || typeof appContext.emit !== 'function') {
		return
	}
	await appContext.emit(manifest.successEventName, output)
}

function createNoopPuristaLogger(): PuristaLogger {
	const write = () => undefined
	return {
		info: write,
		fatal: write,
		error: write,
		warn: write,
		debug: write,
		trace: write,
		getChildLogger: () => createNoopPuristaLogger(),
	} as PuristaLogger
}

function isExternalWaitPending(
	error: unknown,
): error is { name: string; snapshot: { waitId: string; kind: string; status: 'waiting' } } {
	return Boolean(
		error &&
			typeof error === 'object' &&
			(error as { name?: unknown }).name === 'ExternalWaitPendingError' &&
			typeof (error as { snapshot?: { waitId?: unknown } }).snapshot?.waitId === 'string' &&
			typeof (error as { snapshot?: { kind?: unknown } }).snapshot?.kind === 'string' &&
			(error as { snapshot?: { status?: unknown } }).snapshot?.status === 'waiting',
	)
}
