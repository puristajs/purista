import { HandledError, type Logger, StatusCode } from '@purista/core'
import { z } from 'zod'
import type { JsonValue } from '../protocol/types.js'
import type { AgentRunHandle, AgentRunTaskInput, AgentRunTaskKind } from './runState.js'

const planRuntimeSymbol = Symbol.for('@purista/ai/planRuntime')

const generatedPlanTaskSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	instruction: z.string().min(1),
	delegate: z.string().min(1).optional(),
	dependsOn: z.array(z.string().min(1)).optional(),
})

export const generatedExecutionPlanSchema = z.object({
	title: z.string().min(1).optional(),
	summary: z.string().optional(),
	tasks: z.array(generatedPlanTaskSchema).min(1),
})

/**
 * Canonical planner output schema used by {@link context.plan.generate}.
 *
 * The planner produces business-level sequential tasks only. Routing to worker/delegates
 * is resolved at execution time via {@link AgentExecutionPlan}.
 */
export type GeneratedExecutionPlan = z.infer<typeof generatedExecutionPlanSchema>

/**
 * Runtime task shape used during plan execution.
 *
 * This extends persisted run-state task metadata with planner fields
 * (`instruction`, optional `delegate`) so a task can be executed deterministically.
 */
export type AgentPlanTask = AgentRunTaskInput & {
	id: string
	title: string
	instruction: string
	delegate?: string
}

/**
 * Input passed to worker/delegate executors for each generated task.
 */
export type AgentPlanExecutionContext<Context> = {
	context: Context
	request: string
	task: AgentPlanTask
	run: AgentRunHandle
	results: Record<string, unknown>
}

export type AgentPlanExecutorKind = Extract<
	AgentRunTaskKind,
	'tool' | 'agent' | 'model' | 'reasoning' | 'approval' | 'custom'
>

/**
 * Reusable callable endpoint used by the planner runtime.
 *
 * - `worker` is required and handles non-delegated tasks.
 * - `delegates` are optional and selected by task `delegate`.
 */
export type AgentPlanExecutor<Context, TResult = unknown> = {
	id: string
	description: string
	kind?: AgentPlanExecutorKind
	call(input: AgentPlanExecutionContext<Context>): Promise<TResult>
}

type AnyAgentPlanExecutor = AgentPlanExecutor<any, any>

/**
 * Extracts the async result type produced by a planner executor.
 */
export type AgentPlanExecutorResult<TExecutor extends AnyAgentPlanExecutor> =
	TExecutor extends AgentPlanExecutor<any, infer TResult> ? TResult : unknown

/**
 * Resolves a delegate executor by its declared id.
 */
export type AgentPlanDelegateById<
	Delegates extends readonly AnyAgentPlanExecutor[],
	DelegateId extends string,
> = Extract<Delegates[number], { id: DelegateId }>

/**
 * Computes the result type for a single task by looking at its delegate/worker route.
 */
export type AgentPlanTaskResult<
	Task extends AgentPlanTask,
	Worker extends AnyAgentPlanExecutor,
	Delegates extends readonly AnyAgentPlanExecutor[],
> = Task extends { delegate: infer DelegateId extends string }
	? [AgentPlanDelegateById<Delegates, DelegateId>] extends [never]
		? AgentPlanExecutorResult<Worker>
		: AgentPlanExecutorResult<AgentPlanDelegateById<Delegates, DelegateId>>
	: AgentPlanExecutorResult<Worker>

/**
 * Strongly-typed task result map for an execution plan.
 *
 * When task ids/delegates are known statically, `results` becomes strongly typed
 * per task id. For fully dynamic planner output, this degrades to `Record<string, unknown>`.
 */
export type AgentPlanResults<
	Tasks extends readonly AgentPlanTask[],
	Worker extends AnyAgentPlanExecutor,
	Delegates extends readonly AnyAgentPlanExecutor[],
> = {
	[Task in Tasks[number] as Task['id']]: AgentPlanTaskResult<Task, Worker, Delegates>
}

type AgentPlanRuntimeBindings<
	Context,
	Worker extends AgentPlanExecutor<Context, any>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[],
> = {
	request: string
	scope?: Record<string, string>
	worker: Worker
	delegates: Map<string, Delegates[number]>
}

/**
 * Executable plan with attached runtime bindings.
 *
 * The runtime bindings are attached internally by `context.plan.generate(...)`.
 */
export type AgentExecutionPlan<
	Context = unknown,
	Tasks extends readonly AgentPlanTask[] = readonly AgentPlanTask[],
	Worker extends AgentPlanExecutor<Context, any> = AgentPlanExecutor<Context, unknown>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[] = readonly AgentPlanExecutor<Context, unknown>[],
