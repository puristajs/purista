import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text-summary'],
			include: ['src/**/*.ts'],
			exclude: ['**/*.test.ts', 'src/types/**', '**/index.ts', 'src/version.ts'],
			thresholds: {
				lines: 80,
				functions: 80,
				statements: 80,
				branches: 74,
			},
		},
	},
})
