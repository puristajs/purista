import { defineAgent } from '@purista/harness'
import { expectTypeOf } from 'vitest'
import { z } from 'zod'

import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import {
	defineHarnessQueueBinding,
	type QueuedHarnessTargetReference,
	requireQueuedHarnessTargetReference,
} from './queueBinding.js'

const answer = defineAgent('answer', {
	model: 'primary',
	input: z.object({ question: z.string() }),
	output: z.object({ answer: z.string() }),
	instructions: 'Answer the question.',
	prompt: input => ({ role: 'user', content: input.question }),
})
const other = defineAgent('other', {
	model: 'primary',
	input: z.object({ question: z.string() }),
	output: z.object({ answer: z.string() }),
	instructions: 'Answer the question.',
	prompt: input => ({ role: 'user', content: input.question }),
})

describe('defineHarnessQueueBinding', () => {
	it('returns one frozen nominal reference with exact identities and queue name', () => {
		const queue = new QueueDefinitionBuilder('support.answer', 'Queue support answers')
		const worker = new QueueWorkerBuilder('support.answer', 'answer-worker')
		const binding = defineHarnessQueueBinding(answer.contract, queue, worker)

		expect(binding.targetContract).toBe(answer.contract)
		expect(binding.reference.contract).toBe(answer.contract)
		expect(binding.reference.queue).toEqual({ name: 'support.answer' })
		expect(binding.queue).toBe(queue)
		expect(binding.worker).toBe(worker)
		expect(Object.isFrozen(binding)).toBe(true)
		expect(Object.isFrozen(binding.reference)).toBe(true)
		expect(Object.isFrozen(binding.reference.queue)).toBe(true)
		expect(Object.isFrozen(queue)).toBe(false)
		expect(Object.isFrozen(worker)).toBe(false)
		expectTypeOf(binding.reference.queue.name).toEqualTypeOf<'support.answer'>()
		expectTypeOf(binding.reference.contract).toEqualTypeOf(answer.contract)
	})

	it('rejects different queue names and foreign contracts without mutating builders', () => {
		const queue = new QueueDefinitionBuilder('support.answer', 'Queue support answers')
		const worker = new QueueWorkerBuilder('support.other', 'answer-worker')

		expect(() => defineHarnessQueueBinding(answer.contract, queue, worker as never)).toThrow('names differ')
		expect(() => defineHarnessQueueBinding({ ...answer.contract } as never, queue, worker as never)).toThrow(
			'authentic Harness target contract',
		)
		expect(Object.isFrozen(queue)).toBe(false)
		expect(Object.isFrozen(worker)).toBe(false)
	})

	it('makes structural and cross-contract substitutions fail nominally', () => {
		const binding = defineHarnessQueueBinding(
			answer.contract,
			new QueueDefinitionBuilder('support.answer', 'Queue support answers'),
			new QueueWorkerBuilder('support.answer', 'answer-worker'),
		)
		const spread = { ...binding.reference }
		const wrongContract = { ...binding.reference, contract: other.contract }

		const typeAssertions = () => {
			const exact: QueuedHarnessTargetReference<typeof answer.contract, 'support.answer'> = binding.reference
			// @ts-expect-error a spread loses the private nominal reference brand
			const copied: typeof binding.reference = spread
			// @ts-expect-error another authentic contract cannot replace the exact bound contract
			const mismatched: typeof binding.reference = wrongContract
			return [exact, copied, mismatched]
		}

		expect(typeAssertions).toBeTypeOf('function')
		expect(requireQueuedHarnessTargetReference(binding.reference, answer.contract).queue).toBe(binding.queue)
		expect(() => requireQueuedHarnessTargetReference(spread, answer.contract)).toThrow('exact factory-created binding')
		expect(() => requireQueuedHarnessTargetReference(Object.create(binding.reference), answer.contract)).toThrow(
			'exact factory-created binding',
		)
		expect(() => requireQueuedHarnessTargetReference(binding.reference, other.contract)).toThrow(
			'exact factory-created binding',
		)

		const otherBinding = defineHarnessQueueBinding(
			other.contract,
			new QueueDefinitionBuilder('support.other', 'Queue other answers'),
			new QueueWorkerBuilder('support.other', 'other-worker'),
		)
		expect(() => requireQueuedHarnessTargetReference(otherBinding.reference, answer.contract)).toThrow(
			'exact factory-created binding',
		)
	})
})
