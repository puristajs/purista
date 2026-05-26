import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'
import { handbookSections } from '../../data/handbook'

type PageMeta = {
	title: string
	description?: string
	accent?: 'gold' | 'mint' | 'blue' | 'coral'
}

const pages: Record<string, PageMeta> = {}

function normalizeRoute(route: string) {
	return route.replace(/^\//, '').replace(/\/$/, '').replace(/\/index$/, '') || 'index'
}

function setPage(route: string, page: PageMeta) {
	pages[normalizeRoute(route)] = page
}

/* ================================================================
   Landing pages — manually mapped to match src/pages/*.astro
   ================================================================ */
const landingPages: Record<string, PageMeta> = {
	index: {
		title: 'PURISTA — Enterprise TypeScript backends. Provider-agnostic. Traceable. Approval-ready.',
		description:
			'Open-source TypeScript framework for enterprise backends. Provider-agnostic by construction. Traceable and auditable end-to-end.',
		accent: 'gold',
	},
	enterprise: {
		title: 'Enterprise | PURISTA',
		description: 'PURISTA for enterprise teams. Reviewable by structure, approval-ready by design.',
		accent: 'blue',
	},
	framework: {
		title: 'Framework | PURISTA',
		description: 'The open-source TypeScript framework for production-grade systems.',
		accent: 'gold',
	},
	'framework/mental-model': {
		title: 'PURISTA Mental Model',
		description:
			'From business domains to services, commands, events, runtime contracts, adapters, and observable flows.',
		accent: 'mint',
	},
	harness: {
		title: 'AI Harness | PURISTA',
		description:
			'Self-hosted TypeScript infrastructure for building provider-neutral LLM agent systems inside your own application or platform.',
		accent: 'mint',
	},
	'harness/use-cases': {
		title: 'Use Cases | AI Harness | PURISTA',
		description: 'Production AI patterns — from RAG and triage to human review gates, parallel agents, and living wikis.',
		accent: 'coral',
	},
	'harness/architecture': {
		title: 'Architecture | AI Harness | PURISTA',
		description: 'How the AI Harness works: primitives, adapter model, agent lifecycle, durable execution, and observability.',
		accent: 'gold',
	},
	'harness/security': {
		title: 'Security & Production Readiness | AI Harness | PURISTA',
		description: 'Sandboxed execution, human review gates, content privacy, and the full production checklist.',
		accent: 'blue',
	},
	'harness/observability': {
		title: 'Observability | AI Harness | PURISTA',
		description: 'Full trace visibility, cost control, and evidence-based iteration for AI agents with OpenTelemetry.',
		accent: 'mint',
	},
	'harness/get-started': {
		title: 'Get Started | AI Harness | PURISTA',
		description: 'Step-by-step guide from choosing your model provider to production workflows.',
		accent: 'gold',
	},
	'harness/testing': {
		title: 'Testing | AI Harness | PURISTA',
		description:
			'Test AI Harness applications without calling external model providers: fake providers, contracts, streams, and review gates.',
		accent: 'blue',
	},
	'harness/evaluations': {
		title: 'Evaluations | AI Harness | PURISTA',
		description:
			'Compare prompt candidates locally with deterministic scorers. Run the inner loop in CI and persist results where your product needs them.',
		accent: 'mint',
	},
	'harness/memory': {
		title: 'Memory | AI Harness | PURISTA',
		description: 'Agent memory scopes, the memory facade, sandbox defaults, TTL, search, and custom MemoryAdapter implementations.',
		accent: 'coral',
	},
	'harness/adapters': {
		title: 'Adapters | AI Harness | PURISTA',
		description: 'Model providers, memory, sandbox, tools, protocol emitters, and tracing stay swappable behind explicit interfaces.',
		accent: 'blue',
	},
	'harness/before-you-ship': {
		title: 'Before You Ship | AI Harness | PURISTA',
		description: 'A production checklist for safety, observability, evaluation, runtime controls, and operational readiness.',
		accent: 'gold',
	},
	'harness/usage': {
		title: 'Usage | AI Harness | PURISTA',
		description: 'Practical API patterns for wiring model capabilities, agents, tools, memory, streaming, and reviews.',
		accent: 'mint',
	},
}

/* ================================================================
   Handbook pages
   ================================================================ */
for (const [route, page] of Object.entries(landingPages)) {
	setPage(route, page)
}

// 1. Content collection entries (numbered docs, concepts, etc.)
const handbookEntries = await getCollection('handbook')
for (const entry of handbookEntries) {
	setPage(`handbook/${entry.id}`, {
		title: entry.data.title,
		description: entry.data.description,
		accent: 'gold',
	})
}

// 2. Handbook landing page (overwrites content-collection 'index')
setPage('handbook', {
	title: 'PURISTA Handbook',
	description:
		'Build distributed, event-driven systems with strict schemas, separation of concerns, and production-grade reliability.',
	accent: 'gold',
})

// 3. Section overview pages
for (const section of handbookSections) {
	setPage(`handbook/${section.id}`, {
		title: section.title,
		description: section.subtitle,
		accent: 'blue',
	})
}

// 4. Card pages
for (const section of handbookSections) {
	for (const card of section.cards) {
		setPage(`handbook/${section.id}/${card.id}`, {
			title: card.title,
			description: card.description,
			accent: 'mint',
		})
	}
}

// 5. Card sub-pages (fallback using item title + card description)
for (const section of handbookSections) {
	for (const card of section.cards) {
		if (card.items) {
			for (const item of card.items) {
				const slug = item.id.split('/').pop()!
				setPage(`handbook/${section.id}/${card.id}/${slug}`, {
					title: item.title,
					description: card.description,
					accent: 'mint',
				})
			}
		}
	}
}

// 6. Handbook card MDX content (overwrites fallback with frontmatter data)
const handbookCardEntries = await getCollection('handbookCards')
for (const entry of handbookCardEntries) {
	setPage(`handbook/${entry.id}`, {
		title: entry.data.title,
		description: entry.data.description,
		accent: 'mint',
	})
}

/* ================================================================
   OG Image generator
   ================================================================ */
const accentColors: Record<NonNullable<PageMeta['accent']>, [number, number, number]> = {
	gold: [244, 211, 94],
	mint: [69, 221, 184],
	blue: [99, 179, 237],
	coral: [255, 111, 97],
}

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			path: './public/og-logo.png',
			size: [124, 124],
		},
		bgImage: {
			path: './public/og-background.png',
			fit: 'cover',
		},
		bgGradient: [
			[8, 8, 11],
			[20, 29, 43],
		],
		border: {
			color: accentColors[page.accent ?? 'gold'],
			width: 14,
			side: 'inline-start',
		},
		padding: 64,
		font: {
			title: {
				color: [255, 252, 242],
				size: 56,
				weight: 'Bold',
				lineHeight: 1.08,
			},
			description: {
				color: [214, 220, 226],
				size: 28,
				weight: 'Normal',
				lineHeight: 1.3,
			},
		},
		format: 'PNG',
		quality: 100,
	}),
})
