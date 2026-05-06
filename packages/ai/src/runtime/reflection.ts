import { PuristaSpanTag } from '@purista/core'
import type { JsonValue } from '../protocol/types.js'
import type { ReflectionPolicy } from '../types/AgentManifest.js'
import type { ProtocolContext, ProtocolEmitter } from './context.js'
import type { AgentPolicyHelpers } from './policy.js'
import { resolveReflectionPreset } from './policy.js'
import type { AgentRunStateHelpers } from './runState.js'

export type ReflectionDraftFn<TDraft> = (input: {
	iteration: number
	previousDraft?: TDraft
}) => Promise<TDraft> | TDraft
export type ReflectionCritiqueFn<TDraft, TCritique> = (input: {
	iteration: number
	draft: TDraft
	previousCritique?: TCritique
}) => Promise<TCritique> | TCritique
export type ReflectionAcceptFn<TDraft, TCritique> = (input: {
	iteration: number
	draft: TDraft
	critique: TCritique
}) => Promise<boolean> | boolean
export type ReflectionRefineFn<TDraft, TCritique> = (input: {
	iteration: number
	draft: TDraft
	critique: TCritique
}) => Promise<TDraft> | TDraft

export type ReflectionLoopOptions<TDraft, TCritique> = {
	name: string
	profile?: string
	preset?: string
	maxIterations?: number
	stopOnStagnation?: boolean
	draft: ReflectionDraftFn<TDraft>
	critique: ReflectionCritiqueFn<TDraft, TCritique>
	accept: ReflectionAcceptFn<TDraft, TCritique>
	refine?: ReflectionRefineFn<TDraft, TCritique>
}

export type ReflectionLoopResult<TDraft, TCritique> = {
	name: string
	iterations: number
	stopReason: 'accepted' | 'max-iterations' | 'stagnation'
	accepted: boolean
	output: TDraft
	finalCritique: TCritique
}

export type AgentReflectionHelpers = {
	run<TDraft, TCritique>(
		options: ReflectionLoopOptions<TDraft, TCritique>,
	): Promise<ReflectionLoopResult<TDraft, TCritique>>
}

type CreateAgentReflectionHelpersInput = {
	protocol: ProtocolEmitter
	runState: AgentRunStateHelpers
	policy: AgentPolicyHelpers
	reflectionPolicy?: ReflectionPolicy
	serviceContext: ProtocolContext<any, any, Record<string, unknown>, any, any>
}

const toArtifactContent = (value: unknown): JsonValue => {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		Array.isArray(value) ||
		(typeof value === 'object' && value !== null)
	) {
		return value as JsonValue
	}
	return JSON.stringify(value)
}

const isSameValue = (left: unknown, right: unknown) => {
	try {
		return JSON.stringify(left) === JSON.stringify(right)
	} catch {
		return left === right
	}
}

