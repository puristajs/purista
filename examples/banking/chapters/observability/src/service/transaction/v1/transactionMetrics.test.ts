import {
	createMemoryMetricsRecorder,
	createMetricContext,
	validateMetricDefinition,
} from '@purista/core'
import { expect, test } from 'vitest'
import { z } from 'zod'
import {
	transactionRecordedMetricDefinition,
	transactionRecordedMetricName,
} from './transactionMetrics.js'

test('records only the declared bounded transaction attributes', () => {
	const recorder = createMemoryMetricsRecorder()
	const metrics = createMetricContext({
		[transactionRecordedMetricName]: transactionRecordedMetricDefinition,
	}, recorder)

	metrics[transactionRecordedMetricName].add(1, {
		direction: 'debit',
		amount_band: 'at_least_100_eur',
	})
	expect(recorder.records).toEqual([{
		name: transactionRecordedMetricName,
		kind: 'counter',
		value: 1,
		attributes: { direction: 'debit', amount_band: 'at_least_100_eur' },
	}])
})

test('rejects unknown attributes and high-cardinality identifier keys', async () => {
	const metrics = createMetricContext({
		[transactionRecordedMetricName]: transactionRecordedMetricDefinition,
	}, createMemoryMetricsRecorder())

	expect(() => metrics[transactionRecordedMetricName].add(1, {
		direction: 'debit',
		amount_band: 'at_least_100_eur',
		transaction_id: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
	} as never)).toThrow('attributes failed validation')

	await expect(validateMetricDefinition('app.transaction.byid', {
		kind: 'counter',
		unit: '{transaction}',
		description: 'Invalid example',
		attributes: z.strictObject({ transaction_id: z.string() }),
	})).rejects.toThrow('forbidden attribute keys')
})
