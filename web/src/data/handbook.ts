import type { SidebarItem } from '../lib/sidebar'

export type PuristaColor = 'pilot' | 'con' | 'found'

export interface HandbookCard {
	id: string
	title: string
	description: string
	icon: string
	tags?: string[]
	featured?: boolean
	items?: SidebarItem[]
}

export interface HandbookSection {
	num: number
	id: string
	title: string
	subtitle: string
	color: PuristaColor
	cards: HandbookCard[]
}

export interface LearningPath {
	title: string
	duration: string
	description: string
	slug: string
}

export const handbookSections: HandbookSection[] = [
	{
		num: 1,
		id: 'learn',
		title: 'Learning Paths & Tutorials',
		subtitle: 'Structured hands-on learning journeys — start here',
		color: 'found',
		cards: [
			{
				id: 'getting-started',
				title: 'Getting Started',
				description: '15 minutes from zero to your first service.',
				icon: 'rocket',
				featured: true,
				items: [
					{ id: '1_quickstart/index', title: 'Quickstart Overview', order: 1 },
					{ id: '1_quickstart/setup-the-purista-project', title: 'Project Setup', order: 2 },
					{ id: '1_quickstart/create-a-service', title: 'Create a Service', order: 3 },
					{ id: '1_quickstart/add-the-first-command', title: 'Add a Command', order: 4 },
					{ id: '1_quickstart/add-the-first-subscription', title: 'Add a Subscription', order: 5 },
				],
			},
			{
				id: 'from-zero-to-production',
				title: 'Zero to Production',
				description: 'Four phases from in-memory to live.',
				icon: 'stairs',
			},
			{
				id: 'building-microservices',
				title: 'Microservices',
				description: 'Splitting a system into bounded contexts.',
				icon: 'box',
			},
			{
				id: 'ai-agent-tutorial',
				title: 'AI Agents',
				description: 'Build typed, sandboxed LLM agents.',
				icon: 'robot',
			},
		],
	},
	{
		num: 2,
		id: 'harness',
		title: 'AI Harness',
		subtitle: 'Build, test, govern, and operate typed AI systems inside your application boundary',
		color: 'pilot',
		cards: [
			{
				id: 'overview',
				title: 'Overview',
				description: 'Understand the Harness architecture, boundaries, and execution model.',
				icon: 'robot',
				featured: true,
			},
			{ id: 'quickstart', title: 'Quickstart', description: 'Build and test a first typed Harness application.', icon: 'rocket' },
			{ id: 'ecosystem-packages', title: 'Ecosystem & Packages', description: 'Choose the core, provider, guardrail, privacy, and plugin packages.', icon: 'box' },
			{ id: 'models-and-configuration', title: 'Models & Configuration', description: 'Configure provider-neutral model aliases, defaults, and capabilities.', icon: 'settings' },
			{ id: 'tools-and-skills', title: 'Tools & Skills', description: 'Expose typed tools and mount reusable skill directories safely.', icon: 'bolt' },
			{ id: 'agent-plugins', title: 'Agent Plugins', description: 'Verify and bind data-only plugin packages without executing package code.', icon: 'api' },
			{ id: 'sandboxing-and-mcp', title: 'Sandboxing & MCP', description: 'Choose isolation boundaries and connect MCP servers securely.', icon: 'shield' },
			{ id: 'agents-workflows-storage', title: 'Agents & Workflows', description: 'Compose typed agents, workflows, memory, and Harness storage.', icon: 'network' },
			{ id: 'durable-workflows-and-queues', title: 'Durable Workflows', description: 'Recover workflows with stable run identities, checkpoints, and queues.', icon: 'stairs' },
			{ id: 'human-review-gates', title: 'Human Review Gates', description: 'Suspend and resume durable work through application-owned approvals.', icon: 'check-circle' },
			{ id: 'guardrails-governance', title: 'Guardrails', description: 'Apply typed content rails, policy decisions, and governance controls.', icon: 'certificate' },
			{ id: 'privacy-detectors', title: 'Privacy Detectors', description: 'Select local native, Presidio, or optional local NER detection.', icon: 'lock' },
			{ id: 'custom-adapters', title: 'Custom Adapters', description: 'Implement provider, storage, workspace, memory, and sandbox ports.', icon: 'settings-auto' },
			{ id: 'testing-and-evaluations', title: 'Tests & Evaluations', description: 'Use deterministic fakes, contracts, scorers, and replay fixtures.', icon: 'check-circle' },
			{ id: 'observability-operations', title: 'Observability', description: 'Operate content-free traces, metrics, logs, and cost attribution.', icon: 'wave' },
			{ id: 'migrating-to-v3', title: 'Migrate to v3', description: 'Adopt the clean HarnessStorage and DurableWorkspace boundaries.', icon: 'stairs' },
			{ id: 'adapters-durability-reference', title: 'Adapters & Deployment', description: 'Compare adapter capabilities and production deployment requirements.', icon: 'database' },
		],
	},
	{
		num: 3,
		id: 'mental-model',
		title: 'Mental Model & Philosophy',
		subtitle: 'Why PURISTA exists — the fundamental principles and mental models',
		color: 'pilot',
		cards: [
			{
				id: 'philosophy',
				title: 'Philosophy',
				description: 'The core philosophy and idea behind PURISTA',
				icon: 'brain',
			},
			{
				id: 'separation-of-concerns',
				title: 'Separation of Concerns',
				description: 'Definition, implementation, and configuration are separate layers',
				icon: 'layers',
			},
			{
				id: 'architecture',
				title: 'Architecture',
				description: 'The nervous system connecting services without coupling',
				icon: 'network',
			},
			{
				id: 'data-control',
				title: 'Data Control',
				description: 'Handling of confidential data and privacy controls',
				icon: 'certificate',
			},
			{
				id: 'distribution',
				title: 'Distribution',
				description: 'Distribution implementation and runtime level',
				icon: 'dots',
			},
			{
				id: 'resilience-patterns',
				title: 'Resilience Through Patterns',
				description: 'Fault tolerance, retry logic, and graceful failure handling',
				icon: 'shield',
			},
			{
				id: 'deployment-flexibility',
				title: 'Deployment Flexibility',
				description: 'Same code in monolith, microservices, serverless, edge',
				icon: 'cloud',
			},
		],
	},
	{
		num: 4,
		id: 'service',
		title: 'Service — The Container',
		subtitle: 'Understand what a Service is — the fundamental unit of organization',
		color: 'found',
		cards: [
			{
				id: 'what-is-service',
				title: 'What is a Service?',
				description: 'Services are logical containers organizing related business logic',
				icon: 'box',
			},
			{
				id: 'service-builder',
				title: 'The Service Builder',
				description: 'Define metadata, attach handlers, and create instances',
				icon: 'settings',
			},
			{
				id: 'service-config',
				title: 'Service Configuration',
				description: 'Add typed custom configuration with Zod schemas',
				icon: 'settings-auto',
			},
			{
				id: 'service-resources',
				title: 'Resources & Dependencies',
				description: 'Database connections, APIs, external systems needed',
				icon: 'database',
			},
			{
				id: 'custom-service-class',
				title: 'Custom Service Class',
				description: 'Extend the base class for gateway and adapter patterns',
				icon: 'api',
			},
			{
				id: 'service-testing',
				title: 'Testing a Service',
				description: 'Validate setup, configuration, and wiring with unit tests',
				icon: 'check-circle',
			},
		],
	},
	{
		num: 5,
		id: 'blocks',
		title: 'Core Building Blocks',
		subtitle: "The patterns you'll use inside a service — high-level concepts, not detailed how-to guides",
		color: 'con',
		cards: [
			{
				id: 'command-pattern',
				title: 'Command',
				description: 'Synchronous request/response handlers with typed schemas and validation',
				icon: 'bolt',
				items: [
					{ id: 'blocks/command-pattern/what-is-command', title: 'What is a Command?', order: 1 },
					{ id: 'blocks/command-pattern/command-builder', title: 'The Command Builder', order: 2 },
					{ id: 'blocks/command-pattern/cross-service', title: 'Cross-Service Calls', order: 3 },
					{ id: 'blocks/command-pattern/http-exposure', title: 'HTTP Exposure', order: 4 },
					{ id: 'blocks/command-pattern/testing', title: 'Testing', order: 5 },
				],
			},
			{
				id: 'stream-pattern',
				title: 'Stream',
				description: 'Transform continuous data pipelines in real-time',
				icon: 'wave',
				items: [
					{ id: 'blocks/stream-pattern/what-is-stream', title: 'What is a Stream?', order: 1 },
					{ id: 'blocks/stream-pattern/stream-builder', title: 'The Stream Builder', order: 2 },
					{ id: 'blocks/stream-pattern/stream-testing', title: 'Testing', order: 3 },
				],
			},
			{
				id: 'subscription-pattern',
				title: 'Subscription',
				description: 'Asynchronously react to business events',
				icon: 'bell',
				items: [
					{ id: 'blocks/subscription-pattern/what-is-subscription', title: 'What is a Subscription?', order: 1 },
					{ id: 'blocks/subscription-pattern/subscription-builder', title: 'The Subscription Builder', order: 2 },
					{ id: 'blocks/subscription-pattern/subscription-testing', title: 'Testing', order: 3 },
				],
			},
			{
				id: 'queue-pattern',
				title: 'Queue & Worker',
				description: 'Reliable background work with automatic retry',
				icon: 'list-check',
				items: [
					{ id: 'blocks/queue-pattern/what-is-queue', title: 'What is a Queue?', order: 1 },
					{ id: 'blocks/queue-pattern/queue-builder', title: 'The Queue Builder', order: 2 },
					{ id: 'blocks/queue-pattern/queue-worker', title: 'The Queue Worker', order: 3 },
					{ id: 'blocks/queue-pattern/queue-http-exposure', title: 'Async HTTP Exposure', order: 4 },
					{ id: 'blocks/queue-pattern/queue-testing', title: 'Testing', order: 5 },
				],
			},
			{
				id: 'agent-pattern',
				title: 'AI Agent',
				description: 'Autonomous intelligence making decisions and taking actions',
				icon: 'robot',
				items: [
					{ id: 'blocks/agent-pattern/what-is-agent', title: 'What is an AI Agent?', order: 1 },
					{ id: 'blocks/agent-pattern/harness-integration', title: 'Harness Integration', order: 2 },
					{ id: 'blocks/agent-pattern/agent-builder', title: 'The Agent Builder', order: 3 },
					{ id: 'blocks/agent-pattern/agent-workflows', title: 'Agents & Workflows', order: 4 },
					{ id: 'blocks/agent-pattern/http-exposure', title: 'HTTP Exposure', order: 5 },
					{ id: 'blocks/agent-pattern/guardrails', title: 'Guardrails in PURISTA', order: 6 },
					{ id: 'blocks/agent-pattern/agent-testing', title: 'Testing', order: 7 },
				],
			},
		],
	},
	{
		num: 6,
		id: 'stores',
		title: 'Stores — Data Persistence',
		subtitle: 'Three kinds of storage for different purposes',
		color: 'con',
		cards: [
			{
				id: 'config-store',
				title: 'Config Store',
				description: 'Non-sensitive configuration that varies by environment',
				icon: 'settings-auto',
				items: [
					{ id: '3_eco_system/stores/default_config_store', title: 'Default (in-memory)', order: 1 },
					{ id: '3_eco_system/stores/redis_config_store', title: 'Redis', order: 2 },
					{ id: '3_eco_system/stores/aws_config_store', title: 'AWS SSM', order: 3 },
					{ id: '3_eco_system/stores/nats_config_store', title: 'NATS JetStream KV', order: 4 },
					{ id: '3_eco_system/stores/dapr_config_store', title: 'Dapr', order: 5 },
				],
			},
			{
				id: 'secret-store',
				title: 'Secret Store',
				description: 'Safely store and access passwords and API keys',
				icon: 'lock',
				items: [
					{ id: '3_eco_system/stores/default_secret_store', title: 'Default (in-memory)', order: 1 },
					{ id: '3_eco_system/stores/aws_secret_store', title: 'AWS Secrets Manager', order: 2 },
					{ id: '3_eco_system/stores/azure_secret_store', title: 'Azure Key Vault', order: 3 },
					{ id: '3_eco_system/stores/gcloud_secret_store', title: 'Google Cloud Secret Manager', order: 4 },
					{ id: '3_eco_system/stores/vault_secret_store', title: 'HashiCorp Vault', order: 5 },
					{ id: '3_eco_system/stores/infisical_secret_store', title: 'Infisical', order: 6 },
					{ id: '3_eco_system/stores/dapr_secret_store', title: 'Dapr', order: 7 },
				],
			},
			{
				id: 'state-store',
				title: 'State Store',
				description: 'Persistent application state across restarts',
				icon: 'database-search',
				items: [
					{ id: '3_eco_system/stores/default_state_store', title: 'Default (in-memory)', order: 1 },
					{ id: '3_eco_system/stores/redis_state_store', title: 'Redis', order: 2 },
					{ id: '3_eco_system/stores/nats_state_store', title: 'NATS JetStream KV', order: 3 },
					{ id: '3_eco_system/stores/dapr_state_store', title: 'Dapr', order: 4 },
				],
			},
		],
	},
	{
		num: 7,
		id: 'expose',
		title: 'Exposing Your Service',
		subtitle: 'Making your service accessible to the outside world',
		color: 'pilot',
		cards: [
			{
				id: 'rest-api',
				title: 'REST API Endpoints',
				description: 'Auto-expose commands as HTTP endpoints',
				icon: 'api',
			},
			{
				id: 'graphql',
				title: 'GraphQL Interface',
				description: 'Expose commands as GraphQL queries and mutations',
				icon: 'star',
			},
			{ id: 'http-client', title: 'HTTP Client', description: 'Call external APIs from your service', icon: 'world' },
			{
				id: 'service-discovery',
				title: 'Service Discovery',
				description: 'Export contracts for client consumption and generation',
				icon: 'link-check',
			},
		],
	},
	{
		num: 8,
		id: 'bridges',
		title: 'Connecting Services — Event Bridges',
		subtitle: 'Infrastructure connecting distributed services',
		color: 'found',
		cards: [
			{
				id: 'event-bridges',
				title: 'Event Bridges',
				description: 'Default, AMQP, NATS, MQTT, Dapr — the nervous system',
				icon: 'network',
				items: [
					{ id: '3_eco_system/eventbridges/default_event_bridge', title: 'Default (in-memory)', order: 1 },
					{ id: '3_eco_system/eventbridges/amqp', title: 'AMQP (RabbitMQ)', order: 2 },
					{ id: '3_eco_system/eventbridges/nats', title: 'NATS', order: 3 },
					{ id: '3_eco_system/eventbridges/mqtt', title: 'MQTT', order: 4 },
					{ id: '3_eco_system/eventbridges/dapr', title: 'Dapr', order: 5 },
				],
			},
			{
				id: 'queue-bridges',
				title: 'Queue Bridges',
				description: 'Default, Redis, NATS — reliable work distribution',
				icon: 'list-search',
				items: [
					{ id: '3_eco_system/queue_bridges/default_queue_bridge', title: 'Default (in-memory)', order: 1 },
					{ id: '3_eco_system/queue_bridges/redis_queue_bridge', title: 'Redis Queue Bridge', order: 2 },
					{ id: '3_eco_system/queue_bridges/nats_queue_bridge', title: 'NATS Queue Bridge', order: 3 },
				],
			},
			{
				id: 'direct-calls',
				title: 'Direct Service Calls',
				description: 'In-process communication between services',
				icon: 'link',
			},
		],
	},
	{
		num: 9,
		id: 'patterns',
		title: 'Enterprise Patterns',
		subtitle: 'Proven patterns for production systems',
		color: 'con',
		cards: [
			{
				id: 'enterprise-pattern',
				title: 'Schedule → Event → Queue → Result',
				description: 'Core enterprise pattern: scheduler triggers, event emitted, queue processes, result published',
				icon: 'stairs',
			},
			{
				id: 'scheduling',
				title: 'Scheduling',
				description: 'External orchestration of when work happens',
				icon: 'clock',
			},
			{
				id: 'workflows',
				title: 'Long-Running Workflows',
				description: 'Coordinating work across multiple async stages',
				icon: 'branch',
			},
			{
				id: 'agent-patterns',
				title: 'AI Agent Patterns',
				description: 'Building systems with autonomous AI agents',
				icon: 'robot',
			},
			{
				id: 'event-sourcing',
				title: 'Event Sourcing',
				description: 'Using events as the source of truth',
				icon: 'history',
			},
			{ id: 'cqrs', title: 'CQRS', description: 'Separating reads and writes for scalability', icon: 'git-compare' },
			{
				id: 'temporal',
				title: 'Temporal Orchestration',
				description: 'Complex workflow orchestration with Temporal',
				icon: 'flow-branch',
			},
		],
	},
	{
		num: 10,
		id: 'ops',
		title: 'Observability & Operations',
		subtitle: 'See, debug, and optimize production systems',
		color: 'pilot',
		cards: [
			{
				id: 'observability',
				title: 'Observability',
				description: "Logs, traces, metrics — understand what's happening",
				icon: 'telescope',
			},
			{
				id: 'opentelemetry',
				title: 'OpenTelemetry Backends',
				description: 'Connect PURISTA traces and metrics to your preferred observability platform',
				icon: 'chart-bar',
				items: [
					{ id: '4_open_telemetry/index', title: 'Overview', order: 1 },
					{ id: '4_open_telemetry/jaeger', title: 'Jaeger', order: 2 },
					{ id: '4_open_telemetry/zipkin', title: 'Zipkin', order: 3 },
					{ id: '4_open_telemetry/grafana', title: 'Grafana Tempo', order: 4 },
					{ id: '4_open_telemetry/signoz', title: 'SigNoz', order: 5 },
					{ id: '4_open_telemetry/uptrace', title: 'Uptrace', order: 6 },
					{ id: '4_open_telemetry/teletrace', title: 'Teletrace', order: 7 },
					{ id: '4_open_telemetry/aws', title: 'AWS X-Ray', order: 8 },
					{ id: '4_open_telemetry/azure_monitor', title: 'Azure Monitor', order: 9 },
					{ id: '4_open_telemetry/google_cloud_trace', title: 'Google Cloud Trace', order: 10 },
				],
			},
			{
				id: 'deployment',
				title: 'Deployment Architectures',
				description: 'Monolith, microservices, Kubernetes, edge, serverless',
				icon: 'cloud-upload',
			},
			{
				id: 'reliability',
				title: 'Reliability',
				description: 'Error handling, retries, circuit breakers, failure modes',
				icon: 'shield-check',
			},
			{
				id: 'performance',
				title: 'Performance',
				description: 'Measurement, bottlenecks, optimization strategies',
				icon: 'rocket',
			},
			{
				id: 'security',
				title: 'Security',
				description: 'Secrets, authentication, encryption, access control',
				icon: 'lock',
			},
		],
	},
]

