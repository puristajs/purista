import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { addPuristaAgent } from './addPuristaAgent.js'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaQueue } from './addPuristaQueue.js'
import { addPuristaQueueWorker } from './addPuristaQueueWorker.js'
import { addPuristaService } from './addPuristaService.js'
import { addPuristaStream } from './addPuristaStream.js'
import { addPuristaSubscription } from './addPuristaSubscription.js'
import { puristaConfigSchema } from './loadPuristaConfig.js'
import { scanPuristaProject } from './scanPuristaProject.js'

let TEST_DIR = ''
const TEST_FILE_DIR = dirname(fileURLToPath(import.meta.url))
const CLI_PACKAGE_ROOT = join(TEST_FILE_DIR, '..', '..')
const REPO_ROOT = join(CLI_PACKAGE_ROOT, '..', '..')
const forbiddenAgentTerms = [
	['setStream', 'ProtocolAdapter'].join(''),
	['Agent', 'ProtocolEnvelope'].join(''),
	['purista', '-', 'ai'].join(''),
	['Ai', 'SdkProvider'].join(''),
	['ai', '-', 'sdk'].join(''),
]

const createBaseProject = () => {
	const coreDtsPath = join(REPO_ROOT, 'packages', 'core', 'dist', 'esm', 'index.d.ts')
	const coreGlobPath = join(REPO_ROOT, 'packages', 'core', 'dist', 'esm', '*')
	TEST_DIR = mkdtempSync(join(REPO_ROOT, 'node_modules', 'tmp-e2e-'))
	writeFileSync(
		join(TEST_DIR, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				target: 'ES2022',
				module: 'NodeNext',
				moduleResolution: 'NodeNext',
				skipLibCheck: true,
				allowImportingTsExtensions: true,
				baseUrl: '.',
				paths: {
					'@purista/core': [coreDtsPath],
					'@purista/core/*': [coreGlobPath],
				},
			},
			include: ['src/**/*.ts'],
			exclude: ['src/service/**/agent/**/*.ts'],
		}),
	)
	writeFileSync(
		join(TEST_DIR, 'package.json'),
		JSON.stringify({
			name: 'test-project',
			type: 'module',
			dependencies: {
				'@purista/core': 'latest',
				zod: 'latest',
			},
		}),
	)

	const serviceRoot = join(TEST_DIR, 'src', 'service')
	mkdirSync(serviceRoot, { recursive: true })
	writeFileSync(
		join(serviceRoot, 'serviceEvent.enum.ts'),
		`
export enum ServiceEvent {
  UserSignedUp = "user.signed_up",
  UserWelcomeSent = "user.welcome_sent"
}
`,
	)
}

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
	}
})