> = {
	title: string
	summary?: string
	tasks: Tasks
	[planRuntimeSymbol]?: AgentPlanRuntimeBindings<Context, Worker, Delegates>
}

/**
 * Input for generating a sequential execution plan.
 *
 * `request` and `title` can be inferred by runtime defaults when omitted.
 */
export type AgentPlanGenerateInput<
	Context,
	Models extends Record<string, { generateObject?: (...args: any[]) => Promise<any> }>,
	Worker extends AgentPlanExecutor<Context, any> = AgentPlanExecutor<Context, unknown>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[] = readonly AgentPlanExecutor<Context, unknown>[],
> = {
	title?: string
	model: Extract<keyof Models, string>
	request?: string
	scope?: Record<string, string>
	instructions?: string
	worker: Worker
	delegates?: Delegates
}

/**
 * Result returned by {@link AgentPlanHelpers.execute}.
 */
export type AgentPlanExecutionResult<
	Context = unknown,
	Tasks extends readonly AgentPlanTask[] = readonly AgentPlanTask[],
	Worker extends AgentPlanExecutor<Context, any> = AgentPlanExecutor<Context, unknown>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[] = readonly AgentPlanExecutor<Context, unknown>[],
> = {
	plan: AgentExecutionPlan<Context, Tasks, Worker, Delegates>
	results: AgentPlanResults<Tasks, Worker, Delegates>
	run: Awaited<ReturnType<AgentRunHandle['finishSuccess']>>
}

/**
 * Convenience helper to compute an execution result type directly from a plan type.
 */
export type AgentPlanExecutionResultFromPlan<Plan extends AgentExecutionPlan<any, any, any, any>> =
	Plan extends AgentExecutionPlan<infer Context, infer Tasks, infer Worker, infer Delegates>
		? AgentPlanExecutionResult<Context, Tasks, Worker, Delegates>
		: never

/**
 * High-level planner API exposed on `context.plan`.
 */
export type AgentPlanHelpers<
	Context,
	Models extends Record<string, { generateObject?: (...args: any[]) => Promise<any> }>,
> = {
	/**
	 * Generate a business-level sequential task plan from request + instructions.
	 */
	generate<
		Worker extends AgentPlanExecutor<Context, any>,
		Delegates extends readonly AgentPlanExecutor<Context, any>[] = readonly AgentPlanExecutor<Context, unknown>[],
	>(
		input: AgentPlanGenerateInput<Context, Models, Worker, Delegates>,
	): Promise<AgentExecutionPlan<Context, readonly AgentPlanTask[], Worker, Delegates>>
	/**
	 * Execute a generated plan sequentially using worker/delegate routing.
	 */
	execute<Plan extends AgentExecutionPlan<Context, any, any, any>>(
		plan: Plan,
	): Promise<AgentPlanExecutionResultFromPlan<Plan>>
}

type CreateAgentPlanHelpersInput<
	Context,
	Models extends Record<string, { generateObject?: (...args: any[]) => Promise<any> }>,
> = {
	getContext: () => Context
	getDefaultRequest?: () => string | undefined
	getDefaultTitle?: () => string | undefined
	getRunState: () => {
		start: (input: { title: string; scope?: Record<string, string> }) => Promise<AgentRunHandle>
	}
	getModels: () => Models
	logger: Logger
}

const summarizeFallback = (result: unknown): string | undefined => {
	if (typeof result === 'string' && result.trim().length > 0) {
		return result.trim()
	}
	if (typeof result === 'number' || typeof result === 'boolean') {
		return String(result)
	}
	if (result && typeof result === 'object') {
		return undefined
	}
	return undefined
}

const attachPlanRuntime = <
	Context,
	Tasks extends readonly AgentPlanTask[],
	Worker extends AgentPlanExecutor<Context, any>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[],
>(
	plan: AgentExecutionPlan<Context, Tasks, Worker, Delegates>,
	runtime: AgentPlanRuntimeBindings<Context, Worker, Delegates>,
): AgentExecutionPlan<Context, Tasks, Worker, Delegates> => {
	Object.defineProperty(plan, planRuntimeSymbol, {
		value: runtime,
		enumerable: false,
		configurable: false,
		writable: false,
	})
	return plan
}

const getPlanRuntime = <
	Context,
	Tasks extends readonly AgentPlanTask[],
	Worker extends AgentPlanExecutor<Context, any>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[],
>(
	plan: AgentExecutionPlan<Context, Tasks, Worker, Delegates>,
) => {
	const runtime = plan[planRuntimeSymbol]
	if (!runtime) {
		throw new HandledError(
			StatusCode.BadRequest,
			'Plan is missing runtime bindings. Generate the plan with context.plan.generate(...) before executing it.',
		)
	}
	return runtime
}

