import type { Schema } from '@decs/typeschema'
import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type {
  EBMessage,
  EBMessageAddress,
  FromEmitToOtherType,
  FromInvokeToOtherType,
  SubscriptionFunctionContext,
} from '../core/index.js'
import { getLoggerMock } from './getLogger.mock.js'

/**
 * A function that returns a mock object for subscription function context
 *
 * @group Unit test helper
 * */
export const getSubscriptionContextMock = <Invokes = {}, EmitListType = {}>(
  message: EBMessage,
  sandbox?: SinonSandbox,
  _invokes?: FromInvokeToOtherType<
    Invokes,
    { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }
  >,
  emitList?: EmitListType,
) => {
  const logger = getLoggerMock(sandbox)

  const getMockSpan = () => {
    return {
      spanContext: () => {
        return {
          traceId: 'fake',
          spanId: 'fake',
          isRemote: false,
          traceFlags: 0,
        }
      },
      setAttribute: sandbox?.stub() || stub(),
      setAttributes: sandbox?.stub() || stub(),
      addEvent: sandbox?.stub() || stub(),
      setStatus: sandbox?.stub() || stub(),
      updateName: sandbox?.stub() || stub(),
      end: sandbox?.stub() || stub(),
      isRecording: () => true,
      recordException: (sandbox?.stub() || stub()).callsFake((err: any) => {
        // eslint-disable-next-line no-console
        console.error(err)
      }),
    }
  }

  const invokeMocks: Record<string, Record<string, Record<string, SinonStub>>> = {}

  const getInvokeProxy = <TFaux>(address?: EBMessageAddress, lvl = 0): TFaux => {
    const adr = address || {
      serviceName: '',
      serviceTarget: '',
      serviceVersion: '',
    }

    return new Proxy(() => {}, {
      get(obj: Record<string, any>, name) {
        if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
          return undefined
        }

        const x = obj[name]
        if (lvl === 0) {
          adr.serviceName = name
          if (!invokeMocks[adr.serviceName]) {
            invokeMocks[adr.serviceName] = {}
          }
          return getInvokeProxy<typeof x>(adr, lvl + 1)
        }
        if (lvl === 1) {
          adr.serviceVersion = name
          if (!invokeMocks[adr.serviceName][adr.serviceVersion]) {
            invokeMocks[adr.serviceName][adr.serviceVersion] = {}
          }
          return getInvokeProxy<typeof x>(adr, lvl + 1)
        }

        if (lvl === 2) {
          adr.serviceTarget = name
          if (!invokeMocks[adr.serviceName][adr.serviceVersion][adr.serviceTarget]) {
            invokeMocks[adr.serviceName][adr.serviceVersion][adr.serviceTarget] = sandbox?.stub() || stub()

            invokeMocks[adr.serviceName][adr.serviceVersion][adr.serviceTarget].rejects(
              new Error(
                `invocation of ${adr.serviceTarget} in service ${adr.serviceName} version ${adr.serviceVersion} is not stubbed`,
              ),
            )
          }
          return invokeMocks[adr.serviceName]?.[adr.serviceVersion]?.[adr.serviceTarget]
        }
      },
    }) as TFaux
  }

  const eventList = Object.keys(emitList || {}).reduce((prev, current) => {
    return {
      ...prev,
      [current]: sandbox?.stub() || stub().resolves(),
    }
  }, {}) as FromEmitToOtherType<EmitListType, SinonStub>

  const stubs = {
    logger: logger.stubs,
    emit: eventList,
    invoke: sandbox?.stub() || stub(),
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
    getSecret: sandbox?.stub() || stub(),
    setSecret: sandbox?.stub() || stub(),
    removeSecret: sandbox?.stub() || stub(),
    getConfig: sandbox?.stub() || stub(),
    setConfig: sandbox?.stub() || stub(),
    removeConfig: sandbox?.stub() || stub(),
    getState: sandbox?.stub() || stub(),
    setState: sandbox?.stub() || stub(),
    removeState: sandbox?.stub() || stub(),
    service: getInvokeProxy<FromInvokeToOtherType<Invokes, SinonStub>>(),
  }

  const mock: SubscriptionFunctionContext<Invokes> = {
    logger: logger.mock,
    message,
    emit: async <K extends keyof EmitListType, Payload = EmitListType[K]>(eventName: K, payload: Payload) => {
      return eventList[eventName](eventName, payload)
    },
    invoke: stubs.invoke.rejects(new Error('Invoke is not stubbed')),
    wrapInSpan: stubs.wrapInSpan.callsFake((_name, _opts, fn) => fn(getMockSpan())),
    startActiveSpan: stubs.startActiveSpan.callsFake((_name, _opts, _context, fn) => fn(getMockSpan())),
    service: getInvokeProxy<Invokes>(),
    secrets: {
      getSecret: stubs.getSecret.rejects(new Error('getSecret is not stubbed')),
      setSecret: stubs.setSecret.rejects(new Error('setSecret is not stubbed')),
      removeSecret: stubs.removeSecret.rejects(new Error('removeSecret is not stubbed')),
    },
    configs: {
      getConfig: stubs.getConfig.rejects(new Error('getConfig is not stubbed')),
      setConfig: stubs.setConfig.rejects(new Error('setConfig is not stubbed')),
      removeConfig: stubs.removeConfig.rejects(new Error('removeConfig is not stubbed')),
    },
    states: {
      getState: stubs.getState.rejects(new Error('getState is not stubbed')),
      setState: stubs.setState.rejects(new Error('setState is not stubbed')),
      removeState: stubs.removeState.rejects(new Error('removeState is not stubbed')),
    },
  }

  return {
    mock,
    stubs,
  }
}
