import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { Schema } from '../../schema/index.js'

import type { ConfigStore } from '../ConfigStore/types/ConfigStore.js'
import type { EventBridge } from '../EventBridge/types/EventBridge.js'
import type { SecretStore } from '../SecretStore/types/SecretStore.js'
import type { StateStore } from '../StateStore/types/StateStore.js'
import type { CommandDefinitionListResolved } from './commandType/CommandDefinitionList.js'
import type { ServiceInfoType } from './infoType/ServiceInfoType.js'
import type { Logger } from './Logger.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'
import type { StreamDefinitionListResolved } from './stream/StreamDefinitionList.js'
import type { SubscriptionDefinitionListResolved } from './subscription/SubscriptionDefinitionList.js'

/**
 * @group Service
 */
export type ServiceConstructorInput<S extends ServiceClassTypes = ServiceClassTypes> = {
	/** A logger instance */
	logger: Logger
	/** The service info with name, version and description of service */
	info: ServiceInfoType
	/** The eventBridge instance */
	eventBridge: EventBridge
	/** The list of command definitions for this service */
	commandDefinitionList: CommandDefinitionListResolved<any>
	/** The list of subscription definitions for this service */
	subscriptionDefinitionList: SubscriptionDefinitionListResolved<any>
	/** The list of stream definitions for this service */
	streamDefinitionList?: StreamDefinitionListResolved<any>
	/** The service specific config */
	config: S['ConfigType']
	/** The secret store instance */
	secretStore?: SecretStore
	/** The config store instance */
	configStore?: ConfigStore
	/** the state store instance */
	stateStore?: StateStore
	/** The opentelemetry span processor instance */
	spanProcessor?: SpanProcessor
	/** The config validation schema */
	configSchema?: Schema
	resources?: S['Resources']
}
