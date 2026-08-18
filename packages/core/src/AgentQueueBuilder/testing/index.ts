import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type {
	EmbeddingRequest,
	EmbeddingResponse,
	GovernanceConfig,
	JsonValue,
	ModelProvider,
	ObjectRequest,
	ObjectResponse,
	ObjectStreamChunk,
	RerankRequest,
	RerankResponse,
	Sandbox,
	TextRequest,
	TextResponse,
	TextStreamChunk,
} from '@purista/harness'
import type { StateStore } from '../../core/StateStore/types/StateStore.js'
import type { EmptyObject } from '../../core/types/EmptyObject.js'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from '../../core/types/PuristaMetrics.js'
import { createAgentExecutor } from '../runtime/executor.js'
import { resolveAgentRuntimeSkills } from '../runtime/skills.js'
import type {
	AgentHandlerContext,
	AgentHarnessRuntimeOptions,
	AgentModelBinding,
	AgentRunIdentity,
	AgentRuntimeModelBindings,
	AgentRuntimeOptions,
	AgentSkillContext,
	AgentSkillRuntimeBinding,
	AgentSkillRuntimeOptions,
	AttachedAgentDefinition,
} from '../types.js'

export type CreateAgentContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	payload?: Payload
	parameter?: Parameter
	resources?: Resources
	models?: AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models']
	skills?: AgentSkillContext
	metrics?: PuristaMetricContext<Metrics>
	identity?: Partial<AgentRunIdentity>
	logger?: PuristaLogger
}

export function createAgentContextMock<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
>(
	input: CreateAgentContextMockInput<Payload, Parameter, Resources, Models, Metrics> = {},
): AgentHandlerContext<Payload, Parameter, Resources, Models, Record<never, never>, Record<never, never>, Metrics> {
	const identity: AgentRunIdentity = {
		transportMessageId: 'test-message',
		serviceName: 'test',
		serviceVersion: '1',
		agentName: 'agent',
		runtimeRevision: 'test',
		runId: 'test-run',
		harnessSessionId: 'test-session',
		...input.identity,
	}

	const resources = (input.resources ?? {}) as Resources
	const message = { id: identity.transportMessageId }
	const emit = async () => undefined
	const service = {}
	const stream = {}
	const queue = {}
	return {
		payload: input.payload as Payload,
		parameter: input.parameter as Parameter,
		identity,
		message,
		emit,
		service,
		stream,
		queue,
		resources,
		metrics: (input.metrics ?? {}) as PuristaMetricContext<Metrics>,
		harness: {
			session: createSessionMock(identity.harnessSessionId),
			models: (input.models ?? {}) as AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models'],
			skills: input.skills ?? emptySkillContext(),
		},
		invoke: {
			tools: {},
			agents: {},
		},
		logger: input.logger ?? createNoopPuristaLogger(),
		signal: new AbortController().signal,
	}
}

function emptySkillContext(): AgentSkillContext {
	return {
		catalog: [],
		systemPromptFragment: () => '',
		resolve: () => undefined,
	}
}

export function createScriptedHarnessModel() {
	return new ScriptedHarnessModelProvider()
}

export type CreateAgentSkillTestRuntimeSkill = {
	/** Skill frontmatter name. Must match the name declared by `.useSkills(...)`. */
	name: string
	/** Skill frontmatter description shown in the model-visible skill catalog. */
	description?: string
	/** Markdown body written after frontmatter. The body is mounted for `read`, not inlined into prompts. */
	body?: string
	/** Optional frontmatter compatibility value surfaced in the skill catalog. */
	compatibility?: string
	/** Optional `.useSkills(..., resourceName)` namespace for the generated binding. */
	resourceName?: string
	/** Trust value reported to the runtime skill catalog. */
	trust?: 'trusted' | 'project' | 'user'
	/** Optional source label reported to the runtime skill catalog. */
	source?: string
}

export type AgentSkillTestRuntime = {
	/** Runtime skill options passed to `createAgentTestHarness(..., { skills })` or service `ai.skills`. */
	skills: AgentSkillRuntimeOptions
	/** Absolute skill directories keyed by skill name. */
	directories: Record<string, string>
	/** Remove the temporary skill root. Call from test teardown when the process keeps running. */
	cleanup(): Promise<void>
}

