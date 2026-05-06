import type { Service } from '../Service/Service.impl.js'
import type { EmptyObject } from './EmptyObject.js'
import type { ServiceClass } from './ServiceClass.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'

export type ServiceBuilderTypes<
	ConfigType extends {} = EmptyObject,
	ConfigInputType extends {} = EmptyObject,
	Resources extends {} = EmptyObject,
	ServiceClassType extends ServiceClass<ServiceClassTypes<ConfigType, Resources>> = Service<
		ServiceClassTypes<ConfigType, Resources>
	>,
> = {
	ConfigType: ConfigType
	ConfigInputType: ConfigInputType
	Resources: Resources
	ServiceClassType: ServiceClassType
}
