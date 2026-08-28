// @ts-check

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { getHandbookCompatibilityRedirects } from './src/data/handbook.ts'

// https://astro.build/config
export default defineConfig({
	site: 'https://purista.dev',
	integrations: [react(), mdx()],
	redirects: {
		'/ai-harness': '/harness',
		...getHandbookCompatibilityRedirects(),
		'/handbook/2_building_business-logic/ai/': '/handbook/blocks/agent-pattern/',
		'/handbook/2_building_business-logic/ai/the-agent-builder/': '/handbook/blocks/agent-pattern/agent-builder/',
		'/handbook/2_building_business-logic/ai/harness-agents-and-workflows/': '/handbook/blocks/agent-pattern/agent-workflows/',
		'/handbook/2_building_business-logic/ai/guardrails/': '/handbook/harness/secure-and-govern/guardrails/',
		'/handbook/2_building_business-logic/ai/model-capabilities/': '/handbook/harness/configure-the-runtime/',
		'/handbook/2_building_business-logic/ai/test-an-agent/': '/handbook/harness/test-and-evaluate/',
		'/handbook/2_building_business-logic/ai/evaluating-prompts/': '/handbook/harness/test-and-evaluate/',
	},

	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
			transformers: [
				{
					// Add language and meta as data attributes
					pre(node) {
						node.properties['data-language'] = this.options.lang
						const meta = this.options.meta
						if (meta) {
							// Shiki parses meta into an object; __raw holds the original string
							const metaStr = typeof meta === 'string' ? meta : meta.__raw || ''
							if (metaStr) {
								node.properties['data-meta'] = metaStr
							}
						}
					},
				},
			],
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},
})
