import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@purista/ai/testing': fileURLToPath(new URL('./src/testing/index.ts', import.meta.url)),
			'@purista/ai': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
			'@purista/core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text-summary'],
			include: ['src/**/*.ts'],
			exclude: ['**/*.test.ts', '**/index.ts'],
			thresholds: {
				lines: 0,
				functions: 0,
				statements: 0,
				branches: 0,
			},
		},
	},
})
