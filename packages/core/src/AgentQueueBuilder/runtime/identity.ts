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
}

export function deriveAgentRunIdentity(input: DeriveAgentRunIdentityInput): AgentRunIdentity {
	const transportMessageId = requireNonEmptyString(input.message.id, 'message.id')
	const harnessSessionId = resolveHarnessSessionId(input.manifest, transportMessageId, input.payload)

	return {
		transportMessageId,
		...optionalStringField('correlationId', input.message.correlationId),
		...optionalStringField('traceId', input.message.traceId),
		...optionalStringField('otp', input.message.otp),
		...optionalStringField('tenantId', input.message.tenantId),
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
): string {
	if (manifest.session.mode === 'ephemeral') {
		return `agent:${manifest.serviceName}:${manifest.serviceVersion}:${manifest.agentName}:message:${transportMessageId}`
	}

	const value = readPayloadPath(payload, manifest.session.payloadPath)
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(
			`Agent conversation session path "${manifest.session.payloadPath.join('.')}" must resolve to a non-empty string`,
		)
	}
	// Namespace by service/version/agent so two agents that share the same logical
	// conversation id never collide on one harness session (cross-agent/tenant leak).
	return `agent:${manifest.serviceName}:${manifest.serviceVersion}:${manifest.agentName}:conversation:${value}`
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

function optionalStringField<K extends string>(key: K, value: unknown): Partial<Record<K, string>> {
	return (typeof value === 'string' && value.trim() !== '' ? { [key]: value } : {}) as Partial<Record<K, string>>
}
