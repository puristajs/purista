export const TEMPLATE_BASE = '../../blueprint'

export const dependencies: string[] = ['typescript', '@purista/core', 'zod', 'tsx']

export const httpserverDependencies: string[] = ['@purista/hono-http-server', '@hono/node-server', '@hono/swagger-ui']

export const devDependencies: string[] = ['pino-pretty', '@types/node', 'sinon', '@types/sinon']

export const cliDependencies = ['@purista/cli']

export const jestDependencies: string[] = ['@swc/jest', '@types/jest', 'jest']
export const vitestDependencies: string[] = ['vitest']

export const eslintDependencies: string[] = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint',
  'eslint-config-prettier',
  'eslint-config-standard',
  'eslint-plugin-import',
  'eslint-plugin-json',
  'eslint-plugin-node',
  'eslint-plugin-prettier',
  'eslint-plugin-simple-import-sort',
  'prettier',
]

export const biomeDependencies: string[] = ['biome']
