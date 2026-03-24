import { HandledError, PuristaSpanTag, StatusCode } from '@purista/core'
import type { AgentApprovalPolicy } from '../types/AgentManifest.js'
import type { ProtocolContext, ProtocolEmitter } from './context.js'
import type { AgentRunStateHelpers, StateStoreHelpers } from './runState.js'

export type ApprovalDecision = {
	status: 'approved' | 'rejected'
	decisionBy?: string
	reason?: string
	updatedAt: string
}

export type ApprovalPendingRecord = {
	status: 'pending'
	checkpoint: string
	detail?: string
	requestedAt: string
	timeoutMs: number
}

export type ApprovalWaitOptions = {
	checkpoint: string
	timeoutMs?: number
	pollIntervalMs?: number
	detail?: string
	onExpiry?: 'fail' | 'return-expired'
}

export type ApprovalWaitResult = {
	checkpoint: string
	status: 'approved' | 'rejected' | 'expired'
	decision?: ApprovalDecision
}

export type AgentApprovalHelpers = {
	wait(options: ApprovalWaitOptions): Promise<ApprovalWaitResult>
	decide(input: { checkpoint: string } & ApprovalDecision): Promise<ApprovalDecision>
	stateKey(checkpoint: string): string
}

type CreateAgentApprovalHelpersInput = {
	states: StateStoreHelpers
	runState: AgentRunStateHelpers
	protocol: ProtocolEmitter
	approvalPolicy?: AgentApprovalPolicy
	agentName: string
	agentVersion: string
	serviceContext: ProtocolContext<any, any, Record<string, unknown>, any, any>
}

const encode = (value: string) =>
	value
		.trim()
		.replaceAll(/[^a-zA-Z0-9._:-]+/g, '-')
		.replaceAll(/-+/g, '-')
		.replace(/^-|-$/g, '') || 'value'

export const getApprovalStateKey = (agentName: string, agentVersion: string, checkpoint: string) =>
	`purista:ai:approval:${encode(agentName)}:${encode(agentVersion)}:${encode(checkpoint)}`

export const readApprovalDecision = async (
	states: StateStoreHelpers,
	agentName: string,
	agentVersion: string,
	checkpoint: string,
): Promise<ApprovalDecision | undefined> => {
	const key = getApprovalStateKey(agentName, agentVersion, checkpoint)
	const result = await states.getState(key)
	const decision = result[key]
	if (!decision || typeof decision !== 'object') {
		return undefined
	}
	const status = (decision as { status?: unknown }).status
	if (status !== 'approved' && status !== 'rejected') {
		return undefined
	}
	return decision as ApprovalDecision
}

export const writeApprovalDecision = async (
	states: StateStoreHelpers,
	agentName: string,
	agentVersion: string,
	checkpoint: string,
	decision: ApprovalDecision,
) => {
	await states.setState(getApprovalStateKey(agentName, agentVersion, checkpoint), decision)
	return decision
}

const sleep = async (durationMs: number) => await new Promise(resolve => setTimeout(resolve, durationMs))

export const createAgentApprovalHelpers = (input: CreateAgentApprovalHelpersInput): AgentApprovalHelpers => ({
	async wait(options: ApprovalWaitOptions): Promise<ApprovalWaitResult> {
		return await input.serviceContext.startActiveSpan('ai.approval.wait', {}, undefined, async span => {
			span.setAttribute('purista.ai.approval_checkpoint', options.checkpoint)
			if (input.serviceContext.message.principalId) {
				span.setAttribute(PuristaSpanTag.PrincipalId, input.serviceContext.message.principalId)
			}
			if (input.serviceContext.message.tenantId) {
				span.setAttribute(PuristaSpanTag.TenantId, input.serviceContext.message.tenantId)
			}
			const currentRun = await input.runState.get()
			if (!currentRun) {
				await input.runState.start({
					title: `${input.agentName} approval`,
					phase: 'approval',
					status: 'running',
				})
			}

			const configuredTimeoutMs = input.approvalPolicy?.checkpoints?.[options.checkpoint]?.timeoutMs
			const timeoutMs = options.timeoutMs ?? configuredTimeoutMs ?? 60_000
			const pollIntervalMs = options.pollIntervalMs ?? 250
			const startedAt = Date.now()
			span.setAttribute('purista.ai.approval_timeout_ms', timeoutMs)

			const pending: ApprovalPendingRecord = {
				status: 'pending',
				checkpoint: options.checkpoint,
				detail: options.detail,
				requestedAt: new Date().toISOString(),
				timeoutMs,
			}

			await input.runState.checkpoint(`approval:${options.checkpoint}`, pending, { completed: false })
			input.protocol.emitArtifact({
				artifactId: `approval:${options.checkpoint}`,
				content: pending,
				mimeType: 'application/json',
				final: false,
			})

			while (Date.now() - startedAt < timeoutMs) {
				const decision = await readApprovalDecision(
					input.states,
					input.agentName,
					input.agentVersion,
					options.checkpoint,
				)
				if (decision) {
					await input.runState.checkpoint(`approval:${options.checkpoint}`, decision, { completed: true })
					input.protocol.emitArtifact({
						artifactId: `approval:${options.checkpoint}`,
						content: decision,
						mimeType: 'application/json',
						final: true,
					})
					span.setAttribute('purista.ai.approval_status', decision.status)
					if (decision.status === 'rejected') {
						throw new HandledError(
							StatusCode.Forbidden,
							`Approval rejected for checkpoint ${options.checkpoint}`,
							decision,
						)
					}
					return {
						checkpoint: options.checkpoint,
						status: decision.status,
						decision,
					}
				}
				await sleep(pollIntervalMs)
			}

			const expired = {
				status: 'expired',
				checkpoint: options.checkpoint,
				expiredAt: new Date().toISOString(),
			}
			await input.runState.checkpoint(`approval:${options.checkpoint}`, expired, { completed: true })
			input.protocol.emitArtifact({
				artifactId: `approval:${options.checkpoint}`,
				content: expired,
				mimeType: 'application/json',
				final: true,
			})
			span.setAttribute('purista.ai.approval_status', 'expired')
			const onExpiry = options.onExpiry ?? input.approvalPolicy?.checkpoints?.[options.checkpoint]?.onExpiry ?? 'fail'
			if (onExpiry === 'fail') {
				throw new HandledError(
					StatusCode.GatewayTimeout,
					`Approval expired for checkpoint ${options.checkpoint}`,
					expired,
				)
			}
			return {
				checkpoint: options.checkpoint,
				status: 'expired',
			}
		})
	},
	async decide(decisionInput) {
		const decision: ApprovalDecision = {
			status: decisionInput.status,
			decisionBy: decisionInput.decisionBy,
			reason: decisionInput.reason,
			updatedAt: decisionInput.updatedAt,
		}
		await writeApprovalDecision(input.states, input.agentName, input.agentVersion, decisionInput.checkpoint, decision)
		return decision
	},
	stateKey(checkpoint) {
		return getApprovalStateKey(input.agentName, input.agentVersion, checkpoint)
	},
})
