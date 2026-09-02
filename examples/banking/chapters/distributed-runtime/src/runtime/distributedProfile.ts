import type { EventBridgeCapabilities, QueueBridgeCapabilities } from '@purista/core'

export interface DistributedRequirements {
	requiresQueue?: boolean
	requiresIncrementalStreams?: boolean
	requiresPendingCommandCancellation?: boolean
}

export function assertDistributedCapabilities(
	eventBridge: EventBridgeCapabilities,
	queueBridge: QueueBridgeCapabilities | undefined,
	requirements: DistributedRequirements = {},
) {
	if (!eventBridge.durableSubscriptions || !eventBridge.manualAckSupported) {
		throw new Error('The distributed profile requires JetStream-backed durable subscriptions and manual acknowledgement')
	}
	if (
		requirements.requiresQueue
		&& (!queueBridge?.strictStartupValidation || !queueBridge.idempotencyEnforcement)
	) {
		throw new Error('The distributed profile requires strict QueueBridge startup validation and idempotency enforcement')
	}
	if (requirements.requiresIncrementalStreams && !eventBridge.supportsStreams) {
		throw new Error('The selected EventBridge cannot carry PURISTA incremental streams')
	}
	if (
		requirements.requiresPendingCommandCancellation
		&& !eventBridge.commandHandling.pendingInvocationCancellation
	) {
		throw new Error('The selected EventBridge cannot cancel a pending command invocation')
	}
}
