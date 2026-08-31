import { afterEach, describe, expect, it } from 'vitest'

import { createBankingApplication } from './index.js'

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

describe('Example Bank tutorial UI', () => {
	it('serves the Vite-built React shell and its JavaScript asset through the Hono composition root', async () => {
		const application = await createBankingApplication()
		destroy = application.destroy

		const index = await application.fetch(new Request('http://example.test/'))
		expect(index.status).toBe(200)
		expect(index.headers.get('content-type')).toContain('text/html')
		const document = await index.text()
		expect(document).toContain('<div id="root"></div>')
		const assetPath = document.match(/src="(\/assets\/[^"\n]+\.js)"/)?.[1]
		expect(assetPath).toBeDefined()

		const asset = await application.fetch(new Request(`http://example.test${assetPath}`))
		expect(asset.status).toBe(200)
		expect(asset.headers.get('content-type')).toContain('javascript')
		expect(await asset.text()).toContain('createRoot')
	})
})
