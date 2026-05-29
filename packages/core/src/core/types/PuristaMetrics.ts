import type { PuristaMetricContext, PuristaMetricDefinitions } from '../metrics/types.js'

export type * from '../metrics/types.js'

/** Adds the typed PURISTA metric context to a handler context type. */
export type PuristaMetricContextProperty<Metrics extends PuristaMetricDefinitions> = {
	metrics: PuristaMetricContext<Metrics>
}
