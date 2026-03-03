import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text-summary'],
			include: [
				'src/runtime/**/*.ts',
				'src/protocol/**/*.ts',
				'src/providers/runtime/**/*.ts',
				'src/memory/**/*.ts',
				'src/knowledge/**/*.ts',
				'src/manifest/**/*.ts',
				'src/pools/**/*.ts',
			],
			exclude: ['**/*.test.ts', '**/index.ts'],
			thresholds: {
				lines: 80,
				functions: 80,
				statements: 80,
				branches: 60,
			},
		},
	},
})
