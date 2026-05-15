import type { EmptyObject } from './EmptyObject.js'
import type { PuristaMetricDefinitions } from './PuristaMetrics.js'
import type { ServiceClass } from './ServiceClass.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'

export type ServiceClassMetrics<S extends ServiceClass> = S extends { readonly __serviceClassTypes?: infer Types }
	? Types extends ServiceClassTypes<any, any, infer Metrics>
		? Metrics extends PuristaMetricDefinitions
			? Metrics
			: EmptyObject
		: EmptyObject
	: EmptyObject
