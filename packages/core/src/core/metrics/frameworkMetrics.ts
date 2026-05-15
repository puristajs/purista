import type { PuristaMetricDefinition, PuristaMetricDefinitions } from './types.js'

const metric = (kind: PuristaMetricDefinition['kind'], unit: string, description: string): PuristaMetricDefinition => ({
	kind,
	unit,
	description,
})

/**
 * PURISTA framework metric catalog.
 *
 * @example
 * ```ts
 * const commandCounter = frameworkMetricDefinitions['purista.command.executions']
 * ```
 */
export const frameworkMetricDefinitions = {
	'purista.command.executions': metric('counter', '{execution}', 'Command executions'),
	'purista.command.duration': metric('histogram', 'ms', 'Command duration'),
	'purista.subscription.executions': metric('counter', '{execution}', 'Subscription executions'),
	'purista.subscription.duration': metric('histogram', 'ms', 'Subscription duration'),
	'purista.stream.executions': metric('counter', '{execution}', 'Stream executions'),
	'purista.stream.duration': metric('histogram', 'ms', 'Stream duration'),
	'purista.stream.frames': metric('counter', '{frame}', 'Stream frames'),
	'purista.stream.active': metric('upDownCounter', '{stream}', 'Active streams'),
	'purista.queue.jobs': metric('upDownCounter', '{job}', 'Queue jobs'),
	'purista.queue.oldest_job_age': metric('histogram', 'ms', 'Oldest queue job age'),
	'purista.queue.operation.duration': metric('histogram', 'ms', 'Queue operation duration'),
	'purista.queue.worker.executions': metric('counter', '{execution}', 'Queue worker executions'),
	'purista.queue.worker.duration': metric('histogram', 'ms', 'Queue worker duration'),
	'purista.store.operation.duration': metric('histogram', 'ms', 'Store operation duration'),
	'purista.store.operations': metric('counter', '{operation}', 'Store operations'),
	'purista.resource.init.duration': metric('histogram', 'ms', 'Resource initialization duration'),
	'purista.resource.active': metric('upDownCounter', '{resource}', 'Active resources'),
	'purista.bridge.operation.duration': metric('histogram', 'ms', 'Bridge operation duration'),
	'purista.bridge.messages': metric('counter', '{message}', 'Bridge messages'),
	'http.server.request.duration': metric('histogram', 's', 'HTTP server request duration'),
	'http.server.active_requests': metric('upDownCounter', '{request}', 'Active HTTP server requests'),
	'http.client.request.duration': metric('histogram', 's', 'HTTP client request duration'),
	'messaging.client.operation.duration': metric('histogram', 's', 'Messaging client operation duration'),
	'messaging.client.sent.messages': metric('counter', '{message}', 'Messaging client sent messages'),
	'messaging.client.consumed.messages': metric('counter', '{message}', 'Messaging client consumed messages'),
	'messaging.process.duration': metric('histogram', 's', 'Messaging process duration'),
	'purista.agent.runs': metric('counter', '{run}', 'Agent runs'),
	'purista.agent.run.duration': metric('histogram', 'ms', 'Agent run duration'),
	'purista.agent.active': metric('upDownCounter', '{run}', 'Active agent runs'),
	'purista.health.status': metric('upDownCounter', '{status}', 'Health status'),
	'purista.health.check.duration': metric('histogram', 'ms', 'Health check duration'),
} satisfies PuristaMetricDefinitions

export const getFrameworkMetricDefinition = (name: string): PuristaMetricDefinition | undefined =>
	(frameworkMetricDefinitions as Record<string, PuristaMetricDefinition | undefined>)[name]

export type PuristaFrameworkMetricName = keyof typeof frameworkMetricDefinitions
