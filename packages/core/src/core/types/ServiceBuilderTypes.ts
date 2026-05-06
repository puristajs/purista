import type { Service } from '../Service/Service.impl.js'
import type { EmptyObject } from './EmptyObject.js'
import type { ServiceClass } from './ServiceClass.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'

export type ServiceBuilderTypes<
	ConfigType extends {} = EmptyObject,
	ConfigInputType extends {} = EmptyObject,
	Resources extends {} = EmptyObject,
	AgentDefinitions extends {} = EmptyObject,
	AiConfig extends {} = EmptyObject,
	ServiceClassType extends ServiceClass<ServiceClassTypes<ConfigType, Resources>> = Service<
		ServiceClassTypes<ConfigType, Resources>
	>,
> = {
	ConfigType: ConfigType
	ConfigInputType: ConfigInputType
	Resources: Resources
	AgentDefinitions: AgentDefinitions
	AiConfig: AiConfig
	ServiceClassType: ServiceClassType
}

export type ExtractAgentModels<AgentDefinitions extends {}> = keyof AgentDefinitions extends never
	? Record<string, never>
	: AgentDefinitions extends { Models: Record<string, unknown> }
		? AgentDefinitions['Models'] extends Record<string, unknown>
			? AgentDefinitions['Models']
			: Record<string, never>
		: Record<string, never>
