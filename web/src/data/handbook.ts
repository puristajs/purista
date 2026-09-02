import canonicalContentManifest from './handbook-content-manifest.ts'
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

/** Product that owns a handbook topic. Product-local navigation never crosses this boundary. */
export type HandbookProduct = 'framework' | 'harness'

export type HandbookPageRole = 'landing' | 'chapter' | 'hub' | 'tutorial' | 'concept' | 'task' | 'adapter' | 'operations' | 'migration' | 'reference'

/**
 * Canonical handbook navigation record.
 *
 * Existing numbered Markdown routes remain compatibility routes while their
 * content is migrated into this manifest-backed structure.
 */
export interface HandbookManifestTopic {
	topicId: string
	product: HandbookProduct
	chapterId: string
	parentTopicId?: string
	order: number
	title: string
	description: string
	canonicalRoute: string
	source?: {
		collection: 'handbook' | 'handbookCards'
		id: string
	}
	pageRole: HandbookPageRole
	status: 'canonical' | 'deprecated' | 'redirected' | 'private'
	redirects: string[]
	availabilityOwner?: string
	relatedTopicIds?: string[]
	icon?: string
	tags?: string[]
	featured?: boolean
	sectionId?: string
	cardId?: string
}

export interface HandbookProductDefinition {
	id: HandbookProduct
	topicId: string
	title: string
	description: string
	canonicalRoute: string
}

export type HandbookCompatibilityDisposition = 'redirect' | 'merge-before-redirect' | 'evaluator-separate' | 'retain' | 'retire-approved'

/**
 * A public legacy route whose target has been reviewed against the canonical
 * product tree. Only `redirect` records are emitted as transport redirects;
 * merge and evaluator records deliberately retain their current pages.
 */
export interface HandbookCompatibilityAlias {
	sourceRoute: string
	targetTopicId: string
	disposition: HandbookCompatibilityDisposition
	/** Explicitly reviewed legacy hash aliases. Unknown source fragments are dropped. */
	fragmentAliases?: Record<string, string>
}

export interface LearningPath {
	title: string
	duration: string
	description: string
	slug: string
}

/**
 * Migration input only. All consumers use manifest selectors below. Keeping
 * this compact input temporarily preserves every current card/item route.
 */
