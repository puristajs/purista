import { createHash, randomUUID } from 'node:crypto'
import {
	type DurableRuntime,
	type DurableWorkspaceStore,
	defineHarness,
	type GovernanceConfig,
	type Harness,
	type AgentDefinition as HarnessAgentDefinition,
	type HarnessModule,
	type StateStore as HarnessStateStore,
	type WorkflowDefinition as HarnessWorkflowDefinition,
	type InvokeOptions,
	type ModelAlias,
	type RunEvent,
	type Sandbox,
	type Session,
	type TelemetryOptions,
	type ToolsConfig,
} from '@purista/harness'
import { z } from 'zod'
import type { StateStore as PuristaStateStore } from '../../core/StateStore/types/StateStore.js'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { Schema } from '../../schema/index.js'
import { validate } from '../../schema/index.js'
import type {
	AgentDefinition,
	AgentHandlerModelBindings,
	AgentHarnessRuntimeOptions,
	AgentManifest,
	AgentModelBinding,
	AgentRunIdentity,
	AgentRuntimeInvocationInput,
	AgentRuntimeModelBindings,
	AgentRuntimeStreamInvocationInput,
	AgentSkillRuntimeResolved,
} from '../types.js'
import { createAgentHandlerContext } from './context.js'
import { createAgentRunEvent } from './events.js'
import { deriveAgentRunIdentity } from './identity.js'
import { createPuristaHarnessLogger } from './logger.js'
import { resolveRuntimeModelBindings } from './modelBindings.js'
import { createAgentSkillContext } from './skills.js'
import { createProviderSseEvent } from './sseEvents.js'
import { createPuristaHarnessStateStore } from './stateStore.js'

export type CreateAgentExecutorInput<Models extends Record<string, AgentModelBinding>> = {
	definition: AgentDefinition<any>
	manifest: AgentManifest<Models>
	models: AgentRuntimeModelBindings<Models>
	runtime?: DurableRuntime
	workspaceStore?: DurableWorkspaceStore
	harness?: AgentHarnessRuntimeOptions
	skillRuntime?: AgentSkillRuntimeResolved
	logger?: PuristaLogger
	/** Explicit Harness persistence override owned by the agent runtime configuration. */
	harnessStateStore?: HarnessStateStore
	/** Service-owned generic PURISTA state store used when no Harness override is configured. */
	stateStore?: PuristaStateStore
	sandbox?: Sandbox<any>
	telemetry?: TelemetryOptions
	governance?: GovernanceConfig<any>
	singleTenantId?: string
}

type RunFunctionInvocation = {
	payload: unknown
	parameter: unknown
	identity: AgentRunIdentity
	appContext: Record<string, unknown>
	session: Session<any>
}

export function createAgentExecutor<Models extends Record<string, AgentModelBinding>>(
	input: CreateAgentExecutorInput<Models>,
) {
	return new HarnessBackedAgentExecutor(input)
}

class HarnessBackedAgentExecutor<Models extends Record<string, AgentModelBinding>> {
	private readonly harness?: Harness<any>
	private readonly resolvedModels: Record<string, ModelAlias>
	private readonly logger?: PuristaLogger
	private readonly runFunctionInvocations = new Map<string, RunFunctionInvocation>()

	constructor(private readonly input: CreateAgentExecutorInput<Models>) {
		this.logger = input.logger
		this.resolvedModels = resolveRuntimeModelBindings(input.manifest, input.models)
		this.harness = this.buildHarness()
	}

