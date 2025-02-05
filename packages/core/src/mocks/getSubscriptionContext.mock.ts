import type { Schema } from '@typeschema/main'
import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type {
	EBMessage,
	EBMessageAddress,
	FromEmitToOtherType,
	FromInvokeToOtherType,
	InvokeList,
	SubscriptionFunctionContext,
} from '../core/index.js'
import { getLoggerMock } from './getLogger.mock.js'

/**
 * A function that returns a mock object for subscription function context
 *
 * @group Unit test helper
 * */
export const getSubscriptionContextMock = <
	Resources extends Record<string, any>,
	Invokes extends InvokeList,
	EmitList extends Record<string, Schema>,
>(input: {
	message: EBMessage
	sandbox?: SinonSandbox
	invokes: FromInvokeToOtherType<Invokes, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>
	emitList: FromEmitToOtherType<EmitList, Schema>
	resources?: Partial<Resources>
}) => {
	const logger = getLoggerMock(input.sandbox)

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
			setAttribute: input.sandbox?.stub() ?? stub(),
			setAttributes: input.sandbox?.stub() ?? stub(),
			addEvent: input.sandbox?.stub() ?? stub(),
			setStatus: input.sandbox?.stub() ?? stub(),
			updateName: input.sandbox?.stub() ?? stub(),
			end: input.sandbox?.stub() ?? stub(),
			isRecording: () => true,
			recordException: (input.sandbox?.stub() ?? stub()).callsFake((err: unknown) => {
				// biome-ignore lint/suspicious/noConsole: no logger available
				console.error(err)
			}),
		}
	}

	const invokeMocks: Record<string, Record<string, Record<string, SinonStub>>> = {}

	const getInvokeProxy = <TFaux>(address?: EBMessageAddress, lvl = 0): TFaux => {
		const adr = {
			serviceName: '',
			serviceTarget: '',
			serviceVersion: '',
			...address,
		}

		return new Proxy(() => {}, {
			get(obj: Record<string, any>, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					return undefined
				}

				const x = obj[name]
				if (lvl === 0) {
					const na = {
						...adr,
						serviceName: name,
					}
					if (!invokeMocks[na.serviceName]) {
						invokeMocks[na.serviceName] = {}
					}
					return getInvokeProxy<typeof x>(na, lvl + 1)
				}
				if (lvl === 1) {
					const na = {
						...adr,
						serviceVersion: name,
					}
					if (!invokeMocks[na.serviceName][na.serviceVersion]) {
						invokeMocks[na.serviceName][na.serviceVersion] = {}
					}
					return getInvokeProxy<typeof x>(na, lvl + 1)
				}

				if (lvl === 2) {
					const na = {
						...adr,
						serviceTarget: name,
					}
					if (!invokeMocks[na.serviceName][na.serviceVersion][na.serviceTarget]) {
						invokeMocks[na.serviceName][na.serviceVersion][na.serviceTarget] = input.sandbox?.stub() ?? stub()

						invokeMocks[na.serviceName][na.serviceVersion][na.serviceTarget].rejects(
							new Error(
								`invocation of ${na.serviceTarget} in service ${na.serviceName} version ${na.serviceVersion} is not stubbed`,
							),
						)
					}
					return invokeMocks[na.serviceName]?.[na.serviceVersion]?.[na.serviceTarget]
				}
			},
		}) as TFaux
	}

	const resourceMocks: Record<string, SinonStub> = {}

	const getResourceProxy = <TFaux>(): TFaux => {
		return new Proxy(() => {}, {
			get(obj: Record<string, any>, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					return undefined
				}
				if (!resourceMocks[name]) {
					resourceMocks[name] = input.sandbox?.stub() ?? stub()
					resourceMocks[name].throws(`Resource ${name} not mocked`)
				}
				return resourceMocks[name]
			},
		}) as TFaux
	}

	const eventList = Object.keys(input.emitList ?? {}).reduce((prev, current) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			...prev,
			[current]: input.sandbox?.stub() ?? stub().resolves(),
		}
	}, {}) as FromEmitToOtherType<EmitList, SinonStub>

	const stubs = {
		logger: logger.stubs,
		emit: eventList,
		invoke: input.sandbox?.stub() ?? stub(),
		wrapInSpan: input.sandbox?.stub() ?? stub(),
		startActiveSpan: input.sandbox?.stub() ?? stub(),
		getSecret: input.sandbox?.stub() ?? stub(),
		setSecret: input.sandbox?.stub() ?? stub(),
		removeSecret: input.sandbox?.stub() ?? stub(),
		getConfig: input.sandbox?.stub() ?? stub(),
		setConfig: input.sandbox?.stub() ?? stub(),
		removeConfig: input.sandbox?.stub() ?? stub(),
		getState: input.sandbox?.stub() ?? stub(),
		setState: input.sandbox?.stub() ?? stub(),
		removeState: input.sandbox?.stub() ?? stub(),
		service: getInvokeProxy<FromInvokeToOtherType<Invokes, SinonStub>>(),
		resources: getResourceProxy<Resources>(),
	}

	const mock: SubscriptionFunctionContext<Resources, Invokes, EmitList> = {
		logger: logger.mock,
		message: input.message,
		emit: async <K extends keyof EmitList, Payload = EmitList[K]>(eventName: K, payload: Payload) => {
			return eventList[eventName](eventName, payload)
		},
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
		resources: getResourceProxy<Resources>(),
	}

	return {
		mock,
		stubs,
	}
}
