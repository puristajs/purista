import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
import { addPuristaWorkflow } from './addPuristaWorkflow.js'
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
				ignoreDeprecations: '6.0',
				baseUrl: '.',
				paths: {
					'@purista/core': [coreDtsPath],
					'@purista/core/*': [coreGlobPath],
				},
			},
			include: ['src/**/*.ts'],
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

		await addPuristaWorkflow({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			workflowName: 'resolve ticket',
			workflowDescription: 'Resolve a support ticket in durable steps',
		})
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'triage',
			agentDescription: 'Review tickets',
		})
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'summarize',
			agentDescription: 'Summarize a ticket',
		})
		const serviceDir = join(TEST_DIR, 'src', 'service', 'user', 'v1')
		const serviceFile = join(serviceDir, 'userV1Service.ts')
		const builderFile = join(serviceDir, 'userV1ServiceBuilder.ts')
		const commandDir = join(serviceDir, 'command', 'signUp')
		const subscriptionDir = join(serviceDir, 'subscription', 'sendWelcomeEmail')
		const streamDir = join(serviceDir, 'stream', 'searchUsers')

		expect(readFileSync(builderFile, 'utf-8')).toContain('new ServiceBuilder')
		expect(readFileSync(builderFile, 'utf-8')).toContain("import { ServiceBuilder } from '@purista/core'")
		expect(readFileSync(builderFile, 'utf-8')).not.toContain('@purista/ai')
		const serviceFileContent = readFileSync(serviceFile, 'utf-8')
		expect(serviceFileContent).toContain('commandDefinitions')
		expect(serviceFileContent).toContain('subscriptionDefinitions')
		expect(serviceFileContent).toContain('streamDefinitions')
		expect(serviceFileContent).toContain('queueDefinitions')
		expect(serviceFileContent).toContain('queueWorkerDefinitions')
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
		expect(serviceFileContent).toContain('.addQueueDefinition(...queueDefinitions)')
		expect(serviceFileContent).toContain('.addQueueWorkerDefinition(...queueWorkerDefinitions)')
		expect(serviceFileContent).toContain('.mountHarness(userHarness)')
		expect(serviceFileContent.match(/\.mountHarness\(/g)).toHaveLength(1)
		expect(serviceFileContent).not.toMatch(/^ +\t/m)
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

		for (const [directory, fileName, definition] of [
			[commandDir, 'signUpCommandBuilder.test.ts', 'addCommandDefinition(signUpCommandBuilder.getDefinition())'],
			[
				subscriptionDir,
				'sendWelcomeEmailSubscriptionBuilder.test.ts',
				'addSubscriptionDefinition(sendWelcomeEmailSubscriptionBuilder.getDefinition())',
			],
		]) {
			const content = readFileSync(join(directory, fileName), 'utf8')
			expect(content).toContain('userV1ServiceBuilder')
			expect(content).toContain(definition)
			expect(content).not.toContain('../../userV1Service.js')
		}
		const queueDirPath = join(serviceDir, 'queue', 'processJobs')
		expect(readFileSync(join(queueDirPath, 'schema.ts'), 'utf-8')).toContain('userV1ProcessJobsQueuePayloadSchema')
		expect(readFileSync(join(queueDirPath, 'types.ts'), 'utf-8')).toContain('UserV1ProcessJobsQueuePayload')
		const queueBuilderContent = readFileSync(join(queueDirPath, 'processJobsQueueBuilder.ts'), 'utf-8')
		expect(queueBuilderContent).toContain('.getQueueBuilder("processJobs"')
		expect(queueBuilderContent).toContain('.addPayloadSchema(userV1ProcessJobsQueuePayloadSchema)')

		const harnessDirPath = join(serviceDir, 'harness')
		const harnessDefinition = readFileSync(join(harnessDirPath, 'userHarness.ts'), 'utf-8')
		expect(harnessDefinition).toContain("import { defineHarness } from '@purista/harness'")
		expect(harnessDefinition).not.toContain('@purista/ai')
		expect(harnessDefinition).toContain('defineHarness({ name: "user" })')
		expect(harnessDefinition).not.toContain('.requireModel(')
		expect(harnessDefinition).toContain('.addAgent(triageAgent)')
		expect(harnessDefinition).toContain('.addAgent(summarizeAgent)')
		expect(harnessDefinition).toContain('.addWorkflow(resolveTicketWorkflow)')
		expect(harnessDefinition).not.toContain('.define()')
		const triageDefinition = readFileSync(join(harnessDirPath, 'agent', 'triage', 'triageAgent.ts'), 'utf-8')
		expect(triageDefinition).toContain("defineAgent('triage'")
		expect(triageDefinition).toContain('instructions: "Review tickets"')
		const summarizeDefinition = readFileSync(join(harnessDirPath, 'agent', 'summarize', 'summarizeAgent.ts'), 'utf-8')
		expect(summarizeDefinition).toContain("defineAgent('summarize'")
		expect(summarizeDefinition).toContain('instructions: "Summarize a ticket"')
		expect(existsSync(join(serviceDir, 'harness', 'userHarnessMount.ts'))).toBe(false)
		expect(existsSync(join(TEST_DIR, 'src', 'harness'))).toBe(false)
		const workflowDefinition = readFileSync(
			join(harnessDirPath, 'workflow', 'resolveTicket', 'resolveTicketWorkflow.ts'),
			'utf-8',
		)
		expect(workflowDefinition).toContain("defineWorkflow('resolveTicket'")
		expect(workflowDefinition).toContain('handler: async context => context.input')
		const workflowTest = readFileSync(
			join(harnessDirPath, 'workflow', 'resolveTicket', 'resolveTicketWorkflow.test.ts'),
			'utf-8',
		)
		expect(workflowTest).toContain('runs as a standalone Harness workflow')
		expect(workflowTest).toContain('session.workflows.resolveTicket.run')
		for (const term of forbiddenAgentTerms) {
			expect(harnessDefinition).not.toContain(term)
			expect(triageDefinition).not.toContain(term)
		}
		const agentTestContent = readFileSync(join(harnessDirPath, 'agent', 'triage', 'triageAgent.test.ts'), 'utf-8')
		expect(agentTestContent).toContain("import { FakeModelProvider } from '@purista/harness/testing'")
		expect(agentTestContent).not.toContain('@purista/ai')
		expect(agentTestContent).toContain('runs as a standalone Harness definition')
		expect(agentTestContent).toContain('const provider = new FakeModelProvider({ strict: true })')
		expect(agentTestContent).toContain("content: 'hello'")
		expect(agentTestContent).toContain("model: { provider, model: 'fake' }")
		expect(agentTestContent).toContain('session.agents.triage.run')
		expect(agentTestContent).toContain("expect(outcome.output).toBe('hello')")
		expect(agentTestContent).toContain('await runtime.close()')
		for (const term of forbiddenAgentTerms) {
			expect(agentTestContent).not.toContain(term)
		}
		const packageJsonContent = JSON.parse(readFileSync(join(TEST_DIR, 'package.json'), 'utf-8')) as {
			dependencies?: Record<string, string>
		}
		expect(packageJsonContent.dependencies?.['@purista/ai']).toBeUndefined()
		expect(packageJsonContent.dependencies?.['@purista/harness']).toBe('^4.0.0')

		expect(readdirSync(harnessDirPath).sort()).toEqual(['agent', 'userHarness.ts', 'workflow'])
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

		writeFileSync(
			join(TEST_DIR, 'vitest.config.ts'),
			`export default { test: { include: ['src/service/**/harness/**/*.test.ts', 'src/service/**/command/signUp/*.test.ts', 'src/service/**/subscription/**/*.test.ts'], exclude: [] } }`,
		)
		execFileSync(
			join(REPO_ROOT, 'node_modules', '.bin', 'vitest'),
			['run', '--config', join(TEST_DIR, 'vitest.config.ts')],
			{ cwd: TEST_DIR, stdio: 'inherit' },
		)
		expect(() =>
			execFileSync(
				join(REPO_ROOT, 'node_modules', '.bin', 'tsc'),
				['--noEmit', '-p', join(TEST_DIR, 'tsconfig.json')],
				{
					cwd: TEST_DIR,
					stdio: 'inherit',
				},
			),
		).not.toThrow()
	}, 60_000)
})
