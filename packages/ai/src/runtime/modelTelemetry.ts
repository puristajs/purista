import type { Tracer } from '@opentelemetry/api'
import { SpanStatusCode } from '@opentelemetry/api'
import { PuristaSpanTag } from '@purista/core'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createSanitizedErrorDiagnostics } from './errorDiagnostics.js'
import type { AgentInvocationIdentity } from './invocationIdentity.js'

export type AgentModelCapability =
	| 'generateText'
	| 'streamText'
	| 'generateObject'
	| 'streamObject'
	| 'embed'
	| 'embedMany'
	| 'rerank'

const getAiSdkTargetKey = (capability: AgentModelCapability) =>
	capability === 'streamText' || capability === 'generateText'
		? 'generate'
		: capability === 'streamObject' || capability === 'generateObject'
			? 'generateObject'
			: capability

const mergeRecord = (
	base: Record<string, unknown> | undefined,
	patch: Record<string, unknown> | undefined,
): Record<string, unknown> => {
	const next: Record<string, unknown> = { ...(base ?? {}) }
	for (const [key, value] of Object.entries(patch ?? {})) {
		const existing = next[key]
		if (
			existing &&
			typeof existing === 'object' &&
			!Array.isArray(existing) &&
			value &&
			typeof value === 'object' &&
			!Array.isArray(value)
		) {
			next[key] = {
				...(existing as Record<string, unknown>),
				...(value as Record<string, unknown>),
			}
			continue
		}
		next[key] = value
	}
	return next
}

export const injectRuntimeAiSdkTelemetry = (input: {
	metadata?: Record<string, unknown>
	manifest: AgentManifest
	identity: AgentInvocationIdentity
	capability: AgentModelCapability
	alias: string
	poolId: string
	maxConcurrencyPerInstance: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
	tracer?: Tracer
}): Record<string, unknown> => {
	const current = (input.metadata ?? {}) as Record<string, unknown>
	const aiSdk =
		current.aiSdk && typeof current.aiSdk === 'object' && !Array.isArray(current.aiSdk)
			? (current.aiSdk as Record<string, unknown>)
			: {}
	const targetKey = getAiSdkTargetKey(input.capability)
	const currentTarget =
		aiSdk[targetKey] && typeof aiSdk[targetKey] === 'object' && !Array.isArray(aiSdk[targetKey])
			? (aiSdk[targetKey] as Record<string, unknown>)
			: {}
	const replicaCountHint =
		typeof input.concurrencyHints?.replicaCountHint === 'number' && input.concurrencyHints.replicaCountHint > 0
			? Math.trunc(input.concurrencyHints.replicaCountHint)
			: undefined
	const effectiveMaxConcurrencyHint =
		typeof replicaCountHint === 'number' ? replicaCountHint * input.maxConcurrencyPerInstance : undefined

	return mergeRecord(current, {
		aiSdk: {
			...aiSdk,
			[targetKey]: mergeRecord(currentTarget, {
				experimental_telemetry: {
					isEnabled: true,
					functionId: `${input.manifest.agentName}.model.${input.capability}`,
					metadata: {
						agentName: input.manifest.agentName,
						serviceVersion: input.manifest.serviceVersion,
						modelAlias: input.alias,
						capability: input.capability,
						poolId: input.poolId,
						maxConcurrencyPerInstance: input.maxConcurrencyPerInstance,
						replicaCountHint,
						effectiveMaxConcurrencyHint,
						correlationId: input.identity.correlationId,
						traceId: input.identity.traceId,
						transportMessageId: input.identity.transportMessageId,
						baseSessionId: input.identity.baseSessionId,
						scopedSessionId: input.identity.scopedSessionId,
						conversationId: input.identity.conversationId,
						tenantId: input.identity.tenantId,
						principalId: input.identity.principalId,
					},
					...(input.tracer ? { tracer: input.tracer } : {}),
				},
			}),
		},
	})
}

export const withRuntimeModelInvocationSpan = async <T>(input: {
	tracer?: Tracer
	manifest: AgentManifest
	identity: AgentInvocationIdentity
	capability: AgentModelCapability
	alias: string
	providerName: string
	run: () => Promise<T>
}): Promise<T> => {
	if (!input.tracer) {
		return await input.run()
	}

	return await input.tracer.startActiveSpan(`ai.model.${input.capability}`, async span => {
		const attributes: Record<string, string | number | boolean | undefined> = {
			[PuristaSpanTag.PrincipalId]: input.identity.principalId,
			[PuristaSpanTag.TenantId]: input.identity.tenantId,
			'purista.ai.agent_name': input.manifest.agentName,
			'purista.ai.service_version': input.manifest.serviceVersion,
			'purista.ai.capability': input.capability,
			'purista.ai.model_alias': input.alias,
			'purista.ai.provider': input.providerName,
			'purista.ai.correlation_id': input.identity.correlationId,
			'purista.ai.trace_id': input.identity.traceId,
			'purista.ai.transport_message_id': input.identity.transportMessageId,
			'purista.ai.base_session_id': input.identity.baseSessionId,
			'purista.ai.scoped_session_id': input.identity.scopedSessionId,
			'purista.ai.conversation_id': input.identity.conversationId,
		}
		for (const [key, value] of Object.entries(attributes)) {
			if (value !== undefined) {
				span.setAttribute(key, value)
			}
		}

		try {
			const result = await input.run()
			span.setStatus({ code: SpanStatusCode.OK })
			return result
		} catch (error) {
			const diagnostics = createSanitizedErrorDiagnostics(error, { fallbackKind: 'provider' })
			if (error instanceof Error) {
				span.recordException(error)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: error.message,
				})
			}
			if (diagnostics.kind) {
				span.setAttribute('purista.ai.error_kind', diagnostics.kind)
			}
			if (diagnostics.statusCode !== undefined) {
				span.setAttribute('purista.ai.error_status_code', diagnostics.statusCode)
			}
			if (diagnostics.providerCode) {
				span.setAttribute('purista.ai.error_provider_code', diagnostics.providerCode)
			}
			if (diagnostics.retryable !== undefined) {
				span.setAttribute('purista.ai.error_retryable', diagnostics.retryable)
			}
			if (diagnostics.attempts !== undefined) {
				span.setAttribute('purista.ai.error_attempts', diagnostics.attempts)
			}
			if ('addEvent' in span && typeof span.addEvent === 'function') {
				span.addEvent('purista.ai.model.error', {
					'purista.ai.error_kind': diagnostics.kind,
					'purista.ai.error_status_code': diagnostics.statusCode,
					'purista.ai.error_provider_code': diagnostics.providerCode,
					'purista.ai.error_retryable': diagnostics.retryable,
					'purista.ai.error_attempts': diagnostics.attempts,
				})
			}
			throw error
		} finally {
			span.end()
		}
	})
}
