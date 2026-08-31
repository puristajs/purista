import {
	type AgentExecutionInterceptor,
	agentGuardrailsBinding,
	defineHarness,
	type GovernanceConfig,
	type Harness,
	type AgentDefinition as HarnessAgentDefinition,
	type WorkflowDefinition as HarnessWorkflowDefinition,
	type ModelAlias,
	type RunEvent,
} from '@purista/harness'

import type { AgentRuntimeOptions, AgentSkillRuntimeResolved, AttachedAgentDefinition } from '../types.js'
import { createAgentConfigurationError } from './errors.js'
import { createPuristaHarnessLogger } from './logger.js'

export type AttachedHarnessRegistration = {
	readonly entryId: string
	readonly modelIds: Readonly<Record<string, string>>
	readonly publicModelIds: Readonly<Record<string, string>>
	readonly agentIds: Readonly<Record<string, string>>
	readonly publicAgentIds: Readonly<Record<string, string>>
	readonly publicWorkflowIds: Readonly<Record<string, string>>
}

export type PreparedAttachedAgentRuntime = {
	readonly definition: AttachedAgentDefinition<any>
	readonly skillRuntime: AgentSkillRuntimeResolved
	readonly resolvedModels: Readonly<Record<string, ModelAlias>>
	readonly registration: AttachedHarnessRegistration
}

export type ServiceHarnessRuntime = {
	readonly harness?: Harness<any>
	shutdown(): Promise<void>
}

export function prepareAttachedAgentRuntime(
	definition: AttachedAgentDefinition<any>,
	skillRuntime: AgentSkillRuntimeResolved,
	resolvedModels: Readonly<Record<string, ModelAlias>>,
): PreparedAttachedAgentRuntime {
	const entryId = toHarnessRegistryId(definition.manifest.agentName)
	const modelIds = Object.fromEntries(
		Object.keys(resolvedModels).map(alias => [
			alias,
			toScopedHarnessRegistryId('model', definition.manifest.agentName, alias),
		]),
	)
	const agentIds =
		definition.execution.kind === 'harnessWorkflow'
			? Object.fromEntries(
					Object.keys(definition.execution.agents ?? {}).map(agentName => [
						agentName,
						toScopedHarnessRegistryId('agent', definition.manifest.agentName, agentName),
					]),
				)
			: {}

	return {
		definition,
		skillRuntime,
		resolvedModels,
		registration: {
			entryId,
			modelIds,
			publicModelIds: invert(modelIds),
			agentIds,
			publicAgentIds: {
				[entryId]: definition.manifest.agentName,
				...invert(agentIds),
			},
			publicWorkflowIds:
				definition.execution.kind === 'harnessWorkflow' ? { [entryId]: definition.manifest.agentName } : {},
		},
	}
}

export function createServiceHarnessRuntime(
	prepared: readonly PreparedAttachedAgentRuntime[],
	options: AgentRuntimeOptions<Record<string, any>>,
): ServiceHarnessRuntime {
	if (!needsHarness(prepared)) {
		return { shutdown: async () => undefined }
	}

	validateServiceScope(prepared)
	const models = collectModels(prepared)
	const skills = collectSkills(prepared)
	const agents = collectAgents(prepared)
	const workflows = collectWorkflows(prepared)
	const first = prepared[0]
	if (!first) {
		return { shutdown: async () => undefined }
	}

	let builder: any = defineHarness({
		name: `${first.definition.manifest.serviceName}.${first.definition.manifest.serviceVersion}`,
	}).logger(createPuristaHarnessLogger(options.logger))

	if (Object.keys(models).length > 0) builder = builder.models(models)

	if (options.storage) builder = builder.storage(options.storage)
	if (options.memory) builder = builder.memory(options.memory)
	if (options.telemetry) {
		builder = builder.telemetry({ contentCaptureMode: 'NO_CONTENT', ...options.telemetry })
	}
	if (options.sandbox || options.sandboxOptions) {
		builder = options.sandbox
			? builder.sandbox(options.sandbox, options.sandboxOptions)
			: builder.sandbox(undefined, options.sandboxOptions)
	}
	if (options.workspace) builder = builder.workspace(options.workspace)
	if (Object.keys(skills).length > 0) builder = builder.skills(skills)

	const requiredCapabilities = [
		...new Set(prepared.flatMap(item => item.definition.manifest.workspacePolicy?.capabilities ?? [])),
	]
	if (requiredCapabilities.length > 0) builder = builder.requires(requiredCapabilities)
	if (Object.keys(agents).length > 0) builder = builder.agents(agents)
	if (Object.keys(workflows).length > 0) builder = builder.workflows(workflows)
	if (options.governance) {
		builder = builder.governance(translateGovernance(options.governance, prepared))
	}

	const harness = builder.build() as Harness<any>
	let shutdownPromise: Promise<void> | undefined
	return {
		harness,
		shutdown() {
			shutdownPromise ??= shutdownHarness(harness)
			return shutdownPromise
		},
	}
}

