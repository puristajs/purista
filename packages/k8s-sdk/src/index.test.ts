import { getHttpServer, puristaVersion } from './index.js'

describe('exports k8s-sdk', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports getHttpServer', () => {
		expect(getHttpServer).toBeDefined()
	})
})