const normalizePlannerDelegateId = (delegate: string | undefined): string | undefined => {
	if (!delegate) {
		return undefined
	}

	const normalized = delegate.trim()
	if (normalized.length === 0) {
		return undefined
	}

	if (
		normalized === 'worker' ||
		normalized === '/worker' ||
		normalized === 'default-worker' ||
		normalized === '/default-worker'
	) {
		return undefined
	}

	return normalized
}

const normalizePlanTask = <
	Context,
	Worker extends AgentPlanExecutor<Context, any>,
	Delegates extends readonly AgentPlanExecutor<Context, any>[],
>(
	task: z.infer<typeof generatedPlanTaskSchema>,
	index: number,
	runtime: AgentPlanRuntimeBindings<Context, Worker, Delegates>,
): AgentPlanTask => {
	const delegate = normalizePlannerDelegateId(task.delegate)
	const executor = delegate ? runtime.delegates.get(delegate) : runtime.worker
	if (!executor) {
		throw new HandledError(
			StatusCode.BadGateway,
			delegate
				? `Planner selected unknown delegate ${delegate}`
				: 'Planner generated a task without a resolvable worker',
		)
	}

	return {
		id: task.id,
		title: task.title,
		instruction: task.instruction,
		delegate,
		order: index,
		status: 'pending',
		kind: executor.kind ?? 'custom',
		detail: task.instruction,
		dependsOn: task.dependsOn,
	}
}

const buildPlannerPrompt = <Context>(input: {
	title: string
	request: string
	instructions?: string
	worker: AgentPlanExecutor<Context, any>
	delegates: readonly AgentPlanExecutor<Context, any>[]
}) => {
	const delegateLines = input.delegates.length
		? input.delegates.map(delegate => `- id: ${delegate.id}\n  description: ${delegate.description}`).join('\n')
		: '- none'

	return `You are planning a sequential task execution flow for the workflow "${input.title}".
Break down the request into an exact sequential plan.

Execution model:
- The default worker handles tasks when no delegate is specified.
- For tasks handled by the default worker, omit the delegate field entirely.
- Never set delegate to "worker", "/worker", "default-worker", or "/default-worker".
- Delegates are optional specialist handoffs.
- Use a delegate only when the task should be handed to that specialist.
- Do not invent delegate ids.
- Execution is sequential and single-agent.

Default worker:
- description: ${input.worker.description}

Available delegates:
${delegateLines}

Return JSON with:
- title?: optional workflow title
- summary?: optional short planning summary
- tasks: ordered array of
  - id: stable task id
  - title: short task title
  - instruction: exact instruction passed to the worker or delegate as the user task message
  - delegate?: optional delegate id
  - dependsOn?: optional ids of prerequisite tasks

${input.instructions ? `Additional planning instructions:\n${input.instructions}\n\n` : ''}User request:
${input.request}`
}

const toJsonValue = (value: unknown): JsonValue => {
	if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value
	}
	if (Array.isArray(value)) {
		return value.map(toJsonValue)
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, toJsonValue(entry)]),
		) as JsonValue
	}
	return String(value)
}

/**
 * Creates planner helpers exposed as `context.plan`.
 *
 * The returned helpers implement the strict split between:
 * - plan generation (`generate`)
 * - sequential execution (`execute`)
 */
export const createAgentPlanHelpers = <
	Context extends {
		io: {
			tasks: {
				sendChunk(
					taskId: string,
					content: JsonValue,
					options?: {
						kind?: string
						sequence?: number
						metadata?: Record<string, unknown>
						final?: boolean
						mimeType?: string
					},
				): void
			}
		}
	},
	Models extends Record<string, { generateObject?: (...args: any[]) => Promise<any> }>,
