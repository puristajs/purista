import { accountV1Service as service } from './accountV1Service.js'

describe('service account version 1', () => {
	it('has valid setup', async () => {
		await expect(service.testServiceSetup()).resolves.toBeTruthy()
	})
})