	async executeAggregate(input: AgentRuntimeInvocationInput) {
		const result = await this.execute(input, false)
		return result.output
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
			await input.writer.fail(error)
		}
	}

	async shutdown() {
		await this.harness?.shutdown()
	}

	private buildHarness() {
		if (this.input.definition.execution.kind === 'runFunction' && Object.keys(this.resolvedModels).length === 0) {
			return undefined
		}

		let builder: any = defineHarness({
			name: `${this.input.manifest.serviceName}.${this.input.manifest.agentName}`,
		})
			.logger(createPuristaHarnessLogger(this.input.logger))
			.state(
				this.input.harnessStateStore ??
					createPuristaHarnessStateStore({
						store: this.input.stateStore,
						namespace: `${this.input.manifest.serviceName}:${this.input.manifest.serviceVersion}:${this.input.manifest.agentName}`,
					}),
			)

		for (const module of this.input.harness?.modules ?? []) {
			builder = builder.use(module as HarnessModule)
		}

		builder = builder.models(this.resolvedModels)

		if (this.input.harness?.tools && Object.keys(this.input.harness.tools).length > 0) {
			builder = builder.tools(this.input.harness.tools as ToolsConfig)
		}

		if (this.input.telemetry) {
			// Secure by default: never capture prompt/completion content unless the
			// caller explicitly opts in with an approved retention/redaction policy.
			builder = builder.telemetry({ contentCaptureMode: 'NO_CONTENT', ...this.input.telemetry })
		}

		if (this.input.governance) {
			builder = builder.governance(this.input.governance)
		}

		if (this.input.manifest.execution.timeoutMs !== undefined) {
			builder = builder.defaults({ runTimeoutMs: this.input.manifest.execution.timeoutMs })
		}

		if (this.input.sandbox) {
			builder = builder.sandbox(this.input.sandbox)
		}

		if (this.input.runtime) {
			builder = builder.runtime(this.input.runtime)
		}

		if (this.input.workspaceStore) {
			builder = builder.workspaceStore(this.input.workspaceStore)
		}

		if (this.input.skillRuntime && Object.keys(this.input.skillRuntime.harnessSkills).length > 0) {
			builder = builder.skills(this.input.skillRuntime.harnessSkills)
		}

		if (this.input.manifest.workspacePolicy?.capabilities?.length) {
			builder = builder.requires(this.input.manifest.workspacePolicy.capabilities)
		}

		if (this.input.definition.execution.kind === 'harnessAgent') {
			builder = builder.agents({
				[this.input.manifest.agentName]: this.withDeclaredSkills(
					this.input.definition.execution.definition,
				) as HarnessAgentDefinition<any>,
			})
		}

		if (this.input.definition.execution.kind === 'harnessWorkflow') {
			const agents = this.input.definition.execution.agents ?? {}
			const agentNames = Object.keys(agents)
			if (Object.keys(agents).length > 0) {
				builder = builder.agents(
					Object.fromEntries(
						Object.entries(agents).map(([agentName, agent]) => [
							agentName,
							this.withDeclaredSkills(agent as HarnessAgentDefinition<any>),
						]),
					),
				)
			}
			const workflowDefinition = this.input.definition.execution.definition as HarnessWorkflowDefinition<any>
			builder = builder.workflows({
				[this.input.manifest.agentName]:
					agentNames.length > 0 && !workflowDefinition.delegation
						? {
								...workflowDefinition,
								delegation: {
									agents: agentNames,
									modelAliases: Object.keys(this.resolvedModels),
								},
							}
						: workflowDefinition,
			})
		}

		if (this.input.definition.execution.kind === 'runFunction') {
			builder = builder.agents({
				[this.input.manifest.agentName]: {
					model: Object.keys(this.resolvedModels)[0],
					input: z.object({ invocationId: z.string().uuid() }),
					output: z.unknown(),
					instructions: 'Run the PURISTA custom agent handler through the Harness runtime.',
					handler: async (context: {
						input: { invocationId: string }
						models: AgentHandlerModelBindings<Models>
						signal: AbortSignal
					}) => this.runFunctionThroughHarness(context.input.invocationId, context),
				},
			})
		}

		return builder.build()
	}

	private async execute(
		input: AgentRuntimeInvocationInput,
		streaming: boolean,
		emit?: (event: ReturnType<typeof createAgentRunEvent>) => Promise<void>,
	) {
		const signal = input.signal ?? new AbortController().signal
		const identity = deriveAgentRunIdentity({
			manifest: this.input.manifest,
			message: input.message,
			payload: input.payload,
			singleTenantId: this.input.singleTenantId,
		})
		const session = await this.getSession(identity.harnessSessionId)
		try {
			const invokeOptions = this.createInvokeOptions(identity, signal)
			const emitWrapped = async (event: RunEvent) => {
				await emit?.(createAgentRunEvent(identity, event))
			}

			let output: unknown
			if (this.input.definition.execution.kind === 'runFunction') {
				output = this.harness
					? await this.invokeRunFunctionThroughHarness({
							input,
							identity,
							session,
							streaming,
							emitWrapped,
							signal,
						})
					: await this.runFunctionWithoutHarness({ input, identity, session, signal })
			} else if (this.input.definition.execution.kind === 'harnessAgent') {
				const sessionAny = session as any
				const agentName = this.input.manifest.agentName
				output = streaming
					? await this.streamHarnessCall(session, input.payload, emitWrapped, 'agent', invokeOptions)
					: await sessionAny.agents[agentName].prompt(input.payload, invokeOptions)
			} else {
				const sessionAny = session as any
				const agentName = this.input.manifest.agentName
				output = streaming
					? await this.streamHarnessCall(session, input.payload, emitWrapped, 'workflow', invokeOptions)
					: await sessionAny.workflows[agentName].prompt(input.payload, invokeOptions)
			}

			const validated = await validateOutput(this.input.definition.outputSchema, output)
			await emitSuccessEvent(this.input.manifest, input.appContext, validated)
			return { identity, output: validated }
		} finally {
			await session.release()
		}
	}

	private async getSession(sessionId: string): Promise<Session<any>> {
		if (this.harness) {
			return this.harness.getSession(sessionId)
		}
		if (this.input.manifest.session.mode === 'conversation') {
			this.logger?.warn(
				`Attached agent "${this.input.manifest.agentName}" uses conversation session mode but has no harness session (no models configured); conversation memory and history are not persisted`,
			)
		}
		return createLocalSession(sessionId)
	}

	private withDeclaredSkills(definition: HarnessAgentDefinition<any>) {
		const skillNames = Object.keys(this.input.skillRuntime?.harnessSkills ?? {})
		return {
			...definition,
			...(skillNames.length > 0 ? { skills: skillNames } : {}),
			...(this.input.manifest.builtInTools !== true ? { builtinTools: this.input.manifest.builtInTools } : {}),
		}
	}

	private async invokeRunFunctionThroughHarness(args: {
		input: AgentRuntimeInvocationInput
		identity: AgentRunIdentity
		session: Session<any>
		streaming: boolean
		emitWrapped: (event: RunEvent) => Promise<void>
		signal: AbortSignal
	}): Promise<unknown> {
		const invocationId = randomUUID()
		this.runFunctionInvocations.set(invocationId, {
			payload: args.input.payload,
			parameter: args.input.parameter,
			identity: args.identity,
			appContext: args.input.appContext,
			session: args.session,
		})
		try {
			const sessionAny = args.session as any
			const invokeOptions: InvokeOptions = { signal: args.signal }
			return args.streaming
				? await this.streamHarnessCall(args.session, { invocationId }, args.emitWrapped, 'agent', invokeOptions)
				: await sessionAny.agents[this.input.manifest.agentName].prompt({ invocationId }, invokeOptions)
		} finally {
			this.runFunctionInvocations.delete(invocationId)
		}
	}

	private async runFunctionWithoutHarness(args: {
		input: AgentRuntimeInvocationInput
		identity: AgentRunIdentity
		session: Session<any>
		signal: AbortSignal
	}): Promise<unknown> {
		if (this.input.definition.execution.kind !== 'runFunction') {
			throw new Error('PURISTA custom agent execution is unavailable.')
		}
		const context = createAgentHandlerContext({
			payload: args.input.payload,
			parameter: args.input.parameter,
			identity: args.identity,
			appContext: args.input.appContext,
			metrics: args.input.appContext.metrics as never,
			session: args.session,
			models: {} as AgentHandlerModelBindings<Models>,
			skills: this.input.skillRuntime
				? createAgentSkillContext(this.input.skillRuntime.catalog)
				: createAgentSkillContext([]),
			commandTools: this.input.manifest.allowedCommands,
			agentTools: this.input.manifest.allowedAgents,
			serviceName: this.input.manifest.serviceName,
			logger: this.resolvePuristaLogger(args.input.appContext),
			signal: args.signal,
		})
		return this.input.definition.execution.handler(context)
	}

	private async runFunctionThroughHarness(
		invocationId: string,
		context: { models: AgentHandlerModelBindings<Models>; signal: AbortSignal },
	): Promise<unknown> {
		const invocation = this.runFunctionInvocations.get(invocationId)
		if (!invocation || this.input.definition.execution.kind !== 'runFunction') {
			throw new Error('PURISTA custom agent invocation is no longer active.')
		}
		const handlerContext = createAgentHandlerContext({
			payload: invocation.payload,
			parameter: invocation.parameter,
			identity: invocation.identity,
			appContext: invocation.appContext,
			metrics: invocation.appContext.metrics as never,
			session: invocation.session,
			models: context.models,
			skills: this.input.skillRuntime
				? createAgentSkillContext(this.input.skillRuntime.catalog)
				: createAgentSkillContext([]),
			commandTools: this.input.manifest.allowedCommands,
			agentTools: this.input.manifest.allowedAgents,
			serviceName: this.input.manifest.serviceName,
			logger: this.resolvePuristaLogger(invocation.appContext),
			signal: context.signal,
		})
		return this.input.definition.execution.handler(handlerContext)
	}

	private createInvokeOptions(identity: AgentRunIdentity, signal: AbortSignal): InvokeOptions {
		const workspacePolicy = this.input.manifest.workspacePolicy
		if (workspacePolicy?.mode !== 'durable') {
			return { signal }
		}
		return {
			signal,
			durable: {
				// Harness durable ids have a strict portable character set. A digest
				// keeps arbitrary transport ids stable without treating them as ids.
				runId: `purista:${createHash('sha256').update(identity.runId).digest('hex')}`,
				...(workspacePolicy.policy ? { workspacePolicy: workspacePolicy.policy } : {}),
			},
		}
	}

	private async streamHarnessCall(
		session: Session<any>,
		payload: unknown,
		emitWrapped: (event: RunEvent) => Promise<void>,
		kind: 'agent' | 'workflow',
		options: InvokeOptions,
	) {
		let output: unknown
		let finished = false
		const sessionAny = session as any
		const agentName = this.input.manifest.agentName
		const stream =
			kind === 'agent'
				? sessionAny.agents[agentName].stream(payload, options)
				: sessionAny.workflows[agentName].stream(payload, options)

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
			list: async () => [],
			search: async () => [],
		},
		history: {
			list: async () => [],
		},
		getRunSummary: async () => undefined,
		clearHistory: async () => undefined,
		replaceHistory: async () => undefined,
		release: async () => undefined,
		close: async () => undefined,
	} as Session<any>
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
		throw new Error(`Agent output validation failed: ${JSON.stringify(result.issues)}`)
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
