/* @jsxRuntime automatic */

import { type UIMessage, useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type FileUIPart } from 'ai'
import {
	BracesIcon,
	CompassIcon,
	HistoryIcon,
	MenuIcon,
	MessageSquareMoreIcon,
	MoonIcon,
	MoreHorizontalIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
	SearchIcon,
	SunIcon,
	WandSparklesIcon,
	WorkflowIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ComposerAttachmentStrip } from '@/chat/ComposerAttachmentStrip'
import { MessageAttachments } from '@/chat/MessageAttachments'
import { getAttachmentLabel } from '@/components/ai-elements/attachments'
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Plan, PlanContent, PlanTrigger } from '@/components/ai-elements/plan'
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionAddScreenshot,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Source, Sources, SourcesContent, SourcesTrigger } from '@/components/ai-elements/sources'
import { Task, TaskContent, TaskItem, TaskTrigger } from '@/components/ai-elements/task'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { ExplanationMarkdown } from '@/components/explanation/ExplanationMarkdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { getStoredTheme, THEME_KEY, type Theme } from '@/lib/app-state'
import { cn } from '@/lib/utils'
import { loadConversationHistory, loadRecentConversationHistory, toApiUrl } from './lib/api'
import { type DeveloperDeskScenarioId, developerDeskScenarioMap, developerDeskScenarios } from './lib/showcase'
import type {
	AgentRunState,
	ConversationHistoryMessage,
	PuristaAiPlan,
	PuristaAiPlanStatus,
	PuristaAiTask,
	PuristaAiTaskChunk,
	PuristaAiWorkflowStage,
} from './lib/types'
import { StructuredObjectPreview } from './structured/StructuredObjectPreview'

type ConversationHistoryItem = {
	sessionId: string
	firstMessage: string
	updatedAt: number
	scenario: DeveloperDeskScenarioId
}

type HistoryPaneProps = {
	conversationHistory: ConversationHistoryItem[]
	historyCollapsed: boolean
	onRestore: (item: ConversationHistoryItem) => void
	onStartFreshSession: () => void
	onToggleCollapsed: () => void
	sessionId: string
	activeScenarioId: DeveloperDeskScenarioId
}

type SourceEntry = {
	id: string
	title: string
	url?: string
	mediaType?: string
}

type PlannerOutput = {
	message: string
	highlights?: string[]
	recommendedNextActions?: string[]
}

type StructuredReviewOutput = Partial<{
	overallVerdict: string
	scorecard: {
		readinessScore: number
		riskScore: number
		confidenceScore: number
	}
	dimensionScores: {
		scalability: number
		reliability: number
		operability: number
		security: number
	}
	executiveSummary: string
	strengths: string[]
	risks: string[]
	nextActions: string[]
}>

const structuredSectionByDataType: Record<string, keyof StructuredReviewOutput> = {
	'data-architecture-review-overallverdict': 'overallVerdict',
	'data-architecture-review-scorecard': 'scorecard',
	'data-architecture-review-dimensionscores': 'dimensionScores',
	'data-architecture-review-executivesummary': 'executiveSummary',
	'data-architecture-review-strengths': 'strengths',
	'data-architecture-review-risks': 'risks',
	'data-architecture-review-nextactions': 'nextActions',
}

const getHistoryItemKey = (item: ConversationHistoryItem) => `${item.scenario}:${item.sessionId}:${item.updatedAt}`

const getDefaultResponseFormat = (scenarioId: DeveloperDeskScenarioId): 'text' | 'json' =>
	scenarioId === 'planner' || scenarioId === 'structured' ? 'json' : 'text'

const isTextPart = (part: { type?: unknown; text?: unknown }): part is { type: 'text'; text: string } =>
	part.type === 'text' && typeof part.text === 'string'

const isFilePart = (part: { type?: unknown; url?: unknown; mediaType?: unknown }): part is FileUIPart =>
	part.type === 'file' && typeof part.url === 'string' && typeof part.mediaType === 'string'

const isReasoningTextPart = (part: { type?: unknown; text?: unknown }): part is { type: 'reasoning'; text: string } =>
	part.type === 'reasoning' && typeof part.text === 'string'

const isToolPart = (part: { type?: unknown }): part is Record<string, unknown> & { type: string } =>
	part.type === 'dynamic-tool' || (typeof part.type === 'string' && part.type.startsWith('tool-'))

const isSourceUrlPart = (part: {
	type?: unknown
	url?: unknown
	sourceId?: unknown
}): part is { type: 'source-url'; sourceId: string; url?: string } =>
	part.type === 'source-url' && typeof part.sourceId === 'string'

const isSourceDocumentPart = (part: {
	type?: unknown
	sourceId?: unknown
	title?: unknown
	mediaType?: unknown
}): part is { type: 'source-document'; sourceId: string; title?: string; mediaType?: string } =>
	part.type === 'source-document' && typeof part.sourceId === 'string'

const isRunStateDataPart = (value: unknown): value is { type: 'data-run-state'; data: AgentRunState } =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'data-run-state' &&
	'data' in value &&
	typeof value.data === 'object' &&
	value.data !== null

const isPlanDataPart = (value: unknown): value is { type: 'data-purista-ai-plan'; data: PuristaAiPlan } =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'data-purista-ai-plan' &&
	'data' in value

const isPlanStatusDataPart = (
	value: unknown,
): value is { type: 'data-purista-ai-plan-status'; data: PuristaAiPlanStatus } =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'data-purista-ai-plan-status' &&
	'data' in value

