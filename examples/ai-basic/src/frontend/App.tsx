import { useEffect, useMemo, useRef, useState } from 'react'

import { BotIcon, CheckCircle2Icon, MessageSquareIcon, SparklesIcon, WrenchIcon, WorkflowIcon, XCircleIcon } from 'lucide-react'
import { Streamdown } from 'streamdown'

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from './components/ai-elements/conversation'
import { loadConversation, runSupportCommand, streamSupportAgent, triggerFollowUp } from './lib/api'
import type { AgentProtocolEnvelope, StreamPayload } from './lib/types'
import { mapToWorkflow } from './lib/workflow'

type Scenario = 'stream' | 'command' | 'followup' | 'protocol'
type Theme = 'dark' | 'light'
type ConversationHistoryItem = {
	sessionId: string
	firstMessage: string
	updatedAt: number
}

type ChatMessage = {
	id: string
	role: 'user' | 'assistant' | 'tool'
	content: string
	toolStatus?: string
	toolInput?: unknown
	toolOutput?: unknown
	toolKey?: string
	actor?: string
	timestamp?: string
}

const scenarioOptions: Array<{ id: Scenario; label: string }> = [
	{ id: 'stream', label: 'Stream Chat' },
	{ id: 'command', label: 'Command Run' },
	{ id: 'followup', label: 'Follow-up' },
	{ id: 'protocol', label: 'Protocol Inspector' },
]

const THEME_KEY = 'purista.ai.theme'
const HISTORY_KEY = 'purista.ai.history'

const getStoredTheme = (): Theme => {
	const stored = window.localStorage.getItem(THEME_KEY)
	return stored === 'light' ? 'light' : 'dark'
}

const getStoredHistory = (): ConversationHistoryItem[] => {
	try {
		const value = window.localStorage.getItem(HISTORY_KEY)
		if (!value) {
			return []
		}
		const parsed = JSON.parse(value) as ConversationHistoryItem[]
		if (!Array.isArray(parsed)) {
			return []
		}
		return parsed
			.filter(item => item && typeof item.sessionId === 'string' && typeof item.firstMessage === 'string')
			.map(item => ({
				sessionId: item.sessionId,
				firstMessage: item.firstMessage,
				updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : Date.now(),
			}))
	} catch {
		return []
	}
}

const uniqueEnvelopes = (
	previous: AgentProtocolEnvelope[],
	incoming: AgentProtocolEnvelope[],
): AgentProtocolEnvelope[] => {
	const known = new Set(previous.map(item => item.messageId))
	const result = [...previous]
	for (const envelope of incoming) {
		if (known.has(envelope.messageId)) {
			continue
		}
		known.add(envelope.messageId)
		result.push(envelope)
	}
	return result
}

const envelopeFingerprint = (envelope: AgentProtocolEnvelope): string => {
	const frame = envelope.frame
	if (frame.kind === 'message') {
		return `${envelope.conversationId ?? 'n/a'}|message|${frame.final === true ? 'final' : 'partial'}|${String(frame.content ?? '')}`
	}
	if (frame.kind === 'tool') {
		return `${envelope.conversationId ?? 'n/a'}|tool|${String(frame.toolName ?? '')}|${String(frame.status ?? '')}|${JSON.stringify(frame.input ?? null)}|${JSON.stringify(frame.output ?? null)}`
	}
	if (frame.kind === 'telemetry') {
		return `${envelope.conversationId ?? 'n/a'}|telemetry|${JSON.stringify(frame.usage ?? null)}|${String(frame.durationMs ?? '')}`
	}
	return `${envelope.conversationId ?? 'n/a'}|error|${JSON.stringify(frame)}`
}

const actorLabel = (envelope: AgentProtocolEnvelope): string =>
	[envelope.actor?.service, envelope.actor?.version, envelope.actor?.agent].filter(Boolean).join(':')

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const stableJson = (value: unknown): string => {
	try {
		return JSON.stringify(value ?? null)
	} catch {
		return String(value)
	}
}

