import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'
import { handbookSections } from '../../data/handbook'

/* ================================================================
   Landing pages — manually mapped to match src/pages/*.astro
   ================================================================ */
const landingPages: Record<string, { title: string; description?: string }> = {
	index: {
		title: 'PURISTA 3 — AI accelerates implementation. PURISTA accelerates approval.',
		description:
			'The open-source TypeScript framework for production-grade systems built with AI-assisted development. Declared. Reviewable. Observable. Approval-ready.',
	},
	'enterprise/index': {
		title: 'Enterprise | PURISTA',
		description: 'PURISTA for enterprise teams. Reviewable by structure, approval-ready by design.',
	},
	'framework/index': {
		title: 'Framework | PURISTA',
		description: 'The open-source TypeScript framework for production-grade systems.',
	},
	'harness/index': {
		title: 'AI Harness | PURISTA',
		description:
			'Self-hosted TypeScript infrastructure for building provider-neutral LLM agent systems inside your own application or platform.',
	},
	'harness/use-cases': {
		title: 'Use Cases | AI Harness | PURISTA',
		description: 'Production AI patterns — from RAG and triage to human review gates, parallel agents, and living wikis.',
	},
	'harness/architecture': {
		title: 'Architecture | AI Harness | PURISTA',
		description: 'How the AI Harness works: primitives, adapter model, agent lifecycle, durable execution, and observability.',
	},
	'harness/security': {
		title: 'Security & Production Readiness | AI Harness | PURISTA',
		description: 'Sandboxed execution, human review gates, content privacy, and the full production checklist.',
	},
	'harness/observability': {
		title: 'Observability | AI Harness | PURISTA',
		description: 'Full trace visibility, cost control, and evidence-based iteration for AI agents with OpenTelemetry.',
	},
	'harness/get-started': {
		title: 'Get Started | AI Harness | PURISTA',
		description: 'Step-by-step guide from choosing your model provider to production workflows.',
	},
}

/* ================================================================
   Handbook pages
   ================================================================ */
const pages: Record<string, { title: string; description?: string }> = { ...landingPages }

// 1. Content collection entries (numbered docs, concepts, etc.)
const handbookEntries = await getCollection('handbook')
for (const entry of handbookEntries) {
	const route = `handbook/${entry.id}`
	pages[route] = {
		title: entry.data.title,
		description: entry.data.description,
	}
}

// 2. Handbook landing page (overwrites content-collection 'index')
pages['handbook/index'] = {
	title: 'PURISTA Handbook',
	description:
		'Build distributed, event-driven systems with strict schemas, separation of concerns, and production-grade reliability.',
}

// 3. Section overview pages
for (const section of handbookSections) {
	const route = `handbook/${section.id}`
	pages[route] = {
		title: section.title,
		description: section.subtitle,
	}
}

// 4. Card pages
for (const section of handbookSections) {
	for (const card of section.cards) {
		const route = `handbook/${section.id}/${card.id}`
		pages[route] = {
			title: card.title,
			description: card.description,
		}
	}
}

// 5. Card sub-pages (fallback using item title + card description)
for (const section of handbookSections) {
	for (const card of section.cards) {
		if (card.items) {
			for (const item of card.items) {
				const slug = item.id.split('/').pop()!
				const route = `handbook/${section.id}/${card.id}/${slug}`
				pages[route] = {
					title: item.title,
					description: card.description,
				}
			}
		}
	}
}

// 6. Handbook card MDX content (overwrites fallback with frontmatter data)
const handbookCardEntries = await getCollection('handbookCards')
for (const entry of handbookCardEntries) {
	const route = `handbook/${entry.id}`
	pages[route] = {
		title: entry.data.title,
		description: entry.data.description,
	}
}

/* ================================================================
   OG Image generator
   ================================================================ */
export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description,
		// Light mode background
		bgGradient: [[250, 250, 250]],
		// PURISTA purple accent border on the left
		border: {
			color: [124, 58, 237],
			width: 8,
			side: 'inline-start',
		},
		padding: 60,
		font: {
			title: {
				color: [8, 8, 11],
				size: 70,
				weight: 'Bold',
				lineHeight: 1.15,
			},
			description: {
				color: [77, 77, 85],
				size: 36,
				weight: 'Normal',
				lineHeight: 1.3,
			},
		},
	}),
})