export function getSectionById(id: string): HandbookSection | undefined {
	return handbookSections.find(s => s.id === id)
}

export function getCardBySlug(
	sectionId: string,
	cardId: string,
): { section: HandbookSection; card: HandbookCard } | undefined {
	const section = getSectionById(sectionId)
	if (!section) return undefined
	const card = section.cards.find(c => c.id === cardId)
	if (!card) return undefined
	return { section, card }
}

export function getAllCards(): (HandbookCard & {
	sectionId: string
	sectionColor: PuristaColor
	sectionTitle: string
})[] {
	const all: (HandbookCard & { sectionId: string; sectionColor: PuristaColor; sectionTitle: string })[] = []
	for (const section of handbookSections) {
		for (const card of section.cards) {
			all.push({ ...card, sectionId: section.id, sectionColor: section.color, sectionTitle: section.title })
		}
	}
	return all
}

export function getSidebarItems(): SidebarItem[] {
	const frameworkSections = handbookSections.filter(section => section.id !== 'harness')
	const harnessSection = handbookSections.find(section => section.id === 'harness')

	const frameworkLabels: Record<string, string> = {
		learn: 'Start Here',
		'mental-model': 'Foundations',
		service: 'Services',
		blocks: 'Building Blocks',
		stores: 'Stores',
		expose: 'APIs & Clients',
		bridges: 'Messaging',
		patterns: 'Patterns',
		ops: 'Operations',
	}

	const frameworkCardLabels: Record<string, string> = {
		'learn/getting-started': 'Quickstart',
		'service/what-is-service': 'Service Overview',
		'service/service-builder': 'Service Builder',
		'service/service-config': 'Configuration',
		'service/service-resources': 'Resources',
		'service/custom-service-class': 'Custom Service',
		'service/service-testing': 'Service Tests',
		'expose/rest-api': 'REST API',
		'expose/graphql': 'GraphQL',
		'expose/service-discovery': 'Service Discovery',
		'bridges/direct-calls': 'Service Calls',
		'ops/opentelemetry': 'OpenTelemetry',
		'ops/deployment': 'Deployment',
	}

	const harnessLabels: Record<string, string> = {
		'harness/overview': 'Overview',
		'harness/quickstart': 'Quickstart',
		'harness/models-and-configuration': 'Configuration',
		'harness/tools-and-skills': 'Tools & Skills',
		'harness/agent-plugins': 'Agent Plugins',
		'harness/sandboxing-and-mcp': 'Sandboxing & MCP',
		'harness/agents-workflows-storage': 'Agents & Workflows',
		'harness/durable-workflows-and-queues': 'Durable Workflows',
		'harness/human-review-gates': 'Human Review Gates',
		'harness/guardrails-governance': 'Guardrails',
		'harness/privacy-detectors': 'Privacy Detectors',
		'harness/custom-adapters': 'Custom Adapters',
		'harness/testing-and-evaluations': 'Tests & Evaluations',
		'harness/observability-operations': 'Observability',
		'harness/migrating-to-v3': 'Migrate to v3',
		'harness/adapters-durability-reference': 'Adapters & Deployment',
	}

	return [
		...frameworkSections.map(section => ({
			title: frameworkLabels[section.id] ?? section.title,
			id: section.id,
			order: section.num,
			items: section.cards.map(card => ({
				title: frameworkCardLabels[`${section.id}/${card.id}`] ?? card.title,
				id: `${section.id}/${card.id}`,
				order: 0,
				items: card.items,
			})),
		})),
		{
			title: 'API Reference',
			id: 'api',
			href: '/handbook/api/',
			order: handbookSections.length + 1,
			items: [
				{ title: 'Overview', id: 'api/overview', href: '/handbook/api/', order: 1 },
				{ title: 'Packages', id: 'api/packages', href: '/handbook/api/#packages', order: 2 },
				{ title: 'Classes', id: 'api/classes', href: '/handbook/api/#classes', order: 3 },
				{ title: 'Interfaces', id: 'api/interfaces', href: '/handbook/api/#interfaces', order: 4 },
				{ title: 'Functions', id: 'api/functions', href: '/handbook/api/#functions', order: 5 },
				{ title: 'Types', id: 'api/types', href: '/handbook/api/#types', order: 6 },
			],
		},
		...(harnessSection
			? [
				{
					title: 'AI Harness',
					id: 'harness',
					href: '/handbook/harness/',
					order: handbookSections.length + 2,
					sectionStart: true,
					kind: 'sectionHeader' as const,
					iconLabel: 'AI',
				},
				...harnessSection.cards.map((card, index) => ({
					id: `harness/${card.id}`,
					title: harnessLabels[`harness/${card.id}`] ?? card.title,
					order: index + 1,
				})),
			]
			: []),
	]
}
