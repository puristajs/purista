import { EventBridge } from '@purista/core'
import { stub } from 'sinon'

/**
 * Mocks the eventbridge and methods are stubs
 * @returns EventBridge mocked
 */
export const getEventBridgeMock = (): EventBridge => {
  const emit = stub()
  const subscribe = stub()
  const unsubscribe = stub()
  const unsubscribeService = stub()

  return {
    defaultTtl: 1000,
    emit,
    subscribe,
    unsubscribe,
    unsubscribeService,
  }
}
