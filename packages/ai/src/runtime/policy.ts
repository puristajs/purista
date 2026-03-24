import type { AgentPolicy, AgentQualityProfile, ReflectionPolicy, ReflectionPreset } from '../types/AgentManifest.js'

export type ResolvedReflectionConfig = {
	enabled: boolean
	preset?: string
	maxIterations: number
	stopOnStagnation: boolean
	artifacts: {
		emitArtifacts: boolean
		artifactPrefix: string
	}
}

export type ResolvedAgentQualityProfile = {
	name?: string
	verification: {
		required: boolean
	}
	execution: {
		maxModelSteps?: number
		maxToolCalls?: number
	}
	reflection: ResolvedReflectionConfig
}

export type AgentPolicyHelpers = {
	resolve(profileName?: string): ResolvedAgentQualityProfile
}

const defaultReflectionPreset: ReflectionPreset = {
	maxIterations: 1,
	stopOnStagnation: true,
	artifacts: {
		emitArtifacts: true,
		artifactPrefix: 'reflection',
	},
}

export const resolveReflectionPreset = (
	reflection: ReflectionPolicy | undefined,
	presetName?: string,
): ReflectionPreset => {
	if (!presetName) {
		return defaultReflectionPreset
	}
	return {
		...defaultReflectionPreset,
		...(reflection?.presets?.[presetName] ?? {}),
		artifacts: {
			...(defaultReflectionPreset.artifacts ?? {}),
			...(reflection?.presets?.[presetName]?.artifacts ?? {}),
		},
	}
}

const resolveProfileName = (policy: AgentPolicy | undefined, profileName?: string) =>
	profileName ?? policy?.quality?.defaultProfile

export const resolveAgentQualityProfile = (
	policy: AgentPolicy | undefined,
	reflectionPolicy: ReflectionPolicy | undefined,
	profileName?: string,
): ResolvedAgentQualityProfile => {
	const resolvedName = resolveProfileName(policy, profileName)
	const profile: AgentQualityProfile | undefined =
		resolvedName === undefined ? undefined : policy?.quality?.profiles?.[resolvedName]
	const reflectionPreset = resolveReflectionPreset(reflectionPolicy, profile?.reflection?.preset)

	return {
		name: resolvedName,
		verification: {
			required: profile?.verification?.required ?? false,
		},
		execution: {
			maxModelSteps: profile?.execution?.maxModelSteps,
			maxToolCalls: profile?.execution?.maxToolCalls,
		},
		reflection: {
			enabled: profile?.reflection?.enabled ?? reflectionPolicy?.enabledByDefault ?? false,
			preset: profile?.reflection?.preset,
			maxIterations: profile?.reflection?.maxIterations ?? reflectionPreset.maxIterations ?? 1,
			stopOnStagnation: profile?.reflection?.stopOnStagnation ?? reflectionPreset.stopOnStagnation ?? true,
			artifacts: {
				emitArtifacts: reflectionPreset.artifacts?.emitArtifacts ?? true,
				artifactPrefix: reflectionPreset.artifacts?.artifactPrefix ?? 'reflection',
			},
		},
	}
}

export const resolveAgentExecutionLimits = (
	policy: AgentPolicy | undefined,
	reflectionPolicy: ReflectionPolicy | undefined,
	executionPolicy:
		| {
				maxModelSteps?: number
				maxToolCalls?: number
		  }
		| undefined,
	profileName?: string,
) => {
	const profile = resolveAgentQualityProfile(policy, reflectionPolicy, profileName)
	return {
		profile,
		maxModelSteps: profile.execution.maxModelSteps ?? executionPolicy?.maxModelSteps,
		maxToolCalls: profile.execution.maxToolCalls ?? executionPolicy?.maxToolCalls,
	}
}

export const createAgentPolicyHelpers = (
	policy: AgentPolicy | undefined,
	reflectionPolicy: ReflectionPolicy | undefined,
): AgentPolicyHelpers => ({
	resolve: profileName => resolveAgentQualityProfile(policy, reflectionPolicy, profileName),
})
