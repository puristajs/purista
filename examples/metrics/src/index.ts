import { metrics } from '@opentelemetry/api'
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { DefaultEventBridge, gracefulShutdown, initLogger, ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { z } from 'zod'

const logger = initLogger('debug')

const meterProvider = new MeterProvider({
	readers: [
		new PeriodicExportingMetricReader({
			exporter: new ConsoleMetricExporter(),
			exportIntervalMillis: 1000,
		}),
	],
})

metrics.setGlobalMeterProvider(meterProvider)
const meter = meterProvider.getMeter('purista.metrics.example')

const metricsServiceInfo = {
	serviceName: 'MetricsExample',
	serviceVersion: '1',
	serviceDescription: 'Minimal custom metrics example',
} as const satisfies ServiceInfoType

const metricAttributesSchema = z.object({
	channel: z.enum(['local']),
})

const inputSchema = z.object({
	amount: z.number().positive(),
})

const outputSchema = z.object({
	accepted: z.boolean(),
})

const metricsServiceBuilder = new ServiceBuilder(metricsServiceInfo)
	.defineMetric('app.metricsexample.requests', {
		kind: 'counter',
		unit: '{request}',
		description: 'Requests handled by the metrics example',
		attributes: metricAttributesSchema,
	})
	.defineMetric('app.metricsexample.processing.duration', {
		kind: 'histogram',
		unit: 'ms',
		description: 'Processing duration for the metrics example command',
		attributes: metricAttributesSchema,
	})

const recordPaymentCommandBuilder = metricsServiceBuilder
	.getCommandBuilder('recordPayment', 'Records a local payment and emits custom metrics')
	.addPayloadSchema(inputSchema)
	.addOutputSchema(outputSchema)
	.setCommandFunction(async context => {
		const started = Date.now()

		context.metrics['app.metricsexample.requests'].add(1, { channel: 'local' })

		try {
			return { accepted: true }
		} finally {
			context.metrics['app.metricsexample.processing.duration'].record(Date.now() - started, { channel: 'local' })
		}
	})

const metricsServiceDefinition = metricsServiceBuilder.addCommandDefinition(recordPaymentCommandBuilder.getDefinition())

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await metricsServiceDefinition.getInstance(eventBridge, {
	logger,
	metrics: { meter },
})
await service.start()

logger.info('metrics example ready; invoke recordPayment to emit custom metrics')

gracefulShutdown(logger, [
	service,
	eventBridge,
	{
		name: 'OTelMeterProvider',
		destroy: () => meterProvider.shutdown(),
	},
])
