import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
	it('has valid configuration', () => {
		service.testServiceSetup()
	})
})