/**
 * Create temporary runtime skill bindings for deterministic agent tests.
 *
 * The helper writes minimal `SKILL.md` files to a temporary directory and
 * returns the `skills` runtime option expected by `createAgentTestHarness(...)`.
 * It mirrors production skill binding behavior without requiring tests to
 * hand-roll filesystem fixtures or expose skill bodies in prompts.
 *
 * @example
 * ```ts
 * const skillRuntime = await createAgentSkillTestRuntime([
 *   { name: 'incident-responder', description: 'Incident response guidance' },
 * ])
 *
 * const harness = await createAgentTestHarness(await triageAgent.getDefinition(), {
 *   models,
 *   skills: skillRuntime.skills,
 * })
 *
 * await skillRuntime.cleanup()
 * ```
 */
export async function createAgentSkillTestRuntime(
	skills: readonly CreateAgentSkillTestRuntimeSkill[],
): Promise<AgentSkillTestRuntime> {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-agent-skills-'))
	const bindings: Record<string, AgentSkillRuntimeBinding> = {}
	const namespaces: NonNullable<AgentSkillRuntimeOptions['namespaces']> = {}
	const directories: Record<string, string> = {}

	for (const skill of skills) {
		const directory = path.join(root, skill.resourceName ?? 'global', skill.name)
		await fs.mkdir(directory, { recursive: true })
		await fs.writeFile(path.join(directory, 'SKILL.md'), renderTestSkill(skill))
		const binding: AgentSkillRuntimeBinding = {
			directory,
			trust: skill.trust ?? 'trusted',
			source: skill.source ?? 'test',
		}
		directories[skill.name] = directory
		if (skill.resourceName) {
			namespaces[skill.resourceName] = {
				...(namespaces[skill.resourceName] ?? {}),
				[skill.name]: binding,
			}
		} else {
			bindings[skill.name] = binding
		}
	}

	return {
		skills: {
			...(Object.keys(bindings).length > 0 ? { bindings } : {}),
			...(Object.keys(namespaces).length > 0 ? { namespaces } : {}),
		},
		directories,
		cleanup: async () => {
			await fs.rm(root, { recursive: true, force: true })
		},
	}
}

function renderTestSkill(skill: CreateAgentSkillTestRuntimeSkill): string {
	const description = skill.description ?? `Test skill fixture for ${skill.name}.`
	const frontmatter = [`name: ${skill.name}`, `description: ${description}`]
	if (skill.compatibility) frontmatter.push(`compatibility: ${skill.compatibility}`)
	return `---
${frontmatter.join('\n')}
---
${skill.body ?? 'Use this deterministic test skill fixture.'}
`
}

export type CreateAgentTestHarnessOptions<Models extends Record<string, AgentModelBinding>> = {
	models: AgentRuntimeModelBindings<Models>
	/**
	 * Runtime skill bindings for agents that declare `.useSkills(...)`.
	 *
	 * @example
	 * ```ts
	 * const harness = await createAgentTestHarness(definition, {
	 *   models,
	 *   skills: { bindings: { 'incident-responder': { directory: skillDir } } },
	 * })
	 * ```
	 */
	skills?: AgentSkillRuntimeOptions
	/** Explicit static Harness modules and tools to bind for this test runtime. */
	harness?: AgentHarnessRuntimeOptions
	/** Explicit single-tenant identity used by conversation-session tests. */
	tenancy?: AgentRuntimeOptions<Models>['tenancy']
	/** Optional durable runtime for workflow replay tests. */
	runtime?: AgentRuntimeOptions<Models>['runtime']
	/** Optional durable workspace store for workflow replay tests. */
	workspaceStore?: AgentRuntimeOptions<Models>['workspaceStore']
	/** Optional sandbox adapter used to verify sandbox-backed agent behavior. */
	sandbox?: Sandbox
	/** Optional state store for conversation/session lifecycle tests. */
	stateStore?: StateStore
	logger?: PuristaLogger
	governance?: GovernanceConfig<any>
}

