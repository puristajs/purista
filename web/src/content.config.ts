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

export const collections = { handbook, handbookCards, articles, resources, pages }
