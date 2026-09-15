import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const handbook = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/handbook' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		order: z.number().default(999999),
	}),
})

const handbookCards = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/handbook-cards' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
})

/**
 * Problem-oriented, runnable tutorial chapters.
 *
 * A chapter owns `<chapter>/index.md`; its ordered child pages live below the
 * same directory. This keeps the public route, sidebar nesting, and source
 * checkpoint together without duplicating chapter metadata in every page.
 */
const tutorials = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tutorials' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		order: z.number().int().nonnegative().default(999999),
		status: z.enum(['draft', 'published']).default('published'),
		sidebarLabel: z.string().optional(),
		kind: z.enum(['overview', 'chapter', 'group', 'lesson']).default('lesson'),
		group: z.enum(['start', 'services', 'ai', 'workflows', 'operate']).optional(),
		optional: z.boolean().default(false),
	}),
})

const legacyPageSchema = z
	.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.any().optional(),
		order: z.number().optional(),
		image: z.string().optional(),
	})
	.passthrough()

const articles = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/article' }),
	schema: legacyPageSchema,
})

const resources = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
	schema: legacyPageSchema,
})

const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema: legacyPageSchema,
})

export const collections = { handbook, handbookCards, tutorials, articles, resources, pages }