>(
	input: CreateAgentPlanHelpersInput<Context, Models>,
): AgentPlanHelpers<Context, Models> => {
	/**
	 * Generates a plan and attaches hidden runtime bindings needed by `execute(...)`.
	 */
	const generate = async <
		Worker extends AgentPlanExecutor<Context, any>,
		Delegates extends readonly AgentPlanExecutor<Context, any>[],
	>(
		generateInput: AgentPlanGenerateInput<Context, Models, Worker, Delegates>,
	): Promise<AgentExecutionPlan<Context, readonly AgentPlanTask[], Worker, Delegates>> => {
		const models = input.getModels()
		const model = models[generateInput.model]
		if (!model || typeof model.generateObject !== 'function') {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Model ${String(generateInput.model)} cannot generate plans`,
			)
		}

		const request = (generateInput.request ?? input.getDefaultRequest?.() ?? '').trim()
		if (request.length === 0) {
			throw new HandledError(
				StatusCode.BadRequest,
				'Plan generation requires a request. Pass request explicitly or provide a payload prompt.',
			)
		}
		const title = (generateInput.title ?? input.getDefaultTitle?.() ?? 'Agent workflow').trim()
		if (title.length === 0) {
			throw new HandledError(StatusCode.BadRequest, 'Plan generation title cannot be empty')
		}

		const delegates = (generateInput.delegates ?? []) as Delegates
		const duplicateIds = new Set<string>()
		for (const delegate of delegates) {
			if (delegate.id === generateInput.worker.id || duplicateIds.has(delegate.id)) {
				throw new HandledError(StatusCode.BadRequest, `Duplicate delegate id ${delegate.id}`)
			}
			duplicateIds.add(delegate.id)
		}

		const runtime: AgentPlanRuntimeBindings<Context, Worker, Delegates> = {
			request,
			scope: generateInput.scope,
			worker: generateInput.worker,
			delegates: new Map(delegates.map(delegate => [delegate.id, delegate])) as Map<string, Delegates[number]>,
		}

		const planned = await model.generateObject({
			prompt: buildPlannerPrompt({
				title,
				request,
				instructions: generateInput.instructions,
				worker: generateInput.worker,
				delegates,
			}),
			schema: generatedExecutionPlanSchema,
		})

		const planData = planned.data as GeneratedExecutionPlan
		const duplicateTaskIds = new Set<string>()
		for (const task of planData.tasks) {
			if (duplicateTaskIds.has(task.id)) {
				throw new HandledError(StatusCode.BadGateway, `Planner generated duplicate task id ${task.id}`)
			}
			duplicateTaskIds.add(task.id)
		}
		const plan: AgentExecutionPlan<Context, readonly AgentPlanTask[], Worker, Delegates> = {
			title: planData.title ?? title,
			summary: planData.summary,
			tasks: planData.tasks.map((task, index) => normalizePlanTask(task, index, runtime)),
		}

		return attachPlanRuntime(plan, runtime)
	}

	/**
	 * Executes plan tasks in declared order and emits canonical task artifacts.
	 */
	const execute = async <
		Plan extends AgentExecutionPlan<
			Context,
			readonly AgentPlanTask[],
			AgentPlanExecutor<Context, unknown>,
			readonly AgentPlanExecutor<Context, unknown>[]
		>,
	>(
		plan: Plan,
	): Promise<AgentPlanExecutionResultFromPlan<Plan>> => {
		const runtime = getPlanRuntime(plan)
		const context = input.getContext()
		const run = await input.getRunState().start({
			title: plan.title,
			scope: runtime.scope,
		})
		await run.plan([...plan.tasks])
		const results: Record<string, unknown> = {}

		for (const task of plan.tasks) {
			const executor = task.delegate ? runtime.delegates.get(task.delegate) : runtime.worker
			if (!executor) {
				throw new HandledError(
					StatusCode.BadRequest,
					task.delegate ? `Unknown delegate ${task.delegate}` : 'No worker available for plan execution',
				)
			}
			if (task.dependsOn?.some(id => !(id in results))) {
				await run.updateTask(task.id, {
					status: 'blocked',
					detail: `Waiting for dependencies: ${task.dependsOn.filter(id => !(id in results)).join(', ')}`,
				})
				throw new HandledError(StatusCode.Conflict, `Task ${task.id} is blocked by unmet dependencies`)
			}

			await run.updateTask(task.id, {
				kind: executor.kind ?? task.kind ?? 'custom',
				detail: task.instruction,
				delegate: task.delegate,
				instruction: task.instruction,
			})
			await run.startTask(task.id, task.instruction)

			try {
				const result = await executor.call({
					context,
					request: runtime.request,
					task,
					run,
					results,
				})
				results[task.id] = result
				const summary = summarizeFallback(result) ?? task.summary
				await run.updateTask(task.id, {
					output: result,
					summary,
				})
				await run.completeTask(task.id, summary)
				context.io.tasks.sendChunk(task.id, toJsonValue(result), {
					kind: 'final-output',
					final: true,
					mimeType: 'application/json',
				})
			} catch (error) {
				await run.failTask(task.id, error instanceof Error ? error.message : String(error))
				throw error
			}
		}

		const finalRun = await run.finishSuccess(plan.summary ?? 'Plan execution completed')
		return {
			plan,
			results: results as AgentPlanExecutionResultFromPlan<Plan>['results'],
			run: finalRun,
		} as unknown as AgentPlanExecutionResultFromPlan<Plan>
	}

	return {
		generate,
		execute,
	}
}