export const createAgentReflectionHelpers = (input: CreateAgentReflectionHelpersInput): AgentReflectionHelpers => ({
	async run<TDraft, TCritique>(
		options: ReflectionLoopOptions<TDraft, TCritique>,
	): Promise<ReflectionLoopResult<TDraft, TCritique>> {
		return await input.serviceContext.startActiveSpan('ai.reflect.run', {}, undefined, async span => {
			const resolvedProfile = input.policy.resolve(options.profile)
			const presetName = options.preset ?? resolvedProfile.reflection.preset
			const preset = resolveReflectionPreset(input.reflectionPolicy, presetName)
			const hasExplicitPreset = options.preset !== undefined
			const maxIterations = hasExplicitPreset
				? (options.maxIterations ?? preset.maxIterations ?? resolvedProfile.reflection.maxIterations ?? 1)
				: (options.maxIterations ?? resolvedProfile.reflection.maxIterations ?? preset.maxIterations ?? 1)
			const stopOnStagnation = hasExplicitPreset
				? (options.stopOnStagnation ?? preset.stopOnStagnation ?? resolvedProfile.reflection.stopOnStagnation ?? true)
				: (options.stopOnStagnation ?? resolvedProfile.reflection.stopOnStagnation ?? preset.stopOnStagnation ?? true)
			const artifactPrefix = hasExplicitPreset
				? (preset.artifacts?.artifactPrefix ?? resolvedProfile.reflection.artifacts.artifactPrefix)
				: (resolvedProfile.reflection.artifacts.artifactPrefix ?? preset.artifacts?.artifactPrefix)
			const emitArtifacts = hasExplicitPreset
				? (preset.artifacts?.emitArtifacts ?? resolvedProfile.reflection.artifacts.emitArtifacts)
				: (resolvedProfile.reflection.artifacts.emitArtifacts ?? preset.artifacts?.emitArtifacts)

			span.setAttribute('purista.ai.reflection_name', options.name)
			const profileName = options.profile ?? resolvedProfile.name ?? 'default'
			span.setAttribute('purista.ai.reflection_profile', profileName)
			if (presetName) {
				span.setAttribute('purista.ai.reflection_preset', presetName)
			}
			span.setAttribute('purista.ai.reflection_max_iterations', maxIterations)
			span.setAttribute('purista.ai.reflection_stop_on_stagnation', stopOnStagnation)
			if (input.serviceContext.message.principalId) {
				span.setAttribute(PuristaSpanTag.PrincipalId, input.serviceContext.message.principalId)
			}
			if (input.serviceContext.message.tenantId) {
				span.setAttribute(PuristaSpanTag.TenantId, input.serviceContext.message.tenantId)
			}

			let iteration = 1
			let draft = await options.draft({ iteration })
			let critique = await options.critique({ iteration, draft })
			let accepted = await options.accept({ iteration, draft, critique })
			let stopReason: ReflectionLoopResult<TDraft, TCritique>['stopReason'] = accepted ? 'accepted' : 'max-iterations'

			if (emitArtifacts) {
				input.protocol.emitArtifact({
					artifactId: `${artifactPrefix}:${options.name}:draft:${iteration}`,
					content: toArtifactContent(draft),
					mimeType: 'application/json',
					final: false,
				})
				input.protocol.emitArtifact({
					artifactId: `${artifactPrefix}:${options.name}:critique:${iteration}`,
					content: toArtifactContent(critique),
					mimeType: 'application/json',
					final: false,
				})
			}
			await input.runState.checkpoint(
				`reflection:${options.name}:${iteration}`,
				{ draft, critique, accepted },
				{ completed: accepted },
			)

			while (!accepted && iteration < maxIterations) {
				const nextIteration = iteration + 1
				const nextDraft = options.refine
					? await options.refine({ iteration: nextIteration, draft, critique })
					: await options.draft({ iteration: nextIteration, previousDraft: draft })
				if (stopOnStagnation && isSameValue(nextDraft, draft)) {
					stopReason = 'stagnation'
					break
				}
				draft = nextDraft
				iteration = nextIteration
				critique = await options.critique({ iteration, draft, previousCritique: critique })
				accepted = await options.accept({ iteration, draft, critique })
				stopReason = accepted ? 'accepted' : 'max-iterations'

				if (emitArtifacts) {
					input.protocol.emitArtifact({
						artifactId: `${artifactPrefix}:${options.name}:draft:${iteration}`,
						content: toArtifactContent(draft),
						mimeType: 'application/json',
						final: false,
					})
					input.protocol.emitArtifact({
						artifactId: `${artifactPrefix}:${options.name}:critique:${iteration}`,
						content: toArtifactContent(critique),
						mimeType: 'application/json',
						final: false,
					})
				}
				await input.runState.checkpoint(
					`reflection:${options.name}:${iteration}`,
					{ draft, critique, accepted },
					{ completed: accepted },
				)
			}

			const result: ReflectionLoopResult<TDraft, TCritique> = {
				name: options.name,
				iterations: iteration,
				stopReason,
				accepted,
				output: draft,
				finalCritique: critique,
			}

			if (emitArtifacts) {
				input.protocol.emitArtifact({
					artifactId: `${artifactPrefix}:${options.name}:summary`,
					content: toArtifactContent(result),
					mimeType: 'application/json',
					final: true,
				})
			}
			await input.runState.checkpoint(`reflection:${options.name}:summary`, result, { completed: true })
			span.setAttribute('purista.ai.reflection_iterations', result.iterations)
			span.setAttribute('purista.ai.reflection_accepted', result.accepted)
			span.setAttribute('purista.ai.reflection_stop_reason', result.stopReason)
			return result
		})
	},
})
