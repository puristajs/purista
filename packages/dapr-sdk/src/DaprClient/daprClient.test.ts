import type { EBMessageAddress, HttpExposedServiceMeta } from '@purista/core'
import { getCommandMessageMock, getLoggerMock } from '@purista/core'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { DaprClient } from './DaprClient.impl'

describe('DaprClient', () => {
  const baseUrl = 'http://example.com'
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
    sandbox.reset()
  })

  it('returns a path for getInternalPathForSubscription', () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })
    const address: EBMessageAddress = {
      serviceName: 'testServer',
      serviceVersion: '1',
      serviceTarget: 'exampleSubscription',
    }
    expect(client.getInternalPathForSubscription(address)).toBe('purista/subscription/example-subscription')
  })

  it('returns a path for getInternalPathForCommand', () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })
    const address: EBMessageAddress = {
      serviceName: 'testServer',
      serviceVersion: '1',
      serviceTarget: 'exampleCommand',
    }
    expect(client.getInternalPathForCommand(address)).toBe('purista/command/example-command')
  })

  it('returns a path for getApiPathForCommand', () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })
    const address: EBMessageAddress = {
      serviceName: 'testServer',
      serviceVersion: '1',
      serviceTarget: 'exampleCommand',
    }
    const metadata: HttpExposedServiceMeta = {
      expose: {
        http: {
          method: 'POST',
          path: '/example',
        },
      },
    }
    expect(client.getApiPathForCommand(address, metadata)).toBe('api/v1/example')
  })

  it('can invoke a command', async () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })

    const response = { example: 'response' }
    const command = getCommandMessageMock()

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any),
    )
    try {
      await expect(client.invoke(command)).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can send a event a command', async () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })

    const response = { example: 'response' }
    const command = getCommandMessageMock({ eventName: 'test' })

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any),
    )
    try {
      await expect(client.sendEvent(command)).resolves.toBeUndefined()
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('throws of no event name is provided', async () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })

    const command = getCommandMessageMock({ eventName: undefined })
    await expect(client.sendEvent(command)).rejects.toThrowError(
      'message can not be sent as event - event name not set',
    )
  })

  it('returns true if sidecar is available', async () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(JSON.stringify({})),
      } as any),
    )
    try {
      await expect(client.isSidecarAvailable()).resolves.toBeTruthy()
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('returns true if sidecar is available', async () => {
    const client = new DaprClient({
      baseUrl,
      logger: getLoggerMock(sandbox).mock,
      serve: sandbox.stub(),
    })

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.reject(new Error('unavailable')),
        text: () => Promise.reject(new Error('unavailable')),
      } as any),
    )
    try {
      await expect(client.isSidecarAvailable()).resolves.toBeFalsy()
    } finally {
      fetchMock.mockRestore()
    }
  })
})