const isTaskDataPart = (value: unknown): value is { type: 'data-purista-ai-task'; data: PuristaAiTask } =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'data-purista-ai-task' &&
	'data' in value

const isTaskChunkDataPart = (
	value: unknown,
): value is { type: 'data-purista-ai-task-chunk'; data: PuristaAiTaskChunk } =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'data-purista-ai-task-chunk' &&
	'data' in value

const isGenericDataPart = (value: unknown): value is { type: string; data?: unknown } =>
	typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string'

const isPlannerOutput = (value: unknown): value is PlannerOutput =>
	typeof value === 'object' &&
	value !== null &&
	'message' in value &&
	typeof (value as { message?: unknown }).message === 'string'

const isPlannerWorkflowStage = (value: unknown): value is PuristaAiWorkflowStage =>
	typeof value === 'object' &&
	value !== null &&
	'type' in value &&
	value.type === 'purista-ai-workflow-stage' &&
	'status' in value &&
	((value as { status?: unknown }).status === 'running' ||
		(value as { status?: unknown }).status === 'completed' ||
		(value as { status?: unknown }).status === 'failed')

const stableChunkContent = (value: unknown): string => {
	try {
		return JSON.stringify(value ?? null, null, 2)
	} catch {
		return String(value)
	}
}

const getMessageText = (message: UIMessage) =>
	message.parts
		.filter(isTextPart)
		.map(part => part.text)
		.join('')
		.trim()

const getReasoningText = (message: UIMessage) =>
	message.parts
		.filter(isReasoningTextPart)
		.map(part => part.text)
		.join('')
		.trim()

const getMessageFiles = (message: UIMessage) =>
	message.parts.filter(isFilePart).map((part, index) => ({
		...part,
		id: `${message.id}-file-${index}`,
	}))

const getMessageSources = (messages: UIMessage[]): SourceEntry[] => getSourceEntries(messages)

const toUiHistoryMessages = (messages: ConversationHistoryMessage[]): UIMessage[] =>
	messages.map(message => {
		const role = message.role === 'user' ? 'user' : message.role === 'assistant' ? 'assistant' : 'assistant'
		const prefix =
			message.role === 'tool'
				? `[tool${message.toolName ? `:${message.toolName}` : ''}] `
				: message.role === 'tool_result'
					? `[tool-result${message.toolName ? `:${message.toolName}` : ''}] `
					: message.role === 'developer'
						? '[developer] '
						: message.role === 'system'
							? '[system] '
							: ''

		return {
			id: message.id,
			role,
			parts: [
				{
					type: 'text',
					text: `${prefix}${message.content}`,
				},
			],
		} as UIMessage
	})

const buildPromptFromUserMessage = (message?: UIMessage) => {
	if (!message) {
		return ''
	}

	const text = getMessageText(message)
	const files = getMessageFiles(message)
	if (files.length === 0) {
		return text
	}

	const attachmentSummary = files.map(file => `- ${getAttachmentLabel(file)} (${file.mediaType})`).join('\n')

	return [text, `Attached files:\n${attachmentSummary}`].filter(Boolean).join('\n\n')
}

const getSourceEntries = (messages: UIMessage[]): SourceEntry[] => {
	const dedup = new Map<string, SourceEntry>()
	for (const message of messages) {
		for (const part of message.parts) {
			if (isSourceUrlPart(part)) {
				dedup.set(part.sourceId, {
					id: part.sourceId,
					title: typeof part.url === 'string' ? part.url : part.sourceId,
					url: typeof part.url === 'string' ? part.url : undefined,
				})
			}
			if (isSourceDocumentPart(part)) {
				const current = dedup.get(part.sourceId)
				dedup.set(part.sourceId, {
					id: part.sourceId,
					title: typeof part.title === 'string' ? part.title : (current?.title ?? part.sourceId),
					url: current?.url,
					mediaType: typeof part.mediaType === 'string' ? part.mediaType : current?.mediaType,
				})
			}
		}
	}
	return [...dedup.values()]
}

const formatRunStatus = (status: string): string =>
	({
		queued: 'Queued',
		idle: 'Idle',
		planning: 'Planning',
		running: 'Running',
		recovering: 'Recovering',
		retrying: 'Retrying',
		summarizing: 'Summarizing',
		completed: 'Completed',
		failed: 'Failed',
		cancelled: 'Cancelled',
		blocked: 'Blocked',
		'waiting-approval': 'Waiting approval',
	})[status] ?? status

const toBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
	if (status === 'completed' || status === 'running' || status === 'streaming') {
		return 'default'
	}
	if (status === 'failed' || status === 'error' || status === 'cancelled') {
		return 'destructive'
	}
	if (status === 'submitted' || status === 'planning' || status === 'retrying' || status === 'waiting-approval') {
		return 'secondary'
	}
	return 'outline'
}

