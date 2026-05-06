import {
	AppleContainerSandboxDriver,
	assertSandboxRuntimeAvailable,
	createInlineSkillResource,
	createPuristaSandboxProvider,
	DockerSandboxDriver,
	SandboxRegistry,
	sandboxServiceBuilder,
	seedSandboxSkills,
	toSandboxSkillPath,
} from '@purista/ai'
import { DefaultEventBridge, DefaultStateStore, initLogger } from '@purista/core'

const logger = initLogger()
const eventBridge = new DefaultEventBridge({
	logger,
	defaultCommandTimeout: 60_000,
})
const stateStore = new DefaultStateStore({ logger })

const imageName = process.env.PURISTA_SANDBOX_IMAGE?.trim() || 'purista-sandbox-agent:latest'
const driver =
	process.platform === 'darwin'
		? new AppleContainerSandboxDriver({
				imageName,
				memory: '2g',
			})
		: new DockerSandboxDriver({
				imageName,
				memory: '2g',
			})
const registry = new SandboxRegistry(stateStore)

await assertSandboxRuntimeAvailable(driver)

const sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
	logger,
	stateStore,
	resources: { driver, registry },
})

await eventBridge.start()
await sandboxService.start()

const provider = createPuristaSandboxProvider(eventBridge)
const subject = {
	tenantId: 'example-tenant',
	principalId: 'example-user',
	projectId: 'example-project',
}

const sharedDescriptor = await provider.ensureSandbox({
	subject,
})
const sharedReused = await provider.ensureSandbox({
	subject,
})
const scopedDescriptor = await provider.ensureSandbox({
	subject,
	scope: { kind: 'agent-run', key: 'example-run-2' },
})

const adapter = provider.createAdapter({ descriptor: sharedDescriptor })
const skillResource = createInlineSkillResource({
	'sandbox-demo': {
		content: '# sandbox demo skill\n',
		scripts: {
			'echo.sh': '#!/usr/bin/env sh\necho sandbox-skill-ok\n',
		},
		references: {
			'guide.md': 'sandbox skill reference\n',
		},
	},
})

await adapter.writeFiles([
	{
		path: '/workspace/repo/hello.txt',
		content: 'hello from @purista/ai\n',
	},
])
const seededSkills = await seedSandboxSkills({
	adapter,
	skillResource,
})

const fileContent = await adapter.readFile('/workspace/repo/hello.txt')
const skillContent = await adapter.readFile(toSandboxSkillPath('sandbox-demo', 'SKILL.md'))
const skillReference = await adapter.readFile(toSandboxSkillPath('sandbox-demo', 'references/guide.md'))
const commandResult = await adapter.executeCommand('pwd && cat /workspace/repo/hello.txt', { cwd: '/workspace' })
const skillScriptResult = await adapter.executeCommand('sh /workspace/skills/sandbox-demo/scripts/echo.sh', {
	cwd: '/workspace',
})

logger.info(
	{
		driver: driver.name,
		imageName,
		sharedSandboxId: sharedDescriptor.sandboxId,
		reusedSharedSandboxId: sharedReused.sandboxId,
		scopedSandboxId: scopedDescriptor.sandboxId,
		sharedWasReused: !sharedReused.created,
		scopedIsDifferent: scopedDescriptor.sandboxId !== sharedDescriptor.sandboxId,
		fileContent,
		seededSkills,
		skillContent,
		skillReference,
		commandResult,
		skillScriptResult,
	},
	'Exercised the sandbox provider and adapter runtime',
)

await provider.destroySandbox?.({ descriptor: scopedDescriptor })
await provider.destroySandbox?.({ descriptor: sharedDescriptor })
await sandboxService.destroy()
await eventBridge.destroy()
