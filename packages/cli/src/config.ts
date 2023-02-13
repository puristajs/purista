export const TEMPLATE_BASE = '../../blueprint'

export const dependencies: string[] = [
  'typescript@^4.9.5',
  '@purista/core@latest',
  'zod@3.20.2',
  'ts-node@^10.9.1',
  '@anatine/zod-openapi@^1.12.0',
]

export const httpserverDependencies: string[] = ['@purista/httpserver@latest']

export const httpStaticDependencies: string[] = ['@fastify/static@^6.9.0']

export const devDependencies: string[] = ['pino-pretty@^9.1.1']

export const cliDependencies = ['@purista/cli@latest']

export const testDependencies: string[] = [
  '@swc/jest@^0.2.24',
  '@types/jest@^29.4.0',
  '@types/sinon@^10.0.13',
  'jest@^29.4.1',
  'sinon@^15.0.1',
]

export const lintDependencies: string[] = [
  'eslint@^8.33.0',
  'eslint-config-prettier@^8.6.0',
  'eslint-config-standard@^17.0.0',
  'eslint-plugin-import@^2.27.5',
  'eslint-plugin-json@^3.1.0',
  'eslint-plugin-node@^11.1.0',
  'eslint-plugin-prettier@^4.2.1',
  'eslint-plugin-simple-import-sort@^10.0.0',
  'prettier@^2.8.3',
]
