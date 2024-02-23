import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    coverage: {
      enabled: true,
      include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['examples/**', 'packages/cli/**'],
      thresholds: {
        lines: 63,
        functions: 63,
        branches: 74,
        statements: 63,
      },
    },
    include: [
      '**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      // '**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.tshy-build/**', '**/test/**', 'examples/**', 'website/**'],
  },
})
