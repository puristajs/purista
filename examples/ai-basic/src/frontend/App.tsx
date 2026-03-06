import { BotIcon, MessageSquareIcon, SparklesIcon, WorkflowIcon, WrenchIcon, XCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Streamdown } from 'streamdown'

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from './components/ai-elements/conversation'
import { getMcpTools, loadConversation, runSupportA2a, runSupportMcp, streamSupportAgent } from './lib/api'
import type { AgentProtocolEnvelope, StreamPayload, WorkflowStep } from './lib/types'
import { mapToWorkflow } from './lib/workflow'

type Scenario = 'stream' | 'mcp' | 'a2a' | 'protocol'
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
	jsonContent?: unknown
	toolStatus?: string
	toolInput?: unknown
	toolOutput?: unknown
	toolKey?: string
	actor?: string
	timestamp?: string
}

const scenarioOptions: Array<{ id: Scenario; label: string }> = [
	{ id: 'stream', label: 'Stream Chat' },
	{ id: 'mcp', label: 'MCP Expose' },
	{ id: 'a2a', label: 'Agent2Agent Expose' },
	{ id: 'protocol', label: 'Protocol Inspector' },
]

const defaultPrompt = 'Summarize https://purista.dev and calculate 12 * (8 + 4).'
const suggestedPrompts = [
	'Tell me what PURISTA is and give me 3 practical use cases.',
	'Summarize https://purista.dev and calculate 12 * (8 + 4).',
	'Compare 345 * 17 and 2^10 (use calculator for arithmetic only).',
	'Fetch https://purista.dev/handbook and list 5 key topics.',
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

const envelopeFingerprint = (envelope: AgentProtocolEnvelope): string => {
	const frame = envelope.frame
	if (frame.kind === 'message') {
		return `${envelope.conversationId ?? 'n/a'}|message|${frame.final === true ? 'final' : 'partial'}|${String(frame.content ?? '')}`
	}
	if (frame.kind === 'artifact') {
		return `${envelope.conversationId ?? 'n/a'}|artifact|${stableJson(frame.content)}`
	}
	if (frame.kind === 'tool') {
		return `${envelope.conversationId ?? 'n/a'}|tool|${String(frame.toolName ?? '')}|${String(frame.status ?? '')}|${stableJson(frame.input)}|${stableJson(frame.output)}`
	}
	if (frame.kind === 'telemetry') {
		return `${envelope.conversationId ?? 'n/a'}|telemetry|${stableJson(frame.usage)}|${String(frame.durationMs ?? '')}`
	}
	return `${envelope.conversationId ?? 'n/a'}|error|${stableJson(frame)}`
}

const formatTime = (isoTimestamp?: string): string => {
	if (!isoTimestamp) {
		return '--:--:--'
	}
	try {
		return new Date(isoTimestamp).toLocaleTimeString()
	} catch {
		return '--:--:--'
	}
}

const workflowMeta = (step: WorkflowStep): { icon: typeof WorkflowIcon; title: string; description: string } => {
	if (step.type === 'tool') {
		return {
			icon: WrenchIcon,
			title: step.label,
			description: `${step.actor} · ${formatTime(step.timestamp)}`,
		}
	}
	if (step.type === 'telemetry') {
		return {
			icon: SparklesIcon,
			title: 'Telemetry',
			description: `${step.label} · ${step.actor}`,
		}
	}
	if (step.type === 'error') {
		return {
			icon: XCircleIcon,
			title: step.label,
			description: `${step.actor} · ${formatTime(step.timestamp)}`,
		}
	}
	if (step.category === 'ai') {
		return {
			icon: BotIcon,
			title: step.label,
			description: `${step.actor} · ${formatTime(step.timestamp)}`,
		}
	}
	if (step.category === 'command') {
		return {
			icon: WrenchIcon,
			title: step.label,
			description: `${step.actor} · ${formatTime(step.timestamp)}`,
		}
	}
	return {
		icon: WorkflowIcon,
		title: step.label,
		description: `${step.actor} · ${formatTime(step.timestamp)}`,
	}
}

const workflowStepMessageKey = (step: WorkflowStep): string => `${step.actor}|${step.depth}`

const workflowStepToolKey = (step: WorkflowStep): string => {
	if (step.type !== 'tool') {
		return ''
	}
	const details = (step.details ?? {}) as { toolName?: string; input?: unknown }
	return `${step.actor}|${step.depth}|${String(details.toolName ?? '')}|${stableJson(details.input)}`
}

const coalesceWorkflowSteps = (steps: WorkflowStep[]): WorkflowStep[] => {
	const next: WorkflowStep[] = []
	for (const step of steps) {
		if (step.type === 'message') {
			const isFinal = (step.details as { final?: boolean } | undefined)?.final === true
			const key = workflowStepMessageKey(step)
			const existingIndex = next.findIndex(existing => {
				if (existing.type !== 'message') {
					return false
				}
				if (workflowStepMessageKey(existing) !== key) {
					return false
				}
				const existingFinal = (existing.details as { final?: boolean } | undefined)?.final === true
				return existingFinal === false || isFinal
			})
			if (existingIndex >= 0) {
				next[existingIndex] = step
				continue
			}
		}
		if (step.type === 'tool') {
			const key = workflowStepToolKey(step)
			const existingIndex = next.findIndex(
				existing => existing.type === 'tool' && workflowStepToolKey(existing) === key,
			)
			if (existingIndex >= 0) {
				next[existingIndex] = step
				continue
			}
		}
		next.push(step)
	}
	return next
}

export const App = () => {
	const [scenario, setScenario] = useState<Scenario>('stream')
	const [theme, setTheme] = useState<Theme>(getStoredTheme)
	const [prompt, setPrompt] = useState(defaultPrompt)
	const [sessionId, setSessionId] = useState('')
	const [responseFormat, setResponseFormat] = useState<'text' | 'json'>('text')
	const [status, setStatus] = useState('Ready')
	const [canRetry, setCanRetry] = useState(false)
	const [commandOutput, setCommandOutput] = useState('{}')
	const [assistantDraft, setAssistantDraft] = useState('')
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
	const [envelopes, setEnvelopes] = useState<AgentProtocolEnvelope[]>([])
	const [streamPayloads, setStreamPayloads] = useState<StreamPayload[]>([])
	const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>(getStoredHistory)
	const [mcpTools, setMcpTools] = useState<unknown[] | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)
	const seenFramesRef = useRef<Set<string>>(new Set())

	const workflow = useMemo(() => mapToWorkflow(envelopes), [envelopes])
	const coalescedWorkflow = useMemo(() => coalesceWorkflowSteps(workflow), [workflow])

	const chatTimeline = useMemo(() => {
		const rows: Array<{ message: ChatMessage; tools: ChatMessage[] }> = []
		for (const message of chatMessages) {
			if (message.role === 'tool') {
				const last = rows.at(-1)
				if (last) {
					last.tools.push(message)
				} else {
					rows.push({ message: { id: nowId(), role: 'assistant', content: '' }, tools: [message] })
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

	const appendAssistantMessage = (content: string, jsonContent?: unknown) => {
		const text = content.trim()
		if (!text && jsonContent === undefined) {
			return
		}
		setChatMessages(previous => [...previous, { id: nowId(), role: 'assistant', content: text, jsonContent }])
	}

	const appendToolMessage = (
		toolName: string,
		statusValue: string,
		input?: unknown,
		output?: unknown,
		actor?: string,
		timestamp?: string,
	) => {
		const text = `${toolName} · ${statusValue}`
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
					toolStatus: statusValue,
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
					toolStatus: statusValue,
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
		if (frame.kind === 'artifact') {
			if (frame.mimeType === 'application/json' && typeof frame.content === 'object' && frame.content !== null) {
				appendAssistantMessage('Structured JSON response', frame.content)
				setStatus('Structured JSON received')
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
			setStatus(
				`Telemetry · tokens ${String((frame.usage as { totalTokens?: number } | undefined)?.totalTokens ?? '-')}`,
			)
		}
	}

	const runStream = async () => {
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

		await streamSupportAgent(
			{ prompt: question, sessionId: activeSessionId, responseFormat },
			{
				onEnvelope: processEnvelope,
				onPayload: payload => setStreamPayloads(previous => [...previous, payload]),
				onComplete: () => {
					setAssistantDraft('')
					setStatus('Completed')
				},
				onError: error => {
					setAssistantDraft('')
					appendAssistantMessage(`Error: ${error}`)
					setStatus('Error')
					setCanRetry(true)
				},
			},
		)
	}

	const runMcp = async () => {
		const question = prompt.trim()
		if (!question) {
			return
		}
		const activeSessionId = sessionId.trim() || crypto.randomUUID()
		setSessionId(activeSessionId)
		rememberConversation(activeSessionId, question)
		appendUserMessage(question)
		setStatus('Calling MCP endpoint...')
		setCanRetry(false)
		const result = await runSupportMcp({
			name: 'supportAgent',
			arguments: {
				prompt: question,
				sessionId: activeSessionId,
				responseFormat,
			},
		})
		setCommandOutput(JSON.stringify(result, null, 2))
		appendAssistantMessage('MCP call completed. See result panel for protocol-compatible response.')
		setStatus('MCP call completed')
	}

	const runA2a = async () => {
		const question = prompt.trim()
		if (!question) {
			return
		}
		const activeSessionId = sessionId.trim() || crypto.randomUUID()
		setSessionId(activeSessionId)
		rememberConversation(activeSessionId, question)
		appendUserMessage(question)
		setStatus('Calling A2A endpoint...')
		setCanRetry(false)
		const result = await runSupportA2a({ prompt: question, sessionId: activeSessionId, responseFormat })
		setCommandOutput(JSON.stringify(result, null, 2))
		appendAssistantMessage('Agent2Agent endpoint completed. See result panel for message graph payload.')
		setStatus('A2A call completed')
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

	const execute = async () => {
		if (isGenerating) {
			return
		}
		const question = prompt.trim()
		if (!question) {
			return
		}
		setPrompt('')
		setAssistantDraft('')
		setEnvelopes([])
		setStreamPayloads([])
		seenFramesRef.current = new Set()
		setCommandOutput('{}')
		setCanRetry(false)
		setIsGenerating(true)
		try {
			if (scenario === 'mcp') {
				await runMcp()
				return
			}
			if (scenario === 'a2a') {
				await runA2a()
				return
			}
			await runStream()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			appendAssistantMessage(`Error: ${message}`)
			setStatus('Error')
			setCanRetry(true)
		} finally {
			setIsGenerating(false)
		}
	}

	const applySuggestedPrompt = (nextPrompt: string) => {
		if (isGenerating) {
			return
		}
		setPrompt(nextPrompt)
	}

	useEffect(() => {
		void getMcpTools()
			.then(result => {
				if (result && typeof result === 'object' && 'tools' in result && Array.isArray(result.tools)) {
					setMcpTools(result.tools)
				}
			})
			.catch(() => {
				setMcpTools([])
			})
	}, [])

	return (
		<div className="page">
			<aside className="sidebar">
				<div className="sidebar-header">
					<h2>History</h2>
					<button
						type="button"
						className="button secondary"
						onClick={() => {
							setPrompt(defaultPrompt)
							setChatMessages([])
							setEnvelopes([])
							setStreamPayloads([])
							seenFramesRef.current = new Set()
							setAssistantDraft('')
							setStatus('Ready')
							setCanRetry(false)
							setIsGenerating(false)
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
						<p>General AI chat with tool calling, streaming, MCP/A2A interoperability, and protocol inspection.</p>
					</div>
					<button
						type="button"
						className="button secondary"
						onClick={() => setThemeAndStore(theme === 'dark' ? 'light' : 'dark')}
					>
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
					<select
						value={responseFormat}
						onChange={event => setResponseFormat(event.target.value as 'text' | 'json')}
						className="response-format-select"
					>
						<option value="text">Text output</option>
						<option value="json">JSON output</option>
					</select>
				</nav>

				<div className="status-row">
					<span>{status}</span>
					{canRetry && (
						<button type="button" className="button secondary" onClick={() => void execute()}>
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
											{row.message.jsonContent !== undefined && (
												<details className="bubble bubble-assistant" open>
													<summary>Structured JSON</summary>
													<pre>{JSON.stringify(row.message.jsonContent, null, 2)}</pre>
												</details>
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
							<fieldset className="suggested-prompts">
								<legend className="visually-hidden">Suggested prompts</legend>
								{suggestedPrompts.map(suggestion => (
									<button
										key={suggestion}
										type="button"
										className={`button secondary suggestion-button ${
											prompt.trim() === suggestion.trim() ? 'active' : ''
										}`}
										disabled={isGenerating}
										onClick={() => applySuggestedPrompt(suggestion)}
									>
										{suggestion}
									</button>
								))}
							</fieldset>
							<div className="prompt-bar">
								<textarea
									value={prompt}
									disabled={isGenerating}
									onChange={event => setPrompt(event.target.value)}
									onKeyDown={event => {
										if (event.key !== 'Enter' || event.shiftKey) {
											return
										}
										event.preventDefault()
										void execute()
									}}
									placeholder="Ask the assistant..."
									className="prompt-input"
									rows={1}
								/>
								<button
									type="button"
									className="button primary-icon send-button"
									disabled={isGenerating}
									onClick={() => void execute()}
									aria-label="Send message"
								>
									<span className="button-icon" aria-hidden>
										➤
									</span>
								</button>
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
								{coalescedWorkflow.length === 0 ? (
									<div className="placeholder">No workflow frames yet.</div>
								) : (
									<div className="workflow-column">
										{coalescedWorkflow.map((step, index) => {
											const { icon: Icon, title, description } = workflowMeta(step)
											const next = coalescedWorkflow[index + 1]
											const edgeClass =
												step.status === 'running'
													? 'flow-edge-active'
													: step.status === 'success'
														? 'flow-edge-success'
														: step.status === 'error'
															? 'flow-edge-error'
															: 'flow-edge-idle'
											return (
												<div key={`${step.id}-${index}`} className={`workflow-step-wrap depth-${step.depth}`}>
													<div
														className={`flow-node-card flow-status-${step.status} ${step.status === 'running' ? 'flow-active' : ''}`}
													>
														<div className="flow-node-content">
															<div className="flow-node-icon-wrap">
																<Icon size={16} />
															</div>
															<div className="flow-node-copy">
																<div className="flow-title">{title}</div>
																<div className="flow-meta">{description}</div>
															</div>
															<div className={`flow-status-pill flow-status-pill-${step.status}`}>{step.status}</div>
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
								)}
							</div>
						)}
						<details className="output-details" open={scenario === 'mcp' || scenario === 'a2a'}>
							<summary>Protocol result output</summary>
							<pre>{commandOutput}</pre>
						</details>
						{scenario === 'mcp' && (
							<details className="output-details" open>
								<summary>MCP tool descriptors</summary>
								<pre>{JSON.stringify(mcpTools ?? [], null, 2)}</pre>
							</details>
						)}
					</section>
				</div>
			</div>
		</div>
	)
}

export { getStoredTheme, THEME_KEY, uniqueEnvelopes }