const buildScenarioExplanationMarkdown = (scenario: (typeof developerDeskScenarios)[number]) => {
	const flow = scenario.userVisibleFlow.map(step => `- ${step}`).join('\n')
	const runtime = scenario.runtimeFlow.map(step => `- ${step}`).join('\n')
	const visible = scenario.protocolFlow.map(step => `- ${step}`).join('\n')
	const concepts = scenario.keyConcepts.map(item => `- **${item.term}**: ${item.description}`).join('\n')
	const features = [
		'Direct attached-agent HTTP endpoint',
		'AI SDK streaming UI messages',
		...(scenario.id === 'chat' ? ['Conversation memory'] : []),
		...(scenario.id === 'research' ? ['Tool calling', 'Source grounding'] : []),
		...(scenario.id === 'planner'
			? ['Planner tasks', 'Worker/delegate orchestration', 'Workflow-stage finalization']
			: []),
		...(scenario.id === 'structured' ? ['Schema-first output', 'Structured validation'] : []),
		...(scenario.id === 'reflection' ? ['Draft/critique loop', 'Refinement workflow'] : []),
	]
		.map(item => `- ${item}`)
		.join('\n')
	const codeMap = scenario.codeMap.map(item => `- \`${item.path}\` (${item.label})`).join('\n')
	const callables =
		scenario.agent.callables.length > 0
			? scenario.agent.callables
					.map(callable => `- **${callable.name}** (${callable.kind}): ${callable.description}`)
					.join('\n')
			: '- No additional tools or delegates are needed in this scenario.'
	const extension = scenario.extensionPoints.map(item => `- ${item}`).join('\n')
	const usageSnippet = getScenarioUsageSnippet(scenario.id, scenario.endpoint)
	const flowDiagram = `\`\`\`mermaid
flowchart LR
    A["You send a prompt"] --> B["Attached PURISTA agent"]
    B --> C["Model / tools / delegates"]
    C --> D["AI SDK UI message stream"]
    D --> E["Transcript + explanation pane"]
\`\`\``

	return `## What this demo shows

${scenario.what}

## Features used

${features}

## Try this first

${flow}

## What happens behind the scenes

${runtime}

## What becomes visible in the UI

${visible}

## The mental model

${concepts}

## Build this pattern

\`\`\`ts
${usageSnippet}
\`\`\`

## Where to look in the code

${codeMap}

## Active runtime pieces

- **Agent:** \`${scenario.agent.name}\`
- **Model:** \`${scenario.agent.model}\`
- **Capabilities:**
${callables}

## How to extend it

${extension}

## Flow

${flowDiagram}`
}

const getScenarioUsageSnippet = (scenarioId: DeveloperDeskScenarioId, endpoint: string) => {
	switch (scenarioId) {
		case 'planner':
			return `const plan = await context.plan.generate({
  prompt,
  delegates: ['researchAgent', 'architectureReviewAgent'],
})

await context.plan.execute(plan)

context.io.workflow.emitStage({
  name: 'final-answer',
  status: 'running',
  summary: 'Synthesizing the final recommendation from finished tasks.',
})

const result = await context.ai.replyObject({
  schema: plannerSummarySchema,
  prompt,
})

await context.ai.reply(result.message)
await context.memory.conversation.addAssistant(result.message)`
		case 'research':
			return `const chat = useChat({
  transport: new DefaultChatTransport({
    api: '${endpoint}',
  }),
})

// The agent can fetch URLs, call typed business tools,
// and stream the grounded answer into one transcript.`
		case 'structured':
			return `const result = await context.ai.streamObject({
  schema: architectureReviewSchema,
  prompt,
})

// Stream section updates for the UI, but treat the
// final output artifact as the canonical machine result.`
		case 'reflection':
			return `const reflection = await context.ai.reflect.run({
  prompt,
  maxIterations: 3,
})

await context.ai.reply(reflection.message)`
		default:
			return `const chat = useChat({
  transport: new DefaultChatTransport({
    api: '${endpoint}',
  }),
})

// Keep the same session id to reuse conversation memory
// and stream the assistant answer directly into the UI.`
	}
}

const formatHistoryTimestamp = (timestamp: number) => {
	if (!Number.isFinite(timestamp)) {
		return ''
	}
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(timestamp))
}

