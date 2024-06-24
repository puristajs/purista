import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
	it('has a valid setup', async () => {
		await expect(service.testServiceSetup()).resolves.toBeTruthy()
	})
})
