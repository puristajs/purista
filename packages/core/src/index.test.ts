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
		'createArchitectureManifest',
		'exportCloudEventsSchema',
		'exportScheduleManifest',
		'exportServiceDefinitions',
		'extendApi',
		'fromCloudEvent',
		'getNewInstanceId',
		'getNewTraceId',
		'gracefulShutdown',
		'initLogger',
		'isCustomMessage',
		'toCloudEvent',
		'toJSONSchema',
		'validate',
		'validateArchitectureManifest',
	])
	expect(testing.createCommandTestHarness).toBeDefined()
	expect(testing.getEventBridgeMock).toBeDefined()
	expect(client.ClientBuilder).toBeDefined()
	expect(client.HttpClient).toBeDefined()
	expect(adapter.EventBridgeBaseClass).toBeDefined()
})