const HistoryPane = ({
	conversationHistory,
	historyCollapsed,
	onRestore,
	onStartFreshSession,
	onToggleCollapsed,
	sessionId,
	activeScenarioId,
}: HistoryPaneProps) => (
	<div className="flex h-full min-h-0 flex-col border-r bg-background">
		<div className="flex items-start justify-between gap-3 border-b px-4 py-4">
			{historyCollapsed ? null : (
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">History</p>
					<h2 className="mt-1 text-sm font-semibold">Recent sessions</h2>
					<p className="mt-1 text-sm text-muted-foreground">Reopen an earlier prompt without changing scenarios.</p>
				</div>
			)}
			<div className="flex items-center gap-2">
				{historyCollapsed ? null : (
					<Button onClick={onStartFreshSession} size="sm" variant="outline">
						New chat
					</Button>
				)}
				<Button
					aria-label={historyCollapsed ? 'Expand history' : 'Collapse history'}
					onClick={onToggleCollapsed}
					size="icon-sm"
					variant="ghost"
				>
					{historyCollapsed ? <PanelLeftOpenIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
				</Button>
			</div>
		</div>
		<div className="min-h-0 flex-1">
			{historyCollapsed ? null : (
				<ScrollArea className="h-full">
					<div className="flex flex-col gap-2 p-4">
						{conversationHistory.length === 0 ? (
							<div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
								Start a conversation and it will appear here for quick reopening.
							</div>
						) : (
							conversationHistory.map(item => (
								<Button
									className="h-auto justify-start px-3 py-3 text-left"
									key={getHistoryItemKey(item)}
									onClick={() => onRestore(item)}
									title={item.firstMessage}
									variant={item.sessionId === sessionId && item.scenario === activeScenarioId ? 'secondary' : 'ghost'}
								>
									<div className="min-w-0 space-y-1 overflow-hidden">
										<p className="line-clamp-2 text-sm font-medium leading-5">{item.firstMessage}</p>
										<p className="truncate text-xs text-muted-foreground">
											{developerDeskScenarioMap[item.scenario].label}
											{item.updatedAt ? ` · ${formatHistoryTimestamp(item.updatedAt)}` : ''}
										</p>
									</div>
								</Button>
							))
						)}
					</div>
				</ScrollArea>
			)}
		</div>
	</div>
)

const ScenarioIcon = ({ scenarioId }: { scenarioId: DeveloperDeskScenarioId }) => {
	switch (scenarioId) {
		case 'chat':
			return <MessageSquareMoreIcon />
		case 'research':
			return <SearchIcon />
		case 'planner':
			return <WorkflowIcon />
		case 'structured':
			return <BracesIcon />
		case 'reflection':
			return <WandSparklesIcon />
	}
}

const ExplanationPane = ({ scenarioId, theme }: { scenarioId: DeveloperDeskScenarioId; theme: Theme }) => {
	const scenario = developerDeskScenarioMap[scenarioId]
	const explanationMarkdown = buildScenarioExplanationMarkdown(scenario)

	return (
		<div className="flex h-full min-h-0 flex-col border-l bg-background">
			<div className="px-5 py-5">
				<p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">Explanation</p>
				<h2 className="mt-2 text-xl font-semibold leading-tight text-balance">{scenario.title}</h2>
			</div>
			<Separator />
			<ScrollArea className="min-h-0 flex-1 px-5 pb-5">
				<div className="pt-5">
					<ExplanationMarkdown theme={theme}>{explanationMarkdown}</ExplanationMarkdown>
				</div>
			</ScrollArea>
		</div>
	)
}

export const App = () => {
	const [scenarioId, setScenarioId] = useState<DeveloperDeskScenarioId>('chat')
	const [theme, setTheme] = useState<Theme>(getStoredTheme)
	const [prompt, setPrompt] = useState(developerDeskScenarioMap.chat.defaultPrompt)
	const [sessionId, setSessionId] = useState('')
	const [responseFormat, setResponseFormat] = useState<'text' | 'json'>(getDefaultResponseFormat('chat'))
	const [statusText, setStatusText] = useState('Ready')
	const [appError, setAppError] = useState<string | null>(null)
	const [activeRunState, setActiveRunState] = useState<AgentRunState | null>(null)
	const [planArtifact, setPlanArtifact] = useState<PuristaAiPlan | null>(null)
	const [planStatusArtifact, setPlanStatusArtifact] = useState<PuristaAiPlanStatus | null>(null)
	const [taskArtifacts, setTaskArtifacts] = useState<Record<string, PuristaAiTask>>({})
	const [latestOutput, setLatestOutput] = useState<unknown>(undefined)
	const [plannerFinalization, setPlannerFinalization] = useState<PuristaAiWorkflowStage | null>(null)
	const [liveStructuredOutput, setLiveStructuredOutput] = useState<StructuredReviewOutput | null>(null)
	const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>([])
	const [docsOpen, setDocsOpen] = useState(false)
	const [navOpen, setNavOpen] = useState(false)
	const [historyCollapsed, setHistoryCollapsed] = useState(true)
	const sessionIdRef = useRef(sessionId)
	const responseFormatRef = useRef(responseFormat)
	const activeScenario = developerDeskScenarioMap[scenarioId]

	const {
		messages,
		status: uiStatus,
		error: uiError,
		sendMessage,
		setMessages,
		stop,
	} = useChat({
		id: scenarioId,
		transport: new DefaultChatTransport({
			api: toApiUrl(activeScenario.endpoint),
			prepareSendMessagesRequest: ({ messages: pendingMessages, body }) => {
				const lastUserMessage = [...pendingMessages].reverse().find(message => message.role === 'user')
				const lastPrompt = buildPromptFromUserMessage(lastUserMessage)

				return {
					body: {
						...(body ?? {}),
						sessionId: sessionIdRef.current || undefined,
						responseFormat: responseFormatRef.current,
						prompt: lastPrompt,
						message: lastPrompt,
					},
				}
			},
		}),
		onError: error => {
			setAppError(error.message)
			setStatusText(`Error: ${error.message}`)
		},
		onData: dataPart => {
			if (isRunStateDataPart(dataPart)) {
				setActiveRunState(dataPart.data)
				return
			}
			if (isPlanDataPart(dataPart)) {
				setPlanArtifact(dataPart.data)
				return
			}
			if (isPlanStatusDataPart(dataPart)) {
				setPlanStatusArtifact(dataPart.data)
				return
			}
			if (isTaskDataPart(dataPart)) {
				setTaskArtifacts(previous => ({ ...previous, [dataPart.data.taskId]: dataPart.data }))
				return
			}
			if (isTaskChunkDataPart(dataPart)) {
				return
			}
			if (
				isGenericDataPart(dataPart) &&
				dataPart.type === 'data-purista-ai-workflow-stage' &&
				isPlannerWorkflowStage(dataPart.data)
			) {
				setPlannerFinalization(dataPart.data)
				return
			}
			const structuredSection = structuredSectionByDataType[dataPart.type]
			if (structuredSection) {
				setLiveStructuredOutput(previous => ({
					...(previous ?? {}),
					[structuredSection]: dataPart.data as never,
				}))
				return
			}
			if (isGenericDataPart(dataPart) && dataPart.type === 'data-output') {
				setLatestOutput(dataPart.data)
				if (scenarioId === 'structured' && typeof dataPart.data === 'object' && dataPart.data !== null) {
					setLiveStructuredOutput(dataPart.data as StructuredReviewOutput)
				}
			}
		},
	})

	const orderedTasks = useMemo(
		() =>
			Object.values(taskArtifacts).sort((left, right) => {
				const orderDelta = left.order - right.order
				return orderDelta !== 0 ? orderDelta : left.taskId.localeCompare(right.taskId)
			}),
		[taskArtifacts],
	)
	const plannerDisplayTasks = useMemo(() => {
		const merged = new Map<
			string,
			{
				taskId: string
				title: string
				status: string
				order: number
				kind?: string
				summary?: string
				detail?: string
			}
		>()

		for (const task of planArtifact?.tasks ?? []) {
			merged.set(task.id, {
				taskId: task.id,
				title: task.title,
				status: task.status,
				order: task.order,
				kind: task.kind,
				detail: task.detail,
			})
		}

		for (const task of orderedTasks) {
			merged.set(task.taskId, {
				taskId: task.taskId,
				title: task.title,
				status: task.status,
				order: task.order,
				kind: task.kind,
				summary: task.summary,
				detail: task.detail,
			})
		}

		return [...merged.values()].sort((left, right) => {
			const orderDelta = left.order - right.order
			return orderDelta !== 0 ? orderDelta : left.taskId.localeCompare(right.taskId)
		})
	}, [orderedTasks, planArtifact])
	const activeTask = plannerDisplayTasks.find(task => task.status === 'running') ?? null
	const latestStructuredOutput = latestOutput
	const liveStructuredPreview =
		scenarioId === 'structured'
			? ((typeof latestStructuredOutput === 'object' && latestStructuredOutput !== null
					? latestStructuredOutput
					: liveStructuredOutput) as StructuredReviewOutput | null)
			: null
	const latestPlannerOutput = isPlannerOutput(latestOutput) ? latestOutput : undefined
	const currentAssistantMessage = messages.at(-1)?.role === 'assistant' ? messages.at(-1) : undefined
	const currentAssistantHasText =
		currentAssistantMessage !== undefined && getMessageText(currentAssistantMessage).trim().length > 0
	const showInlineStructuredPreview =
		scenarioId === 'structured' && liveStructuredPreview !== null && currentAssistantMessage === undefined
	const shouldShowFinalAnswerSpinner =
		scenarioId === 'planner' &&
		(plannerFinalization?.status === 'running' || (uiStatus === 'streaming' && currentAssistantMessage !== undefined))
	const plannerAnswerReady = scenarioId === 'planner' && (latestPlannerOutput !== undefined || currentAssistantHasText)
	const showInlinePlanner =
		scenarioId === 'planner' &&
		!plannerAnswerReady &&
		(activeRunState !== null || planArtifact !== null || planStatusArtifact !== null || plannerDisplayTasks.length > 0)
	const plannerLifecycleLabel =
		plannerFinalization?.status === 'running'
			? (plannerFinalization.summary ?? 'Synthesizing the final recommendation.')
			: (planStatusArtifact?.summary ?? (activeTask ? `working on ${activeTask.title}` : 'planning workflow'))
	const plannerLifecycleDescription =
		plannerFinalization?.status === 'running'
			? 'The plan is complete. The final answer is being synthesized now.'
			: latestPlannerOutput
				? 'The final planner answer is ready below.'
				: 'Tasks update live as delegates and workers finish.'
	const plannerIsActive =
		scenarioId === 'planner' &&
		(uiStatus === 'submitted' || uiStatus === 'streaming' || plannerFinalization?.status === 'running')
	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}, [theme])

	useEffect(() => {
		sessionIdRef.current = sessionId
	}, [sessionId])

	useEffect(() => {
		responseFormatRef.current = responseFormat
	}, [responseFormat])

	const refreshConversationHistory = useCallback(async () => {
		try {
			const response = (await loadRecentConversationHistory(30)) as { items?: ConversationHistoryItem[] }
			setConversationHistory(Array.isArray(response.items) ? response.items : [])
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			setAppError(message)
		}
	}, [])

	useEffect(() => {
		void refreshConversationHistory()
	}, [refreshConversationHistory])

	useEffect(() => {
		if (uiStatus === 'submitted') {
			setStatusText(`Submitting ${activeScenario.label.toLowerCase()} request...`)
			return
		}
		if (uiStatus === 'streaming') {
			setStatusText(activeRunState ? `${formatRunStatus(activeRunState.status)}...` : 'Streaming response...')
			return
		}
		if (uiStatus === 'error') {
			setStatusText(uiError?.message ? `Error: ${uiError.message}` : 'Error')
			return
		}
		if (plannerFinalization?.status === 'running') {
			setStatusText(plannerFinalization.summary ?? 'Synthesizing final recommendation...')
			return
		}
		if (planStatusArtifact?.summary) {
			setStatusText(planStatusArtifact.summary)
			return
		}
		if (activeRunState) {
			setStatusText(formatRunStatus(activeRunState.status))
			return
		}
		setStatusText(messages.length > 0 ? 'Completed' : 'Ready')
	}, [
		activeRunState,
		activeScenario.label,
		messages.length,
		planStatusArtifact,
		plannerFinalization,
		uiError,
		uiStatus,
	])

	const resetRunState = () => {
		setAppError(null)
		setActiveRunState(null)
		setPlanArtifact(null)
		setPlanStatusArtifact(null)
		setTaskArtifacts({})
		setLatestOutput(undefined)
		setPlannerFinalization(null)
		setLiveStructuredOutput(null)
	}

	const executeScenario = async (text: string, files: FileUIPart[] = []) => {
		const question = text.trim()
		if (!question || uiStatus === 'submitted' || uiStatus === 'streaming') {
			return
		}
		const resolvedSessionId = sessionId.trim() || crypto.randomUUID()
		if (resolvedSessionId !== sessionId) {
			setSessionId(resolvedSessionId)
		}
		resetRunState()
		setPrompt('')
		try {
			await sendMessage(
				{ files, text: question },
				{
					body: {
						sessionId: resolvedSessionId,
						responseFormat,
						prompt: question,
						message: question,
					},
				},
			)
			await refreshConversationHistory()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			setAppError(message)
			setStatusText(`Error: ${message}`)
		}
	}

	const switchScenario = (nextScenarioId: DeveloperDeskScenarioId) => {
		setScenarioId(nextScenarioId)
		setPrompt(developerDeskScenarioMap[nextScenarioId].defaultPrompt)
		setResponseFormat(getDefaultResponseFormat(nextScenarioId))
		setStatusText('Ready')
		resetRunState()
		setMessages([])
		setDocsOpen(false)
		setNavOpen(false)
	}

	const restoreHistorySession = async (item: ConversationHistoryItem) => {
		switchScenario(item.scenario)
		setSessionId(item.sessionId)
		try {
			const response = (await loadConversationHistory({
				sessionId: item.sessionId,
				scenario: item.scenario,
			})) as { found?: boolean; messages?: ConversationHistoryMessage[] }
			if (!response.found) {
				setMessages([])
				await refreshConversationHistory()
				setStatusText('This session is no longer available in the current backend runtime.')
				return
			}
			const historyMessages = Array.isArray(response.messages) ? response.messages : []
			setMessages(toUiHistoryMessages(historyMessages))
			setStatusText(`Loaded ${historyMessages.length} saved messages`)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			setAppError(message)
			setStatusText(`Error: ${message}`)
		}
	}

	const startFreshSession = () => {
		setSessionId('')
		setMessages([])
		resetRunState()
		setPrompt(activeScenario.defaultPrompt)
		setStatusText('Ready')
	}

	const setThemeAndStore = (nextTheme: Theme) => {
		window.localStorage.setItem(THEME_KEY, nextTheme)
		setTheme(nextTheme)
	}

	const isBusy = uiStatus === 'submitted' || uiStatus === 'streaming'

	const transcript = (
		<div className="flex min-h-0 flex-1 flex-col">
			<Conversation className="min-h-0 flex-1">
				<ConversationContent className="p-4">
					{appError ? (
						<div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
							<p className="font-medium">Request failed</p>
							<p className="mt-1">{appError}</p>
						</div>
					) : null}
					{messages.length === 0 && !isBusy ? (
						<ConversationEmptyState
							description="Choose a scenario on the left, inspect the explanation on the right, and run the first prompt."
							icon={<ScenarioIcon scenarioId={scenarioId} />}
							title="No messages yet"
						/>
					) : null}

					{messages.map((message, messageIndex) => {
						const text = getMessageText(message)
						const reasoning = getReasoningText(message)
						const inlineTools = message.parts.filter(isToolPart)
						const visibleInlineTools = scenarioId === 'planner' ? [] : inlineTools
						const inlineFiles = getMessageFiles(message)
						const inlineSources = getMessageSources([message])
						const shouldShowStructuredPreview =
							scenarioId === 'structured' &&
							message.role === 'assistant' &&
							message.id === currentAssistantMessage?.id &&
							liveStructuredPreview !== null
						const shouldRenderMessageText = !(shouldShowStructuredPreview && text.length > 0)
						const hasRenderableMessageContent =
							inlineFiles.length > 0 ||
							reasoning.length > 0 ||
							(shouldRenderMessageText && text.length > 0) ||
							visibleInlineTools.length > 0 ||
							shouldShowStructuredPreview ||
							(message.role === 'assistant' && inlineSources.length > 0)
						if (!hasRenderableMessageContent) {
							return null
						}
						return (
							<Message key={`${message.id}-${messageIndex}`} from={message.role}>
								<div className="flex items-center gap-2">
									<Badge variant={message.role === 'user' ? 'secondary' : 'outline'}>{message.role}</Badge>
									{message.role === 'assistant' && message.id === currentAssistantMessage?.id && isBusy ? (
										<span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
											<Spinner className="size-3" />
											streaming now
										</span>
									) : null}
								</div>
								<MessageContent>
									{inlineFiles.length > 0 ? (
										<MessageAttachments files={inlineFiles} variant={message.role === 'user' ? 'grid' : 'list'} />
									) : null}
									{reasoning ? (
										<Reasoning defaultOpen={false} isStreaming={isBusy && message.id === messages.at(-1)?.id}>
											<ReasoningTrigger />
											<ReasoningContent>{reasoning}</ReasoningContent>
										</Reasoning>
									) : null}
									{shouldShowStructuredPreview ? (
										<div className="mt-3">
											<StructuredObjectPreview
												title={uiStatus === 'streaming' ? 'Structured output streaming' : 'Structured output'}
												value={liveStructuredPreview as never}
											/>
											{isBusy ? (
												<div className="mt-3 inline-flex items-center gap-2 text-muted-foreground text-sm">
													<Spinner className="size-4" />
													<span>Updating structured result...</span>
												</div>
											) : null}
										</div>
									) : null}
									{shouldRenderMessageText && text ? (
										<MessageResponse className="markdown-body">{text}</MessageResponse>
									) : null}
									{message.role === 'assistant' &&
									message.id === currentAssistantMessage?.id &&
									shouldShowFinalAnswerSpinner ? (
										<div className="mt-3 inline-flex items-center gap-2 text-muted-foreground text-sm">
											<Spinner className="size-4" />
											<span>{plannerFinalization?.summary ?? 'Generating final answer...'}</span>
										</div>
									) : null}
									{visibleInlineTools.length > 0 ? (
										<div className="mt-2 flex flex-col gap-2">
											{visibleInlineTools.map((part, index) => {
												const type =
													part.type === 'dynamic-tool' ? `tool-${String(part.toolName ?? 'tool')}` : part.type
												const state = 'state' in part ? String(part.state ?? 'unknown') : 'unknown'
												const errorText =
													'errorText' in part && typeof part.errorText === 'string' ? part.errorText : undefined
												const output =
													'output' in part && part.output !== undefined ? stableChunkContent(part.output) : undefined
												return (
													<Tool
														defaultOpen={state !== 'input-streaming' && state !== 'invoked'}
														key={`${message.id}-${type}-${index}`}
													>
														<ToolHeader state={state} toolType={type} />
														<ToolContent>
															<ToolInput input={'input' in part ? part.input : undefined} />
															<ToolOutput
																errorText={errorText}
																output={output ? <pre className="overflow-x-auto text-xs">{output}</pre> : undefined}
															/>
														</ToolContent>
													</Tool>
												)
											})}
										</div>
									) : null}
									{inlineSources.length > 0 && message.role === 'assistant' ? (
										<Sources>
											<SourcesTrigger count={inlineSources.length} />
											<SourcesContent>
												{inlineSources.map((source, sourceIndex) => (
													<Source
														href={source.url}
														key={`${message.id}-${source.id}-${sourceIndex}`}
														title={source.title}
													/>
												))}
											</SourcesContent>
										</Sources>
									) : null}
								</MessageContent>
							</Message>
						)
					})}

					{showInlinePlanner ? (
						<Message from="assistant">
							<div className="flex items-center gap-2">
								<Badge variant="outline">assistant</Badge>
							</div>
							<MessageContent>
								<Plan defaultOpen isStreaming={uiStatus === 'streaming' && orderedTasks.length === 0}>
									<PlanTrigger>{planArtifact?.title ?? activeRunState?.title ?? 'Execution plan'}</PlanTrigger>
									<PlanContent className="flex flex-col gap-3">
										<div className="flex flex-col gap-1">
											<div>
												<div className="flex items-center gap-2">
													{plannerIsActive ? <Spinner className="size-4 text-primary" /> : null}
													<p className="text-sm font-medium">
														{plannerLifecycleLabel ??
															(planArtifact
																? `${planArtifact.tasks.length} tasks generated for this execution.`
																: 'The plan is being generated and will update here live.')}
													</p>
												</div>
												{plannerLifecycleDescription ? (
													<p className="mt-1 text-muted-foreground text-xs">{plannerLifecycleDescription}</p>
												) : null}
											</div>
										</div>
										{plannerDisplayTasks.length > 0 ? (
											plannerDisplayTasks.map(task => (
												<Task defaultOpen={task.taskId === activeTask?.taskId} key={task.taskId}>
													<TaskTrigger
														badge={<Badge variant={toBadgeVariant(task.status)}>{task.status}</Badge>}
														status={task.status}
														title={task.title}
													/>
													<TaskContent className="flex flex-col gap-2">
														{task.summary || task.detail || task.kind ? (
															<TaskItem status="info">{task.summary ?? task.detail ?? task.kind}</TaskItem>
														) : null}
													</TaskContent>
												</Task>
											))
										) : (
											<div className="rounded-lg border border-dashed px-3 py-4 text-muted-foreground text-sm">
												Waiting for the first plan tasks to arrive.
											</div>
										)}
									</PlanContent>
								</Plan>
							</MessageContent>
						</Message>
					) : null}

					{showInlineStructuredPreview ? (
						<Message from="assistant">
							<div className="flex items-center gap-2">
								<Badge variant="outline">assistant</Badge>
								<span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
									<Spinner className="size-3" />
									structured result is streaming
								</span>
							</div>
							<MessageContent>
								<div className="mt-1">
									<StructuredObjectPreview title="Structured output streaming" value={liveStructuredPreview as never} />
									{isBusy ? (
										<div className="mt-3 inline-flex items-center gap-2 text-muted-foreground text-sm">
											<Spinner className="size-4" />
											<span>Updating structured result...</span>
										</div>
									) : null}
								</div>
							</MessageContent>
						</Message>
					) : null}

					{isBusy && !showInlinePlanner && !showInlineStructuredPreview ? (
						<Message from="assistant">
							<div className="flex items-center gap-2">
								<Badge variant="outline">assistant</Badge>
								<span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
									<Spinner className="size-3" />
									{activeTask ? `working on ${activeTask.title}` : 'preparing response'}
								</span>
							</div>
							<MessageContent className="w-full max-w-xl">
								<div className="flex w-full min-w-[18rem] flex-col gap-3 rounded-lg border border-dashed p-4">
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-3 w-full" />
									<Skeleton className="h-3 w-4/5" />
								</div>
							</MessageContent>
						</Message>
					) : null}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>
			<Separator />
			<div className="p-4">
				<div className="mb-3 flex items-center justify-between gap-3">
					<p className="text-muted-foreground text-xs">
						Markdown, reasoning, tool calls, and sources appear here only when they are actually used.
					</p>
					<p className="shrink-0 text-right text-muted-foreground text-xs">{statusText}</p>
				</div>
				<PromptInput
					onSubmit={async ({ files, text }) => {
						await executeScenario(text, files)
					}}
				>
					{activeScenario.attachments?.enabled ? <ComposerAttachmentStrip /> : null}
					<PromptInputBody>
						<PromptInputTextarea
							onChange={event => setPrompt(event.currentTarget.value)}
							placeholder={`Try: ${activeScenario.defaultPrompt}`}
							value={prompt}
						/>
					</PromptInputBody>
					<PromptInputFooter>
						<PromptInputTools>
							{activeScenario.attachments?.enabled ? (
								<PromptInputActionMenu>
									<PromptInputActionMenuTrigger tooltip="Add supporting files or screenshots" />
									<PromptInputActionMenuContent>
										<PromptInputActionAddAttachments />
										<PromptInputActionAddScreenshot />
									</PromptInputActionMenuContent>
								</PromptInputActionMenu>
							) : null}
							{activeScenario.attachments?.hint ? (
								<span className="hidden max-w-[18rem] text-muted-foreground text-xs md:inline">
									{activeScenario.attachments.hint}
								</span>
							) : null}
						</PromptInputTools>
						<PromptInputSubmit onStop={stop} status={uiStatus} />
					</PromptInputFooter>
				</PromptInput>
			</div>
		</div>
	)

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
					<div className="flex min-w-0 items-center gap-3">
						<Sheet onOpenChange={setNavOpen} open={navOpen}>
							<SheetTrigger asChild>
								<Button className="lg:hidden" size="icon-sm" variant="outline">
									<MenuIcon className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="w-[min(90vw,22rem)] p-0 lg:hidden" side="left">
								<SheetHeader className="sr-only">
									<SheetTitle>Navigation</SheetTitle>
									<SheetDescription>Scenario and session navigation.</SheetDescription>
								</SheetHeader>
								<div className="flex h-full min-h-0 flex-col">
									<div className="border-b px-4 py-4">
										<p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">Scenarios</p>
										<div className="mt-3 flex flex-col gap-2">
											{developerDeskScenarios.map(scenario => (
												<Button
													className="justify-start"
													key={scenario.id}
													onClick={() => switchScenario(scenario.id)}
													variant={scenario.id === scenarioId ? 'secondary' : 'ghost'}
												>
													<ScenarioIcon scenarioId={scenario.id} />
													<span>{scenario.label}</span>
												</Button>
											))}
										</div>
									</div>
									<div className="min-h-0 flex-1 border-t">
										<HistoryPane
											conversationHistory={conversationHistory}
											historyCollapsed={false}
											onRestore={restoreHistorySession}
											onStartFreshSession={startFreshSession}
											onToggleCollapsed={() => undefined}
											sessionId={sessionId}
											activeScenarioId={scenarioId}
										/>
									</div>
								</div>
							</SheetContent>
						</Sheet>
						<div className="min-w-0">
							<p className="truncate font-semibold">{activeScenario.title}</p>
							<p className="truncate text-muted-foreground text-sm">
								{activeScenario.tagline} {sessionId ? '· Continuing saved session' : ''}
							</p>
							<div className="mt-3 hidden lg:block">
								<div className="flex flex-wrap gap-2">
									{developerDeskScenarios.map(scenario => (
										<Button
											key={scenario.id}
											onClick={() => switchScenario(scenario.id)}
											size="sm"
											variant={scenario.id === scenarioId ? 'secondary' : 'ghost'}
										>
											{scenario.label}
										</Button>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button aria-label="Open actions" size="icon-sm" variant="outline">
									<MoreHorizontalIcon className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setThemeAndStore(theme === 'dark' ? 'light' : 'dark')}>
									{theme === 'dark' ? <SunIcon data-icon="inline-start" /> : <MoonIcon data-icon="inline-start" />}
									Theme
								</DropdownMenuItem>
								<DropdownMenuItem onClick={startFreshSession}>
									<CompassIcon data-icon="inline-start" />
									New session
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Sheet onOpenChange={setDocsOpen} open={docsOpen}>
							<SheetTrigger asChild>
								<Button className="xl:hidden" size="icon-sm" variant="outline">
									<HistoryIcon className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="w-[min(92vw,36rem)] p-0 xl:hidden" side="right">
								<SheetHeader className="sr-only">
									<SheetTitle>{activeScenario.title}</SheetTitle>
									<SheetDescription>{activeScenario.tagline}</SheetDescription>
								</SheetHeader>
								<ExplanationPane scenarioId={scenarioId} theme={theme} />
							</SheetContent>
						</Sheet>
					</div>
				</header>

				<div className="min-h-0 flex-1 overflow-hidden">
					<div className="grid h-full min-h-0 xl:hidden">
						<div className="flex min-h-0 flex-col p-4">
							<section className="flex min-h-[36rem] flex-col bg-background">{transcript}</section>
						</div>
					</div>

					<div className="hidden h-full min-h-0 xl:flex">
						<aside
							className={cn(
								'h-full shrink-0 transition-[width] duration-200',
								historyCollapsed ? 'w-[4.75rem]' : 'w-[20rem]',
							)}
						>
							<HistoryPane
								conversationHistory={conversationHistory}
								historyCollapsed={historyCollapsed}
								onRestore={restoreHistorySession}
								onStartFreshSession={startFreshSession}
								onToggleCollapsed={() => setHistoryCollapsed(previous => !previous)}
								sessionId={sessionId}
								activeScenarioId={scenarioId}
							/>
						</aside>
						<ResizablePanelGroup className="min-h-0 min-w-0 flex-1" orientation="horizontal">
							<ResizablePanel defaultSize={50} minSize={36}>
								<div className="h-full p-4">
									<section className="flex h-full min-h-0 min-w-0 flex-col bg-background">{transcript}</section>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={50} minSize={28}>
								<ExplanationPane scenarioId={scenarioId} theme={theme} />
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</div>
			</div>
		</div>
	)
}
