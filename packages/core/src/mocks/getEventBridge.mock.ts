import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type { EventBridge } from '../core/index.js'

/**
 * Mocks the eventBridge and stubs the methods
 * @returns EventBridge mocked
 * @group Unit test helper
 */
export const getEventBridgeMock = (sandbox?: SinonSandbox): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
  const emitMessage = sandbox?.stub() ?? stub()
  const registerCommand = sandbox?.stub() ?? stub()
  const registerSubscription = sandbox?.stub() ?? stub()
  const unregisterCommand = sandbox?.stub() ?? stub()
  const unregisterSubscription = sandbox?.stub() ?? stub()
  const invoke = sandbox?.stub() ?? stub()
  const start = sandbox?.stub() ?? stub()
  const isReady = sandbox?.stub().resolves(true) ?? stub().resolves(true)
  const isHealthy = sandbox?.stub().resolves(true) ?? stub().resolves(true)
  const destroy = sandbox?.stub().resolves() ?? stub().resolves()

  const mock: EventBridge = {
    name: 'EventBridgeMock',
    instanceId: 'mockedInstanceId',
    defaultCommandTimeout: 30000,
    emitMessage,
    registerCommand,
    registerSubscription,
    unregisterCommand,
    unregisterSubscription,
    invoke,
    start,
    isReady,
    isHealthy,
    destroy,
  }

  return {
    stubs: {
      emitMessage,
      registerCommand,
      registerSubscription,
      unregisterCommand,
      unregisterSubscription,
      invoke,
      start,
      isReady,
      isHealthy,
      destroy,
    },
    mock,
  }
}
