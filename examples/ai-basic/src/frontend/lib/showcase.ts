export type DeveloperDeskScenarioId = 'chat' | 'research' | 'planner' | 'structured' | 'reflection'

export type DeveloperDeskScenarioDoc = {
	id: DeveloperDeskScenarioId
	label: string
	title: string
	tagline: string
	endpoint: string
	defaultPrompt: string
	what: string
	userVisibleFlow: string[]
	runtimeFlow: string[]
	protocolFlow: string[]
	codeMap: Array<{ label: string; path: string }>
	extensionPoints: string[]
	keyConcepts: Array<{ term: string; description: string }>
	attachments?: {
		enabled: boolean
		hint: string
	}
	agent: {
		name: string
		model: string
		instructions: string
		callables: Array<{
			id: string
			name: string
			description: string
			kind: 'tool' | 'delegate'
			inputSchema?: string
		}>
		outputSchema?: string
	}
}

export const developerDeskScenarios: DeveloperDeskScenarioDoc[] = [
	{
		id: 'chat',
		label: 'Chat',
		title: 'Conversation Memory + Streaming',
		tagline: 'Simple attached-agent chat with session history and real text deltas.',
		endpoint: '/api/v1/agents/deskChatAgent',
		defaultPrompt: 'Explain how PURISTA services, commands, and agents fit together for a new developer.',
		what:
			'This scenario is the smallest truthful PURISTA AI setup: one attached agent, one session, persisted conversation memory, and direct text streaming to the browser.',
		userVisibleFlow: [
			'You send a developer question.',
			'The assistant starts streaming text immediately.',
			'Previous turns influence the answer when you keep the same session id.',
			'The final assistant answer is persisted back into conversation memory.',
		],
		runtimeFlow: [
			'`deskChatAgent` stores the user turn in `context.memory.conversation`.',
			'It rebuilds prompt context from the current session history.',
			'`context.ai.streamText(...)` streams deltas into the current protocol stream.',
			'The final assistant message is stored in conversation memory.',
		],
		protocolFlow: [
			'Primary live lane: assistant `message` frames and `text-delta` UI parts.',
			'Conversation memory is durable state; this scenario does not use planner run-state.',
			'The returned `output` artifact contains the final answer for machine consumers.',
		],
		codeMap: [
			{
				label: 'deskChatAgentBuilder',
				path: 'src/service/desk/v1/agent/deskChatAgent/deskChatAgentBuilder.ts',
			},
			{
				label: 'Conversation helpers',
				path: '../../../packages/ai/src/runtime/conversation.ts',
			},
		],
		extensionPoints: [
			'Swap the model alias in `.addModel(...)` and `streamText(...)`.',
			'Attach a different session retention strategy through the agent manifest.',
			'Project the same stream to another UI transport without changing the agent logic.',
		],
		keyConcepts: [
			{ term: 'sessionId', description: 'Stable conversation partition key used to reload prior turns.' },
			{ term: 'conversation history', description: 'Persisted prompt context built from prior user and assistant turns.' },
			{ term: 'attached-agent endpoint', description: 'Direct HTTP route exposed from the agent builder itself.' },
		],
		agent: {
			name: 'deskChatAgent',
			model: 'openai:gpt-4o-mini',
			instructions:
				'Concise developer desk chat agent. Rebuilds session history, answers directly, and persists the final assistant reply.',
			callables: [],
			outputSchema: `{
  answer: string
}`,
		},
	},
	{
		id: 'research',
		label: 'Research',
		title: 'Tool + Skill Backed Research',
		tagline: 'Shows factual lookup, website fetching, calculator usage, and skill references.',
		endpoint: '/api/v1/agents/researchAgent',
		defaultPrompt: 'Fetch https://purista.dev/handbook and tell me the most relevant topics for building agents.',
		what:
			'This scenario demonstrates the next level after chat: the agent can call allowlisted business tools, select skill references, and synthesize a grounded answer.',
		userVisibleFlow: [
			'You send a research-style request.',
			'Tool activity appears while the agent gathers facts.',
			'The final answer streams after the research context is assembled.',
			'The transcript and tool lane stay separate so the UI can explain why the answer changed.',
		],
		runtimeFlow: [
			'`researchAgent` decides which tools to call from the request shape.',
			'Allowlisted invokes emit canonical tool lifecycle frames.',
			'Optional skill references from the PURISTA skill are selected late and passed into the model call.',
			'The final assistant answer is streamed and persisted to conversation memory.',
		],
		protocolFlow: [
			'Content lane: assistant deltas and final answer.',
			'Operational lane: tool frames and optional reasoning/task chunk artifacts.',
			'Final `output` contains findings plus normalized sources for machine consumers.',
		],
		codeMap: [
			{
				label: 'researchAgentBuilder',
				path: 'src/service/desk/v1/agent/researchAgent/researchAgentBuilder.ts',
			},
			{
				label: 'fetchWebsite command',
				path: 'src/service/desk/v1/command/fetchWebsite/fetchWebsiteCommandBuilder.ts',
			},
			{
				label: 'lookupFaq command',
				path: 'src/service/desk/v1/command/lookupFaq/lookupFaqCommandBuilder.ts',
			},
		],
		extensionPoints: [
			'Add more allowlisted commands and expose them through the same research pattern.',
			'Select different skills or narrower reference prefixes for domain-specific research.',
			'Render tool inputs and outputs differently in the UI without changing the agent contract.',
		],
		keyConcepts: [
			{ term: 'allowlisted tool', description: 'A command or invoke binding declared in the builder and typed end to end.' },
			{ term: 'skill reference', description: 'Structured documentation content selected from the installed skill catalog.' },
			{ term: 'tool frame', description: 'Canonical protocol frame describing invoke status, input, and output.' },
		],
		attachments: {
			enabled: true,
			hint: 'Attach local notes or screenshots to keep visual context alongside the research request.',
		},
		agent: {
			name: 'researchAgent',
			model: 'openai:gpt-4o-mini',
			instructions:
				'Research-oriented developer desk agent. Fetches websites, performs lightweight calculations, looks up Purista guidance, and then streams a grounded answer.',
			callables: [
				{
					id: 'fetchWebsite',
					name: 'fetchWebsite',
					description: 'Fetches a URL and extracts readable text content.',
					kind: 'tool',
					inputSchema: `{
  url: string
}`,
				},
				{
					id: 'calculate',
					name: 'calculate',
					description: 'Evaluates a simple arithmetic expression for quick factual checks.',
					kind: 'tool',
					inputSchema: `{
  expression: string
}`,
				},
				{
					id: 'lookupFaq',
					name: 'lookupFaq',
					description: 'Returns Purista-specific framework guidance when the request is product-related.',
					kind: 'tool',
					inputSchema: `{
  question: string
}`,
				},
			],
			outputSchema: `{
  message: string
  findings: string[]
  sources: string[]
}`,
		},
	},
	{
		id: 'planner',
		label: 'Planner',
		title: 'Worker + Delegates Planning',
		tagline: 'Planner generates business tasks, then worker/delegates execute them sequentially.',
		endpoint: '/api/v1/agents/deliveryPlannerAgent',
		defaultPrompt: 'Plan how to evaluate a risky architecture change for a streaming developer platform.',
		what:
			'This scenario is the planner-first PURISTA AI flow: one planner model creates business tasks, the runtime executes them sequentially, and delegates can be tools or child agents.',
		userVisibleFlow: [
			'You send a larger engineering request.',
			'The generated plan appears with ordered tasks.',
			'Running tasks and task chunks update while delegates stream their own progress.',
			'You receive one synthesized final answer after execution completes.',
		],
		runtimeFlow: [
			'`deliveryPlannerAgent` declares one worker plus optional delegates.',
			'`context.plan.generate(...)` creates a business-level task list with `instruction` and optional `delegate`.',
			'`context.plan.execute(plan)` emits run-state plus `purista-ai:*` task artifacts while routing each task.',
			'`context.ai.replyObject(...)` finalizes a typed developer-facing summary using plan results and optional session history.',
		],
		protocolFlow: [
			'Task lane: `purista-ai:plan`, `purista-ai:task:<taskId>`, `purista-ai:task-chunk:<taskId>`, `purista-ai:plan-status`.',
			'Delegated child-agent frames keep their original actor identity when forwarded.',
			'Final machine result comes from the canonical `output` artifact, not assistant prose parsing.',
		],
		codeMap: [
			{
				label: 'deliveryPlannerAgentBuilder',
				path: 'src/service/desk/v1/agent/deliveryPlannerAgent/deliveryPlannerAgentBuilder.ts',
			},
			{
				label: 'Plan runtime',
				path: '../../../packages/ai/src/runtime/plan.ts',
			},
			{
				label: 'replyObject helper',
				path: '../../../packages/ai/src/runtime/context.ts',
			},
		],
		extensionPoints: [
			'Swap the worker model without changing the planner contract.',
			'Add more delegates for new tools or child agents.',
			'Change final synthesis schema to fit your product domain.',
		],
		keyConcepts: [
			{ term: 'worker', description: 'Default executor used when the planner does not choose a delegate.' },
			{ term: 'delegate', description: 'Named specialist executor for a subset of task types.' },
			{ term: 'purista-ai:plan', description: 'Reserved artifact lane for live plan/task UI rendering.' },
		],
		attachments: {
			enabled: true,
			hint: 'Attach a spec draft or architecture screenshot to keep the planning request grounded in concrete context.',
		},
		agent: {
			name: 'deliveryPlannerAgent',
			model: 'openai:gpt-4o-mini',
			instructions:
				'Planner-first developer desk agent. Generates business tasks, runs them sequentially, and synthesizes one final developer-facing answer.',
			callables: [
				{
					id: 'worker',
					name: 'default worker',
					description: 'Handles general drafting, sequencing, and implementation reasoning.',
					kind: 'delegate',
					inputSchema: `{
  instruction: string
}`,
				},
				{
					id: 'lookup-faq',
					name: 'lookupFaq delegate',
					description: 'Pulls Purista-specific framework guidance for focused tasks.',
					kind: 'delegate',
					inputSchema: `{
  question: string
}`,
				},
				{
					id: 'research-agent',
					name: 'researchAgent delegate',
					description: 'Delegates documentation lookup, URL research, and factual investigation to a child agent.',
					kind: 'delegate',
					inputSchema: `{
  prompt: string
  sessionId?: string
}`,
				},
				{
					id: 'architecture-review',
					name: 'architectureReviewAgent delegate',
					description: 'Delegates structured architecture assessment to a child agent.',
					kind: 'delegate',
					inputSchema: `{
  prompt: string
  sessionId?: string
}`,
				},
			],
			outputSchema: `{
  mode: "summary" | "research" | "architecture"
  message: string
  researchSummary?: string
  architectureReview?: object
  plan?: object
}`,
		},
	},
	{
		id: 'structured',
		label: 'Structured',
		title: 'Schema-First Streaming Object',
		tagline: 'Streams progressive sections and a final validated object from one attached agent.',
		endpoint: '/api/v1/agents/architectureReviewAgent',
		defaultPrompt: 'Review the architecture readiness of a queue-backed multi-agent deployment pipeline.',
		what:
			'This scenario isolates schema-first structured output. It shows how a consumer can render progressive sections while still relying on one canonical validated final object.',
		userVisibleFlow: [
			'You send an architecture or readiness request.',
			'Section deltas appear progressively in the transcript.',
			'Structured artifact updates appear in parallel.',
			'The final validated object remains available for machine consumers.',
		],
		runtimeFlow: [
			'`architectureReviewAgent` calls `context.ai.streamObject(...)` with a Standard Schema.',
			'Section instructions are inferred from schema metadata when possible.',
			'The stream publishes assistant deltas and object artifacts at the same time.',
			'The returned handler `output` becomes the canonical final machine result.',
		],
		protocolFlow: [
			'Content lane: assistant deltas rendered from section updates.',
			'Artifact lane: schema-backed section artifacts plus final `output` artifact.',
			'Consumers should treat the final `output` artifact as the only canonical machine-readable result.',
		],
		codeMap: [
			{
				label: 'architectureReviewAgentBuilder',
				path: 'src/service/desk/v1/agent/architectureReviewAgent/architectureReviewAgentBuilder.ts',
			},
			{
				label: 'architecture review schema',
				path: 'src/service/desk/v1/agent/architectureReviewAgent/schema.ts',
			},
		],
		extensionPoints: [
			'Add richer field descriptions to influence auto-inferred sections.',
			'Swap `renderSectionDelta` to match your UI or prose style.',
			'Reuse the same schema with planner delegates or child agents.',
		],
		keyConcepts: [
			{ term: 'schema', description: 'The Standard Schema object that drives validation and output typing.' },
			{ term: 'section delta', description: 'Incremental structured field update emitted before final object completion.' },
			{ term: 'output artifact', description: 'Canonical final machine-readable result emitted by the runtime.' },
		],
		attachments: {
			enabled: true,
			hint: 'Attach screenshots or design notes when you want the review prompt to carry visible supporting context.',
		},
		agent: {
			name: 'architectureReviewAgent',
			model: 'openai:gpt-4o-mini',
			instructions:
				'Schema-first architecture review agent. Streams progressive sections and returns a final validated review object.',
			callables: [],
			outputSchema: `{
  overallVerdict: "ready" | "needs-work" | "risky"
  executiveSummary: string
  strengths: string[]
  risks: string[]
  nextActions: string[]
}`,
		},
	},
	{
		id: 'reflection',
		label: 'Reflection',
		title: 'Propose, Reflect, Refine',
		tagline: 'Shows reflection artifacts, critique loops, and a refined final result.',
		endpoint: '/api/v1/agents/reflectionAgent',
		defaultPrompt: 'Draft a rollout proposal for introducing a new planner-driven multi-agent workflow.',
		what:
			'This scenario demonstrates the reflection helpers: the runtime can preserve draft, critique, and summary artifacts while the agent iterates toward a better result.',
		userVisibleFlow: [
			'You submit a proposal-style request.',
			'Draft and critique artifacts appear as the loop runs.',
			'The final assistant summary appears after reflection finishes.',
			'The right-side explanation pane shows how to adapt the loop for stricter quality gates.',
		],
		runtimeFlow: [
			'`reflectionAgent` starts a durable run and then calls `context.ai.reflect.run(...)`.',
			'The helper checkpoints draft and critique state in run-state and emits reflection artifacts.',
			'The final developer-facing summary is streamed separately after the loop finishes.',
			'The final response returns both the accepted draft and critique metadata.',
		],
		protocolFlow: [
			'Reflection artifacts live in their own artifact prefix and remain distinct from the final assistant answer.',
			'Run-state checkpoints preserve iteration state for recovery and inspection.',
			'Final `output` contains accepted draft, critique, and iteration count.',
		],
		codeMap: [
			{
				label: 'reflectionAgentBuilder',
				path: 'src/service/desk/v1/agent/reflectionAgent/reflectionAgentBuilder.ts',
			},
			{
				label: 'reflection runtime',
				path: '../../../packages/ai/src/runtime/reflection.ts',
			},
		],
		extensionPoints: [
			'Swap the critique schema or accept threshold for stricter quality rules.',
			'Use planner or child-agent output as the draft input for reflection.',
			'Render reflection artifacts in a custom timeline or side-by-side diff UI.',
		],
		keyConcepts: [
			{ term: 'reflection artifact', description: 'Draft, critique, or summary artifact emitted during iterative refinement.' },
			{ term: 'checkpoint', description: 'Durable run-state snapshot stored between reflection iterations.' },
			{ term: 'accepted draft', description: 'The final proposal that met the loop acceptance criteria.' },
		],
		agent: {
			name: 'reflectionAgent',
			model: 'openai:gpt-4o-mini',
			instructions:
				'Runs a propose, critique, and refine loop before streaming a final summary and returning the accepted draft.',
			callables: [],
			outputSchema: `{
  message: string
  acceptedDraft: string
  critique?: string
  iterations: number
}`,
		},
	},
]

export const developerDeskScenarioMap = Object.fromEntries(
	developerDeskScenarios.map(scenario => [scenario.id, scenario]),
) as Record<DeveloperDeskScenarioId, DeveloperDeskScenarioDoc>
