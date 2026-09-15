import {
	AggregationTemporality,
	InMemoryMetricExporter,
	MeterProvider,
	PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { ApplicationTelemetry } from './ApplicationTelemetry.js'

export function createTestTelemetry(): ApplicationTelemetry & {
	traceExporter: InMemorySpanExporter
	metricExporter: InMemoryMetricExporter
	forceFlush(): Promise<void>
	destroy(): Promise<void>
} {
	const traceExporter = new InMemorySpanExporter()
	const spanProcessor = new SimpleSpanProcessor(traceExporter)
	const metricExporter = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)
	const meterProvider = new MeterProvider({
		readers: [new PeriodicExportingMetricReader({
			exporter: metricExporter,
			exportIntervalMillis: 60_000,
		})],
	})

	return {
		spanProcessor,
		meter: meterProvider.getMeter('example-bank-test'),
		traceExporter,
		metricExporter,
		forceFlush: async () => {
			await spanProcessor.forceFlush()
			await meterProvider.forceFlush()
		},
		destroy: async () => {
			await spanProcessor.shutdown()
			await meterProvider.shutdown()
		},
	}
}

export function metricNames(exporter: InMemoryMetricExporter): string[] {
	return exporter.getMetrics().flatMap(resource =>
		resource.scopeMetrics.flatMap(scope => scope.metrics.map(metric => metric.descriptor.name)),
	)
}
