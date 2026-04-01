import type { SinonSandbox, SinonStub } from 'sinon'
import type { EBMessage } from '../core/types/EBMessage.js'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { SubscriptionFunctionContext } from '../core/types/subscription/SubscriptionFunctionContext.js'
import type { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import type { Schema } from '../schema/index.js'
import {
	createAgentInvokeProxy,
	createBaseContextStubs,
	createInvokeProxy,
	createMockSpan,
	createResourceProxy,
} from './sharedContextMocks.js'

/**
 * Infer the internal builder type configuration from a subscription builder.
 *
 * @group Unit test helper
 */
export type SubscriptionContextMockBuilderTypes<T> = T extends SubscriptionDefinitionBuilder<any, infer C> ? C : never

export type CreateSubscriptionContextMockInput<TBuilder extends SubscriptionDefinitionBuilder<any, any>> = {
	message: EBMessage
	sandbox?: SinonSandbox
	resources?: Partial<SubscriptionContextMockBuilderTypes<TBuilder>['Resources']>
}

export type SubscriptionContextMockResult<TBuilder extends SubscriptionDefinitionBuilder<any, any>> = {
	context: SubscriptionFunctionContext<
		SubscriptionContextMockBuilderTypes<TBuilder>['Resources'],
		SubscriptionContextMockBuilderTypes<TBuilder>['Invokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['EmitList'],
		SubscriptionContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['AgentInvokes']
	>
	mock: SubscriptionFunctionContext<
		SubscriptionContextMockBuilderTypes<TBuilder>['Resources'],
		SubscriptionContextMockBuilderTypes<TBuilder>['Invokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['EmitList'],
		SubscriptionContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['AgentInvokes']
	>
	stubs: {
		logger: Record<string, SinonStub>
		emit: FromEmitToOtherType<SubscriptionContextMockBuilderTypes<TBuilder>['EmitList'], SinonStub>
		invoke: SinonStub
		wrapInSpan: SinonStub
		startActiveSpan: SinonStub
		getSecret: SinonStub
		setSecret: SinonStub
		removeSecret: SinonStub
		getConfig: SinonStub
		setConfig: SinonStub
		removeConfig: SinonStub
		getState: SinonStub
		setState: SinonStub
		removeState: SinonStub
		enqueue: SinonStub
		scheduleAt: SinonStub
		service: Record<string, any>
		resources: Partial<SubscriptionContextMockBuilderTypes<TBuilder>['Resources']>
		invokeAgent: Record<string, any>
	}
}

/**
 * Create a typed subscription handler context mock from a subscription builder.
 *
 * Use this helper when you want to execute the subscription handler directly and
 * assert on emits, invocations, or state/store interactions.
 *
 * @group Unit test helper
 */
export const createSubscriptionContextMock = <TBuilder extends SubscriptionDefinitionBuilder<any, any>>(
	builder: TBuilder,
	input: CreateSubscriptionContextMockInput<TBuilder>,
): SubscriptionContextMockResult<TBuilder> => {
	const internalBuilder = builder as unknown as {
		invokes: SubscriptionContextMockBuilderTypes<TBuilder>['Invokes']
		streamInvokes: SubscriptionContextMockBuilderTypes<TBuilder>['StreamInvokes']
		agentInvokes: SubscriptionContextMockBuilderTypes<TBuilder>['AgentInvokes']
		emitList: SubscriptionContextMockBuilderTypes<TBuilder>['EmitList']
	}

	const base = createBaseContextStubs<
		SubscriptionContextMockBuilderTypes<TBuilder>['Resources'],
		SubscriptionContextMockBuilderTypes<TBuilder>['EmitList']
	>(
		internalBuilder.emitList as FromEmitToOtherType<SubscriptionContextMockBuilderTypes<TBuilder>['EmitList'], Schema>,
		input.sandbox,
	)
	const invokeProxy = createInvokeProxy<SubscriptionContextMockBuilderTypes<TBuilder>['Invokes']>(input.sandbox)
	const streamProxy = createInvokeProxy<SubscriptionContextMockBuilderTypes<TBuilder>['StreamInvokes']>(input.sandbox)
	const agentProxy = createAgentInvokeProxy<SubscriptionContextMockBuilderTypes<TBuilder>['AgentInvokes']>(
		input.sandbox,
	)
	const resourcesProxy = createResourceProxy(input.resources, base.stubs.resources)

	const context: SubscriptionFunctionContext<
		SubscriptionContextMockBuilderTypes<TBuilder>['Resources'],
		SubscriptionContextMockBuilderTypes<TBuilder>['Invokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['EmitList'],
		SubscriptionContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		SubscriptionContextMockBuilderTypes<TBuilder>['AgentInvokes']
	> = {
		logger: base.logger.mock,
		message: input.message,
		emit: async (eventName, payload) => base.stubs.emit[eventName](eventName, payload),
		wrapInSpan: base.stubs.wrapInSpan.callsFake((name, opts, fn) => {
			void name
			void opts
			return fn(createMockSpan(input.sandbox))
		}),
		startActiveSpan: base.stubs.startActiveSpan.callsFake((name, opts, contextValue, fn) => {
			void name
			void opts
			void contextValue
			return fn(createMockSpan(input.sandbox))
		}),
		service: invokeProxy.api,
		stream: streamProxy.api,
		invokeAgent: agentProxy.api,
		secrets: {
			getSecret: base.stubs.getSecret.rejects(new Error('getSecret is not stubbed')),
			setSecret: base.stubs.setSecret.rejects(new Error('setSecret is not stubbed')),
			removeSecret: base.stubs.removeSecret.rejects(new Error('removeSecret is not stubbed')),
		},
		configs: {
			getConfig: base.stubs.getConfig.rejects(new Error('getConfig is not stubbed')),
			setConfig: base.stubs.setConfig.rejects(new Error('setConfig is not stubbed')),
			removeConfig: base.stubs.removeConfig.rejects(new Error('removeConfig is not stubbed')),
		},
		states: {
			getState: base.stubs.getState.rejects(new Error('getState is not stubbed')),
			setState: base.stubs.setState.rejects(new Error('setState is not stubbed')),
			removeState: base.stubs.removeState.rejects(new Error('removeState is not stubbed')),
		},
		queue: {
			enqueue: base.stubs.enqueue.rejects(new Error('enqueue is not stubbed')) as any,
			scheduleAt: base.stubs.scheduleAt.rejects(new Error('scheduleAt is not stubbed')) as any,
		},
		resources: resourcesProxy,
	}

	return {
		context,
		mock: context,
		stubs: {
			...base.stubs,
			service: invokeProxy.createApi<Record<string, any>>(),
			invokeAgent: agentProxy.createApi<Record<string, any>>(),
		},
	}
}
