export const TEMPLATE_BASE = '../../blueprint'

export const dependencies: string[] = ['typescript@^5.1.6', '@purista/core@latest', 'zod@3.21.4', 'ts-node@^10.9.1']

export const httpserverDependencies: string[] = ['@purista/httpserver@latest']

export const httpStaticDependencies: string[] = ['@fastify/static@^6.10.2']

export const devDependencies: string[] = ['pino-pretty@^10.0.1', '@types/node@^18.16.19']

export const cliDependencies = ['@purista/cli@latest']

export const testDependencies: string[] = [
  '@swc/jest@^0.2.26',
  '@types/jest@^29.x',
  '@types/sinon@^10.x',
  'jest@^29.x',
  'sinon@^15.2.x',
]

export const lintDependencies: string[] = [
  '@typescript-eslint/eslint-plugin@^5.61.0',
  '@typescript-eslint/parser@^5.61.0',
  'eslint@^8.44.0',
  'eslint-config-prettier@^8.8.0',
  'eslint-config-standard@^17.1.0',
  'eslint-plugin-import@^2.27.5',
  'eslint-plugin-json@^3.1.0',
  'eslint-plugin-node@^11.1.0',
  'eslint-plugin-prettier@5.0.0-alpha.2',
  'eslint-plugin-simple-import-sort@^10.0.0',
  'prettier@^3.0.0',
]