const legacySectionDefinitions: HandbookSection[] = [
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
			{ id: 'memory', title: 'Memory', description: 'Store scoped facts and configure durable or vector-capable memory engines.', icon: 'database' },
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
					{ id: 'blocks/agent-pattern/what-is-agent', title: 'What is a mounted Harness target?', order: 1 },
					{ id: 'blocks/agent-pattern/harness-integration', title: 'Harness Integration', order: 2 },
					{ id: 'blocks/agent-pattern/agent-builder', title: 'Define agents with Harness modules', order: 3 },
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

export const handbookProducts: HandbookProductDefinition[] = [
	{
		id: 'framework',
		topicId: 'framework',
		title: 'PURISTA Framework',
		description: 'Build, configure, test, and operate production-grade PURISTA services.',
		canonicalRoute: '/handbook/framework/',
	},
	{
		id: 'harness',
		topicId: 'handbook-harness',
		title: 'AI Harness',
		description: 'Build, secure, evaluate, and operate typed AI agents and workflows.',
		canonicalRoute: '/handbook/harness/',
	},
]

const frameworkSectionLabels: Record<string, string> = {
	learn: 'Start',
	'mental-model': 'Understand the Framework',
	service: 'Build services',
	blocks: 'Build services',
	stores: 'Configure and persist',
	expose: 'Expose and consume services',
	bridges: 'Connect distributed infrastructure',
	patterns: 'Apply patterns and recipes',
	ops: 'Secure and operate',
}

const frameworkCardLabels: Record<string, string> = {
	'learn/getting-started': 'Quickstart',
	'service/what-is-service': 'Service overview',
	'service/service-builder': 'Define a service',
	'service/service-config': 'Service configuration',
	'service/service-resources': 'Resources and dependencies',
	'service/custom-service-class': 'Custom service classes',
	'service/service-testing': 'Test a service',
}

const cardOrderOverrides: Record<string, number> = {
	'blocks/command-pattern': 1,
	'blocks/subscription-pattern': 2,
	'blocks/stream-pattern': 3,
	'blocks/queue-pattern': 4,
	'blocks/agent-pattern': 5,
}

const handbookCompatibilityAliasInputs: HandbookCompatibilityAlias[] = [
	{ sourceRoute: '/handbook/learn/getting-started/', targetTopicId: 'framework/start', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/learn/building-microservices/', targetTopicId: 'framework/deploy-applications/distributed-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/1_quickstart/', targetTopicId: 'framework/start', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/1_quickstart/setup-the-purista-project/', targetTopicId: 'framework/start/requirements-and-installation', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/1_quickstart/create-a-service/', targetTopicId: 'framework/start/create-the-first-service', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/1_quickstart/add-the-first-command/', targetTopicId: 'framework/start/add-a-command', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/1_quickstart/add-the-first-subscription/', targetTopicId: 'framework/start/add-a-subscription', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/stores/config-store/', targetTopicId: 'framework/configure-applications/configuration-stores', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/stores/secret-store/', targetTopicId: 'framework/configure-applications/secret-stores', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/stores/state-store/', targetTopicId: 'framework/persist-application-state', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/expose/rest-api/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/expose/graphql/', targetTopicId: 'framework/expose-and-consume-services/graphql', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/expose/http-client/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/expose/service-discovery/', targetTopicId: 'framework/expose-and-consume-services/service-discovery', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/deployment-flexibility/', targetTopicId: 'framework/understand-the-framework/distribution-and-deployment-models', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/distribution/', targetTopicId: 'framework/understand-the-framework/distribution-and-deployment-models', disposition: 'redirect' },
	{ sourceRoute: '/handbook/bridges/event-bridges/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/bridges/queue-bridges/', targetTopicId: 'framework/connect-distributed-infrastructure/queue-delivery', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/default_config_store/', targetTopicId: 'framework/configure-applications/configuration-stores/default', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/redis_config_store/', targetTopicId: 'framework/configure-applications/configuration-stores/redis', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/aws_config_store/', targetTopicId: 'framework/configure-applications/configuration-stores/aws-systems-manager', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/nats_config_store/', targetTopicId: 'framework/configure-applications/configuration-stores/nats-jetstream-kv', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/dapr_config_store/', targetTopicId: 'framework/configure-applications/configuration-stores/dapr', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/default_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/default', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/aws_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/aws-secrets-manager', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/azure_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/azure-key-vault', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/gcloud_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/gcloud-secret-manager', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/vault_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/vault', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/infisical_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/infisical', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/dapr_secret_store/', targetTopicId: 'framework/configure-applications/secret-stores/dapr', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/default_state_store/', targetTopicId: 'framework/persist-application-state/default', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/redis_state_store/', targetTopicId: 'framework/persist-application-state/redis', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/nats_state_store/', targetTopicId: 'framework/persist-application-state/nats-jetstream-kv', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/dapr_state_store/', targetTopicId: 'framework/persist-application-state/dapr', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/framework/build-services/use-stores-in-a-service/', targetTopicId: 'framework/configure-applications/use-stores-from-handlers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/default_event_bridge/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/amqp/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery/amqp-rabbitmq', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/nats/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery/nats', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/mqtt/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery/mqtt', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/dapr/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery/dapr', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/queue_bridges/default_queue_bridge/', targetTopicId: 'framework/connect-distributed-infrastructure/queue-delivery', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/queue_bridges/redis_queue_bridge/', targetTopicId: 'framework/connect-distributed-infrastructure/queue-delivery/redis', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/3_eco_system/queue_bridges/nats_queue_bridge/', targetTopicId: 'framework/connect-distributed-infrastructure/queue-delivery/nats', disposition: 'merge-before-redirect' },

	{ sourceRoute: '/handbook/harness/overview/', targetTopicId: 'harness/understand-the-harness/mental-model-and-runtime-architecture', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/quickstart/', targetTopicId: 'harness/start', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/ecosystem-packages/', targetTopicId: 'harness/reference', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/models-and-configuration/', targetTopicId: 'harness/configure-the-runtime', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/tools-and-skills/', targetTopicId: 'harness/add-capabilities', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/agent-plugins/', targetTopicId: 'harness/add-capabilities/agent-plugins', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/sandboxing-and-mcp/', targetTopicId: 'harness/secure-and-govern/sandbox-and-mcp', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/agents-workflows-storage/', targetTopicId: 'harness/understand-the-harness', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/durable-workflows-and-queues/', targetTopicId: 'harness/orchestrate-work/durable-workflows', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/human-review-gates/', targetTopicId: 'harness/orchestrate-work/human-review', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/memory/', targetTopicId: 'harness/manage-context-and-state/memory', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/guardrails-governance/', targetTopicId: 'harness/secure-and-govern/guardrails', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/privacy-detectors/', targetTopicId: 'harness/secure-and-govern/privacy-detectors', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/custom-adapters/', targetTopicId: 'harness/reference', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/testing-and-evaluations/', targetTopicId: 'harness/test-and-evaluate', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/observability-operations/', targetTopicId: 'harness/understand-the-harness/failure-and-durability-model', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/migrating-to-v3/', targetTopicId: 'harness/upgrade-and-migrate/migrate-to-v3', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/adapters-durability-reference/', targetTopicId: 'harness/reference', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/extend-the-harness/', targetTopicId: 'harness/reference', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/extend-the-harness/custom-ports-and-contracts/', targetTopicId: 'harness/reference', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/operate-in-production/', targetTopicId: 'harness/understand-the-harness/failure-and-durability-model', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/operate-in-production/deployment-and-topology/', targetTopicId: 'harness/understand-the-harness/failure-and-durability-model', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/operate-in-production/observability-and-troubleshooting/', targetTopicId: 'harness/understand-the-harness/failure-and-durability-model', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/patterns-and-recipes/', targetTopicId: 'harness/orchestrate-work', disposition: 'redirect' },
	{ sourceRoute: '/handbook/harness/use-with-purista-framework/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/what-is-agent/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/harness-integration/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/agent-builder/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/agent-workflows/', targetTopicId: 'harness/orchestrate-work', disposition: 'retire-approved' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/http-exposure/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/guardrails/', targetTopicId: 'harness/orchestrate-work', disposition: 'retire-approved' },
	{ sourceRoute: '/handbook/blocks/agent-pattern/agent-testing/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/handbook/learn/ai-agent-tutorial/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'merge-before-redirect' },
	{ sourceRoute: '/harness/', targetTopicId: 'harness/start', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/get-started/', targetTopicId: 'harness/start', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/architecture/', targetTopicId: 'harness/understand-the-harness/mental-model-and-runtime-architecture', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/guardrails/', targetTopicId: 'harness/secure-and-govern/guardrails', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/security/', targetTopicId: 'harness/secure-and-govern/sandbox-and-mcp', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/durability/', targetTopicId: 'harness/orchestrate-work/durable-workflows', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/memory/', targetTopicId: 'harness/manage-context-and-state/memory', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/testing/', targetTopicId: 'harness/test-and-evaluate/test-harness-applications', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/evaluations/', targetTopicId: 'harness/test-and-evaluate/evaluate-prompts-and-outputs', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/observability/', targetTopicId: 'harness/understand-the-harness/failure-and-durability-model', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/use-cases/', targetTopicId: 'harness/orchestrate-work', disposition: 'evaluator-separate' },
	{ sourceRoute: '/harness/adapters/', targetTopicId: 'harness/reference', disposition: 'retain' },
	{ sourceRoute: '/harness/before-you-ship/', targetTopicId: 'harness/secure-and-govern', disposition: 'retain' },
	{ sourceRoute: '/harness/usage/', targetTopicId: 'harness/start', disposition: 'retain' },
]

/**
 * Concrete Framework routes expanded from the finalized migration map. Entries
 * deliberately avoid pattern-only and vendor-specific routes: every source is
 * an authored legacy page with one reviewed canonical destination.
 */
const frameworkReadyCompatibilityAliases: HandbookCompatibilityAlias[] = [
	{
		sourceRoute: '/handbook/learn/from-zero-to-production/',
		targetTopicId: 'framework/start/from-zero-to-production',
		disposition: 'redirect',
		fragmentAliases: {
			'#phase-1-foundation': '#phase-1-foundation',
			'#phase-2-integration-ready-logic': '#phase-2-integration-ready-logic',
			'#phase-3-runtime-architecture': '#phase-3-runtime-architecture',
			'#phase-4-production-readiness': '#phase-4-production-readiness',
			'#pre-launch-checklist': '#pre-launch-checklist',
		},
	},
	{ sourceRoute: '/handbook/mental-model/architecture/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/philosophy/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/separation-of-concerns/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/data-control/', targetTopicId: 'framework/secure-and-operate/security/secrets-and-sensitive-data', disposition: 'redirect' },
	{ sourceRoute: '/handbook/mental-model/resilience-patterns/', targetTopicId: 'framework/understand-the-framework/reliability-and-delivery-guarantees', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/what-is-service/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/service-builder/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/service-resources/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/service-config/', targetTopicId: 'framework/configure-applications/configuration-model-defaults-validation-and-precedence', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/custom-service-class/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/service/service-testing/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/what-is-command/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/command-builder/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/cross-service/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/http-exposure/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/command-pattern/testing/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/commands/define-and-validate/', targetTopicId: 'framework/build-services/commands/create-and-validate', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/commands/call-another-service/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/commands/call-other-capabilities/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/commands/handle-errors-and-events/', targetTopicId: 'framework/build-services/commands/handle-errors', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/subscriptions/define-and-route/', targetTopicId: 'framework/build-services/subscriptions/create-and-validate', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/streams/define-and-consume/', targetTopicId: 'framework/build-services/streams/create-and-validate', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/streams/compose-and-customize-a-stream/', targetTopicId: 'framework/build-services/streams/invoke-enqueue-emit-and-consume', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/queues-and-workers/define-a-queue-and-worker/', targetTopicId: 'framework/build-services/queues-and-workers/create-a-queue-and-worker', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/queues-and-workers/customize-queue-and-worker-behavior/', targetTopicId: 'framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/queues-and-workers/expose-asynchronous-work-over-http/', targetTopicId: 'framework/build-services/queues-and-workers/expose-queued-work', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/queues-and-workers/retries-failures-and-idempotency/', targetTopicId: 'framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/services/define-and-version/', targetTopicId: 'framework/build-services/services/create-and-version-a-service', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/services/resources-and-dependencies/', targetTopicId: 'framework/build-services/services/provide-resources-and-metrics', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/services/configuration/', targetTopicId: 'framework/build-services/services/configure-a-service', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/services/custom-service-classes/', targetTopicId: 'framework/build-services/services/customize-service-lifecycle', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/subscription-pattern/', targetTopicId: 'framework/build-services/subscriptions', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/subscription-pattern/what-is-subscription/', targetTopicId: 'framework/build-services/subscriptions', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/subscription-pattern/subscription-builder/', targetTopicId: 'framework/build-services/subscriptions', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/subscription-pattern/subscription-testing/', targetTopicId: 'framework/test-applications/message-flows-queues-and-retries', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/stream-pattern/', targetTopicId: 'framework/build-services/streams', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/stream-pattern/what-is-stream/', targetTopicId: 'framework/build-services/streams', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/stream-pattern/stream-builder/', targetTopicId: 'framework/build-services/streams', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/stream-pattern/stream-testing/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/what-is-queue/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/queue-builder/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/queue-worker/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/queue-http-exposure/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/blocks/queue-pattern/queue-testing/', targetTopicId: 'framework/test-applications/message-flows-queues-and-retries', disposition: 'redirect' },
	{ sourceRoute: '/handbook/bridges/direct-calls/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/patterns/scheduling/', targetTopicId: 'framework/build-services/schedule-event-queue-result', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/apply-patterns-and-recipes/schedule-event-queue-result/', targetTopicId: 'framework/build-services/schedule-event-queue-result', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/apply-patterns-and-recipes/modular-monolith/', targetTopicId: 'framework/deploy-applications/modular-monolith', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/apply-patterns-and-recipes/distributed-microservices/', targetTopicId: 'framework/deploy-applications/distributed-services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/patterns/enterprise-pattern/', targetTopicId: 'framework/apply-patterns-and-recipes/enterprise-interoperability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/patterns/agent-patterns/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/', targetTopicId: 'framework/build-ai-powered-services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/configure-an-attached-agent/', targetTopicId: 'framework/build-ai-powered-services/build-the-first-attached-agent', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/agent-builder-and-context/', targetTopicId: 'framework/build-ai-powered-services/mount-harness-and-bind-runtime', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-ai-powered-services/configure-agent-builder-and-runtime-binding/', targetTopicId: 'framework/build-ai-powered-services/mount-harness-and-bind-runtime', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/queue-and-durable-agent-work/', targetTopicId: 'framework/build-ai-powered-services/manage-sessions-workspaces-and-durable-work', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/expose-and-invoke-agents/', targetTopicId: 'framework/build-ai-powered-services/expose-and-invoke-an-attached-agent', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/build-services/ai-powered-services/test-an-ai-powered-service/', targetTopicId: 'framework/build-ai-powered-services/test-an-ai-powered-service-deterministically', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/security/', targetTopicId: 'framework/secure-and-operate/security', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/observability/', targetTopicId: 'framework/secure-and-operate/observability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/opentelemetry/', targetTopicId: 'framework/secure-and-operate/observability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/reliability/', targetTopicId: 'framework/secure-and-operate/reliability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/deployment/', targetTopicId: 'framework/deploy-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/secure-and-operate/deployment/', targetTopicId: 'framework/deploy-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/secure-and-operate/deployment/kubernetes-and-dapr/', targetTopicId: 'framework/deploy-applications/kubernetes-and-dapr', disposition: 'redirect' },
	{ sourceRoute: '/handbook/ops/performance/', targetTopicId: 'framework/secure-and-operate/performance-and-scaling', disposition: 'redirect' },

	{ sourceRoute: '/handbook/2_building_business-logic/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/builders/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/schemas/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/custom_events/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/error-handling/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/logging/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/advanced/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/advanced/structure_of_a_message/', targetTopicId: 'framework/understand-the-framework', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/advanced/delivery-semantics-and-reliability/', targetTopicId: 'framework/secure-and-operate/reliability/delivery-semantics', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/advanced/queues/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/the-service-builder/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/define-resources/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/add-a-service-config/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/custom-service-class/', targetTopicId: 'framework/build-services/services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/service/unit-test-a-service/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/command/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/command/the-command-builder/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/command/invoke_command_from_command/', targetTopicId: 'framework/build-services/commands', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/command/exposing-a-command-as-http-endpoint/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/command/test-a-command/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/subscription/', targetTopicId: 'framework/build-services/subscriptions', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/subscription/the-subscription-builder/', targetTopicId: 'framework/build-services/subscriptions', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/subscription/unit-test-a-subscription/', targetTopicId: 'framework/test-applications/message-flows-queues-and-retries', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stream/', targetTopicId: 'framework/build-services/streams', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stream/the-stream-builder/', targetTopicId: 'framework/build-services/streams', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stream/test-a-stream/', targetTopicId: 'framework/test-applications/business-logic-and-service-contracts', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/queue/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/queue/the-queue-builder/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/queue/the-queue-worker-builder/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/queue/queue-http-exposure/', targetTopicId: 'framework/build-services/queues-and-workers', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/queue/test-a-queue-worker/', targetTopicId: 'framework/test-applications/message-flows-queues-and-retries', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/exposing_endpoints/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/exposing_endpoints/rest_api_http_endpoints/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/connect_to_a_purista_application/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/connect_to_a_purista_application/embedded_client/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/connect_to_a_purista_application/create_a_rest_api_client/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/connect_to_a_purista_application/create_an_eventbridge_client/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/fetch_based_http_client/', targetTopicId: 'framework/expose-and-consume-services/service-clients', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stores/', targetTopicId: 'framework/configure-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stores/config-stores/', targetTopicId: 'framework/configure-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stores/secret-stores/', targetTopicId: 'framework/configure-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/stores/state-stores/', targetTopicId: 'framework/persist-application-state', disposition: 'redirect' },
	{ sourceRoute: '/handbook/2_building_business-logic/exposing_endpoints/graphql_mutation_and_query/', targetTopicId: 'framework/expose-and-consume-services/graphql', disposition: 'redirect' },

	{ sourceRoute: '/handbook/3_eco_system/', targetTopicId: 'framework/reference/packages-and-feature-availability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/tools/', targetTopicId: 'framework/reference/packages-and-feature-availability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/eventbridges/', targetTopicId: 'framework/connect-distributed-infrastructure/event-delivery', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/queue_bridges/', targetTopicId: 'framework/connect-distributed-infrastructure/queue-delivery', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/http_server/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest/hono', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/connect-distributed-infrastructure/http-servers/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest/hono', disposition: 'redirect' },
	{ sourceRoute: '/handbook/framework/connect-distributed-infrastructure/http-servers/hono/', targetTopicId: 'framework/expose-and-consume-services/http-and-rest/hono', disposition: 'redirect' },
	{ sourceRoute: '/handbook/3_eco_system/stores/', targetTopicId: 'framework/reference/packages-and-feature-availability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/', targetTopicId: 'framework/secure-and-operate/observability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/aws/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/azure_monitor/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/google_cloud_trace/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/grafana/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/jaeger/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/signoz/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/teletrace/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/uptrace/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/4_open_telemetry/zipkin/', targetTopicId: 'framework/secure-and-operate/observability/backend-guides', disposition: 'redirect' },
	{ sourceRoute: '/handbook/5_deploy_and_scale/', targetTopicId: 'framework/deploy-applications', disposition: 'redirect' },
	{ sourceRoute: '/handbook/5_deploy_and_scale/monolithic/', targetTopicId: 'framework/deploy-applications/modular-monolith', disposition: 'redirect' },
	{ sourceRoute: '/handbook/5_deploy_and_scale/microservice_style/', targetTopicId: 'framework/deploy-applications/distributed-services', disposition: 'redirect' },
	{ sourceRoute: '/handbook/5_deploy_and_scale/microservice_style/dapr/', targetTopicId: 'framework/deploy-applications/kubernetes-and-dapr', disposition: 'redirect' },
	{ sourceRoute: '/handbook/5_deploy_and_scale/microservice_style/kubernetes/', targetTopicId: 'framework/deploy-applications/kubernetes-and-dapr', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/', targetTopicId: 'framework/apply-patterns-and-recipes/enterprise-interoperability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/', targetTopicId: 'framework/apply-patterns-and-recipes/enterprise-interoperability', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/async-agent-queues/', targetTopicId: 'framework/apply-patterns-and-recipes/asynchronous-request-processing', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/long-running-queues/', targetTopicId: 'framework/apply-patterns-and-recipes/asynchronous-request-processing', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/result-events/', targetTopicId: 'framework/apply-patterns-and-recipes/asynchronous-request-processing', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/event-to-queue/', targetTopicId: 'framework/apply-patterns-and-recipes/asynchronous-request-processing', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/scheduling/', targetTopicId: 'framework/build-services/schedule-event-queue-result', disposition: 'redirect' },
	{ sourceRoute: '/handbook/6_integrations/enterprise_interoperability/exports/', targetTopicId: 'framework/reference/packages-and-feature-availability', disposition: 'redirect' },
]

const frameworkReadySourceRoutes = new Set(
	handbookCompatibilityAliasInputs
		.filter(alias =>
			alias.disposition === 'merge-before-redirect' &&
			alias.sourceRoute.startsWith('/handbook/') &&
			!['/handbook/blocks/agent-pattern/agent-workflows/', '/handbook/blocks/agent-pattern/guardrails/'].includes(alias.sourceRoute),
		)
		.map(alias => alias.sourceRoute),
)

export const handbookCompatibilityAliases: HandbookCompatibilityAlias[] = [
	...handbookCompatibilityAliasInputs,
	...frameworkReadyCompatibilityAliases,
].map(alias => (frameworkReadySourceRoutes.has(alias.sourceRoute) ? { ...alias, disposition: 'redirect' } : alias))

function markdownRoute(route: string): string {
	return route === '/handbook/' ? '/handbook.md' : `${route.replace(/\/$/, '')}.md`
}

function redirectSourcesForTopic(topicId: string): string[] {
	return handbookCompatibilityAliases
		.filter(alias => alias.targetTopicId === topicId && alias.disposition === 'redirect')
		.flatMap(alias => [alias.sourceRoute, markdownRoute(alias.sourceRoute)])
}

function getCanonicalContentTopics(product: HandbookProduct): HandbookManifestTopic[] {
	return canonicalContentManifest
		.filter(topic => topic.product === product)
		.map(topic => ({
			...topic,
			product,
			chapterId: topic.topicId.split('/')[1],
			canonicalRoute: `/handbook/${topic.topicId}/`,
			source: { collection: 'handbook', id: topic.topicId },
			pageRole: topic.pageRole as HandbookPageRole,
			status: 'canonical' as const,
			redirects: redirectSourcesForTopic(topic.topicId),
		}))
}

function normalizeRoute(route: string): string {
	return route.endsWith('/') ? route : `${route}/`
}

function legacySourceId(item: SidebarItem): string {
	return item.id.replace(/\/index$/, '')
}

function buildManifest(): HandbookManifestTopic[] {
	const topics: HandbookManifestTopic[] = handbookProducts.map((product, index) => ({
		topicId: product.topicId,
		product: product.id,
		chapterId: 'root',
		order: index + 1,
		title: product.title,
		description: product.description,
		canonicalRoute: product.canonicalRoute,
		pageRole: 'landing',
		status: 'canonical',
		redirects: [],
	}))

	for (const product of handbookProducts) {
		for (const topic of getCanonicalContentTopics(product.id)) {
			topics.push(topic)
		}
	}

	for (const section of legacySectionDefinitions) {
		const product: HandbookProduct = section.id === 'harness' ? 'harness' : 'framework'
		const productDefinition = handbookProducts.find(candidate => candidate.id === product)!
		const sectionTopicId = product === 'harness' ? productDefinition.topicId : section.id

		if (product === 'framework') {
			topics.push({
				topicId: sectionTopicId,
				product,
				chapterId: section.id,
				parentTopicId: productDefinition.topicId,
				order: section.num,
				title: frameworkSectionLabels[section.id] ?? section.title,
				description: section.subtitle,
				canonicalRoute: `/handbook/${section.id}/`,
				pageRole: 'chapter',
				status: 'deprecated',
				redirects: [],
				sectionId: section.id,
			})
		}

		for (const [index, card] of section.cards.entries()) {
			const cardOrder = cardOrderOverrides[`${section.id}/${card.id}`] ?? index + 1
			const topicId = `${section.id}/${card.id}`
			topics.push({
				topicId,
				product,
				chapterId: product === 'harness' ? 'root' : section.id,
				parentTopicId: sectionTopicId,
				order: cardOrder,
				title: frameworkCardLabels[topicId] ?? card.title,
				description: card.description,
				canonicalRoute: `/handbook/${section.id}/${card.id}/`,
				source: { collection: 'handbookCards', id: topicId },
				pageRole: card.items?.length ? 'hub' : 'concept',
				status: 'deprecated',
				redirects: [],
				icon: card.icon,
				tags: card.tags,
				featured: card.featured,
				sectionId: section.id,
				cardId: card.id,
			})

			for (const item of card.items ?? []) {
				const cardSourcePrefix = `${section.id}/${card.id}/`
				const isCardSource = item.id.startsWith(cardSourcePrefix)
				const hasLegacyRoute = Boolean(item.href) || !isCardSource
				const slug = item.id.split('/').at(-1)!
				topics.push({
					topicId: item.id,
					product,
					chapterId: product === 'harness' ? 'root' : section.id,
					parentTopicId: topicId,
					order: item.order,
					title: item.title,
					description: card.description,
					canonicalRoute: hasLegacyRoute
						? normalizeRoute(item.href ?? `/handbook/${legacySourceId(item)}/`)
						: `/handbook/${section.id}/${card.id}/${slug}/`,
					source: hasLegacyRoute
						? { collection: 'handbook', id: legacySourceId(item) }
						: { collection: 'handbookCards', id: item.id },
					pageRole: 'task',
					status: 'deprecated',
					redirects: [],
					sectionId: section.id,
					cardId: card.id,
				})
			}
		}
	}

	return topics
}

/** The only canonical handbook navigation graph. */
export const handbookManifest = buildManifest()

function byOrder(left: HandbookManifestTopic, right: HandbookManifestTopic): number {
	return left.order - right.order || left.title.localeCompare(right.title)
}

export function getHandbookProduct(product: HandbookProduct): HandbookProductDefinition {
	return handbookProducts.find(candidate => candidate.id === product)!
}

export function getManifestTopic(topicId: string): HandbookManifestTopic | undefined {
	return handbookManifest.find(topic => topic.topicId === topicId)
}

export function getManifestTopicByRoute(route: string): HandbookManifestTopic | undefined {
	const normalized = normalizeRoute(route)
	return handbookManifest.find(topic => topic.canonicalRoute === normalized)
}

/** Compatibility target for an old handbook route, including its Markdown endpoint. */
export function getHandbookRedirectTarget(route: string): string | undefined {
	const alias = handbookCompatibilityAliases.find(candidate => candidate.disposition === 'redirect' && candidate.sourceRoute === route)
	if (!alias) return undefined
	const target = getManifestTopic(alias.targetTopicId)
	if (!target || target.status !== 'canonical') return undefined
	return target.canonicalRoute
}

/** Astro-compatible permanent redirects derived from reviewed, one-to-one manifest aliases. */
export function getHandbookCompatibilityRedirects(): Record<string, string> {
	const redirects: Record<string, string> = {}
	for (const alias of handbookCompatibilityAliases) {
		if (alias.disposition !== 'redirect') continue
		const target = getHandbookRedirectTarget(alias.sourceRoute)
		if (!target) continue
		redirects[alias.sourceRoute] = target
	}
	return redirects
}

export function getProductForHandbookRoute(route: string): HandbookProduct {
	return getManifestTopicByRoute(route)?.product ?? (route.startsWith('/handbook/harness/') ? 'harness' : 'framework')
}

export function getProductChapterTopics(product: HandbookProduct): HandbookManifestTopic[] {
	const productRootTopicId = getHandbookProduct(product).topicId
	return handbookManifest
		.filter(
			topic =>
				topic.product === product &&
				topic.pageRole === 'chapter' &&
				topic.status === 'canonical' &&
				topic.parentTopicId === productRootTopicId,
		)
		.sort(byOrder)
}

export function getProductCardTopics(product: HandbookProduct): HandbookManifestTopic[] {
	return handbookManifest
		.filter(topic => topic.product === product && (topic.pageRole === 'hub' || topic.pageRole === 'concept') && topic.cardId)
		.sort((left, right) => {
			const leftChapter = getManifestTopic(left.parentTopicId ?? '')?.order ?? 0
			const rightChapter = getManifestTopic(right.parentTopicId ?? '')?.order ?? 0
			return leftChapter - rightChapter || byOrder(left, right)
		})
}

/** All canonical content pages in product-local reading order. */
export function getProductPageTopics(product: HandbookProduct): HandbookManifestTopic[] {
	const rootTopicId = getHandbookProduct(product).topicId
	const topics: HandbookManifestTopic[] = []
	const visit = (parentTopicId: string) => {
		for (const topic of handbookManifest.filter(candidate => candidate.parentTopicId === parentTopicId && candidate.status === 'canonical').sort(byOrder)) {
			if (topic.source) topics.push(topic)
			visit(topic.topicId)
		}
	}
	visit(rootTopicId)
	return topics
}

export function getCardTopic(sectionId: string, cardId: string): HandbookManifestTopic | undefined {
	return getManifestTopic(`${sectionId}/${cardId}`)
}

export function getCardChildTopics(sectionId: string, cardId: string): HandbookManifestTopic[] {
	return handbookManifest.filter(topic => topic.parentTopicId === `${sectionId}/${cardId}`).sort(byOrder)
}

export function getPreviousTopic(topic: HandbookManifestTopic): HandbookManifestTopic | undefined {
	const graph = topic.status === 'canonical' ? getProductPageTopics(topic.product) : getProductCardTopics(topic.product)
	const index = graph.findIndex(candidate => candidate.topicId === topic.topicId)
	return index > 0 ? graph[index - 1] : undefined
}

export function getNextTopic(topic: HandbookManifestTopic): HandbookManifestTopic | undefined {
	const graph = topic.status === 'canonical' ? getProductPageTopics(topic.product) : getProductCardTopics(topic.product)
	const index = graph.findIndex(candidate => candidate.topicId === topic.topicId)
	return index >= 0 && index < graph.length - 1 ? graph[index + 1] : undefined
}

/**
 * Compatibility projection for legacy page components. New consumers should
 * select topics from `handbookManifest` directly.
 */
export const handbookSections: HandbookSection[] = legacySectionDefinitions.map(section => ({
	...section,
	cards: section.cards
		.map(card => {
			const topic = getCardTopic(section.id, card.id)!
			return {
				...card,
				title: topic.title,
				items: getCardChildTopics(section.id, card.id).map(item => ({
					id: item.topicId,
					title: item.title,
					order: item.order,
					href: item.canonicalRoute === `/handbook/${section.id}/${card.id}/${item.topicId.split('/').at(-1)}/` ? undefined : item.canonicalRoute,
				})),
			}
		})
		.sort((left, right) => getCardTopic(section.id, left.id)!.order - getCardTopic(section.id, right.id)!.order),
}))

export function getSectionById(id: string): HandbookSection | undefined {
	return handbookSections.find(section => section.id === id)
}

export function getCardBySlug(sectionId: string, cardId: string): { section: HandbookSection; card: HandbookCard; product: HandbookProduct } | undefined {
	const section = getSectionById(sectionId)
	const card = section?.cards.find(candidate => candidate.id === cardId)
	const topic = getCardTopic(sectionId, cardId)
	return section && card && topic ? { section, card, product: topic.product } : undefined
}

export function getAllCards(): (HandbookCard & { sectionId: string; sectionColor: PuristaColor; sectionTitle: string; product: HandbookProduct })[] {
	return handbookSections.flatMap(section =>
		section.cards.map(card => ({
			...card,
			sectionId: section.id,
			sectionColor: section.color,
			sectionTitle: section.title,
			product: getCardTopic(section.id, card.id)!.product,
		})),
	)
}

function getProductSidebarItems(product: HandbookProduct): SidebarItem[] {
	const chapters = getProductChapterTopics(product)
	const toSidebarItem = (topic: HandbookManifestTopic): SidebarItem => ({
		title: topic.title,
		id: topic.topicId,
		href: topic.canonicalRoute,
		order: topic.order,
		items: handbookManifest
			.filter(candidate => candidate.parentTopicId === topic.topicId && candidate.status === 'canonical')
			.sort(byOrder)
			.map(toSidebarItem),
	})

	return chapters.map(toSidebarItem)
}

/**
 * Navigation for the handbook shell.
 *
 * The handbook is the shared developer entry point, so its sidebar always
 * exposes both product graphs. Product headings link to their own landing
 * pages; nested topics and previous/next navigation remain product-local.
 */
export function getSidebarItems(): SidebarItem[] {
	return handbookProducts.flatMap((definition, index) => [
		{
			title: definition.title,
			id: definition.id,
			href: definition.canonicalRoute,
			order: index * 100,
			kind: 'sectionHeader' as const,
			iconLabel: definition.id === 'framework' ? 'F' : 'AI',
			sectionStart: index > 0,
		},
		...getProductSidebarItems(definition.id),
	])
}
