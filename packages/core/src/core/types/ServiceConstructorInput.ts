import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { Schema } from '@typeschema/main'

import type { ConfigStore } from '../ConfigStore/index.js'
import type { EventBridge } from '../EventBridge/index.js'
import type { SecretStore } from '../SecretStore/index.js'
import type { StateStore } from '../StateStore/index.js'
import type { Logger } from './Logger.js'
import type { CommandDefinitionListResolved } from './commandType/index.js'
import type { ServiceInfoType } from './infoType/index.js'
import type { SubscriptionDefinitionListResolved } from './subscription/index.js'

/**
 * @group Service
 */
export type ServiceConstructorInput<ConfigType extends {}, Resources extends {}> = {
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
	/** The service specific config */
	config: ConfigType
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
	resources?: Resources
}
