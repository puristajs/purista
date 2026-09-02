import type { HarnessDefinition } from '@purista/harness'
import type { Service } from '../Service/Service.impl.js'
import type { EmptyObject } from './EmptyObject.js'
import type { PuristaMetricDefinitions } from './PuristaMetrics.js'
import type { ServiceClass } from './ServiceClass.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'

export type ServiceBuilderTypes<
	ConfigType extends {} = EmptyObject,
	ConfigInputType extends {} = EmptyObject,
	Resources extends {} = EmptyObject,
	ServiceClassType extends ServiceClass<any> = Service<ServiceClassTypes<ConfigType, Resources>>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
	Harnesses extends readonly HarnessDefinition<any>[] = readonly [],
> = {
	ConfigType: ConfigType
	ConfigInputType: ConfigInputType
	Resources: Resources
	ServiceClassType: ServiceClassType
	Metrics: Metrics
	Harnesses: Harnesses
}
