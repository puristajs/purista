import { describe, expect, it } from 'vitest'
import { MockModel } from './MockModel.js'

describe('MockModel', () => {
	it('matches text rules by registration order and supports function replies', async () => {
		const model = new MockModel()
			.on('hello')
			.reply('first')
			.on(/hello/)
			.reply(request => `second:${request.prompt}`)

		const generated = await model.generate?.({ prompt: 'hello world' })
		expect(generated?.output).toBe('first')
	})

	it('supports json matcher and function replies', async () => {
		const model = new MockModel().onJson({ type: 'object' }).reply(() => ({ ok: true }))
		const result = await model.generateJson?.({
			prompt: 'return json',
			schema: { type: 'object' },
		})
		expect(result?.data).toEqual({ ok: true })
		expect(result?.text).toBe('{"ok":true}')
	})
})
