import type { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base'

const jaegerExporterOptions = {
	url: 'http://localhost:4318/v1/traces',
} satisfies OTLPExporterNodeConfigBase

export default jaegerExporterOptions
