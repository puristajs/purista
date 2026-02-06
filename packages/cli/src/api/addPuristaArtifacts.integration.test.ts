import { execSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { addPuristaCommand } from './addPuristaCommand.js'
import { addPuristaService } from './addPuristaService.js'
import { addPuristaSubscription } from './addPuristaSubscription.js'
import { puristaConfigSchema } from './loadPuristaConfig.js'
import { scanPuristaProject } from './scanPuristaProject.js'

let TEST_DIR = ''

const createBaseProject = () => {
	const coreDtsPath = join(process.cwd(), '..', 'core', 'dist', 'esm', 'index.d.ts')
	const coreGlobPath = join(process.cwd(), '..', 'core', 'dist', 'esm', '*')
	TEST_DIR = mkdtempSync(join(process.cwd(), 'node_modules', 'tmp-e2e-'))
	writeFileSync(
		join(TEST_DIR, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				target: 'ES2022',
				module: 'NodeNext',
				moduleResolution: 'NodeNext',
				skipLibCheck: true,
				baseUrl: '.',
				paths: {
					'@purista/core': [coreDtsPath],
					'@purista/core/*': [coreGlobPath],
				},
			},
			include: ['src/**/*.ts'],
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
	it('creates service, command, and subscription with valid wiring', async () => {
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

		const serviceDir = join(TEST_DIR, 'src', 'service', 'user', 'v1')
		const serviceFile = join(serviceDir, 'userV1Service.ts')
		const builderFile = join(serviceDir, 'userV1ServiceBuilder.ts')
		const commandDir = join(serviceDir, 'command', 'signUp')
		const subscriptionDir = join(serviceDir, 'subscription', 'sendWelcomeEmail')

		expect(readFileSync(builderFile, 'utf-8')).toContain('new ServiceBuilder')
		const serviceFileContent = readFileSync(serviceFile, 'utf-8')
		expect(serviceFileContent).toContain('commandDefinitions')
		expect(serviceFileContent).toContain('subscriptionDefinitions')
		expect(serviceFileContent).toContain("Parameters<typeof userV1ServiceBuilder['addCommandDefinition']>[0][] =")
		expect(serviceFileContent).toContain("Parameters<typeof userV1ServiceBuilder['addSubscriptionDefinition']>[0][] =")
		expect(serviceFileContent).toContain('signUpCommandBuilder.getDefinition()')
		expect(serviceFileContent).toContain('sendWelcomeEmailSubscriptionBuilder.getDefinition()')

		const commandSchema = readFileSync(join(commandDir, 'schema.ts'), 'utf-8')
		expect(commandSchema).toContain('userV1SignUpInputParameterSchema')
		expect(commandSchema).toContain('userV1SignUpInputPayloadSchema')
		expect(commandSchema).toContain('userV1SignUpOutputPayloadSchema')
		const commandTypes = readFileSync(join(commandDir, 'types.ts'), 'utf-8')
		expect(commandTypes).toContain('UserV1SignUpInputParameter')
		expect(commandTypes).toContain('UserV1SignUpInputPayload')
		expect(commandTypes).toContain('UserV1SignUpOutputPayload')
		expect(readFileSync(join(commandDir, 'signUpCommandBuilder.ts'), 'utf-8')).toContain('signUpCommandBuilder')

		const subscriptionSchema = readFileSync(join(subscriptionDir, 'schema.ts'), 'utf-8')
		expect(subscriptionSchema).toContain('userV1SendWelcomeEmailInputPayloadSchema')
		expect(subscriptionSchema).toContain('userV1SendWelcomeEmailOutputPayloadSchema')
		const subscriptionTypes = readFileSync(join(subscriptionDir, 'types.ts'), 'utf-8')
		expect(subscriptionTypes).toContain('UserV1SendWelcomeEmailInputPayload')
		expect(subscriptionTypes).toContain('UserV1SendWelcomeEmailOutputPayload')
		expect(readFileSync(join(subscriptionDir, 'sendWelcomeEmailSubscriptionBuilder.ts'), 'utf-8')).toContain(
			'sendWelcomeEmailSubscriptionBuilder',
		)

		try {
			execSync('npm run build -w @purista/core', {
				cwd: process.cwd(),
				stdio: 'pipe',
			})
			execSync(`npx tsc --noEmit -p "${join(TEST_DIR, 'tsconfig.json')}"`, {
				cwd: process.cwd(),
				stdio: 'pipe',
			})
		} catch (error) {
			if (error instanceof Error) {
				const err = error as Error & { stdout?: Buffer; stderr?: Buffer }
				const stdout = err.stdout?.toString().trim()
				const stderr = err.stderr?.toString().trim()
				const details = [stdout, stderr].filter(Boolean).join('\n')
				throw new Error(`Type-check failed: ${error.message}${details ? `\n${details}` : ''}`)
			}
			throw error
		}
	})
})
