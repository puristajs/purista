import { useEffect, useMemo, useRef, useState } from 'react'

import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import { Streamdown } from 'streamdown'

import { loadConversation, runSupportCommand, streamSupportAgent, triggerFollowUp } from './lib/api'
import type { AgentProtocolEnvelope, StreamPayload } from './lib/types'
import { mapToWorkflow } from './lib/workflow'

type Scenario = 'stream' | 'command' | 'followup' | 'protocol'
type Theme = 'dark' | 'light'

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

const getStoredTheme = (): Theme => {
	const stored = window.localStorage.getItem(THEME_KEY)
	return stored === 'light' ? 'light' : 'dark'
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
	const seenFramesRef = useRef<Set<string>>(new Set())
	const chatScrollRef = useRef<HTMLDivElement | null>(null)

	const workflow = useMemo(() => mapToWorkflow(envelopes), [envelopes])

	const flowGraph = useMemo(() => {
		const nodes = workflow.map((step, index) => ({
			id: `${step.id}-${index}`,
			position: { x: step.depth * 250, y: index * 105 },
			data: {
				label: (
					<div className="flow-node">
						<div className="flow-title">{step.label.slice(0, 100)}</div>
						<div className="flow-meta">{step.actor}</div>
					</div>
				),
			},
			style: {
				background: 'var(--panel)',
				color: 'var(--text)',
				border: '1px solid var(--border)',
				borderRadius: 12,
				width: 240,
				padding: 8,
			},
		}))
		const edges = nodes.slice(1).map((node, index) => ({
			id: `e-${index}`,
			source: nodes[index].id,
			target: node.id,
		}))
		return { nodes, edges }
	}, [workflow])

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
		const element = chatScrollRef.current
		if (!element) {
			return
		}
		element.scrollTop = element.scrollHeight
	}, [chatMessages, assistantDraft])

	const setThemeAndStore = (nextTheme: Theme) => {
		window.localStorage.setItem(THEME_KEY, nextTheme)
		setTheme(nextTheme)
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
					sessionId: sessionId || undefined,
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
		appendUserMessage(question)
		setStatus('Running command...')
		setCanRetry(false)
		try {
			const result = await runSupportCommand({
				prompt: question,
				sessionId: sessionId || undefined,
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
		appendUserMessage(question)
		setStatus('Queueing follow-up...')
		setCanRetry(false)
		try {
			const result = await triggerFollowUp({
				prompt: question,
				sessionId: sessionId || undefined,
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

	const executeLoadConversation = async () => {
		if (!sessionId) {
			setStatus('Set a session id first')
			return
		}
		setStatus('Loading conversation...')
		const result = await loadConversation(sessionId)
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
		<div className={`page ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
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
					<div className="chat-scroll" ref={chatScrollRef}>
						{chatTimeline.map(row => (
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
						))}
						{assistantDraft && (
							<div className="bubble bubble-assistant bubble-draft">
								<Streamdown>{assistantDraft}</Streamdown>
							</div>
						)}
					</div>
					<div className="composer">
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
						/>
						<div className="composer-row">
							<input
								value={sessionId}
								onChange={event => setSessionId(event.target.value)}
								placeholder="Session id for restore (optional)"
							/>
							<button type="button" className="button secondary" onClick={executeLoadConversation}>
								Load
							</button>
						</div>
						<div className="composer-row buttons">
							{(scenario === 'stream' || scenario === 'protocol') && (
								<button type="button" className="button" onClick={executeStream}>
									Send
								</button>
							)}
							{scenario === 'command' && (
								<button type="button" className="button" onClick={executeCommand}>
									Run Command
								</button>
							)}
							{scenario === 'followup' && (
								<button type="button" className="button" onClick={executeFollowUp}>
									Queue Follow-up
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
							<ReactFlow nodes={flowGraph.nodes} edges={flowGraph.edges} fitView>
								<MiniMap />
								<Controls />
								<Background />
							</ReactFlow>
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
	)
}

export { getStoredTheme, THEME_KEY, uniqueEnvelopes }
