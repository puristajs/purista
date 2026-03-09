import { DefaultEventBridge, DefaultStateStore, initLogger } from '@purista/core'
import { DockerSandboxDriver, SandboxRegistry, sandboxServiceBuilder } from '@purista/sandbox'

const logger = initLogger()
const eventBridge = new DefaultEventBridge()
const stateStore = new DefaultStateStore({ logger })

const driver = new DockerSandboxDriver({
	imageName: 'purista-sandbox-agent:latest',
	memory: '2g',
})
const registry = new SandboxRegistry(stateStore)

const sandboxService = await sandboxServiceBuilder.getInstance(eventBridge, {
	logger,
	stateStore,
	resources: { driver, registry },
})

await eventBridge.start()
await sandboxService.start()

logger.info('Sandbox service example started')
