import { getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import type { ServiceInfoType } from '../types/index.js'
import { Service } from './Service.impl.js'

describe('Service', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'TestService',
		serviceVersion: '1',
		serviceDescription: 'A service for unit tests',
	}

	it('creates a new instance', async () => {
		const logger = getLoggerMock().mock
		const eventBridge = getEventBridgeMock().mock

		const service = new Service({
			logger,
			eventBridge,
			info: serviceInfo,
			commandDefinitionList: [],
			subscriptionDefinitionList: [],
			config: {},
		})

		await expect(service.start()).resolves.toBeUndefined()

		await expect(service.destroy()).resolves.toBeUndefined()
	})
})
