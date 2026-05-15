import type { PuristaMetricsRecorder } from './types.js'

/**
 * Creates a recorder that intentionally drops all metrics.
 *
 * @example
 * ```ts
 * const recorder = createNoopMetricsRecorder()
 * recorder.recordFrameworkMetric('purista.command.executions', 1)
 * ```
 */
export const createNoopMetricsRecorder = (): PuristaMetricsRecorder => ({
	recordFrameworkMetric: () => {},
	recordCustomMetric: () => {},
})
