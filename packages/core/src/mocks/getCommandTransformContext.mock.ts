import type { SinonSandbox } from 'sinon'
import { stub } from 'sinon'

import type { CommandTransformFunctionContext, EmptyObject } from '../core/index.js'
import { getLoggerMock } from './getLogger.mock.js'
import { getCommandMessageMock } from './messages/index.js'

const noop = () => {
	// noop
}

/**
 * A function that returns a mock object for command transform function context
 *
 * @group Unit test helper
 * */
export const getCommandTransformContextMock = <
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, any> = EmptyObject,
>(input: {
	payload: MessagePayloadType
	parameter: MessageParamsType
	resources?: Partial<Resources>
	sandbox?: SinonSandbox
}) => {
	const logger = getLoggerMock(input.sandbox)
	const providedResources: Partial<Resources> = input.resources ?? ({} as Partial<Resources>)

	const stubs = {
		logger: logger.stubs,
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
		resource: {} as Partial<Resources>,
	}

	const resourcesProxy = new Proxy(
		{},
		{
			get(obj: Record<string, any>, name) {
				if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
					throw new Error('Invalid property access on resources proxy')
				}
				if (Object.hasOwn(providedResources, name)) {
					return providedResources[name]
				}
				if (!Object.hasOwn(stubs.resource, name)) {
					throw new Error(`Resource ${name} not set or stubbed`)
				}
				return stubs.resource[name]
			},
		},
	) as Resources

	const message = getCommandMessageMock({
		payload: {
			payload: input.payload,
			parameter: input.parameter,
		},
	})

	const mock: CommandTransformFunctionContext<MessagePayloadType, MessageParamsType, Resources> = {
		logger: logger.mock,
		message,
		wrapInSpan: stubs.wrapInSpan.callsFake((_name, _opts, fn) => fn()),
		startActiveSpan: stubs.startActiveSpan.callsFake((_name, _opts, _context, fn) => fn()),
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
		resources: resourcesProxy,
	}

	return {
		mock,
		stubs,
	}
}