type FlowPhaseId = 'ingress' | 'faq' | 'triage' | 'generation' | 'result'
type FlowPhaseStatus = 'idle' | 'running' | 'success' | 'error'

const phaseOrder: FlowPhaseId[] = ['ingress', 'faq', 'triage', 'generation', 'result']
type FlowPhase = {
	id: FlowPhaseId
	label: string
	description: string
	status: FlowPhaseStatus
	isActive: boolean
	icon: typeof WorkflowIcon
}

const latestStepByMatch = (steps: ReturnType<typeof mapToWorkflow>, matcher: (label: string) => boolean) => {
	for (let index = steps.length - 1; index >= 0; index -= 1) {
		const step = steps[index]
		if (matcher(step.label)) {
			return step
		}
	}
	return undefined
}

const latestPhaseByStatus = (
	statuses: Record<FlowPhaseId, FlowPhaseStatus>,
	matcher: (status: FlowPhaseStatus) => boolean,
): FlowPhaseId | undefined => {
	for (let index = phaseOrder.length - 1; index >= 0; index -= 1) {
		const phaseId = phaseOrder[index]
		if (phaseId && matcher(statuses[phaseId])) {
			return phaseId
		}
	}
	return undefined
}

export const App = () => {
	const [scenario, setScenario] = useState<Scenario>('stream')
	const [theme, setTheme] = useState<Theme>(getStoredTheme)
	const [prompt, setPrompt] = useState('How can I request a refund for my order?')
	const [sessionId, setSessionId] = useState('')
	const [status, setStatus] = useState('Ready')
	const [canRetry, setCanRetry] = useState(false)
	const [commandOutput, setCommandOutput] = useState('{}')
	const [assistantDraft, setAssistantDraft] = useState('')
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
	const [envelopes, setEnvelopes] = useState<AgentProtocolEnvelope[]>([])
	const [streamPayloads, setStreamPayloads] = useState<StreamPayload[]>([])
	const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>(getStoredHistory)
	const seenFramesRef = useRef<Set<string>>(new Set())

	const workflow = useMemo(() => mapToWorkflow(envelopes), [envelopes])

	const flowPhases = (() => {
		const hasError = workflow.some(step => step.status === 'error' || step.type === 'error')
		const hasTopLevelFinal = workflow.some(
			step => step.depth === 0 && step.type === 'message' && (step.details as { final?: boolean } | undefined)?.final === true,
		)
		const lookupStep = latestStepByMatch(workflow, label => label.includes('support.1.lookupFaq'))
		const triageStep = latestStepByMatch(workflow, label => label.includes('triageAgent.1.run'))
		const generationStep = latestStepByMatch(workflow, label => label.toLowerCase().includes('generating final answer'))

		const phaseStatus: Record<FlowPhaseId, FlowPhaseStatus> = {
			ingress: workflow.length > 0 ? 'success' : 'idle',
			faq: lookupStep?.status ?? 'idle',
			triage: triageStep?.status ?? 'idle',
			generation: hasError ? 'error' : hasTopLevelFinal ? 'success' : generationStep?.status ?? 'idle',
			result: hasError ? 'error' : hasTopLevelFinal ? 'success' : 'idle',
		}

		const activePhase =
			latestPhaseByStatus(phaseStatus, status => status === 'running') ??
			latestPhaseByStatus(phaseStatus, status => status !== 'idle')

		const phaseConfig: Array<{ id: FlowPhaseId; label: string; icon: typeof WorkflowIcon; description: string }> = [
			{ id: 'ingress', label: 'PURISTA ingress', icon: WorkflowIcon, description: 'Request accepted in service/stream' },
			{ id: 'faq', label: 'Command tool', icon: WrenchIcon, description: 'FAQ lookup command invocation' },
			{ id: 'triage', label: 'AI delegation', icon: BotIcon, description: 'Optional triage agent run' },
			{ id: 'generation', label: 'AI generation', icon: SparklesIcon, description: 'Final response generation' },
			{ id: 'result', label: 'Stream result', icon: CheckCircle2Icon, description: 'Final chunk/telemetry emitted' },
		]

		return phaseConfig.map<FlowPhase>(phase => {
			const statusValue = phaseStatus[phase.id]
			return {
				id: phase.id,
				label: phase.label,
				description: phase.description,
				status: statusValue,
				isActive: activePhase === phase.id,
				icon: hasError && phase.id === 'result' ? XCircleIcon : phase.icon,
			}
		})
	})()

	const chatTimeline = useMemo(() => {
		const rows: Array<{
			message: ChatMessage
			tools: ChatMessage[]
		}> = []
		for (const message of chatMessages) {
			if (message.role === 'tool') {
				const last = rows.at(-1)
				if (last) {
					last.tools.push(message)
				} else {
					rows.push({
						message: {
							id: nowId(),
							role: 'assistant',
							content: '',
						},
						tools: [message],
					})
				}
				continue
			}
			rows.push({ message, tools: [] })
		}
		return rows
	}, [chatMessages])

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	const setThemeAndStore = (nextTheme: Theme) => {
		window.localStorage.setItem(THEME_KEY, nextTheme)
		setTheme(nextTheme)
	}

	const rememberConversation = (sessionKey: string, firstMessage: string) => {
		setConversationHistory(previous => {
			const next = [
				{ sessionId: sessionKey, firstMessage: firstMessage.trim().slice(0, 200), updatedAt: Date.now() },
				...previous.filter(item => item.sessionId !== sessionKey),
			].slice(0, 40)
			window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
			return next
		})
	}

	const appendAssistantMessage = (content: string) => {
		const text = content.trim()
		if (!text) {
			return
		}
		setChatMessages(previous => {
			const last = previous.at(-1)
			if (last?.role === 'assistant' && last.content === text) {
				return previous
			}
			return [...previous, { id: nowId(), role: 'assistant', content: text }]
		})
	}

	const appendToolMessage = (
		toolName: string,
		status: string,
		input?: unknown,
		output?: unknown,
		actor?: string,
		timestamp?: string,
	) => {
		const text = `${toolName} · ${status}`
		const toolKey = `${toolName}|${stableJson(input)}`
		setChatMessages(previous => {
			const existingIndex = [...previous]
				.reverse()
				.findIndex(message => message.role === 'tool' && message.toolKey === toolKey)
			if (existingIndex >= 0) {
				const index = previous.length - 1 - existingIndex
				const current = previous[index]
				const next = [...previous]
				next[index] = {
					...current,
					content: text,
					toolStatus: status,
					toolInput: input ?? current.toolInput,
					toolOutput: output ?? current.toolOutput,
					actor: actor ?? current.actor,
					timestamp: timestamp ?? current.timestamp,
				}
				return next
			}
			return [
				...previous,
				{
					id: nowId(),
					role: 'tool',
					content: text,
					toolStatus: status,
					toolInput: input,
					toolOutput: output,
					toolKey,
					actor,
					timestamp,
				},
			]
		})
	}

	const appendUserMessage = (content: string) => {
		const text = content.trim()
		if (!text) {
			return
		}
		setChatMessages(previous => [...previous, { id: nowId(), role: 'user', content: text }])
	}

	const processEnvelope = (envelope: AgentProtocolEnvelope) => {
		const fingerprint = envelopeFingerprint(envelope)
		if (seenFramesRef.current.has(fingerprint)) {
			return
		}
		seenFramesRef.current.add(fingerprint)
		setEnvelopes(previous => uniqueEnvelopes(previous, [envelope]))

		const frame = envelope.frame
		if (frame.kind === 'message') {
			const text = String(frame.content ?? '')
			if (frame.final === true) {
				setAssistantDraft('')
				appendAssistantMessage(text)
				setStatus('Completed')
			} else {
				setAssistantDraft(text)
				setStatus(`Assistant typing · ${actorLabel(envelope)}`)
			}
			return
		}
		if (frame.kind === 'error') {
			setAssistantDraft('')
			appendAssistantMessage(`Error: ${String(frame.message ?? 'Unknown error')}`)
			setStatus('Error')
			setCanRetry(true)
			return
		}
		if (frame.kind === 'tool') {
			const toolName = String(frame.toolName ?? 'tool')
			const toolStatus = String(frame.status ?? 'unknown')
			appendToolMessage(toolName, toolStatus, frame.input, frame.output, actorLabel(envelope), envelope.timestamp)
			setStatus(`Tool ${toolStatus} · ${toolName}`)
			return
		}
		if (frame.kind === 'telemetry') {
			setStatus(`Telemetry · tokens ${String((frame.usage as { totalTokens?: number } | undefined)?.totalTokens ?? '-')}`)
		}
	}

	const executeStream = async () => {
		const question = prompt.trim()
		if (!question) {
			return
		}
		const activeSessionId = sessionId.trim() || crypto.randomUUID()
		if (activeSessionId !== sessionId) {
			setSessionId(activeSessionId)
		}
		rememberConversation(activeSessionId, question)
		appendUserMessage(question)
		setAssistantDraft('')
		setEnvelopes([])
		setStreamPayloads([])
		seenFramesRef.current = new Set()
		setStatus('Streaming...')
		setCanRetry(false)

		try {
			await streamSupportAgent(
				{
					prompt: question,
					sessionId: activeSessionId,
				},
				{
					onEnvelope: envelope => {
						processEnvelope(envelope)
					},
					onPayload: payload => {
						setStreamPayloads(previous => [...previous, payload])
					},
					onComplete: () => {
						setAssistantDraft('')
						setStatus('Completed')
						setCanRetry(false)
					},
					onError: error => {
						setAssistantDraft('')
						appendAssistantMessage(`Error: ${error}`)
						setStatus('Error')
						setCanRetry(true)
					},
				},
			)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			appendAssistantMessage(`Error: ${message}`)
			setStatus('Error')
			setCanRetry(true)
		}
	}

	const executeCommand = async () => {
		const question = prompt.trim()
		if (!question) {
			return
		}
		const activeSessionId = sessionId.trim() || crypto.randomUUID()
		if (activeSessionId !== sessionId) {
			setSessionId(activeSessionId)
		}
		rememberConversation(activeSessionId, question)
		appendUserMessage(question)
		setStatus('Running command...')
		setCanRetry(false)
		try {
			const result = await runSupportCommand({
				prompt: question,
				sessionId: activeSessionId,
			})
			setCommandOutput(JSON.stringify(result, null, 2))
			const message =
				result && typeof result === 'object' && 'message' in result && typeof result.message === 'string'
					? result.message
					: JSON.stringify(result)
			appendAssistantMessage(message)
			setStatus('Command completed')
			setCanRetry(false)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			appendAssistantMessage(`Error: ${message}`)
			setStatus('Error')
			setCanRetry(true)
		}
	}

	const executeFollowUp = async () => {
		const question = prompt.trim()
		if (!question) {
			return
		}
		const activeSessionId = sessionId.trim() || crypto.randomUUID()
		if (activeSessionId !== sessionId) {
			setSessionId(activeSessionId)
		}
		rememberConversation(activeSessionId, question)
		appendUserMessage(question)
		setStatus('Queueing follow-up...')
		setCanRetry(false)
		try {
			const result = await triggerFollowUp({
				prompt: question,
				sessionId: activeSessionId,
			})
			setCommandOutput(JSON.stringify(result, null, 2))
			appendAssistantMessage('Follow-up queued. Final processing is async via subscription.')
			setStatus('Follow-up queued')
			setCanRetry(false)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			appendAssistantMessage(`Error: ${message}`)
			setStatus('Error')
			setCanRetry(true)
		}
	}

	const executeLoadConversation = async (explicitSessionId?: string) => {
		const targetSessionId = explicitSessionId ?? sessionId
		if (!targetSessionId) {
			setStatus('Set a session id first')
			return
		}
		setStatus('Loading conversation...')
		setSessionId(targetSessionId)
		const result = await loadConversation(targetSessionId)
		const hydrated = result.envelopes ?? []
		seenFramesRef.current = new Set()
		setEnvelopes([])
		for (const envelope of hydrated) {
			processEnvelope(envelope)
		}
		setStatus(`Loaded ${hydrated.length} frame(s)`)
		setCanRetry(false)
	}

	const executeRetry = async () => {
		if (scenario === 'command') {
			await executeCommand()
			return
		}
		if (scenario === 'followup') {
			await executeFollowUp()
			return
		}
		await executeStream()
	}

	return (
		<div className="page">
			<aside className="sidebar">
				<div className="sidebar-header">
					<h2>History</h2>
					<button
						type="button"
						className="button secondary"
						onClick={() => {
							setPrompt('How can I request a refund for my order?')
							setChatMessages([])
							setEnvelopes([])
							setStreamPayloads([])
							seenFramesRef.current = new Set()
							setAssistantDraft('')
							setStatus('Ready')
							setCanRetry(false)
						}}
					>
						New chat
					</button>
				</div>
				<div className="sidebar-list">
					{conversationHistory.map(item => (
						<button
							type="button"
							key={item.sessionId}
							className={`history-item ${sessionId.trim() === item.sessionId ? 'active' : ''}`}
							onClick={() => void executeLoadConversation(item.sessionId)}
						>
							<div className="history-title">{item.firstMessage}</div>
							<div className="history-meta">
								<span>{new Date(item.updatedAt).toLocaleTimeString()}</span>
							</div>
						</button>
					))}
					{conversationHistory.length === 0 && <div className="placeholder">No conversations yet.</div>}
				</div>
			</aside>
			<div className="main">
			<header className="topbar">
				<div>
					<h1>PURISTA AI Showcase</h1>
					<p>Conversation-first UI with stream workflow tracing.</p>
				</div>
				<button type="button" className="button secondary" onClick={() => setThemeAndStore(theme === 'dark' ? 'light' : 'dark')}>
					Theme: {theme}
				</button>
			</header>

			<nav className="tabs">
				{scenarioOptions.map(option => (
					<button
						type="button"
						key={option.id}
						className={`button ${scenario === option.id ? 'active' : 'secondary'}`}
						onClick={() => setScenario(option.id)}
					>
						{option.label}
					</button>
				))}
			</nav>

			<div className="status-row">
				<span>{status}</span>
				{canRetry && (
					<button type="button" className="button secondary" onClick={() => void executeRetry()}>
						Retry
					</button>
				)}
			</div>

			<div className="layout">
				<section className="card chat-card">
					<Conversation className="chat-scroll">
						<ConversationContent>
							{chatTimeline.length === 0 && !assistantDraft ? (
								<ConversationEmptyState
									icon={<MessageSquareIcon size={40} />}
									title="Start a conversation"
									description="Ask a question to run the selected AI scenario."
								/>
							) : (
								chatTimeline.map(row => (
									<div key={row.message.id} className="chat-turn">
										{row.message.content && (
											<div className={`bubble ${row.message.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}>
												<Streamdown>{row.message.content}</Streamdown>
											</div>
										)}
										{row.tools.length > 0 && (
											<div className="tool-group">
												{row.tools.map(tool => (
													<div key={tool.id} className="bubble bubble-tool">
														<div className="tool-card">
															<details>
																<summary className="tool-summary">
																	<div className="tool-head">
																		<div className="tool-title">{tool.content}</div>
																		<span className={`tool-chip tool-${String(tool.toolStatus ?? 'unknown')}`}>
																			{String(tool.toolStatus ?? 'unknown').toUpperCase()}
																		</span>
																	</div>
																</summary>
																<div className="tool-meta">
																	<span>{tool.actor ?? 'tool'}</span>
																	{tool.timestamp && <span>{new Date(tool.timestamp).toLocaleTimeString()}</span>}
																</div>
																{tool.toolInput !== undefined && (
																	<details>
																		<summary>input</summary>
																		<pre>{JSON.stringify(tool.toolInput, null, 2)}</pre>
																	</details>
																)}
																{tool.toolOutput !== undefined && (
																	<details>
																		<summary>output</summary>
																		<pre>{JSON.stringify(tool.toolOutput, null, 2)}</pre>
																	</details>
																)}
															</details>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								))
							)}
							{assistantDraft && (
								<div className="bubble bubble-assistant bubble-draft">
									<Streamdown>{assistantDraft}</Streamdown>
								</div>
							)}
						</ConversationContent>
						<ConversationScrollButton />
					</Conversation>
					<div className="composer">
						<div className="prompt-bar">
							<textarea
								value={prompt}
								onChange={event => setPrompt(event.target.value)}
								onKeyDown={event => {
									if (event.key !== 'Enter' || event.shiftKey) {
										return
									}
									event.preventDefault()
									if (scenario === 'command') {
										void executeCommand()
										return
									}
									if (scenario === 'followup') {
										void executeFollowUp()
										return
									}
									void executeStream()
								}}
								placeholder="Ask the assistant..."
								className="prompt-input"
								rows={1}
							/>
							{(scenario === 'stream' || scenario === 'protocol') && (
								<button type="button" className="button primary-icon send-button" onClick={executeStream} aria-label="Send message">
									<span className="button-icon" aria-hidden>
										➤
									</span>
								</button>
							)}
							{scenario === 'command' && (
								<button type="button" className="button primary-icon send-button" onClick={executeCommand} aria-label="Run command">
									<span className="button-icon" aria-hidden>
										⚡
									</span>
								</button>
							)}
							{scenario === 'followup' && (
								<button type="button" className="button primary-icon send-button" onClick={executeFollowUp} aria-label="Queue follow-up">
									<span className="button-icon" aria-hidden>
										↺
									</span>
								</button>
							)}
						</div>
					</div>
				</section>

				<section className="card">
					{scenario === 'protocol' ? (
						<div className="protocol-list">
							{streamPayloads.map((payload, index) => (
								<details key={`${payload.event}-${index}`} open={index === streamPayloads.length - 1}>
									<summary>
										{payload.event} #{index + 1}
									</summary>
									<pre>{JSON.stringify(payload.parsed ?? payload.raw, null, 2)}</pre>
								</details>
							))}
							{streamPayloads.length === 0 && <div className="placeholder">No protocol frames yet.</div>}
						</div>
						) : (
							<div className="flow-wrap">
								<div className="workflow-column">
									{flowPhases.map((phase, index) => {
										const Icon = phase.icon
										const next = flowPhases[index + 1]
										const edgeClass =
											phase.status === 'running'
												? 'flow-edge-active'
												: phase.status === 'success'
													? 'flow-edge-success'
													: phase.status === 'error'
														? 'flow-edge-error'
														: 'flow-edge-idle'
										return (
											<div key={phase.id} className="workflow-step-wrap">
												<div className={`flow-node-card flow-status-${phase.status} ${phase.isActive ? 'flow-active' : ''}`}>
													<div className="flow-node-content">
														<div className="flow-node-icon-wrap">
															<Icon size={16} />
														</div>
														<div className="flow-node-copy">
															<div className="flow-title">{phase.label}</div>
															<div className="flow-meta">{phase.description}</div>
														</div>
														<div className={`flow-status-pill flow-status-pill-${phase.status}`}>{phase.status}</div>
													</div>
												</div>
												{next && (
													<div className={`workflow-edge ${edgeClass}`}>
														<span className="workflow-edge-dot" />
													</div>
												)}
											</div>
										)
									})}
								</div>
							</div>
						)}

					{(scenario === 'command' || scenario === 'followup') && (
						<details className="output-details">
							<summary>Command output</summary>
							<pre>{commandOutput}</pre>
						</details>
					)}
				</section>
			</div>
			</div>
		</div>
	)
}

export { getStoredTheme, THEME_KEY, uniqueEnvelopes }
