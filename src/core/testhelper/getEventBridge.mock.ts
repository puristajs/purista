import { SinonStub, stub } from 'sinon'

import { EventBridge } from '../types'

type ReturnType = {
  emit: SinonStub
  subscribe: SinonStub
  unsubscribe: SinonStub
  unsubscribeService: SinonStub
  mock: EventBridge
}

export const getEventBridgeMock = (): ReturnType => {
  const emit = stub()
  const subscribe = stub()
  const unsubscribe = stub()
  const unsubscribeService = stub()

  return {
    emit,
    subscribe,
    unsubscribe,
    unsubscribeService,
    mock: {
      defaultTtl: 1000,
      emit,
      subscribe,
      unsubscribe,
      unsubscribeService,
    },
  }
}
