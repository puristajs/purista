import { EventBridge } from '@purista/core'
import { SinonStub, stub } from 'sinon'

/**
 * Mocks the eventbridge and methods are stubs
 * @returns EventBridge mocked
 */
export const getEventBridgeMock = (): { mock: EventBridge; stubs: Record<string, SinonStub> } => {
  const emit = stub()
  const registerServiceFunction = stub()
  const registerSubscription = stub()
  const unregisterServiceFunction = stub()
  const unregisterSubscription = stub()
  const invoke = stub()

  const mock: EventBridge = {
    defaultTtl: 30000,
    emit,
    registerServiceFunction,
    registerSubscription,
    unregisterServiceFunction,
    unregisterSubscription,
    invoke,
  }

  return {
    stubs: {
      emit,
      registerServiceFunction,
      registerSubscription,
      unregisterServiceFunction,
      unregisterSubscription,
      invoke,
    },
    mock,
  }
}
