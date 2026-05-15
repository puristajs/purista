import type { SinonSandbox } from 'sinon'
import { stub } from 'sinon'

import type { EBMessage } from '../core/types/EBMessage.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { QueueInvokeClientMap, QueueScheduleProxy } from '../core/types/queue/QueueContext.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { QueueScheduleFunction } from '../core/types/queue/QueueScheduleFunction.js'
import type { SubscriptionTransformFunctionContext } from '../core/types/subscription/SubscriptionTransformFunctionContext.js'
import { createMetricContextMock } from '../testing/sharedContextMocks.js'

import { getLoggerMock } from './getLogger.mock.js'

/**
 * A function that returns a mock object for subscription transform function context
 *
 * @group Unit test helper
 * */
export const getSubscriptionTransformContextMock = <Resources extends Record<string, unknown> = EmptyObject>(input: {
	message: EBMessage
	resources?: Partial<Resources>
	sandbox?: SinonSandbox
}) => {
	const logger = getLoggerMock(input.sandbox)

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
		enqueue: input.sandbox?.stub() ?? stub().resolves(),
		scheduleAt: input.sandbox?.stub() ?? stub().resolves(),
		resources: {} as Partial<Resources>,
	}

	const providedResources: Partial<Resources> = input.resources ?? ({} as Partial<Resources>)

	const resourcesProxy = new Proxy(
		{},
		{
			get(target: object, name) {
				void target
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
		metrics: createMetricContextMock(input.sandbox),
		message: input.message,
		wrapInSpan: stubs.wrapInSpan.callsFake((name, opts, fn) => {
			void name
			void opts
			return fn()
		}),
		startActiveSpan: stubs.startActiveSpan.callsFake((name, opts, context, fn) => {
			void name
			void opts
			void context
			return fn()
		}),
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
		queue: {
			enqueue: stubs.enqueue.rejects(new Error('enqueue is not stubbed')) as unknown as QueueInvokeFunction &
				QueueInvokeClientMap<QueueInvokeList>,
			scheduleAt: stubs.scheduleAt.rejects(new Error('scheduleAt is not stubbed')) as unknown as QueueScheduleFunction &
				QueueScheduleProxy<QueueInvokeClientMap<QueueInvokeList>>,
		},
		resources: resourcesProxy,
	}

	return {
		mock,
		stubs,
	}
}
