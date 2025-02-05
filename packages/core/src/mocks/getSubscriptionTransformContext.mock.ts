import type { SinonSandbox } from 'sinon'
import { stub } from 'sinon'

import type { EBMessage, EmptyObject, SubscriptionTransformFunctionContext } from '../core/index.js'
import { getLoggerMock } from './getLogger.mock.js'

/**
 * A function that returns a mock object for subscription transform function context
 *
 * @group Unit test helper
 * */
export const getSubscriptionTransformContextMock = <Resources extends Record<string, any> = EmptyObject>(input: {
	message: EBMessage
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
		resources: {} as Partial<Resources>,
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
				if (!Object.hasOwn(stubs.resources, name)) {
					throw new Error(`Resource ${name} not set or stubbed`)
				}
				return stubs.resources[name]
			},
		},
	) as Resources

	const mock: SubscriptionTransformFunctionContext = {
		logger: logger.mock,
		message: input.message,
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
