import type { AgentManifest, AgentRunIdentity } from '../types.js'

type IdentityMessage = {
	id?: unknown
	correlationId?: unknown
	traceId?: unknown
	otp?: unknown
	tenantId?: unknown
	principalId?: unknown
}

export type DeriveAgentRunIdentityInput = {
	manifest: Pick<AgentManifest, 'agentName' | 'runtimeRevision' | 'serviceName' | 'serviceVersion' | 'session'>
	message: IdentityMessage
	payload: unknown
	runId?: string
	singleTenantId?: string
}

export function deriveAgentRunIdentity(input: DeriveAgentRunIdentityInput): AgentRunIdentity {
	const transportMessageId = requireNonEmptyString(input.message.id, 'message.id')
	const harnessSessionId = resolveHarnessSessionId(
		input.manifest,
		transportMessageId,
		input.payload,
		input.message.tenantId,
		input.singleTenantId,
	)
	const tenantId = resolveEffectiveTenantId(input.message.tenantId, input.singleTenantId)

	return {
		transportMessageId,
		...optionalStringField('correlationId', input.message.correlationId),
		...optionalStringField('traceId', input.message.traceId),
		...optionalStringField('otp', input.message.otp),
		...optionalStringField('tenantId', tenantId),
		...optionalStringField('principalId', input.message.principalId),
		serviceName: input.manifest.serviceName,
		serviceVersion: input.manifest.serviceVersion,
		agentName: input.manifest.agentName,
		runtimeRevision: input.manifest.runtimeRevision,
		runId: input.runId ?? `run:${transportMessageId}`,
		harnessSessionId,
	}
}

export function resolveHarnessSessionId(
	manifest: Pick<AgentManifest, 'agentName' | 'serviceName' | 'serviceVersion' | 'session'>,
	transportMessageId: string,
	payload: unknown,
	tenantId?: unknown,
	singleTenantId?: unknown,
): string {
	const effectiveTenantId = resolveEffectiveTenantId(tenantId, singleTenantId)
	if (manifest.session.mode === 'ephemeral') {
		return `agent:${manifest.serviceName}:${manifest.serviceVersion}:${manifest.agentName}:message:${transportMessageId}`
	}

	const value = readPayloadPath(payload, manifest.session.payloadPath)
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(
			`Agent conversation session path "${manifest.session.payloadPath.join('.')}" must resolve to a non-empty string`,
		)
	}
	const prefix = [
		'agent',
		encodeSessionSegment(manifest.serviceName),
		encodeSessionSegment(manifest.serviceVersion),
		encodeSessionSegment(manifest.agentName),
	]
	if ((manifest.session.scope ?? 'tenant') === 'tenant') {
		const resolvedTenantId = effectiveTenantId ?? requireConversationTenantId()
		return [
			...prefix,
			'tenant',
			encodeSessionSegment(resolvedTenantId),
			'conversation',
			encodeSessionSegment(value),
		].join(':')
	}
	return [...prefix, 'global', 'conversation', encodeSessionSegment(value)].join(':')
}

function resolveEffectiveTenantId(tenantId?: unknown, singleTenantId?: unknown): string | undefined {
	const configuredTenantId =
		singleTenantId === undefined ? undefined : requireNonEmptyString(singleTenantId, 'ai.tenancy.singleTenantId')
	const messageTenantId = optionalNonEmptyString(tenantId)
	if (configuredTenantId && messageTenantId && configuredTenantId !== messageTenantId) {
		throw new Error('message.tenantId must match ai.tenancy.singleTenantId for a single-tenant service instance')
	}
	return messageTenantId ?? configuredTenantId
}

function requireConversationTenantId(): never {
	throw new Error('Agent conversation session identity requires message.tenantId or ai.tenancy.singleTenantId')
}

function encodeSessionSegment(value: string): string {
	return encodeURIComponent(value)
}

function readPayloadPath(payload: unknown, path: readonly string[]) {
	let current = payload
	for (const segment of path) {
		if (!current || typeof current !== 'object' || !(segment in current)) {
			return undefined
		}
		current = (current as Record<string, unknown>)[segment]
	}
	return current
}

function requireNonEmptyString(value: unknown, label: string) {
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`Agent run identity requires ${label}`)
	}
	return value
}

function optionalNonEmptyString(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function optionalStringField<K extends string>(key: K, value: unknown): Partial<Record<K, string>> {
	return (typeof value === 'string' && value.trim() !== '' ? { [key]: value } : {}) as Partial<Record<K, string>>
}
