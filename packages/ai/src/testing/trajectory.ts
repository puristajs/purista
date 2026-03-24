import type { AgentProtocolEnvelope } from '../protocol/types.js'
import { getArtifactFrames, getErrorFrames, getFinalAssistantText, getToolFrames } from './protocolTestHelpers.js'

export type TrajectoryMatchMode = 'exact' | 'in-order' | 'any-order'

export type TrajectoryExpectation = {
	tools?: Array<string | { name: string; statuses?: Array<'invoked' | 'success' | 'error'> }>
	artifacts?: Array<string | { id: string; phase?: 'chunk' | 'final' | 'any'; contentIncludes?: string | RegExp }>
	finalMessage?: string | RegExp
	requireReflectionSummary?: boolean
	reflection?: {
		name?: string
		minIterations?: number
	}
	requireApprovalArtifact?: boolean | string
	approval?: {
		checkpoint?: string
		statuses?: Array<'pending' | 'approved' | 'rejected' | 'expired'>
	}
	errors?: boolean | Array<string | RegExp>
	mode?: TrajectoryMatchMode
}

export type TrajectoryEvaluationResult = {
	success: boolean
	mode: TrajectoryMatchMode
	observed: {
		tools: string[]
		artifacts: string[]
		finalMessage: string
		errorCodes: string[]
	}
	failures: string[]
}

const normalizeToolExpectation = (
	value: string | { name: string; statuses?: Array<'invoked' | 'success' | 'error'> },
) => (typeof value === 'string' ? { name: value } : value)

const normalizeArtifactExpectation = (
	value: string | { id: string; phase?: 'chunk' | 'final' | 'any'; contentIncludes?: string | RegExp },
) => (typeof value === 'string' ? { id: value, phase: 'any' as const } : { ...value, phase: value.phase ?? 'any' })

const collapseConsecutiveDuplicates = (values: string[]) => {
	const collapsed: string[] = []
	for (const value of values) {
		if (collapsed.at(-1) !== value) {
			collapsed.push(value)
		}
	}
	return collapsed
}

const includesInOrder = (observed: string[], expected: string[]) => {
	let cursor = 0
	for (const item of observed) {
		if (item === expected[cursor]) {
			cursor += 1
		}
	}
	return cursor === expected.length
}

const matches = (observed: string[], expected: string[], mode: TrajectoryMatchMode) => {
	if (expected.length === 0) {
		return true
	}
	if (mode === 'exact') {
		return observed.length === expected.length && observed.every((value, index) => value === expected[index])
	}
	if (mode === 'in-order') {
		return includesInOrder(observed, expected)
	}
	return expected.every(value => observed.includes(value))
}