export function translateHarnessRunEvent(event: RunEvent, registration: AttachedHarnessRegistration): RunEvent {
	return translateIdentityFields(event, registration) as RunEvent
}

function needsHarness(prepared: readonly PreparedAttachedAgentRuntime[]): boolean {
	return prepared.some(
		item => item.definition.execution.kind !== 'runFunction' || Object.keys(item.resolvedModels).length > 0,
	)
}

function validateServiceScope(prepared: readonly PreparedAttachedAgentRuntime[]): void {
	const first = prepared[0]
	if (!first) return
	const serviceName = first.definition.manifest.serviceName
	const serviceVersion = first.definition.manifest.serviceVersion
	const entryIds = new Map<string, string>()
	for (const item of prepared) {
		const manifest = item.definition.manifest
		if (manifest.serviceName !== serviceName || manifest.serviceVersion !== serviceVersion) {
			throw createAgentConfigurationError(
				`Attached agent "${manifest.agentName}" does not belong to PURISTA service ${serviceName} v${serviceVersion}`,
			)
		}
		const existing = entryIds.get(item.registration.entryId)
		if (existing) {
			throw createAgentConfigurationError(
				`Attached agents "${existing}" and "${manifest.agentName}" resolve to the same Harness registry id`,
			)
		}
		entryIds.set(item.registration.entryId, manifest.agentName)
	}
}

function collectModels(prepared: readonly PreparedAttachedAgentRuntime[]): Record<string, ModelAlias> {
	return Object.fromEntries(
		prepared.flatMap(item =>
			Object.entries(item.resolvedModels).map(([publicId, model]) => [item.registration.modelIds[publicId], model]),
		),
	)
}

function collectSkills(prepared: readonly PreparedAttachedAgentRuntime[]): AgentSkillRuntimeResolved['harnessSkills'] {
	const skills: AgentSkillRuntimeResolved['harnessSkills'] = {}
	for (const item of prepared) {
		for (const [id, skill] of Object.entries(item.skillRuntime.harnessSkills)) {
			const existing = skills[id]
			if (
				existing &&
				(existing.directory !== skill.directory || existing.trust !== skill.trust || existing.source !== skill.source)
			) {
				throw createAgentConfigurationError(
					`Attached agent "${item.definition.manifest.agentName}" resolves service-scoped skill "${id}" differently from another attached agent`,
				)
			}
			skills[id] = skill
		}
	}
	return skills
}

function collectAgents(prepared: readonly PreparedAttachedAgentRuntime[]): Record<string, HarnessAgentDefinition<any>> {
	const agents: Record<string, HarnessAgentDefinition<any>> = {}
	for (const item of prepared) {
		const execution = item.definition.execution
		if (execution.kind === 'harnessAgent') {
			addUnique(agents, item.registration.entryId, translateAgentDefinition(execution.definition, item), 'agents')
		}
		if (execution.kind === 'harnessWorkflow') {
			for (const [publicId, definition] of Object.entries(execution.agents ?? {})) {
				addUnique(agents, item.registration.agentIds[publicId], translateAgentDefinition(definition, item), 'agents')
			}
		}
	}
	return agents
}

function collectWorkflows(
	prepared: readonly PreparedAttachedAgentRuntime[],
): Record<string, HarnessWorkflowDefinition<any>> {
	const workflows: Record<string, HarnessWorkflowDefinition<any>> = {}
	for (const item of prepared) {
		if (item.definition.execution.kind !== 'harnessWorkflow') continue
		addUnique(
			workflows,
			item.registration.entryId,
			translateWorkflowDefinition(item.definition.execution.definition, item),
			'workflows',
		)
	}
	return workflows
}

