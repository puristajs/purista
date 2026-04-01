import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { puristaConfigSchema } from '../api/loadPuristaConfig.js'
import { createProjectSnapshot } from './createProjectSnapshot.js'

let TEST_DIR = ''

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
		TEST_DIR = ''
	}
})

describe('createProjectSnapshot', () => {
	it('captures services, queues, queue workers, and agents', async () => {
		TEST_DIR = mkdtempSync(join(tmpdir(), 'purista-cli-snapshot-'))
		const serviceDir = join(TEST_DIR, 'src', 'service', 'user', 'v1')
		mkdirSync(join(serviceDir, 'command', 'signUp'), { recursive: true })
		mkdirSync(join(serviceDir, 'subscription', 'welcome'), { recursive: true })
		mkdirSync(join(serviceDir, 'stream', 'searchUsers'), { recursive: true })
		mkdirSync(join(serviceDir, 'queue', 'processJobs'), { recursive: true })
		mkdirSync(join(serviceDir, 'queue-worker', 'processJobsWorker'), { recursive: true })
		mkdirSync(join(TEST_DIR, 'src', 'agents', 'triage', 'v1'), { recursive: true })

		writeFileSync(join(TEST_DIR, 'src', 'service', 'serviceEvent.enum.ts'), 'export enum ServiceEvent { Example = "example" }\n')
		writeFileSync(join(serviceDir, 'userV1ServiceBuilder.ts'), 'export const userV1ServiceBuilder = {}\n')
		writeFileSync(join(serviceDir, 'userV1Service.ts'), 'export const userV1Service = {}\n')
		writeFileSync(join(TEST_DIR, 'src', 'agents', 'triage', 'v1', 'triageAgent.ts'), 'export const triageAgent = {}\n')

		const config = puristaConfigSchema.parse({
			servicePath: 'src/service',
			agentPath: 'src/agents',
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			formatter: 'none',
			linter: 'none',
		})

		const snapshot = await createProjectSnapshot(config, TEST_DIR)
		expect(snapshot.services.user['1'].commands).toContain('signUp')
		expect(snapshot.services.user['1'].subscriptions).toContain('welcome')
		expect(snapshot.services.user['1'].streams).toContain('searchUsers')
		expect(snapshot.services.user['1'].queues).toContain('processJobs')
		expect(snapshot.services.user['1'].queueWorkers).toContain('processJobsWorker')
		expect(snapshot.agents.triage).toContain('1')
	})
})
