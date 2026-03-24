import { HandledError, StatusCode } from '@purista/core'

export type AgentExecutionBudgetSnapshot = {
	modelSteps: {
		used: number
		limit?: number
	}
	toolCalls: {
		used: number
		limit?: number
	}
}

export type AgentExecutionBudget = {
	consumeModelStep(details: { alias: string; callKind: string }): void
	consumeToolCall(details: { toolName: string; kind: 'tool' | 'agent' }): void
	snapshot(): AgentExecutionBudgetSnapshot
}

export const createAgentExecutionBudget = (limits: {
	modelSteps?: number
	toolCalls?: number
}): AgentExecutionBudget => {
	let usedModelSteps = 0
	let usedToolCalls = 0

	const snapshot = (): AgentExecutionBudgetSnapshot => ({
		modelSteps: {
			used: usedModelSteps,
			limit: limits.modelSteps,
		},
		toolCalls: {
			used: usedToolCalls,
			limit: limits.toolCalls,
		},
	})

	const throwBudgetExceeded = (
		kind: 'modelSteps' | 'toolCalls',
		details: Record<string, unknown>,
		currentUsed: number,
		limit: number,
	) => {
		throw new HandledError(StatusCode.TooManyRequests, `Agent ${kind} budget exceeded`, {
			kind,
			limit,
			used: currentUsed,
			...details,
			budget: snapshot(),
		})
	}

	return {
		consumeModelStep(details) {
			usedModelSteps += 1
			if (limits.modelSteps !== undefined && usedModelSteps > limits.modelSteps) {
				throwBudgetExceeded('modelSteps', details, usedModelSteps, limits.modelSteps)
			}
		},
		consumeToolCall(details) {
			usedToolCalls += 1
			if (limits.toolCalls !== undefined && usedToolCalls > limits.toolCalls) {
				throwBudgetExceeded('toolCalls', details, usedToolCalls, limits.toolCalls)
			}
		},
		snapshot,
	}
}
