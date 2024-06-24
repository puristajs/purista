import { emailV1Service as service } from './emailV1Service.js'

describe('service email version 1', () => {
	it('has valid setup', () => {
		service.testServiceSetup()
	})
})
