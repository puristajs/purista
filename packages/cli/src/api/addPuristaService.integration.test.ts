import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaService } from './addPuristaService.js'
import { scanPuristaProject } from './scanPuristaProject.js'

let DIR: string
let oldCwd: string
const config = {
	servicePath: 'service',
	fileConvention: 'camel',
	eventConvention: 'camel',
	runtime: 'node',
	eventBridge: 'default',
	formatter: 'none',
	linter: 'none',
} as any

beforeEach(() => {
	oldCwd = process.cwd()
	DIR = mkdtempSync('purista-cli')
	process.chdir(DIR)
	writeFileSync('tsconfig.json', JSON.stringify({ compilerOptions: { module: 'ESNext', target: 'ESNext' } }))
})

afterEach(() => {
	process.chdir(oldCwd)
	rmSync(DIR, { recursive: true, force: true })
})

describe('service and command creation', () => {
	it('creates files for service and command', async () => {
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

		const commandFile = join(DIR, 'service', 'demo', 'v1', 'command', 'ping', 'pingCommandBuilder.ts')
		expect(existsSync(commandFile)).toBe(true)

		const serviceFile = join(DIR, 'service', 'demo', 'v1', 'demoV1Service.ts')
		const content = readFileSync(serviceFile, 'utf-8')
		expect(content).toContain('pingCommandBuilder')
	})
})