/** Create a deterministic runtime harness for one attached agent definition. */
export async function createAgentTestHarness<Definition extends AttachedAgentDefinition<any>>(
	definition: Definition,
	options: CreateAgentTestHarnessOptions<Definition['manifest']['models']>,
) {
	const skillRuntime = await resolveAgentRuntimeSkills(definition.manifest, options.skills)
	const executor = createAgentExecutor({
		definition,
		manifest: definition.manifest,
		models: options.models,
		harness: options.harness,
		runtime: options.runtime,
		workspaceStore: options.workspaceStore,
		sandbox: options.sandbox,
		stateStore: options.stateStore,
		skillRuntime,
		logger: options.logger,
		governance: options.governance,
		singleTenantId: options.tenancy?.singleTenantId,
	})
	definition.runtime.current = executor

	return {
		async run(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			return executor.executeAggregate({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
			})
		},
		async stream(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			const chunks: unknown[] = []
			let final: unknown
			await executor.executeStream({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
				writer: {
					write: async chunk => {
						chunks.push(chunk)
					},
					close: async value => {
						final = value
					},
					fail: async error => {
						throw error
					},
					onCancel: () => undefined,
				},
			})
			return { chunks, final }
		},
	}
}

function createSessionMock(id: string) {
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
	}
}

function createAppContext(logger?: PuristaLogger) {
	return {
		message: { id: 'test-message' },
		resources: {},
		emit: async () => undefined,
		service: {},
		stream: {},
		queue: {},
		metrics: {},
		logger: logger ?? createNoopPuristaLogger(),
	}
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

export class ScriptedHarnessModelProvider implements ModelProvider {
	readonly id = 'scripted'
	readonly genAiSystem = 'scripted'
	readonly requests: Array<TextRequest | ObjectRequest | EmbeddingRequest | RerankRequest> = []
	private readonly textQueue: TextResponse[] = []
	private readonly objectQueue: ObjectResponse[] = []
	private readonly embeddingQueue: EmbeddingResponse[] = []
	private readonly rerankQueue: RerankResponse[] = []
	private readonly textStreamQueue: TextStreamChunk[][] = []
	private readonly objectStreamQueue: ObjectStreamChunk[][] = []

	enqueueText(response: TextResponse): void {
		this.textQueue.push(response)
	}

	enqueueObject(response: ObjectResponse): void {
		this.objectQueue.push(response)
	}

	enqueue(response: ObjectResponse): void {
		this.enqueueObject(response)
	}

	enqueueEmbedding(response: EmbeddingResponse): void {
		this.embeddingQueue.push(response)
	}

	enqueueRerank(response: RerankResponse): void {
		this.rerankQueue.push(response)
	}

	enqueueTextStream(chunks: TextStreamChunk[]): void {
		this.textStreamQueue.push(chunks)
	}

	enqueueObjectStream(chunks: ObjectStreamChunk[]): void {
		this.objectStreamQueue.push(chunks)
	}

	async text(req: TextRequest): Promise<TextResponse> {
		this.requests.push(req)
		return shiftScripted(this.textQueue, 'text')
	}

	async *textStream(req: TextRequest): AsyncIterable<TextStreamChunk> {
		this.requests.push(req)
		for (const chunk of shiftScripted(this.textStreamQueue, 'text stream')) {
			yield chunk
		}
	}

	async object<T extends JsonValue>(req: ObjectRequest<T>): Promise<ObjectResponse<T>> {
		this.requests.push(req)
		return shiftScripted(this.objectQueue, 'object') as ObjectResponse<T>
	}

	async *objectStream<T extends JsonValue>(req: ObjectRequest<T>): AsyncIterable<ObjectStreamChunk<T>> {
		this.requests.push(req)
		for (const chunk of shiftScripted(this.objectStreamQueue, 'object stream')) {
			yield chunk as ObjectStreamChunk<T>
		}
	}

	async embed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
		this.requests.push(req)
		return shiftScripted(this.embeddingQueue, 'embedding')
	}

	async rerank(req: RerankRequest): Promise<RerankResponse> {
		this.requests.push(req)
		return shiftScripted(this.rerankQueue, 'rerank')
	}
}

function shiftScripted<T>(queue: T[], label: string): T {
	const value = queue.shift()
	if (!value) {
		throw new Error(`No scripted ${label} response queued`)
	}
	return value
}
