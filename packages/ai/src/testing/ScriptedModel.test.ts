import { describe, expect, it } from 'vitest'

import { ScriptedModel } from './ScriptedModel.js'

describe('ScriptedModel', () => {
	it('supports ordered text and json replies', async () => {
		const model = new ScriptedModel().nextText('hello').nextJson({ ok: true })

		await expect(model.generateText?.({ prompt: 'hi' })).resolves.toBe('hello')
		await expect(model.generateObject?.({ prompt: 'json', schema: { type: 'object' } })).resolves.toMatchObject({
			data: { ok: true },
		})
		expect(model.calls).toHaveLength(2)
	})

	it('streams chunks and reasoning deltas', async () => {
		const model = new ScriptedModel().nextStream(['alpha', 'beta'], { reasoning: ['plan'] })
		const chunks: string[] = []
		const reasoning: string[] = []
		const stream = model.streamText({ prompt: 'stream' })

		for await (const item of stream) {
			if (item.type === 'text-delta') {
				chunks.push(item.textDelta)
			}
			if (item.type === 'reasoning-delta') {
				reasoning.push(item.reasoningDelta)
			}
		}

		await expect(stream.final()).resolves.toMatchObject({ output: 'alphabeta' })
		expect(chunks).toEqual(['alpha', 'beta'])
		expect(reasoning).toEqual(['plan'])
	})

	it('raises configured errors in order', async () => {
		const model = new ScriptedModel().nextError(() => new Error('boom'))

		await expect(model.generateText?.({ prompt: 'fail' })).rejects.toThrow('boom')
	})
})
