import { createHash } from 'node:crypto'
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
	manifest: Pick<AgentManifest, 'agentName' | 'runtimeRevision' | 'serviceName' | 'serviceVersion' | 'session' | 'durability'>
	message: IdentityMessage
	payload: unknown
	runId?: string
}

export function deriveAgentRunIdentity(input: DeriveAgentRunIdentityInput): AgentRunIdentity {
	const transportMessageId = requireNonEmptyString(input.message.id, 'message.id')
	const identity = {
		...optionalStringField('tenantId', input.message.tenantId),
		...optionalStringField('principalId', input.message.principalId),
	}
	const harnessSessionId = resolveHarnessSessionId(input.manifest, transportMessageId, input.payload, identity)

	return {
		transportMessageId,
		...optionalStringField('correlationId', input.message.correlationId),
		...optionalStringField('traceId', input.message.traceId),
		...optionalStringField('otp', input.message.otp),
		...identity,
		serviceName: input.manifest.serviceName,
		serviceVersion: input.manifest.serviceVersion,
		agentName: input.manifest.agentName,
		runtimeRevision: input.manifest.runtimeRevision,
		runId: input.runId ?? resolveRunId(input.manifest, transportMessageId, input.payload, identity),
		harnessSessionId,
	}
}

function resolveRunId(
	manifest: Pick<AgentManifest, 'agentName' | 'serviceName' | 'serviceVersion' | 'durability'>,
	transportMessageId: string,
	payload: unknown,
	identity: Pick<AgentRunIdentity, 'tenantId' | 'principalId'>,
): string {
	if (!manifest.durability) return `run:${transportMessageId}`
	const value = readPayloadPath(payload, manifest.durability.runIdPath)
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(
			`Agent durability run id path "${manifest.durability.runIdPath.join('.')}" must resolve to a non-empty string`,
		)
	}
	const digest = hashIdentityTuple(manifest, identity, 'durable', value)
	return `agent-run:${digest}`
}

export function resolveHarnessSessionId(
	manifest: Pick<AgentManifest, 'agentName' | 'serviceName' | 'serviceVersion' | 'session'>,
	transportMessageId: string,
	payload: unknown,
	identity: Pick<AgentRunIdentity, 'tenantId' | 'principalId'> = {},
): string {
	if (manifest.session.mode === 'ephemeral') {
		return `agent-session:${hashIdentityTuple(manifest, identity, 'ephemeral', transportMessageId)}`
	}

	const value = readPayloadPath(payload, manifest.session.payloadPath)
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(
			`Agent conversation session path "${manifest.session.payloadPath.join('.')}" must resolve to a non-empty string`,
		)
	}
	return `agent-session:${hashIdentityTuple(manifest, identity, 'conversation', value)}`
}

function hashIdentityTuple(
	manifest: Pick<AgentManifest, 'agentName' | 'serviceName' | 'serviceVersion'>,
	identity: Pick<AgentRunIdentity, 'tenantId' | 'principalId'>,
	mode: 'conversation' | 'durable' | 'ephemeral',
	logicalValue: string,
): string {
	return createHash('sha256')
		.update(
			JSON.stringify([
				'v1',
				manifest.serviceName,
				manifest.serviceVersion,
				manifest.agentName,
				identity.tenantId !== undefined,
				identity.tenantId ?? null,
				identity.principalId !== undefined,
				identity.principalId ?? null,
				mode,
				logicalValue,
			]),
		)
		.digest('hex')
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
