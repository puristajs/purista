import { SinonSandbox, SinonStub, stub } from 'sinon'

import { EventBridge } from '../core'

/**
 * Mocks the eventbridge and methods are stubs
 * @returns EventBridge mocked
 */
export const getEventBridgeMock = (sandbox?: SinonSandbox): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
  const emitMessage = sandbox?.stub() || stub()
  const emit = sandbox?.stub() || stub()
  const registerServiceFunction = sandbox?.stub() || stub()
  const registerSubscription = sandbox?.stub() || stub()
  const unregisterServiceFunction = sandbox?.stub() || stub()
  const unregisterSubscription = sandbox?.stub() || stub()
  const invoke = sandbox?.stub() || stub()
  const start = sandbox?.stub() || stub()

  const mock = {
    defaultCommandTimeout: 30000,
    emitMessage,
    emit,
    registerServiceFunction,
    registerSubscription,
    unregisterServiceFunction,
    unregisterSubscription,
    invoke,
    start,
  } as unknown as EventBridge

  return {
    stubs: {
      emitMessage,
      emit,
      registerServiceFunction,
      registerSubscription,
      unregisterServiceFunction,
      unregisterSubscription,
      invoke,
      start,
    },
    mock,
  }
}
