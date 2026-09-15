import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { ApplicationTelemetry } from './ApplicationTelemetry.js'

export interface ManagedTelemetry extends ApplicationTelemetry {
	name: string
	forceFlush(): Promise<void>
	destroy(): Promise<void>
}

export function createOtlpTelemetry(baseUrl: string): ManagedTelemetry {
	const endpoint = baseUrl.replace(/\/$/, '')
	const spanProcessor = new SimpleSpanProcessor(new OTLPTraceExporter({
		url: `${endpoint}/v1/traces`,
	}))
	const meterProvider = new MeterProvider({
		readers: [new PeriodicExportingMetricReader({
			exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
			exportIntervalMillis: 5_000,
		})],
	})

	return {
		name: 'OpenTelemetry exporters',
		spanProcessor,
		meter: meterProvider.getMeter('example-bank'),
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

export function createTelemetryFromEnvironment(): ManagedTelemetry | undefined {
	const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
	return endpoint ? createOtlpTelemetry(endpoint) : undefined
}
