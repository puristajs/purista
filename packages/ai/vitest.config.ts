import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@purista/core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text-summary'],
			include: ['src/bridge/**/*.ts', 'src/platform/runtime/AIWorkerService/queue/executeWorkload.ts'],
			exclude: ['**/*.test.ts', '**/index.ts'],
			thresholds: {
				lines: 0,
				functions: 0,
				statements: 0,
				branches: 0,
				'src/bridge/**/*.ts': {
					lines: 80,
					functions: 80,
					statements: 80,
					branches: 80,
				},
				'src/platform/runtime/AIWorkerService/queue/executeWorkload.ts': {
					lines: 80,
					functions: 80,
					statements: 80,
					branches: 80,
				},
			},
		},
	},
})
