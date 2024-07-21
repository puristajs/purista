import type { Schema } from '@typeschema/main'
import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type {
	CommandFunctionContext,
	EBMessageAddress,
	EmptyObject,
	FromEmitToOtherType,
	FromInvokeToOtherType,
} from '../core/index.js'
import { getLoggerMock } from './getLogger.mock.js'
import { getCommandMessageMock } from './messages/index.js'

/**
 * A function that returns a mock object for command function context
 *
 * @group Unit test helper
 * */
export const getCommandContextMock = <
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
>(
	payload: MessagePayloadType,
	parameter: MessageParamsType,
	sandbox?: SinonSandbox,
	_invokes?: FromInvokeToOtherType<
		Invokes,
		{ outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }
	>,
	emitList?: FromEmitToOtherType<EmitListType, Schema>,
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
			setAttribute: sandbox?.stub() ?? stub(),
			setAttributes: sandbox?.stub() ?? stub(),
			addEvent: sandbox?.stub() ?? stub(),
			setStatus: sandbox?.stub() ?? stub(),
			updateName: sandbox?.stub() ?? stub(),
			end: sandbox?.stub() ?? stub(),
			isRecording: () => true,
			recordException: (sandbox?.stub() ?? stub()).callsFake((err: any) => {
				// biome-ignore lint/nursery/noConsole: no logger available
				console.error(err)
			}),
		}
	}

	const resourceMocks: Record<string, SinonStub> = {}

	const getResourceProxy = <TFaux>(): TFaux => {
		return new Proxy(() => {}, {
			get(obj: Record<string, any>, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					return undefined
				}
				if (!resourceMocks[name]) {
					resourceMocks[name] = sandbox?.stub() ?? stub()
					resourceMocks[name].throws(`Resource ${name} not mocked`)
				}
				return resourceMocks[name]
			},
		}) as TFaux
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
						invokeMocks[na.serviceName][na.serviceVersion][na.serviceTarget] = sandbox?.stub() ?? stub()

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

	const eventList = Object.keys(emitList ?? {}).reduce((prev, current) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			...prev,
			[current]: sandbox?.stub() ?? stub().resolves(),
		}
	}, {}) as FromEmitToOtherType<EmitListType, SinonStub>

	const stubs = {
		logger: logger.stubs,
		emit: eventList,
		invoke: sandbox?.stub() ?? stub(),
		wrapInSpan: sandbox?.stub() ?? stub(),
		startActiveSpan: sandbox?.stub() ?? stub(),
		getSecret: sandbox?.stub() ?? stub(),
		setSecret: sandbox?.stub() ?? stub(),
		removeSecret: sandbox?.stub() ?? stub(),
		getConfig: sandbox?.stub() ?? stub(),
		setConfig: sandbox?.stub() ?? stub(),
		removeConfig: sandbox?.stub() ?? stub(),
		getState: sandbox?.stub() ?? stub(),
		setState: sandbox?.stub() ?? stub(),
		removeState: sandbox?.stub() ?? stub(),
		service: getInvokeProxy<FromInvokeToOtherType<Invokes, SinonStub>>(),
		resource: getResourceProxy<Resources>(),
	}

	const message = getCommandMessageMock({
		payload: {
			payload,
			parameter,
		},
	})

	const mock: CommandFunctionContext<MessagePayloadType, MessageParamsType, Invokes, EmitListType, Resources> = {
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
		resource: getResourceProxy<Resources>(),
	}

	return {
		mock,
		stubs,
	}
}
