import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'
import type { AgentInvokeList } from '../core/types/agent/AgentInvokeList.js'
import type { AgentInvocation, AgentProtocolResponse } from '../core/types/agent/AgentProtocol.js'
import type { EBMessageAddress } from '../core/types/EBMessageAddress.js'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import { getLoggerMock } from '../mocks/getLogger.mock.js'
import type { Schema } from '../schema/index.js'

export const createMockSpan = (sandbox?: SinonSandbox) => {
	return {
		spanContext: () => ({
			traceId: 'fake',
			spanId: 'fake',
			isRemote: false,
			traceFlags: 0,
		}),
		setAttribute: sandbox?.stub() ?? stub(),
		setAttributes: sandbox?.stub() ?? stub(),
		addEvent: sandbox?.stub() ?? stub(),
		setStatus: sandbox?.stub() ?? stub(),
		updateName: sandbox?.stub() ?? stub(),
		end: sandbox?.stub() ?? stub(),
		isRecording: () => true,
		recordException: (sandbox?.stub() ?? stub()).callsFake((err: unknown) => {
			// biome-ignore lint/suspicious/noConsole: no logger available in low-level test helper
			console.error(err)
		}),
	}
}

export const createResourceProxy = <Resources extends Record<string, unknown>>(
	providedResources: Partial<Resources> | undefined,
	stubbedResources: Partial<Resources>,
) =>
	new Proxy(
		{},
		{
			get(_target: object, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					throw new Error('Invalid property access on resources proxy')
				}
				if (providedResources && Object.hasOwn(providedResources, name)) {
					return providedResources[name]
				}
				if (!Object.hasOwn(stubbedResources, name)) {
					throw new Error(`Resource ${name} not set or stubbed`)
				}
				return stubbedResources[name]
			},
		},
	) as Resources

export const createInvokeProxy = <Invokes extends InvokeList | StreamInvokeList = InvokeList>(
	sandbox?: SinonSandbox,
) => {
	const invokeMocks: Record<string, Record<string, Record<string, SinonStub>>> = {}

	const getInvokeProxy = <TFaux>(address?: EBMessageAddress, lvl = 0): TFaux => {
		const adr = {
			serviceName: '',
			serviceTarget: '',
			serviceVersion: '',
			...address,
		}

		return new Proxy(() => {}, {
			get(_obj: object, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					return undefined
				}

				if (lvl === 0) {
					const nextAddress = {
						...adr,
						serviceName: name,
					}
					invokeMocks[nextAddress.serviceName] ??= {}
					return getInvokeProxy<unknown>(nextAddress, lvl + 1)
				}
				if (lvl === 1) {
					const nextAddress = {
						...adr,
						serviceVersion: name,
					}
					invokeMocks[nextAddress.serviceName][nextAddress.serviceVersion] ??= {}
					return getInvokeProxy<unknown>(nextAddress, lvl + 1)
				}

				if (lvl === 2) {
					const nextAddress = {
						...adr,
						serviceTarget: name,
					}
					if (!invokeMocks[nextAddress.serviceName][nextAddress.serviceVersion][nextAddress.serviceTarget]) {
						invokeMocks[nextAddress.serviceName][nextAddress.serviceVersion][nextAddress.serviceTarget] =
							sandbox?.stub() ?? stub()

						invokeMocks[nextAddress.serviceName][nextAddress.serviceVersion][nextAddress.serviceTarget].rejects(
							new Error(
								`invocation of ${nextAddress.serviceTarget} in service ${nextAddress.serviceName} version ${nextAddress.serviceVersion} is not stubbed`,
							),
						)
					}

					return invokeMocks[nextAddress.serviceName][nextAddress.serviceVersion][nextAddress.serviceTarget]
				}
			},
		}) as TFaux
	}

	return {
		api: getInvokeProxy<Invokes>(),
		createApi: <TFaux>() => getInvokeProxy<TFaux>(),
		stubs: invokeMocks,
	}
}

export const createAgentInvokeProxy = <AgentInvokes extends AgentInvokeList = AgentInvokeList>(
	sandbox?: SinonSandbox,
) => {
	const agentInvokeMocks: Record<string, Record<string, SinonStub>> = {}

	const getAgentInvokeProxy = <TFaux>(address?: EBMessageAddress, lvl = 0): TFaux => {
		const adr = {
			serviceName: '',
			serviceTarget: 'run',
			serviceVersion: '',
			...address,
		}

		return new Proxy(() => {}, {
			get(_obj: object, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					return undefined
				}

				if (lvl === 0) {
					const nextAddress = {
						...adr,
						serviceName: name,
					}
					agentInvokeMocks[nextAddress.serviceName] ??= {}
					return getAgentInvokeProxy<unknown>(nextAddress, lvl + 1)
				}
				if (lvl === 1) {
					const nextAddress = {
						...adr,
						serviceVersion: name,
					}
					if (!agentInvokeMocks[nextAddress.serviceName][nextAddress.serviceVersion]) {
						agentInvokeMocks[nextAddress.serviceName][nextAddress.serviceVersion] = sandbox?.stub() ?? stub()
						agentInvokeMocks[nextAddress.serviceName][nextAddress.serviceVersion].rejects(
							new Error(
								`agent invocation of ${nextAddress.serviceName} version ${nextAddress.serviceVersion} is not stubbed`,
							),
						)
					}
					return getAgentInvokeProxy<unknown>(nextAddress, lvl + 1)
				}

				if (lvl === 2 && name === 'call') {
					return (payload: unknown, parameter?: unknown) => {
						const promise = agentInvokeMocks[adr.serviceName]?.[adr.serviceVersion](
							payload,
							parameter,
						) as Promise<AgentProtocolResponse>

						return {
							final: () => promise,
							[Symbol.asyncIterator]: async function* () {
								const result = await promise
								yield result
							},
						} as AgentInvocation
					}
				}
			},
		}) as TFaux
	}

	return {
		api: getAgentInvokeProxy<AgentInvokes>(),
		createApi: <TFaux>() => getAgentInvokeProxy<TFaux>(),
		stubs: agentInvokeMocks,
	}
}

export const createEmitStubMap = <EmitList extends Record<string, Schema>>(
	emitList: FromEmitToOtherType<EmitList, Schema>,
	sandbox?: SinonSandbox,
) => {
	const emitStubs = {} as FromEmitToOtherType<EmitList, SinonStub>

	for (const eventName of Object.keys(emitList ?? {})) {
		emitStubs[eventName as keyof typeof emitStubs] = (sandbox?.stub() ?? stub().resolves()) as never
	}

	return emitStubs
}

export const createBaseContextStubs = <
	Resources extends Record<string, unknown>,
	EmitList extends Record<string, Schema>,
>(
	emitList: FromEmitToOtherType<EmitList, Schema>,
	sandbox?: SinonSandbox,
) => {
	const logger = getLoggerMock(sandbox)

	return {
		logger,
		stubs: {
			logger: logger.stubs,
			emit: createEmitStubMap(emitList, sandbox),
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
			enqueue: sandbox?.stub() ?? stub().resolves(),
			scheduleAt: sandbox?.stub() ?? stub().resolves(),
			resources: {} as Partial<Resources>,
		},
	}
}
