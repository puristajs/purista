import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: true,
    globals: true,
    watch: false,
    environment: 'node',
    hookTimeout: 30000,
    coverage: {
      enabled: true,
      include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['examples/**', 'packages/cli/**', 'website:/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
    include: [
      '**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.tshy-build/**', '**/examples/**'],
  },
})
