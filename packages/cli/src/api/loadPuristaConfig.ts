import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { z } from 'zod'

/**
 * Schema of the purista.json configuration file.
 */
export const puristaConfigSchema = z.object({
	$schema: z.string().optional().default('https://purista.dev/schemas/1.12.0/schema.json'),
	runtime: z.enum(['node', 'bun']).describe('The runtime used in the project').default('node'),
	eventBridge: z
		.enum(['default', 'amqp', 'nats', 'mqtt', 'dapr'])
		.describe('The event bridge used in the project')
		.default('default'),
	fileConvention: z
		.enum(['camel', 'snake', 'kebab', 'pascal', 'pascalSnake'])
		.default('camel')
		.describe('The file naming convention used in the project'),
	eventConvention: z
		.enum(['camel', 'snake', 'kebab', 'pascal', 'pascalSnake', 'constantCase', 'dotCase', 'pathCase', 'trainCase'])
		.default('camel')
		.describe('The event naming convention used in the project'),
	linter: z.enum(['biome', 'eslint', 'none']).default('none').describe('The linter used in the project'),
	formatter: z.enum(['biome', 'prettier', 'none']).default('none').describe('The formatter used in the project'),
	servicePath: z
		.string()
		.optional()
		.default('src/service')
		.describe('The path where services are located relative to the project root'),
})

/**
 * The type for the Purista configuration.
 */
export type PuristaConfig = z.infer<typeof puristaConfigSchema>

/**
 * Load the project configuration file purista.json
 * This file must be placed in the project root (or workspace root).
 * (Same folder where the package.json is located.)
 */
export const loadPuristaConfig = async (projectRootPath?: string) => {
	const projectPath = projectRootPath ?? process.cwd()
	const configFile = join(projectPath, 'purista.json')

	let fileContent = ''
	try {
		fileContent = await readFile(configFile, 'utf-8')
	} catch (error) {
		console.error('PURISTA config file purista.json not found')
		console.error('This file must exist in the project root.')
		throw new Error('purista.json not found')
	}

	let puristaProjectConfig: PuristaConfig
	try {
		puristaProjectConfig = puristaConfigSchema.parse(JSON.parse(fileContent))
		return puristaProjectConfig
	} catch (error) {
		console.error('The PURISTA config file purista.json seems to be invalid')
		throw new Error('Invalid purista.json configuration file')
	}
}
