import type { PuristaMetricContext, PuristaMetricDefinitions } from '../metrics/types.js'

export type * from '../metrics/types.js'

export type PuristaMetricContextProperty<Metrics extends PuristaMetricDefinitions> = {
	metrics: PuristaMetricContext<Metrics>
}
