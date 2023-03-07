import { SinonSandbox, SinonStub, stub } from 'sinon'

import { EventBridge } from '../core'

/**
 * Mocks the eventbridge and stubs the methods
 * @returns EventBridge mocked
 */
export const getEventBridgeMock = (sandbox?: SinonSandbox): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
  const emitMessage = sandbox?.stub() || stub()
  const registerCommand = sandbox?.stub() || stub()
  const registerSubscription = sandbox?.stub() || stub()
  const unregisterCommand = sandbox?.stub() || stub()
  const unregisterSubscription = sandbox?.stub() || stub()
  const invoke = sandbox?.stub() || stub()
  const start = sandbox?.stub() || stub()
  const isReady = sandbox?.stub().resolves(true) || stub().resolves(true)
  const isHealthy = sandbox?.stub().resolves(true) || stub().resolves(true)
  const destroy = sandbox?.stub().resolves() || stub().resolves()

  const mock: EventBridge = {
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