function translateAgentDefinition(
	definition: HarnessAgentDefinition<any>,
	item: PreparedAttachedAgentRuntime,
): HarnessAgentDefinition<any> {
	const candidate = definition as HarnessAgentDefinition<any> & Record<string, any>
	const skillNames = Object.keys(item.skillRuntime.harnessSkills)
	const translated: Record<string, any> = {
		...candidate,
		model: translateModelId(candidate.model, item.registration),
		...(skillNames.length > 0 ? { skills: skillNames } : {}),
		...(item.definition.manifest.builtInTools !== true ? { builtinTools: item.definition.manifest.builtInTools } : {}),
		...(item.definition.sandboxPolicy?.sharing !== undefined ? { sandbox: item.definition.sandboxPolicy.sharing } : {}),
	}

	if (candidate.handler) {
		const handler = candidate.handler
		translated.handler = async (context: Record<string, any>) =>
			handler(translateModelContext(context, item.registration) as never)
	}
	if (candidate.prepareStep) {
		const prepareStep = candidate.prepareStep
		translated.prepareStep = async (context: Record<string, any>) => {
			const result = await prepareStep(translateModelContext(context, item.registration) as never)
			if (!result?.model) return result
			return { ...result, model: translateModelId(result.model, item.registration) }
		}
	}
	if (candidate.stopWhen) {
		const stopWhen = candidate.stopWhen
		translated.stopWhen = (context: Record<string, any>) =>
			stopWhen(translateModelContext(context, item.registration) as never)
	}
	if (candidate.interceptors) {
		translated.interceptors = candidate.interceptors.map((interceptor: AgentExecutionInterceptor) =>
			translateInterceptor(interceptor, item.registration),
		)
	}
	if (candidate.guardrails) {
		const interceptor = candidate.guardrails[agentGuardrailsBinding] as AgentExecutionInterceptor
		translated.guardrails = {
			[agentGuardrailsBinding]: translateInterceptor(interceptor, item.registration),
		}
	}
	return translated as HarnessAgentDefinition<any>
}

function translateWorkflowDefinition(
	definition: HarnessWorkflowDefinition<any>,
	item: PreparedAttachedAgentRuntime,
): HarnessWorkflowDefinition<any> {
	const agentIds = item.registration.agentIds
	const localAgentIds = Object.values(agentIds)
	const policy = definition.delegation
	validateWorkflowDelegationReferences(policy, agentIds, item.definition.manifest.agentName)
	const delegation =
		policy || localAgentIds.length > 0
			? {
					...policy,
					agents: policy?.agents ? policy.agents.map(agentId => agentIds[agentId] ?? agentId) : localAgentIds,
					...(policy?.modelAliases
						? { modelAliases: policy.modelAliases.map(alias => translateModelId(alias, item.registration)) }
						: localAgentIds.length > 0
							? { modelAliases: Object.values(item.registration.modelIds) }
							: {}),
					...(policy?.agentModelAliases
						? {
								agentModelAliases: Object.fromEntries(
									Object.entries(policy.agentModelAliases).map(([agentId, aliases]) => [
										agentIds[agentId] ?? agentId,
										aliases?.map(alias => translateModelId(alias, item.registration)),
									]),
								),
							}
						: {}),
				}
			: undefined

	return {
		...definition,
		...(item.definition.sandboxPolicy?.sharing !== undefined ? { sandbox: item.definition.sandboxPolicy.sharing } : {}),
		...(delegation ? { delegation } : {}),
		handler: async context => {
			const publicContext = translateModelContext(context as Record<string, any>, item.registration)
			const agents = Object.fromEntries(
				Object.entries(agentIds).map(([publicId, internalId]) => [
					publicId,
					(input: unknown, options?: Record<string, any>) =>
						(context.agents as Record<string, (input: unknown, options?: unknown) => Promise<unknown>>)[internalId](
							input,
							translateInvokeOptions(options, item.registration),
						),
				]),
			)
			return definition.handler({
				...publicContext,
				agents,
				childTasks: {
					start: async (agentId: string, input: unknown, options?: Record<string, any>) =>
						translateChildTaskHandle(
							await context.childTasks.start(
								(agentIds[agentId] ?? agentId) as never,
								input as never,
								translateInvokeOptions(options, item.registration) as never,
							),
							item.registration,
						),
				},
			} as never)
		},
	}
}