export const evaluateTrajectory = (
	envelopes: AgentProtocolEnvelope[],
	expectation: TrajectoryExpectation,
): TrajectoryEvaluationResult => {
	const mode = expectation.mode ?? 'in-order'
	const toolFrames = getToolFrames(envelopes)
	const artifactFrames = getArtifactFrames(envelopes)
	const errorFrames = getErrorFrames(envelopes)
	const observedTools = collapseConsecutiveDuplicates(toolFrames.map(frame => frame.toolName))
	const observedArtifacts = artifactFrames.map(frame => frame.artifactId)
	const finalMessage = getFinalAssistantText(envelopes)
	const failures: string[] = []
	const toolExpectations = (expectation.tools ?? []).map(normalizeToolExpectation)
	const artifactExpectations = (expectation.artifacts ?? []).map(normalizeArtifactExpectation)

	if (
		!matches(
			observedTools,
			toolExpectations.map(value => value.name),
			mode,
		)
	) {
		failures.push(`tool trajectory mismatch (${mode})`)
	}
	if (
		!matches(
			observedArtifacts,
			artifactExpectations.map(value => value.id),
			mode,
		)
	) {
		failures.push(`artifact trajectory mismatch (${mode})`)
	}
	for (const tool of toolExpectations) {
		if (!tool.statuses || tool.statuses.length === 0) {
			continue
		}
		const observedStatuses = toolFrames.filter(frame => frame.toolName === tool.name).map(frame => frame.status)
		if (!tool.statuses.every(status => observedStatuses.includes(status))) {
			failures.push(`tool status mismatch for ${tool.name}`)
		}
	}
	for (const artifact of artifactExpectations) {
		if (artifact.phase === 'any') {
		} else {
			const observedPhases = artifactFrames.filter(frame => frame.artifactId === artifact.id).map(frame => frame.phase)
			if (!observedPhases.includes(artifact.phase)) {
				failures.push(`artifact phase mismatch for ${artifact.id}`)
			}
		}
		if (artifact.contentIncludes !== undefined) {
			const matched = artifactFrames
				.filter(frame => frame.artifactId === artifact.id)
				.some(frame => {
					const content = typeof frame.content === 'string' ? frame.content : JSON.stringify(frame.content)
					return artifact.contentIncludes instanceof RegExp
						? artifact.contentIncludes.test(content)
						: content.includes(artifact.contentIncludes ?? '')
				})
			if (!matched) {
				failures.push(`artifact content mismatch for ${artifact.id}`)
			}
		}
	}
	if (
		expectation.requireReflectionSummary &&
		!observedArtifacts.some(id => id.endsWith(':summary') && id.includes('reflection'))
	) {
		failures.push('missing reflection summary artifact')
	}
	if (expectation.requireApprovalArtifact) {
		const requiredArtifact =
			typeof expectation.requireApprovalArtifact === 'string' ? expectation.requireApprovalArtifact : 'approval:'
		const hasApprovalArtifact = observedArtifacts.some(id =>
			typeof expectation.requireApprovalArtifact === 'string'
				? id === requiredArtifact
				: id.startsWith(requiredArtifact),
		)
		if (!hasApprovalArtifact) {
			failures.push('missing approval artifact')
		}
	}
	if (expectation.approval) {
		const checkpointPrefix = expectation.approval.checkpoint
			? `approval:${expectation.approval.checkpoint}`
			: 'approval:'
		const approvalArtifacts = artifactFrames.filter(frame => frame.artifactId.startsWith(checkpointPrefix))
		if (approvalArtifacts.length === 0) {
			failures.push('missing approval artifact')
		}
		for (const status of expectation.approval.statuses ?? []) {
			const matched = approvalArtifacts.some(frame => {
				const content = frame.content
				return content && typeof content === 'object' && (content as { status?: unknown }).status === status
			})
			if (!matched) {
				failures.push(`missing approval status ${status}`)
			}
		}
	}
	if (expectation.reflection?.minIterations !== undefined) {
		const summaryArtifact = artifactFrames
			.filter(frame => frame.artifactId.endsWith(':summary') && frame.artifactId.includes('reflection'))
			.find(frame =>
				expectation.reflection?.name ? frame.artifactId.includes(`:${expectation.reflection.name}:summary`) : true,
			)
		const iterations =
			summaryArtifact &&
			typeof summaryArtifact.content === 'object' &&
			summaryArtifact.content &&
			typeof (summaryArtifact.content as { iterations?: unknown }).iterations === 'number'
				? (summaryArtifact.content as { iterations: number }).iterations
				: undefined
		if (iterations === undefined || iterations < expectation.reflection.minIterations) {
			failures.push('reflection iteration expectation not met')
		}
	}
	if (expectation.errors === true && errorFrames.length === 0) {
		failures.push('expected error frame')
	}
	if (Array.isArray(expectation.errors)) {
		for (const expectedError of expectation.errors) {
			const matched = errorFrames.some(frame =>
				expectedError instanceof RegExp
					? expectedError.test(frame.code) || expectedError.test(frame.message)
					: frame.code === expectedError,
			)
			if (!matched) {
				failures.push(`missing expected error ${String(expectedError)}`)
			}
		}
	}
	if (expectation.finalMessage instanceof RegExp) {
		if (!expectation.finalMessage.test(finalMessage)) {
			failures.push('final message did not match expected pattern')
		}
	} else if (typeof expectation.finalMessage === 'string' && finalMessage !== expectation.finalMessage) {
		failures.push('final message mismatch')
	}

	return {
		success: failures.length === 0,
		mode,
		observed: {
			tools: observedTools,
			artifacts: observedArtifacts,
			finalMessage,
			errorCodes: errorFrames.map(frame => frame.code),
		},
		failures,
	}
}
