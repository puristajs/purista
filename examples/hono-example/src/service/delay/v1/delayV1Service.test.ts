import { delayV1Service as service } from './delayV1Service.js'

describe('service delay version 1', () => {
	it('has valid configuration', () => {
		service.testServiceSetup()
	})
})
