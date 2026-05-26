// @ts-check

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://purista.dev',
	integrations: [react(), mdx()],
	redirects: {
		'/ai-harness': '/harness',
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
