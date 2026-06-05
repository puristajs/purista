import {
	defineHarness,
	type DurableRuntime,
	type Harness,
	type AgentDefinition as HarnessAgentDefinition,
	type WorkflowDefinition as HarnessWorkflowDefinition,
	type ModelAlias,
	type RunEvent,
	type Session,
	type TelemetryOptions,
} from '@purista/harness'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { Schema } from '../../schema/index.js'
import { validate } from '../../schema/index.js'
import type {
	AgentDefinition,
	AgentManifest,
	AgentModelBinding,
	AgentRuntimeInvocationInput,
	AgentRuntimeModelBindings,
	AgentRuntimeStreamInvocationInput,
} from '../types.js'
import { createAgentHandlerContext } from './context.js'
import { createAgentRunEvent } from './events.js'
import { deriveAgentRunIdentity } from './identity.js'
import { createPuristaHarnessLogger } from './logger.js'
import { createHandlerModelBindings, resolveRuntimeModelBindings } from './modelBindings.js'
import { createProviderSseEvent } from './sseEvents.js'
import { createPuristaHarnessStateStore } from './stateStore.js'

export type CreateAgentExecutorInput<Models extends Record<string, AgentModelBinding>> = {
	definition: AgentDefinition<any>
	manifest: AgentManifest<Models>
	models: AgentRuntimeModelBindings<Models>
	runtime?: DurableRuntime
	workspaceStore?: unknown
	logger?: PuristaLogger
	stateStore?: unknown
	sandbox?: unknown
	telemetry?: TelemetryOptions
}

export function createAgentExecutor<Models extends Record<string, AgentModelBinding>>(
	input: CreateAgentExecutorInput<Models>,
) {
	return new HarnessBackedAgentExecutor(input)
}

class HarnessBackedAgentExecutor<Models extends Record<string, AgentModelBinding>> {
	private readonly harness?: Harness<any>
	private readonly resolvedModels: Record<string, ModelAlias>
	private readonly handlerModels
	private readonly logger?: PuristaLogger

	constructor(private readonly input: CreateAgentExecutorInput<Models>) {
		this.logger = input.logger
		this.resolvedModels = resolveRuntimeModelBindings(input.manifest, input.models)
		this.handlerModels = createHandlerModelBindings(this.resolvedModels)
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
				sequenceNumber += 1
				await input.writer.write(createProviderSseEvent(event, sequenceNumber))
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
			.state(createPuristaHarnessStateStore(this.input.stateStore as never))
			.models(this.resolvedModels)

		if (this.input.telemetry) {
			builder = builder.telemetry(this.input.telemetry)
		}

		if (this.input.manifest.execution.timeoutMs !== undefined) {
			builder = builder.defaults({ runTimeoutMs: this.input.manifest.execution.timeoutMs })
		}

		if (this.input.sandbox) {
			builder = builder.sandbox(this.input.sandbox as never)
		}

		if (this.input.runtime) {
			builder = builder.runtime(this.input.runtime)
		}

		if (this.input.workspaceStore) {
			builder = builder.workspaceStore(this.input.workspaceStore)
		}

		if (this.input.manifest.workspacePolicy?.capabilities?.length) {
			builder = builder.requires(this.input.manifest.workspacePolicy.capabilities)
		}

		if (this.input.definition.execution.kind === 'harnessAgent') {
			builder = builder.agents({
				[this.input.manifest.agentName]: this.input.definition.execution.definition as HarnessAgentDefinition<any>,
			})
		}

		if (this.input.definition.execution.kind === 'harnessWorkflow') {
			builder = builder.workflows({
				[this.input.manifest.agentName]: this.input.definition.execution.definition as HarnessWorkflowDefinition<any>,
			})
		}

		if (this.input.definition.execution.kind === 'runFunction') {
			builder = builder.agents({
				[this.input.manifest.agentName]: {
					model: Object.keys(this.resolvedModels)[0],
					instructions: 'Run the PURISTA custom agent handler.',
					handler: async () => undefined,
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
		})
		const session = await this.getSession(identity.harnessSessionId)
		const events: ReturnType<typeof createAgentRunEvent>[] = []
		const emitWrapped = async (event: RunEvent) => {
			const wrapped = createAgentRunEvent(identity, event)
			events.push(wrapped)
			await emit?.(wrapped)
		}

		let output: unknown
		if (this.input.definition.execution.kind === 'runFunction') {
			const context = createAgentHandlerContext({
				payload: input.payload,
				parameter: input.parameter,
				identity,
				appContext: input.appContext,
				session,
				models: this.handlerModels,
				commandTools: this.input.manifest.allowedCommands,
				agentTools: this.input.manifest.allowedAgents,
				serviceName: this.input.manifest.serviceName,
				emitEvent: emitWrapped,
				logger: this.resolvePuristaLogger(input.appContext),
				signal,
			})
			output = await this.input.definition.execution.handler(context)
		} else if (this.input.definition.execution.kind === 'harnessAgent') {
			const sessionAny = session as any
			const agentName = this.input.manifest.agentName
			output = streaming
				? await this.streamHarnessCall(session, input.payload, emitWrapped, 'agent')
				: await sessionAny.agents[agentName].prompt(input.payload, { signal })
		} else {
			const sessionAny = session as any
			const agentName = this.input.manifest.agentName
			output = streaming
				? await this.streamHarnessCall(session, input.payload, emitWrapped, 'workflow')
				: await sessionAny.workflows[agentName].prompt(input.payload, { signal })
		}

		const validated = await validateOutput(this.input.definition.outputSchema, output)
		await emitSuccessEvent(this.input.manifest, input.appContext, validated)
		return { identity, output: validated, events }
	}

	private async getSession(sessionId: string): Promise<Session<any>> {
		if (this.harness) {
			return this.harness.getSession(sessionId)
		}
		return createLocalSession(sessionId)
	}

	private async streamHarnessCall(
		session: Session<any>,
		payload: unknown,
		emitWrapped: (event: RunEvent) => Promise<void>,
		kind: 'agent' | 'workflow',
	) {
		let output: unknown
		const sessionAny = session as any
		const agentName = this.input.manifest.agentName
		const stream =
			kind === 'agent' ? sessionAny.agents[agentName].stream(payload) : sessionAny.workflows[agentName].stream(payload)

		for await (const event of stream) {
			await emitWrapped(event)
			if (event.type === 'run.finished' && 'output' in event) {
				output = event.output
			}
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
		close: async () => undefined,
	} as Session<any>
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
