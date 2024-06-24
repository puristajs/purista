import { httpServerV1Service as service } from './httpServerV1Service.js'

describe('service httpServer version 1', () => {
	it('has valid service setup', () => {
		service.testServiceSetup()
	})
})
