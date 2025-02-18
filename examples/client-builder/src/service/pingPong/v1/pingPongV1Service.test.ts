import { pingPongV1Service as service } from './pingPongV1Service.js'

describe('service ping pong version 1', () => {
	it('has valid configuration', () => {
		service.testServiceSetup()
	})
})