function validateWorkflowDelegationReferences(
	policy: HarnessWorkflowDefinition<any>['delegation'],
	agentIds: Readonly<Record<string, string>>,
	workflowName: string,
): void {
	if (!policy) return
	const declared = new Set(Object.keys(agentIds))
	for (const agentId of policy.agents ?? []) {
		if (!declared.has(agentId)) {
			throw createAgentConfigurationError(
				`Attached workflow "${workflowName}" delegates to undeclared local agent "${agentId}"`,
			)
		}
	}
	for (const agentId of Object.keys(policy.agentModelAliases ?? {})) {
		if (!declared.has(agentId)) {
			throw createAgentConfigurationError(
				`Attached workflow "${workflowName}" configures model aliases for undeclared local agent "${agentId}"`,
			)
		}
	}
}

function translateInterceptor(
	interceptor: AgentExecutionInterceptor,
	registration: AttachedHarnessRegistration,
): AgentExecutionInterceptor {
	const translated: Record<string, any> = { ...interceptor }
	if (interceptor.requirements?.models) {
		translated.requirements = {
			...interceptor.requirements,
			models: interceptor.requirements.models.map(model => ({
				...model,
				alias: translateModelId(model.alias, registration),
			})),
		}
	}
	for (const hook of ['beforeInput', 'beforeModel', 'afterModel', 'beforeTool', 'afterTool', 'beforeOutput'] as const) {
		const evaluate = interceptor[hook] as ((context: Record<string, any>) => unknown) | undefined
		if (evaluate)
			translated[hook] = (context: Record<string, any>) => evaluate(translateModelContext(context, registration))
	}
	return translated as AgentExecutionInterceptor
}

function translateModelContext(
	context: Record<string, any>,
	registration: AttachedHarnessRegistration,
): Record<string, any> {
	const models = context.models
	return translateIdentityFields(
		{
			...context,
			...(models
				? {
						models: Object.fromEntries(
							Object.entries(registration.modelIds).map(([publicId, internalId]) => [publicId, models[internalId]]),
						),
					}
				: {}),
		},
		registration,
	)
}

function translateIdentityFields(
	value: Record<string, any>,
	registration: AttachedHarnessRegistration,
): Record<string, any> {
	const result = { ...value }
	for (const key of ['agentId', 'parentAgentId'] as const) {
		if (typeof result[key] === 'string') result[key] = registration.publicAgentIds[result[key]] ?? result[key]
	}
	if (typeof result.workflowId === 'string') {
		result.workflowId = registration.publicWorkflowIds[result.workflowId] ?? result.workflowId
	}
	for (const key of ['model', 'modelAlias'] as const) {
		if (typeof result[key] === 'string') result[key] = registration.publicModelIds[result[key]] ?? result[key]
	}
	return result
}

function translateInvokeOptions(
	options: Record<string, any> | undefined,
	registration: AttachedHarnessRegistration,
): Record<string, any> | undefined {
	if (!options?.model) return options
	return { ...options, model: translateModelId(options.model, registration) }
}

function translateChildTaskHandle(handle: any, registration: AttachedHarnessRegistration): any {
	const translated = {
		id: handle.id,
		result: () => handle.result(),
		status: async () => {
			const status = await handle.status()
			return {
				...status,
				descriptor: translateIdentityFields(status.descriptor, registration),
			}
		},
		cancel: (reason?: string) => handle.cancel(reason),
	}
	if (typeof handle.send !== 'function') return translated
	return {
		...translated,
		send: (input: unknown) => handle.send(input),
		close: () => handle.close(),
	}
}

