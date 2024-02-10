export const TEMPLATE_BASE = '../../blueprint'

export const dependencies: string[] = ['typescript@latest', '@purista/core@latest', 'zod@latest', 'tsx@latest']

export const httpserverDependencies: string[] = ['@purista/httpserver@latest']

export const httpStaticDependencies: string[] = ['@fastify/static@latest']

export const devDependencies: string[] = ['pino-pretty@latest', '@types/node@latest']

export const cliDependencies = ['@purista/cli@latest']

export const testDependencies: string[] = [
  '@swc/jest@latest',
  '@types/jest@latest',
  '@types/sinon@latest',
  'jest@latest',
  'sinon@latest',
]

export const lintDependencies: string[] = [
  '@typescript-eslint/eslint-plugin@latest',
  '@typescript-eslint/parser@latest',
  'eslint@latest',
  'eslint-config-prettier@latest',
  'eslint-config-standard@latest',
  'eslint-plugin-import@latest',
  'eslint-plugin-json@latest',
  'eslint-plugin-node@latest',
  'eslint-plugin-prettier@latest',
  'eslint-plugin-simple-import-sort@latest',
  'prettier@latest',
]
