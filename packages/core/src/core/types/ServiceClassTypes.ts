import type { EmptyObject } from './EmptyObject.js'
import type { PuristaMetricDefinitions } from './PuristaMetrics.js'

export type ServiceClassTypes<
	ConfigType extends EmptyObject = EmptyObject,
	Resources = EmptyObject,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	ConfigType: ConfigType
	Resources: Resources
	Metrics: Metrics
}