function translateGovernance(
	governance: GovernanceConfig<any>,
	prepared: readonly PreparedAttachedAgentRuntime[],
): GovernanceConfig<any> {
	const publicAgentIds = Object.assign({}, ...prepared.map(item => item.registration.publicAgentIds))
	const publicWorkflowIds = Object.assign({}, ...prepared.map(item => item.registration.publicWorkflowIds))
	const publicModelIds = Object.assign({}, ...prepared.map(item => item.registration.publicModelIds))
	const registration: AttachedHarnessRegistration = {
		entryId: '',
		modelIds: {},
		publicModelIds,
		agentIds: {},
		publicAgentIds,
		publicWorkflowIds,
	}
	const translated: any = {
		...governance,
		...(governance.policies
			? {
					policies: governance.policies.map(policy => {
						if ((policy as { kind?: unknown }).kind === 'native') {
							const native = policy as Extract<(typeof governance.policies)[number], { kind: 'native' }>
							return {
								...native,
								rules: native.rules.map(rule => {
									const when = rule.when
									return {
										...rule,
										...(when
											? {
													when: (context: Record<string, any>) =>
														when(translateIdentityFields(context, registration) as never),
												}
											: {}),
									}
								}),
							}
						}
						const evaluator = policy as { evaluate(context: unknown): unknown }
						return {
							...policy,
							evaluate: (context: Record<string, any>) =>
								evaluator.evaluate(translateIdentityFields(context, registration)),
						}
					}),
				}
			: {}),
		...(governance.exposure
			? {
					exposure: {
						...governance.exposure,
						rules: governance.exposure.rules?.map(rule => ({
							...rule,
							...(rule.when
								? {
										when: (context: Record<string, any>) =>
											rule.when?.(translateIdentityFields(context, registration) as never),
									}
								: {}),
						})),
					},
				}
			: {}),
		...(governance.approval
			? {
					approval: {
						request: (request: any, execution: any) =>
							governance.approval?.request(
								{
									...request,
									subject: translateIdentityFields(request.subject, registration) as never,
								},
								execution,
							) as Promise<any>,
					},
				}
			: {}),
		...(governance.audit
			? {
					audit: {
						record: (record: any, execution: any) =>
							governance.audit?.record(
								translateIdentityFields(record, registration) as never,
								execution,
							) as Promise<void>,
					},
				}
			: {}),
	}
	return translated as GovernanceConfig<any>
}

function translateModelId(id: string, registration: AttachedHarnessRegistration): string {
	return registration.modelIds[id] ?? id
}

function addUnique<T>(target: Record<string, T>, id: string | undefined, value: T, family: string): void {
	if (!id) throw createAgentConfigurationError(`Attached agent has no internal Harness ${family} id`)
	if (id in target) {
		throw createAgentConfigurationError(`Attached agents contain duplicate internal Harness ${family} id "${id}"`)
	}
	target[id] = value
}

function invert(values: Readonly<Record<string, string>>): Record<string, string> {
	return Object.fromEntries(Object.entries(values).map(([key, value]) => [value, key]))
}

/**
 * Harness registry ids are intentionally more restrictive than public PURISTA
 * names. Public names remain unchanged; this id is internal to the shared
 * service runtime.
 */
export function toHarnessRegistryId(name: string): string {
	if (/^[a-z][a-z0-9_]{0,63}$/.test(name) && !name.startsWith('harness_') && !name.startsWith('system_')) {
		return name
	}
	const normalized = normalizeRegistryPart(name)
	const base =
		normalized && /^[a-z]/.test(normalized) && !normalized.startsWith('harness_') && !normalized.startsWith('system_')
			? normalized
			: `purista_${normalized || 'agent'}`
	return `${base.slice(0, 55)}_${stableNameHash(name)}`
}

function toScopedHarnessRegistryId(kind: 'agent' | 'model', owner: string, name: string): string {
	const readable = normalizeRegistryPart(`${owner}_${name}`) || kind
	return `purista_${kind}_${readable.slice(0, 39)}_${stableNameHash(`${kind}\0${owner}\0${name}`)}`
}

function normalizeRegistryPart(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.toLowerCase()
		.replace(/[^a-z0-9_]+/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_+|_+$/g, '')
}

function stableNameHash(value: string): string {
	let hash = 0x811c9dc5
	for (const character of value) {
		hash ^= character.charCodeAt(0)
		hash = Math.imul(hash, 0x01000193)
	}
	return (hash >>> 0).toString(36).padStart(7, '0').slice(-7)
}

async function shutdownHarness(harness: Harness<any>): Promise<void> {
	const result = await harness.shutdown()
	if (result.errors.length === 1) throw result.errors[0]
	if (result.errors.length > 1) {
		throw new AggregateError(result.errors, `${result.errors.length} shared Harness resources failed to shut down`)
	}
}
