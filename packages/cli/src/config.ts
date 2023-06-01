export const TEMPLATE_BASE = '../../blueprint'

export const dependencies: string[] = ['typescript@^5.0.2', '@purista/core@latest', 'zod@3.21.4', 'ts-node@^10.9.1']

export const httpserverDependencies: string[] = ['@purista/httpserver@latest']

export const httpStaticDependencies: string[] = ['@fastify/static@^6.9.0']

export const devDependencies: string[] = ['pino-pretty@^9.1.1', '@types/node@^18.15.11']

export const cliDependencies = ['@purista/cli@latest']

export const testDependencies: string[] = [
  '@swc/jest@^0.2.26',
  '@types/jest@^29.5.2',
  '@types/sinon@^10.x',
  'jest@^29.5.0',
  'sinon@^15.x',
]

export const lintDependencies: string[] = [
  '@typescript-eslint/eslint-plugin@^5.59.8',
  '@typescript-eslint/parser@^5.59.8',
  'eslint@^8.41.0',
  'eslint-config-prettier@^8.8.0',
  'eslint-config-standard@^17.1.0',
  'eslint-plugin-import@^2.27.5',
  'eslint-plugin-json@^3.1.0',
  'eslint-plugin-node@^11.1.0',
  'eslint-plugin-prettier@^4.2.1',
  'eslint-plugin-simple-import-sort@^10.0.0',
  'prettier@^2.8.8',
]
