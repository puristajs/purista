import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

import { jaegerExporterOptions } from './config/jaegerConfig.js'
import { teletraceExporterOptions } from './config/teletrace.js'
import { uptraceConfig } from './config/uptraceConfig.js'
import { zipkinExporterOptions } from './config/zipkinConfig.js'

/**
 * Create and get a new OpenTelemetry exporter
 * @returns OpenTelemetry exporter instance
 */
export const getJaegerExporter = () => {
  const exporter = new OTLPTraceExporter(jaegerExporterOptions)

  return new SimpleSpanProcessor(exporter)
}

export const getTeletraceExporter = () => {
  const exporter = new OTLPTraceExporter(teletraceExporterOptions)

  return new SimpleSpanProcessor(exporter)
}

export const getZipkinExporter = () => {
  const exporter = new ZipkinExporter(zipkinExporterOptions)

  return new SimpleSpanProcessor(exporter)
}

export const getConsoleSpanExporter = () => {
  const exporter = new ConsoleSpanExporter()

  return new SimpleSpanProcessor(exporter)
}

export const uptraceTraceExporter = () => {
  const exporter = new OTLPTraceExporter(uptraceConfig)

  return new SimpleSpanProcessor(exporter)
}
