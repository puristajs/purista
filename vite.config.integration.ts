import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: true,
    globals: true,
    watch: false,
    environment: 'node',
    hookTimeout: 30000,
    coverage: {
      enabled: false,
      include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    include: ['**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.tshy-build/**', '**/src/**'],
  },
})
