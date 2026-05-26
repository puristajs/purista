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

export const collections = { handbook, handbookCards }
