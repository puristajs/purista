import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { createPuristaCliEngine } from '../engine.js'
import { addPuristaAgent } from './addPuristaAgent.js'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaMcp } from './addPuristaMcp.js'
import { addPuristaQueue } from './addPuristaQueue.js'
import { addPuristaQueueWorker } from './addPuristaQueueWorker.js'
import { addPuristaService } from './addPuristaService.js'
import { addPuristaSkill } from './addPuristaSkill.js'
import { addPuristaStream } from './addPuristaStream.js'
import { addPuristaSubscription } from './addPuristaSubscription.js'
import { addPuristaTool } from './addPuristaTool.js'
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
	writeFileSync(
		join(TEST_DIR, 'purista.json'),
		JSON.stringify({
			servicePath: 'src/service',
			fileConvention: 'camel',
			eventConvention: 'dotCase',
			formatter: 'none',
			linter: 'none',
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

const snapshotFiles = (root: string) => {
	const snapshot: Record<string, string> = {}
	const visit = (directory: string) => {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const path = join(directory, entry.name)
			if (entry.isDirectory()) visit(path)
			else snapshot[relative(root, path)] = readFileSync(path).toString('base64')
		}
	}
	visit(root)
	return snapshot
}

afterEach(() => {
	if (TEST_DIR) {
		rmSync(TEST_DIR, { recursive: true, force: true })
	}
})

describe('CLI artifact generation (e2e)', () => {
	it('preflights authentic projection collisions without treating unrelated source text as a target', async () => {
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
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'run collision',
			agentDescription: 'Existing mounted target',
			modelAlias: 'chat',
		})
		const common = {
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentDescription: 'Projected agent',
			http: 'command' as const,
		}
		const beforeMountedCollision = snapshotFiles(TEST_DIR)
		await expect(addPuristaAgent({ ...common, agentName: 'collision', modelAlias: 'chat' })).rejects.toThrow(
			/Mounted Harness target id/,
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(beforeMountedCollision)

		const serviceDirectory = join(TEST_DIR, 'src', 'service', 'user', 'v1')
		writeFileSync(
			join(serviceDirectory, 'existingProjection.ts'),
			`import { userV1ServiceBuilder as builder } from './userV1ServiceBuilder.js'
const canonical = builder
export const existingProjection = canonical
\t.getCommandBuilder('existingProjection', 'existing projection')
\t.exposeAsHttpEndpoint('POST', 'ai/route-collision')
`,
		)
		const beforeRouteCollision = snapshotFiles(TEST_DIR)
		await expect(addPuristaAgent({ ...common, agentName: 'route collision', modelAlias: 'chat' })).rejects.toThrow(
			/HTTP route/,
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(beforeRouteCollision)

		writeFileSync(
			join(serviceDirectory, 'unrelated.ts'),
			`// builder.getCommandBuilder('runIgnoredCollision').exposeAsHttpEndpoint('POST', 'ai/ignored-collision')
const text = "builder.getCommandBuilder('runIgnoredCollision')"
const helper = { getCommandBuilder: () => ({ exposeAsHttpEndpoint: () => undefined }) }
helper.getCommandBuilder('runIgnoredCollision').exposeAsHttpEndpoint('POST', 'ai/ignored-collision')
void text
`,
		)
		await expect(
			addPuristaAgent({ ...common, agentName: 'ignored collision', modelAlias: 'chat' }),
		).resolves.toMatchObject({
			createdFiles: expect.arrayContaining([
				join(serviceDirectory, 'command', 'runIgnoredCollision', 'runIgnoredCollisionCommandBuilder.ts'),
			]),
		})
	})

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
		writeFileSync(
			join(TEST_DIR, 'src', 'index.ts'),
			"import { userV1Service } from './service/user/v1/userV1Service.js'\nexport const start = async (eventBridge: Parameters<typeof userV1Service.getInstance>[0]) => userV1Service.getInstance(eventBridge)\n",
		)
		writeFileSync(join(TEST_DIR, '.env.example'), 'EXISTING_KEY=\n')
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'triage',
			agentDescription: 'Review tickets',
			modelAlias: 'classification',
		})
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'summarize',
			agentDescription: 'Summarize a ticket',
			http: 'command',
			modelAlias: 'chat',
		})
		await addPuristaAgent({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			agentName: 'chat assistant',
			agentDescription: 'Stream assistant responses',
			http: 'stream',
			modelAlias: 'chat',
		})
		const immutableRootFiles = [
			join(TEST_DIR, 'package.json'),
			join(TEST_DIR, 'src', 'service', 'user', 'v1', 'userV1Service.ts'),
			join(TEST_DIR, 'src', 'service', 'user', 'v1', 'harness', 'userHarness.ts'),
		].map(path => [path, readFileSync(path, 'utf8')] as const)
		await addPuristaTool({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			toolName: 'normalize query',
			toolDescription: 'Normalize a search query',
			kind: 'portable',
		})
		await addPuristaTool({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			toolName: 'load profile',
			toolDescription: 'Load a profile through the owning service',
			kind: 'purista',
		})
		await addPuristaSkill({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			skillName: 'support-policy',
			skillDescription: 'Apply the approved support policy.',
			runtimes: ['node', 'python'],
		})
		await addPuristaMcp({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'user',
			serviceVersion: '1',
			mcpName: 'knowledge base',
			mcpDescription: 'Search the approved knowledge base',
			toolName: 'search knowledge',
			remoteName: 'search_knowledge.v2',
		})
		for (const [path, content] of immutableRootFiles) expect(readFileSync(path, 'utf8')).toBe(content)
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
		expect(triageDefinition).toContain('model: "classification"')
		expect(triageDefinition).toContain('instructions: "Review tickets"')
		const summarizeDefinition = readFileSync(join(harnessDirPath, 'agent', 'summarize', 'summarizeAgent.ts'), 'utf-8')
		expect(summarizeDefinition).toContain("defineAgent('summarize'")
		expect(summarizeDefinition).toContain('model: "chat"')
		expect(summarizeDefinition).toContain('instructions: "Summarize a ticket"')
		expect(existsSync(join(serviceDir, 'command', 'runTriage'))).toBe(false)
		const commandProjection = readFileSync(
			join(serviceDir, 'command', 'runSummarize', 'runSummarizeCommandBuilder.ts'),
			'utf8',
		)
		expect(commandProjection).toContain(".canInvokeAgent('User', '1', summarizeAgent.contract)")
		expect(commandProjection).toContain("context.agent.User['1'][summarizeAgent.contract.id].run")
		expect(commandProjection).toContain(".exposeAsHttpEndpoint('POST', 'ai/summarize')")
		expect(commandProjection).toContain('.enableHttpSecurity(true)')
		expect(commandProjection).toContain('input: z.string(), conversationId: z.string().min(1).optional()')
		expect(commandProjection).toContain("createHash('sha256')")
		expect(commandProjection).toContain('context.message.principalId')
		expect(commandProjection).not.toContain('.makeEndpointPublic()')
		const streamProjection = readFileSync(
			join(serviceDir, 'stream', 'streamChatAssistant', 'streamChatAssistantStreamBuilder.ts'),
			'utf8',
		)
		expect(streamProjection).toContain(
			'parseHarnessUIMessageRequest as (body: unknown, options: { sessionId: string })',
		)
		expect(streamProjection).toContain(".canInvokeAgent('User', '1', chatAssistantAgent.contract)")
		expect(streamProjection).toContain("const target = context.agent.User['1'][chatAssistantAgent.contract.id]")
		expect(streamProjection).toContain(".exposeAsHttpStreamEndpoint('POST', 'ai/chat-assistant')")
		expect(streamProjection).toContain('.enableHttpSecurity(true)')
		expect(streamProjection).toContain('.setHttpStreamProtocol(AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL)')
		expect(streamProjection).toContain('await pipeHarnessUIMessageStream(events, writer, request)')
		expect(streamProjection).not.toContain('.setHttpResponseHeaders(')
		expect(streamProjection).not.toContain('await writer.write(record)')
		expect(streamProjection).not.toContain('writer.onCancel(')
		expect(streamProjection).toContain("createHash('sha256')")
		expect(streamProjection).toContain('await target.stream(input, { sessionId: request.sessionId })')
		expect(streamProjection).not.toContain('resume: request.resume')
		expect(streamProjection).not.toContain('idempotencyKey')
		expect(streamProjection).not.toContain('.makeEndpointPublic()')
		const generatedPackage = JSON.parse(readFileSync(join(TEST_DIR, 'package.json'), 'utf8')) as {
			dependencies: Record<string, string>
		}
		expect(generatedPackage.dependencies).toMatchObject({
			'@purista/harness': '^4.0.0',
			'@purista/harness-openai': '^4.0.0',
			'@purista/harness-ai-sdk-ui': '^4.0.0',
			ai: '^7.0.0',
		})
		expect(readFileSync(join(TEST_DIR, '.env.example'), 'utf8')).toBe('EXISTING_KEY=\nOPENAI_API_KEY=\n')
		const bootstrap = readFileSync(join(TEST_DIR, 'src', 'index.ts'), 'utf8')
		expect(bootstrap).toContain("import { openai } from '@purista/harness-openai'")
		expect(bootstrap).toContain('OPENAI_API_KEY')
		expect(bootstrap).toContain('ai: {')
		expect(bootstrap).toContain('models: {')
		expect(bootstrap.match(/classification:/g)).toHaveLength(1)
		expect(bootstrap.match(/chat:/g)).toHaveLength(1)
		expect(bootstrap).toContain("model: 'gpt-5-mini'")
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
		expect(agentTestContent).toContain("models: { classification: { provider, model: 'fake' } }")
		expect(agentTestContent).toContain('session.agents.triage.run')
		expect(agentTestContent).toContain("expect(outcome.output).toBe('hello')")
		expect(agentTestContent).toContain('await runtime.close()')
		for (const term of forbiddenAgentTerms) {
			expect(agentTestContent).not.toContain(term)
		}
		const portableTool = readFileSync(join(harnessDirPath, 'tool', 'normalizeQuery', 'normalizeQueryTool.ts'), 'utf-8')
		expect(portableTool).toContain("import { defineTool } from '@purista/harness'")
		expect(portableTool).toContain("defineTool('normalizeQuery'")
		expect(portableTool).toContain('handler: async (_context, input) => input')
		const hostTool = readFileSync(join(harnessDirPath, 'tool', 'loadProfile', 'loadProfileTool.ts'), 'utf-8')
		expect(hostTool).toContain("import { userV1ServiceBuilder } from '../../../userV1ServiceBuilder.js'")
		expect(hostTool).toContain("userV1ServiceBuilder.defineTool('loadProfile'")
		expect(hostTool).toContain('.setHandler(async (_context, input) => input)')
		expect(hostTool).not.toContain('defineHostTool')
		const skillDirectory = join(harnessDirPath, 'skill', 'support-policy')
		const skillDefinition = readFileSync(join(skillDirectory, 'supportPolicySkill.ts'), 'utf-8')
		expect(skillDefinition).toContain("defineSkill('support-policy'")
		expect(skillDefinition).toContain("directory: new URL('./', import.meta.url)")
		expect(skillDefinition).toContain("runtimes: ['node', 'python']")
		const skillManifest = readFileSync(join(skillDirectory, 'SKILL.md'), 'utf-8')
		expect(skillManifest).toContain('name: support-policy')
		expect(skillManifest).not.toMatch(/^(scripts?|hash|review|approval)(s|_metadata)?:/im)
		const mcpDefinition = readFileSync(join(harnessDirPath, 'mcp', 'knowledgeBase', 'knowledgeBaseMcp.ts'), 'utf-8')
		expect(mcpDefinition).toContain("defineMcpServer('knowledgeBase'")
		expect(mcpDefinition).toContain('searchKnowledge: {')
		expect(mcpDefinition).toContain('remoteName: "search_knowledge.v2"')
		for (const forbidden of ['url:', 'token:', 'command:', 'environment:', 'env:'])
			expect(mcpDefinition).not.toContain(forbidden)
		for (const leaf of [portableTool, hostTool, skillDefinition, mcpDefinition]) {
			expect(leaf).not.toContain('.addTool(')
			expect(leaf).not.toContain('.addSkill(')
			expect(leaf).not.toContain('.addMcpServer(')
		}
		const packageJsonContent = JSON.parse(readFileSync(join(TEST_DIR, 'package.json'), 'utf-8')) as {
			dependencies?: Record<string, string>
		}
		expect(packageJsonContent.dependencies?.['@purista/ai']).toBeUndefined()
		expect(packageJsonContent.dependencies?.['@purista/harness']).toBe('^4.0.0')
		const cliPackageJson = JSON.parse(readFileSync(join(CLI_PACKAGE_ROOT, 'package.json'), 'utf8')) as {
			devDependencies?: Record<string, string>
			dependencies?: Record<string, string>
		}
		expect(cliPackageJson.devDependencies?.['@purista/harness']).toBe('^4.0.0')
		expect(cliPackageJson.dependencies?.['@purista/harness']).toBeUndefined()

		expect(readdirSync(harnessDirPath).sort()).toEqual(['agent', 'mcp', 'skill', 'tool', 'userHarness.ts', 'workflow'])
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
			`export default { test: { include: ['src/service/**/harness/**/*.test.ts', 'src/service/**/command/signUp/*.test.ts', 'src/service/**/command/run*/*.test.ts', 'src/service/**/stream/stream*/*.test.ts', 'src/service/**/subscription/**/*.test.ts'], exclude: [] } }`,
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

	it('resolves mandatory leaf inputs in interactive mode and rejects them non-interactively', async () => {
		createBaseProject()
		const puristaConfig = puristaConfigSchema.parse(JSON.parse(readFileSync(join(TEST_DIR, 'purista.json'), 'utf8')))
		let project = await scanPuristaProject(puristaConfig, TEST_DIR)
		await addPuristaService({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'support',
			serviceDescription: 'Support',
		})
		project = await scanPuristaProject(puristaConfig, TEST_DIR)
		const input = { serviceName: 'support', serviceVersion: '1', name: 'lookup', description: 'Lookup' }
		const before = snapshotFiles(TEST_DIR)
		const nonInteractive = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await expect(nonInteractive.runPuristaCommand('add-tool', input)).rejects.toThrow(
			'Missing required value for "kind"',
		)
		await expect(
			nonInteractive.runPuristaCommand('add-mcp', { ...input, name: 'knowledge', toolName: 'search' }),
		).rejects.toThrow('Missing required value for "remoteName"')
		await expect(
			nonInteractive.runPuristaCommand('add-mcp', {
				...input,
				name: 'knowledge',
				remoteName: 'search_remote',
			}),
		).rejects.toThrow('Missing required value for "toolName"')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		const interactive = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'interactive',
			prompt: {
				input: async request => {
					throw new Error(`Unexpected input prompt: ${request.key}`)
				},
				confirm: async request => {
					throw new Error(`Unexpected confirm prompt: ${request.key}`)
				},
				select: async request => (request.key === 'kind' ? 'portable' : ''),
			},
		})
		const result = await interactive.runPuristaCommand('add-tool', input)
		expect(result.ok).toBe(true)
		expect(result.warnings[0]).toContain("include lookupTool in that definition's tools array")
		const interactiveMcp = createPuristaCliEngine({
			cwd: TEST_DIR,
			mode: 'interactive',
			prompt: {
				input: async request => {
					if (request.key === 'toolName') return 'search'
					if (request.key === 'remoteName') return 'Search::Remote/v1'
					throw new Error(`Unexpected input prompt: ${request.key}`)
				},
				confirm: async request => {
					throw new Error(`Unexpected confirm prompt: ${request.key}`)
				},
				select: async request => {
					throw new Error(`Unexpected select prompt: ${request.key}`)
				},
			},
		})
		await expect(interactiveMcp.runPuristaCommand('add-mcp', { ...input, name: 'knowledge' })).resolves.toMatchObject({
			ok: true,
		})
	})

	it('preserves repeatable Skill runtimes and exact MCP remote names', async () => {
		createBaseProject()
		const configInput = JSON.parse(readFileSync(join(TEST_DIR, 'purista.json'), 'utf8'))
		configInput.fileConvention = 'kebab'
		writeFileSync(join(TEST_DIR, 'purista.json'), JSON.stringify(configInput))
		const puristaConfig = puristaConfigSchema.parse(JSON.parse(readFileSync(join(TEST_DIR, 'purista.json'), 'utf8')))
		let project = await scanPuristaProject(puristaConfig, TEST_DIR)
		await addPuristaService({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'support',
			serviceDescription: 'Support',
		})
		project = await scanPuristaProject(puristaConfig, TEST_DIR)
		const engine = createPuristaCliEngine({ cwd: TEST_DIR, mode: 'non-interactive' })
		await engine.runPuristaCommand('add-skill', {
			serviceName: 'support',
			serviceVersion: '1',
			name: 'incident-review',
			description: 'Review incidents.',
			runtimes: ['shell', 'python'],
		})
		await engine.runPuristaCommand('add-mcp', {
			serviceName: 'support',
			serviceVersion: '1',
			name: 'knowledge',
			description: 'Search knowledge.',
			toolName: 'search',
			remoteName: 'Search::Knowledge/v2',
		})
		const root = join(TEST_DIR, 'src/service/support/v1/harness')
		expect(readFileSync(join(root, 'skill/incident-review/incident-review-skill.ts'), 'utf8')).toContain(
			"runtimes: ['shell', 'python']",
		)
		expect(readFileSync(join(root, 'mcp/knowledge/knowledge-mcp.ts'), 'utf8')).toContain(
			'remoteName: "Search::Knowledge/v2"',
		)
	})

	it('refuses duplicates, traversal, casing collisions, and ambiguous ids before writing', async () => {
		createBaseProject()
		const puristaConfig = puristaConfigSchema.parse(JSON.parse(readFileSync(join(TEST_DIR, 'purista.json'), 'utf8')))
		let project = await scanPuristaProject(puristaConfig, TEST_DIR)
		await addPuristaService({
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'support',
			serviceDescription: 'Support',
		})
		project = await scanPuristaProject(puristaConfig, TEST_DIR)
		const common = {
			projectRootPath: TEST_DIR,
			puristaConfig,
			puristaProject: project,
			serviceName: 'support',
			serviceVersion: '1',
		}
		mkdirSync(join(TEST_DIR, 'src/service/support/v1/harness'), { recursive: true })
		writeFileSync(
			join(TEST_DIR, 'src/service/support/v1/harness/unrelatedFactories.ts'),
			"const helper = { defineTool: (id: string) => id, defineSkill: (id: string) => id, defineMcpServer: (id: string) => id }\nconst { defineTool, defineSkill, defineMcpServer } = helper\nexport const unrelatedTool = helper.defineTool('unrelated')\nexport const unrelatedSkill = helper.defineSkill('unrelated-skill')\nexport const unrelatedMcp = helper.defineMcpServer('unrelatedMcp')\nexport const unrelatedDetached = [defineTool('anotherTool'), defineSkill('another-skill'), defineMcpServer('anotherMcp')]\n",
		)
		await addPuristaTool({
			...common,
			toolName: 'unrelated',
			toolDescription: 'An unrelated same-name method is not a Harness definition.',
			kind: 'portable',
		})
		await addPuristaSkill({
			...common,
			skillName: 'unrelated-skill',
			skillDescription: 'An unrelated same-name method is not a Harness definition.',
		})
		await addPuristaMcp({
			...common,
			mcpName: 'unrelated mcp',
			mcpDescription: 'An unrelated same-name method is not a Harness definition.',
			toolName: 'search',
			remoteName: 'search_remote',
		})
		await addPuristaTool({ ...common, toolName: 'lookup', toolDescription: 'Lookup', kind: 'portable' })
		await addPuristaTool({
			...common,
			toolName: 'constructor',
			toolDescription: 'An inherited object key is not a built-in.',
			kind: 'portable',
		})
		await addPuristaSkill({ ...common, skillName: 'lookup', skillDescription: 'Cross-family reuse is valid.' })
		await addPuristaMcp({
			...common,
			mcpName: 'knowledge',
			mcpDescription: 'Search',
			toolName: 'lookup',
			remoteName: 'lookup_remote',
		})
		await addPuristaMcp({
			...common,
			mcpName: 'documentation',
			mcpDescription: 'Search docs',
			toolName: 'lookup',
			remoteName: 'lookup_docs',
		})
		let before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({ ...common, toolName: 'lookup', toolDescription: 'Duplicate', kind: 'purista' }),
		).rejects.toThrow('already exists')
		await expect(
			addPuristaMcp({
				...common,
				mcpName: 'knowledge',
				mcpDescription: 'Duplicate server',
				toolName: 'differentTool',
				remoteName: 'different_remote',
			}),
		).rejects.toThrow('already exists')
		await expect(
			addPuristaSkill({
				...common,
				skillName: 'duplicate-runtime',
				skillDescription: 'Invalid',
				runtimes: ['node', 'node'],
			}),
		).rejects.toThrow('must not contain duplicates')
		await expect(
			addPuristaMcp({
				...common,
				mcpName: 'spaced-remote',
				mcpDescription: 'Invalid',
				toolName: 'search',
				remoteName: ' remote_search ',
			}),
		).rejects.toThrow('provided exactly')
		await expect(
			addPuristaTool({ ...common, toolName: '../escape', toolDescription: 'Invalid', kind: 'portable' }),
		).rejects.toThrow('path separators')
		await expect(
			addPuristaTool({ ...common, toolName: 'bash', toolDescription: 'Collision', kind: 'portable' }),
		).rejects.toThrow('canonical Harness built-in tool')
		await expect(addPuristaSkill({ ...common, skillName: 'read', skillDescription: 'Collision' })).rejects.toThrow(
			'canonical Harness built-in tool',
		)
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		writeFileSync(
			join(TEST_DIR, 'src/service/support/v1/harness/authenticAlias.ts'),
			"import { defineTool as makeTool } from '@purista/harness'\nimport { z } from 'zod'\nexport const aliasCollision = makeTool('aliasCollision', { description: 'x', input: z.string(), output: z.string(), async handler(_context, input) { return input } })\n",
		)
		before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({
				...common,
				toolName: 'alias collision',
				toolDescription: 'Authentic imported aliases must collide.',
				kind: 'portable',
			}),
		).rejects.toThrow('Definition id "aliasCollision" already exists')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		writeFileSync(
			join(TEST_DIR, 'src/service/support/v1/harness/authenticHost.ts'),
			"import { z } from 'zod'\nimport { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'\nexport const hostCollision = supportV1ServiceBuilder.defineTool('hostCollision', { description: 'x', input: z.string(), output: z.string() }).setHandler(async (_context, input) => input)\n",
		)
		before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({
				...common,
				toolName: 'host collision',
				toolDescription: 'Authentic ServiceBuilder definitions must collide.',
				kind: 'portable',
			}),
		).rejects.toThrow('Definition id "hostCollision" already exists')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		mkdirSync(join(TEST_DIR, 'src/service/support/v1/harness/tool/CASEONLY'), { recursive: true })
		before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({ ...common, toolName: 'case only', toolDescription: 'Collision', kind: 'portable' }),
		).rejects.toThrow('differs only by casing')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		const maliciousProject = structuredClone(project)
		maliciousProject.services.support['1'].serviceFile = '../../../../outside.ts'
		before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({
				...common,
				puristaProject: maliciousProject,
				toolName: 'safe name',
				toolDescription: 'Invalid path',
				kind: 'portable',
			}),
		).rejects.toThrow('outside the project')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)

		writeFileSync(
			join(TEST_DIR, 'src/service/support/v1/harness/tool/unresolvedTool.ts'),
			"import { defineTool } from '@purista/harness'\nimport { z } from 'zod'\nlet id = 'dynamic'\nexport const unresolved = defineTool(id, { description: 'x', input: z.string(), output: z.string(), async handler(_context, input) { return input } })\n",
		)
		before = snapshotFiles(TEST_DIR)
		await expect(
			addPuristaTool({ ...common, toolName: 'safe name', toolDescription: 'Safe', kind: 'portable' }),
		).rejects.toThrow('Cannot statically prove the defineTool definition id')
		expect(snapshotFiles(TEST_DIR)).toEqual(before)
	})
})
