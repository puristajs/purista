import type { Counter, Histogram, UpDownCounter } from '@opentelemetry/api'
import { z } from 'zod'
import { UnhandledError } from '../Error/index.js'
import type { Meter } from './index.js'
import {
	createMemoryMetricsRecorder,
	createMetricContext,
	createNoopMetricsRecorder,
	frameworkMetricDefinitions,
	isAllowedMetricAttributeKey,
	PuristaMetricsRecorder,
	validateMetricAttributes,
	validateMetricDefinition,
} from './index.js'
import type { PuristaMetricDefinitions } from './types.js'

describe('metric attribute policy', () => {
	it('rejects forbidden keys and identifiers', () => {
		expect(isAllowedMetricAttributeKey('purista.command.name')).toBe(true)
		expect(isAllowedMetricAttributeKey('trace_id')).toBe(false)
		expect(isAllowedMetricAttributeKey('customer_id')).toBe(false)
		expect(isAllowedMetricAttributeKey('customer.id')).toBe(false)
		expect(isAllowedMetricAttributeKey('authorization')).toBe(false)
		expect(isAllowedMetricAttributeKey('BadKey')).toBe(false)
	})

	it('drops invalid dynamic attributes without mutating the original object', () => {
		const input = {
			'purista.command.name': 'createOrder',
			trace_id: 'trace-1',
			count: 3,
			nested: { nope: true },
		}

		const result = validateMetricAttributes(input)

		expect(result.attributes).toStrictEqual({
			'purista.command.name': 'createOrder',
			count: 3,
		})
		expect(result.droppedAttributeKeys).toStrictEqual(['trace_id', 'nested'])
		expect(input).toHaveProperty('trace_id')
	})
})

describe('metric definitions', () => {
	it('contains the framework catalog entries from the metrics spec', () => {
		expect(frameworkMetricDefinitions['purista.command.executions']).toMatchObject({
			kind: 'counter',
			unit: '{execution}',
		})
		expect(frameworkMetricDefinitions['purista.agent.active']).toMatchObject({
			kind: 'upDownCounter',
			unit: '{run}',
		})
		expect(frameworkMetricDefinitions['http.server.request.duration']).toMatchObject({
			kind: 'histogram',
			unit: 's',
		})
	})

	it('validates custom metric names and attribute schema keys', async () => {
		await expect(
			validateMetricDefinition('app.orders.created', {
				kind: 'counter',
				unit: '{order}',
				description: 'Created orders',
				attributes: z.object({ channel: z.string() }),
			}),
		).resolves.toBeUndefined()

		await expect(
			validateMetricDefinition('orders.created', {
				kind: 'counter',
				unit: '{order}',
				description: 'Created orders',
			}),
		).rejects.toThrow(UnhandledError)

		await expect(
			validateMetricDefinition('app.orders.by_customer', {
				kind: 'counter',
				unit: '{order}',
				description: 'Created orders',
				attributes: z.object({ customer_id: z.string() }),
			}),
		).rejects.toThrow(UnhandledError)
	})
})

describe('memory and noop metrics recorders', () => {
	it('records deterministic entries in memory', () => {
		const recorder = createMemoryMetricsRecorder({
			defaultAttributes: { 'purista.service.name': 'orders' },
		})

		recorder.recordFrameworkMetric('purista.command.executions', 1, {
			'purista.command.name': 'createOrder',
			'purista.outcome': 'success',
		})
		recorder.recordCustomMetric(
			'app.orders.created',
			{ kind: 'counter', unit: '{order}', description: 'Created orders' },
			2,
			{
				channel: 'web',
			},
		)

		expect(recorder.records).toStrictEqual([
			{
				attributes: {
					'purista.service.name': 'orders',
					'purista.command.name': 'createOrder',
					'purista.outcome': 'success',
				},
				kind: 'counter',
				name: 'purista.command.executions',
				value: 1,
			},
			{
				attributes: {
					'purista.service.name': 'orders',
					channel: 'web',
				},
				kind: 'counter',
				name: 'app.orders.created',
				value: 2,
			},
		])
	})

	it('does nothing when disabled', () => {
		const recorder = createNoopMetricsRecorder()

		expect(() => {
			recorder.recordFrameworkMetric('purista.command.executions', 1)
			recorder.recordCustomMetric(
				'app.orders.created',
				{ kind: 'counter', unit: '{order}', description: 'Created orders' },
				1,
			)
		}).not.toThrow()
	})
})

describe('PuristaMetricsRecorder', () => {
	it('uses only the OpenTelemetry API meter instruments', () => {
		const added: Array<{ name: string; value: number; attributes?: Record<string, unknown> }> = []
		const recorded: Array<{ name: string; value: number; attributes?: Record<string, unknown> }> = []
		const meter: Meter = {
			createCounter: name =>
				({
					add: (value, attributes) => added.push({ name, value, attributes }),
				}) as Counter,
			createHistogram: name =>
				({
					record: (value, attributes) => recorded.push({ name, value, attributes }),
				}) as Histogram,
			createUpDownCounter: name =>
				({
					add: (value, attributes) => added.push({ name, value, attributes }),
				}) as UpDownCounter,
			createObservableCounter: () => {
				throw new Error('not used')
			},
			createObservableGauge: () => {
				throw new Error('not used')
			},
			createGauge: () => {
				throw new Error('not used')
			},
			createObservableUpDownCounter: () => {
				throw new Error('not used')
			},
			addBatchObservableCallback: () => {},
			removeBatchObservableCallback: () => {},
		}
		const recorder = new PuristaMetricsRecorder({
			meter,
			defaultAttributes: { 'purista.service.name': 'orders' },
		})

		recorder.recordFrameworkMetric('purista.command.executions', 1, {
			'purista.command.name': 'createOrder',
			trace_id: 'drop-me',
		})
		recorder.recordCustomMetric(
			'app.payment.capture.duration',
			{ kind: 'histogram', unit: 'ms', description: 'Payment capture duration' },
			127,
			{ provider: 'stripe' },
		)

		expect(added).toStrictEqual([
			{
				attributes: {
					'purista.service.name': 'orders',
					'purista.command.name': 'createOrder',
				},
				name: 'purista.command.executions',
				value: 1,
			},
		])
		expect(recorded).toStrictEqual([
			{
				attributes: {
					'purista.service.name': 'orders',
					provider: 'stripe',
				},
				name: 'app.payment.capture.duration',
				value: 127,
			},
		])
	})
})

describe('createMetricContext', () => {
	it('exposes only declared metric handles', () => {
		const definitions = {
			'app.orders.created': {
				kind: 'counter',
				unit: '{order}',
				description: 'Created orders',
				attributes: z.object({ channel: z.string() }),
			},
			'app.payment.capture.duration': {
				kind: 'histogram',
				unit: 'ms',
				description: 'Payment capture duration',
			},
		} satisfies PuristaMetricDefinitions
		const recorder = createMemoryMetricsRecorder()
		const context = createMetricContext(definitions, recorder)

		context['app.orders.created'].add(1, { channel: 'web' })
		context['app.payment.capture.duration'].record(127)

		expect(Object.keys(context)).toStrictEqual(['app.orders.created', 'app.payment.capture.duration'])
		expect(recorder.records.map(record => record.name)).toStrictEqual([
			'app.orders.created',
			'app.payment.capture.duration',
		])
	})
})