describe('CLI artifact generation (e2e)', () => {
	it('creates service, command, subscription, and stream with valid wiring', async () => {
		createBaseProject()

		const puristaConfig = puristaConfigSchema.parse({
			servicePath: 'src/service',
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			formatter: 'none',
			linter: 'none',
		})

		let project = await scanPuristaProject(puristaConfig, TEST_DIR)

		await addPuristaService({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceDescription: 'User service',
		})

		project = await scanPuristaProject(puristaConfig, TEST_DIR)

		await addPuristaCommand({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			commandName: 'sign up',
			commandDescription: 'Sign up a user',
			responseEventName: 'user.signed_up',
		})

		project = await scanPuristaProject(puristaConfig, TEST_DIR)

		await addPuristaSubscription({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			subscriptionName: 'send welcome email',
			subscriptionDescription: 'Send welcome email',
			eventToSubscribe: 'user.signed_up',
			responseEventName: 'user.welcome_sent',
		})

		project = await scanPuristaProject(puristaConfig, TEST_DIR)

		await addPuristaStream({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			streamName: 'search users',
			streamDescription: 'Stream user search results',
			responseEventName: 'user.welcome_sent',
		})

		project = await scanPuristaProject(puristaConfig, TEST_DIR)

		await addPuristaQueue({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			queueName: 'process jobs',
			queueDescription: 'Process background jobs',
			worker: {
				name: 'process jobs worker',
				description: 'Default worker',
				mode: 'continuous',
				maxParallelHandlers: 1,
			},
			producer: {
				commandName: 'enqueue job',
				commandDescription: 'Enqueue a job for async processing',
				responseEventName: 'user.job_enqueued',
			},
		})

		await addPuristaQueueWorker({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			queueName: 'process jobs',
			workerName: 'process jobs interval worker',
			workerDescription: 'Interval worker',
			mode: 'interval',
			intervalMs: 30000,
			maxParallelHandlers: 2,
		})

		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'triage',
			agentDescription: 'Review tickets',
			responseEventName: 'user.triage_completed',
		})

		const serviceDir = join(TEST_DIR, 'src', 'service', 'user', 'v1')
		const serviceFile = join(serviceDir, 'userV1Service.ts')
		const builderFile = join(serviceDir, 'userV1ServiceBuilder.ts')
		const commandDir = join(serviceDir, 'command', 'signUp')
		const subscriptionDir = join(serviceDir, 'subscription', 'sendWelcomeEmail')
		const streamDir = join(serviceDir, 'stream', 'searchUsers')

		expect(readFileSync(builderFile, 'utf-8')).toContain('new ServiceBuilder')
		const serviceFileContent = readFileSync(serviceFile, 'utf-8')
		expect(serviceFileContent).toContain('commandDefinitions')
		expect(serviceFileContent).toContain('subscriptionDefinitions')
		expect(serviceFileContent).toContain('streamDefinitions')
		expect(serviceFileContent).toContain('queueDefinitions')
		expect(serviceFileContent).toContain('queueWorkerDefinitions')
		expect(serviceFileContent).toContain('agentDefinitions')
		expect(serviceFileContent).toContain("Parameters<typeof userV1ServiceBuilder['addCommandDefinition']>[0][] =")
		expect(serviceFileContent).toContain("Parameters<typeof userV1ServiceBuilder['addSubscriptionDefinition']>[0][] =")
		expect(serviceFileContent).toContain("Parameters<typeof userV1ServiceBuilder['addStreamDefinition']>[0][] =")
		expect(serviceFileContent).toContain(
			"type QueueDefinition = Parameters<typeof userV1ServiceBuilder['addQueueDefinition']>[number]",
		)
		expect(serviceFileContent).toContain(
			"type QueueWorkerDefinition = Parameters<typeof userV1ServiceBuilder['addQueueWorkerDefinition']>[number]",
		)
		expect(serviceFileContent).toContain('signUpCommandBuilder.getDefinition()')
		expect(serviceFileContent).toContain('sendWelcomeEmailSubscriptionBuilder.getDefinition()')
		expect(serviceFileContent).toContain('searchUsersStreamBuilder.getDefinition()')
		expect(serviceFileContent).toContain('enqueueJobCommandBuilder.getDefinition()')
		expect(serviceFileContent).toContain('triageAgentBuilder.getDefinition()')
		expect(serviceFileContent).toContain('.addQueueDefinition(...queueDefinitions)')
		expect(serviceFileContent).toContain('.addQueueWorkerDefinition(...queueWorkerDefinitions)')
		expect(serviceFileContent).toContain('.addAgentDefinition(...(await Promise.all(agentDefinitions)))')
		expect(serviceFileContent).toContain('processJobsQueueBuilder.getDefinition()')

		const commandSchema = readFileSync(join(commandDir, 'schema.ts'), 'utf-8')
		expect(commandSchema).toContain('userV1SignUpInputParameterSchema')
		expect(commandSchema).toContain('userV1SignUpInputPayloadSchema')
		expect(commandSchema).toContain('userV1SignUpOutputPayloadSchema')
		const commandTypes = readFileSync(join(commandDir, 'types.ts'), 'utf-8')
		expect(commandTypes).toContain('UserV1SignUpInputParameter')
		expect(commandTypes).toContain('UserV1SignUpInputPayload')
		expect(commandTypes).toContain('UserV1SignUpOutputPayload')
		expect(readFileSync(join(commandDir, 'signUpCommandBuilder.ts'), 'utf-8')).toContain('signUpCommandBuilder')

		const queueDirPath = join(serviceDir, 'queue', 'processJobs')
		expect(readFileSync(join(queueDirPath, 'schema.ts'), 'utf-8')).toContain('userV1ProcessJobsQueuePayloadSchema')
		expect(readFileSync(join(queueDirPath, 'types.ts'), 'utf-8')).toContain('UserV1ProcessJobsQueuePayload')
		const queueBuilderContent = readFileSync(join(queueDirPath, 'processJobsQueueBuilder.ts'), 'utf-8')
		expect(queueBuilderContent).toContain('.getQueueBuilder("processJobs"')
		expect(queueBuilderContent).toContain('.addPayloadSchema(userV1ProcessJobsQueuePayloadSchema)')

		const agentDirPath = join(TEST_DIR, 'src', 'service', 'user', 'v1', 'agent', 'triage')
		const agentBuilder = readFileSync(join(agentDirPath, 'triageAgent.ts'), 'utf-8')
		expect(agentBuilder).toContain("import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'")
		expect(agentBuilder).toContain(".getAgentQueueBuilder('triageAgent', 'Review tickets')")
		expect(agentBuilder).toContain('.addPayloadSchema(triageAgentPayloadSchema)')
		expect(agentBuilder).toContain('.addParameterSchema(triageAgentParameterSchema)')
		expect(agentBuilder).toContain('.addOutputSchema(triageAgentOutputSchema)')
		expect(agentBuilder).toContain(".addModel('primary', {")
		expect(agentBuilder).toContain('.setHarnessAgent(triageAgentHarnessAgent)')
		expect(agentBuilder).toContain(".setSuccessEventName('user.triage.completed')")
		expect(agentBuilder).toContain(".setSessionPolicy({ mode: 'ephemeral' })")
		expect(agentBuilder).toContain('.setExecutionPolicy({')
		expect(agentBuilder).toContain("instructions: 'You are a helpful assistant for this service domain.'")
		for (const term of forbiddenAgentTerms) {
			expect(agentBuilder).not.toContain(term)
		}
		const agentTestContent = readFileSync(join(agentDirPath, 'triageAgent.test.ts'), 'utf-8')
		expect(agentTestContent).toContain(
			"import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/ai/testing'",
		)
		expect(agentTestContent).toContain('runs with the attached-agent harness runtime')
		expect(agentTestContent).toContain("provider: createScriptedHarnessModel().nextObject({ message: 'hello' })")
		expect(agentTestContent).toContain("model: 'gpt-4.1-mini'")
		expect(agentTestContent).toContain(
			'const harness = await createAgentTestHarness(await triageAgentBuilder.getDefinition(), {',
		)
		expect(agentTestContent).toContain("expect(result).toEqual({ message: 'hello' })")
		expect(agentTestContent).not.toContain('ai: {')
		expect(agentTestContent).not.toContain('await harness.destroy()')
		for (const term of forbiddenAgentTerms) {
			expect(agentTestContent).not.toContain(term)
		}
		expect(agentTestContent).not.toContain('getAgentQueueBuilder: () => null as any')
		const packageJsonContent = JSON.parse(readFileSync(join(TEST_DIR, 'package.json'), 'utf-8')) as {
			dependencies?: Record<string, string>
		}
		expect(packageJsonContent.dependencies?.['@purista/ai']).toBeUndefined()

		const queueWorkerDir = join(serviceDir, 'queue-worker', 'processJobsWorker')
		expect(readFileSync(join(queueWorkerDir, 'processJobsWorkerQueueWorkerBuilder.ts'), 'utf-8')).toContain(
			'.getQueueWorkerBuilder("processJobs"',
		)
		const queueWorkerIntervalDir = join(serviceDir, 'queue-worker', 'processJobsIntervalWorker')
		expect(
			readFileSync(join(queueWorkerIntervalDir, 'processJobsIntervalWorkerQueueWorkerBuilder.ts'), 'utf-8'),
		).toContain('.setIntervalMs(30000)')

		const producerCommandBuilder = readFileSync(
			join(serviceDir, 'command', 'enqueueJob', 'enqueueJobCommandBuilder.ts'),
			'utf-8',
		)
		expect(producerCommandBuilder).toContain(".canEnqueue('processJobs'")
		expect(producerCommandBuilder).toContain('context.queue.enqueue.processJobs')

		const subscriptionSchema = readFileSync(join(subscriptionDir, 'schema.ts'), 'utf-8')
		expect(subscriptionSchema).toContain('userV1SendWelcomeEmailInputParameterSchema')
		expect(subscriptionSchema).toContain('userV1SendWelcomeEmailInputPayloadSchema')
		expect(subscriptionSchema).toContain('userV1SendWelcomeEmailOutputPayloadSchema')
		const subscriptionTypes = readFileSync(join(subscriptionDir, 'types.ts'), 'utf-8')
		expect(subscriptionTypes).toContain('UserV1SendWelcomeEmailInputParameter')
		expect(subscriptionTypes).toContain('UserV1SendWelcomeEmailInputPayload')
		expect(subscriptionTypes).toContain('UserV1SendWelcomeEmailOutputPayload')
		expect(readFileSync(join(subscriptionDir, 'sendWelcomeEmailSubscriptionBuilder.ts'), 'utf-8')).toContain(
			'sendWelcomeEmailSubscriptionBuilder',
		)

		const streamSchema = readFileSync(join(streamDir, 'schema.ts'), 'utf-8')
		expect(streamSchema).toContain('userV1SearchUsersInputParameterSchema')
		expect(streamSchema).toContain('userV1SearchUsersInputPayloadSchema')
		expect(streamSchema).toContain('userV1SearchUsersChunkPayloadSchema')
		expect(streamSchema).toContain('userV1SearchUsersFinalPayloadSchema')
		const streamTypes = readFileSync(join(streamDir, 'types.ts'), 'utf-8')
		expect(streamTypes).toContain('UserV1SearchUsersInputParameter')
		expect(streamTypes).toContain('UserV1SearchUsersInputPayload')
		expect(streamTypes).toContain('UserV1SearchUsersChunkPayload')
		expect(streamTypes).toContain('UserV1SearchUsersFinalPayload')
		expect(readFileSync(join(streamDir, 'searchUsersStreamBuilder.ts'), 'utf-8')).toContain('searchUsersStreamBuilder')
	}, 60_000)
})
