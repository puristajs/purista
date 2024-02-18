import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    coverage: {
      enabled: true,
      include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    include: [
      '**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      // '**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.tshy-build/**', '**/test/**'],
  },
})
