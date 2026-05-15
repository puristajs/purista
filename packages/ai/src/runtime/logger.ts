import { context, trace } from '@opentelemetry/api'
import type { Logger as PuristaLogger } from '@purista/core'
import type { Logger as HarnessLogger } from '@purista/harness'

type Level = 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn'

export function createPuristaHarnessLogger(logger?: PuristaLogger): HarnessLogger {
	const fallback = new NoopHarnessLogger()
	if (!logger) {
		return fallback
	}

	return {
		trace: (msg, fields) => write(logger, 'trace', msg, fields),
		debug: (msg, fields) => write(logger, 'debug', msg, fields),
		info: (msg, fields) => write(logger, 'info', msg, fields),
		warn: (msg, fields) => write(logger, 'warn', msg, fields),
		error: (msg, fields) => write(logger, 'error', msg, fields),
		fatal: (msg, fields) => write(logger, 'fatal', msg, fields),
		child(bindings) {
			return createPuristaHarnessLogger(logger.getChildLogger({ module: stringifyBindings(bindings) }))
		},
	}
}

function write(logger: PuristaLogger, level: Level, msg: string, fields?: Record<string, unknown>) {
	const logFields = createPuristaLogFields(fields)
	if (Object.keys(logFields).length > 0) {
		logger[level](logFields, msg)
		return
	}
	logger[level](msg)
}

function createPuristaLogFields(fields?: Record<string, unknown>) {
	const spanContext = trace.getSpan(context.active())?.spanContext() ?? trace.getSpanContext(context.active())
	const result: Record<string, unknown> = {}

	if (spanContext?.traceId) {
		result.traceId = spanContext.traceId
	}
	if (spanContext?.spanId) {
		result.spanId = spanContext.spanId
	}
	if (spanContext?.traceFlags !== undefined) {
		result.traceFlags = spanContext.traceFlags
	}

	for (const [key, value] of Object.entries(fields ?? {})) {
		result[normalizeHarnessLogFieldName(key)] = value
	}

	return result
}

function normalizeHarnessLogFieldName(key: string) {
	if (key === 'trace_id') {
		return 'traceId'
	}
	if (key === 'span_id') {
		return 'spanId'
	}
	if (key === 'trace_flags') {
		return 'traceFlags'
	}
	return key
}

function stringifyBindings(bindings: Record<string, unknown>) {
	return Object.entries(bindings)
		.map(([key, value]) => `${key}:${String(value)}`)
		.join(',')
}

class NoopHarnessLogger implements HarnessLogger {
	trace(): void {}
	debug(): void {}
	info(): void {}
	warn(): void {}
	error(): void {}
	fatal(): void {}
	child(): HarnessLogger {
		return this
	}
}
