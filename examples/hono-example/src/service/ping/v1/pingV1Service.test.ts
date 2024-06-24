import { pingV1Service as service } from './pingV1Service.js'

describe('service ping version 1', () => {
	it('has valid configuration', () => {
		service.testServiceSetup()
	})
})
