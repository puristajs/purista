import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	esbuild: {
		jsx: 'automatic',
	},
	test: {
		environment: 'jsdom',
		include: [resolve(__dirname, 'src/frontend/**/*.test.ts'), resolve(__dirname, 'src/frontend/**/*.test.tsx')],
	},
})
