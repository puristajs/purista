import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service, ServiceInfoType } from '../core'
import { getEventBridgeMock, getLoggerMock } from '../testhelper'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl'
import { ServiceBuilder } from './ServiceBuilder.impl'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl'

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

  it('can set a service config schema and default config', () => {
    const service = new ServiceBuilder(serviceInfo)

    const configSchema = z.object({
      host: z.string(),
    })

    const defaultConfig = {
      host: 'localhost',
    }

    const serviceWithConfigSchema = service.setConfigSchema(configSchema)
    const serviceWithDefaultConfig = serviceWithConfigSchema.setDefaultConfig(defaultConfig)

    const eventBridge = getEventBridgeMock(sandbox)
    const logger = getLoggerMock(sandbox)

    const serviceInstanceWithDefaultConfig = serviceWithDefaultConfig.getInstance(eventBridge.mock, {
      logger: logger.mock,
    })

    expect(serviceInstanceWithDefaultConfig.config.host).toEqual(defaultConfig.host)

    const serviceInstanceWithCustomConfig = serviceWithDefaultConfig.getInstance(eventBridge.mock, {
      logger: logger.mock,
      serviceConfig: { host: 'remote' },
    })

    expect(serviceInstanceWithCustomConfig.config.host).toEqual('remote')
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

  it('can use a custom service class', () => {
    class CustomClass extends Service<{}> {
      customFunction() {
        return 'custom'
      }
    }

    const service = new ServiceBuilder(serviceInfo).setCustomClass(CustomClass)

    const eventBridge = getEventBridgeMock(sandbox)
    const logger = getLoggerMock(sandbox)

    const serviceInstance = service.getInstance(eventBridge.mock, { logger: logger.mock })

    expect(serviceInstance.customFunction()).toEqual('custom')
    expect(serviceInstance).toBeInstanceOf(CustomClass)
  })
})
