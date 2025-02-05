import { createSandbox } from 'sinon'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/index.js'
import type { ServiceInfoType } from '../core/index.js'
import { Service } from '../core/index.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { ServiceBuilder } from './ServiceBuilder.impl.js'

describe('ServiceBuilder', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'test-service',
		serviceVersion: '1',
		serviceDescription: 'the description of the service',
	}

	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.reset()
	})

	it('returns a CommandBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getCommandBuilder('command-name', 'command description')).toBeInstanceOf(CommandDefinitionBuilder)
	})

	it('returns a SubscriptionBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getSubscriptionBuilder('command-name', 'command description')).toBeInstanceOf(
			SubscriptionDefinitionBuilder,
		)
	})

	it('can use a custom service class', async () => {
		class CustomClass extends Service {
			customFunction() {
				return 'custom'
			}
		}

		const service = new ServiceBuilder(serviceInfo).setCustomClass(CustomClass)

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)

		const serviceInstance = await service.getInstance(eventBridge.mock, { logger: logger.mock })

		expect(serviceInstance.customFunction()).toBe('custom')
		expect(serviceInstance).toBeInstanceOf(CustomClass)
	})

	it('can add resources', async () => {
		class ExampleClass {
			method() {
				return 'hello'
			}
		}

		const service = new ServiceBuilder(serviceInfo).defineResource<'x', ExampleClass>()

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)
		const _serviceInstance = await service.getInstance(eventBridge.mock, {
			logger: logger.mock,
			resources: { x: new ExampleClass() },
		})
	})
})
