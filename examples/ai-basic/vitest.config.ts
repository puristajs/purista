import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@purista/ai': resolve(__dirname, '../../packages/ai/src/index.ts'),
			'@purista/core': resolve(__dirname, '../../packages/core/src/index.ts'),
			'@purista/hono-http-server': resolve(__dirname, '../../packages/hono-http-server/src/index.ts'),
		},
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
		exclude: ['src/frontend/**/*.test.ts', 'src/frontend/**/*.test.tsx'],
		coverage: {
			provider: 'v8',
			reporter: ['text-summary'],
			include: ['src/service/desk/v1/agent/**/*.ts'],
			exclude: ['**/*.test.ts'],
			thresholds: {
				lines: 0,
				functions: 0,
				statements: 0,
				branches: 0,
				'src/service/desk/v1/agent/**/*.ts': {
					lines: 80,
					functions: 80,
					statements: 80,
					branches: 80,
				},
			},
		},
	},
})
