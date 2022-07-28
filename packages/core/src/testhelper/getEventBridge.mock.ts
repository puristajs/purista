import { SinonStub, stub } from 'sinon'

import { EventBridge } from '../core'

/**
 * Mocks the eventbridge and methods are stubs
 * @returns EventBridge mocked
 */
export const getEventBridgeMock = (): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
  const emitMessage = stub()
  const emit = stub()
  const registerServiceFunction = stub()
  const registerSubscription = stub()
  const unregisterServiceFunction = stub()
  const unregisterSubscription = stub()
  const invoke = stub()
  const start = stub()

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
