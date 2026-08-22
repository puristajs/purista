import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaService } from './addPuristaService.js'
import { addPuristaStream } from './addPuristaStream.js'
import { puristaConfigSchema } from './loadPuristaConfig.js'
import { scanPuristaProject } from './scanPuristaProject.js'

let DIR: string
let oldCwd: string
const config = puristaConfigSchema.parse({
	servicePath: 'service',
	fileConvention: 'camel',
	eventConvention: 'camel',
	runtime: 'node',
	eventBridge: 'default',
	formatter: 'none',
	linter: 'none',
})

beforeEach(() => {
	oldCwd = process.cwd()
	DIR = mkdtempSync(join(tmpdir(), 'purista-cli-'))
	process.chdir(DIR)
	writeFileSync('tsconfig.json', JSON.stringify({ compilerOptions: { module: 'ESNext', target: 'ESNext' } }))
	mkdirSync('src', { recursive: true })
	writeFileSync(
		'src/definitions.ts',
		"import { exportServiceDefinitions, type ServiceBuilder } from '@purista/core'\n\nexport const serviceBuilders: ServiceBuilder<any>[] = []\nexport const createPuristaDefinitions = () => exportServiceDefinitions(serviceBuilders)\n",
	)
})

afterEach(() => {
	process.chdir(oldCwd)
	rmSync(DIR, { recursive: true, force: true })
})

describe('service artifact creation', () => {
	it('creates files for service, command, and stream', async () => {
		await addPuristaService({
			projectRootPath: DIR,
			puristaConfig: config,
			puristaProject: { services: {}, eventNames: [], eventEnumFileName: '' },
			serviceName: 'demo',
			serviceDescription: 'demo',
		})

		const project = await scanPuristaProject(config, DIR)
		await addPuristaCommand({
			projectRootPath: DIR,
			puristaConfig: config,
			puristaProject: project,
			serviceName: 'demo',
			serviceVersion: '1',
			commandName: 'ping',
			commandDescription: 'ping',
		})

		await addPuristaStream({
			projectRootPath: DIR,
			puristaConfig: config,
			puristaProject: project,
			serviceName: 'demo',
			serviceVersion: '1',
			streamName: 'ping stream',
			streamDescription: 'stream ping output',
		})

		const commandFile = join(DIR, 'service', 'demo', 'v1', 'command', 'ping', 'pingCommandBuilder.ts')
		const streamFile = join(DIR, 'service', 'demo', 'v1', 'stream', 'pingStream', 'pingStreamStreamBuilder.ts')
		expect(existsSync(commandFile)).toBe(true)
		expect(existsSync(streamFile)).toBe(true)

		const serviceFile = join(DIR, 'service', 'demo', 'v1', 'demoV1Service.ts')
		const content = readFileSync(serviceFile, 'utf-8')
		expect(content).toContain('pingCommandBuilder')
		expect(content).toContain('pingStreamStreamBuilder')

		const definitions = readFileSync(join(DIR, 'src', 'definitions.ts'), 'utf-8')
		expect(definitions).toMatch(/import \{ demoV1Service \} from ["']\.\.\/service\/demo\/v1\/demoV1Service\.js["']/)
		expect(definitions).toMatch(/serviceBuilders(?:: ServiceBuilder(?:<any>)?\[\])? = \[demoV1Service\]/)
	})
})
