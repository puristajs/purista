import * as adapter from './adapter/index.js'
import * as client from './client/index.js'
import * as core from './index.js'
import * as testing from './testing/index.js'

it('keeps the application root builder-focused and exposes expert APIs by subpath', () => {
	expect(Object.keys(core).sort()).toEqual([
		'AgentQueueBuilder',
		'AgentRunError',
		'CommandDefinitionBuilder',
		'DefaultConfigStore',
		'DefaultEventBridge',
		'DefaultLogger',
		'DefaultQueueBridge',
		'DefaultSchedulerProvider',
		'DefaultSecretStore',
		'DefaultStateStore',
		'EBMessageType',
		'HandledError',
		'PuristaSpanName',
		'PuristaSpanTag',
		'QueueDefinitionBuilder',
		'QueueWorkerBuilder',
		'ScheduleDefinitionBuilder',
		'SchedulerBuilder',
		'SchedulerRuntime',
		'Service',
		'ServiceBuilder',
		'StatusCode',
		'StreamDefinitionBuilder',
		'SubscriptionDefinitionBuilder',
		'UnhandledError',
		'compareArchitectureManifests',
		'createArchitectureContext',
		'createArchitectureManifest',
		'exportCloudEventsSchema',
		'exportScheduleManifest',
		'exportServiceDefinitions',
		'extendApi',
		'fromCloudEvent',
		'getArchitectureManifestDigest',
		'getNewInstanceId',
		'getNewTraceId',
		'gracefulShutdown',
		'initLogger',
		'isCustomMessage',
		'renderArchitectureContextMarkdown',
		'toCloudEvent',
		'toJSONSchema',
		'validate',
		'validateArchitectureComposition',
		'validateArchitectureManifest',
	])
	expect(testing.createCommandTestHarness).toBeDefined()
	expect(testing.getEventBridgeMock).toBeDefined()
	expect(client.ClientBuilder).toBeDefined()
	expect(client.HttpClient).toBeDefined()
	expect(adapter.EventBridgeBaseClass).toBeDefined()
})
