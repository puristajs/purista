import type { SinonSandbox, SinonStub } from 'sinon'
import type { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import { createQueueEnqueueProxy } from '../core/helper/createQueueEnqueueProxy.impl.js'
import { createQueueScheduleProxy } from '../core/helper/createQueueScheduleProxy.impl.js'
import type { Service } from '../core/Service/Service.impl.js'
import type { CommandFunctionContext } from '../core/types/commandType/CommandFunctionContext.js'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { GetMessageParamsType } from '../core/types/GetMessageParamsType.js'
import type { GetMessagePayloadType } from '../core/types/GetMessagePayloadType.js'
import type { QueueInvokeFunction } from '../core/types/queue/QueueInvokeFunction.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { QueueScheduleFunction } from '../core/types/queue/QueueScheduleFunction.js'
import type { ServiceClass } from '../core/types/ServiceClass.js'
import type { ServiceClassMetrics } from '../core/types/ServiceClassMetrics.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import type { Schema } from '../schema/index.js'
import {
	createBaseContextStubs,
	createHarnessInvocationMockProxy,
	createHarnessModelMockProxy,
	createInvokeProxy,
	createMetricContextMock,
	createMockSpan,
	createResourceProxy,
} from './sharedContextMocks.js'

/**
 * Infer the internal builder type configuration from a command builder.
 *
 * @group Unit test helper
 */
export type CommandContextMockBuilderTypes<T> = T extends CommandDefinitionBuilder<any, infer C> ? C : never
export type CommandContextMockServiceClass<T> =
	T extends CommandDefinitionBuilder<infer S extends Service, any> ? S : ServiceClass

export type CreateCommandContextMockInput<TBuilder extends CommandDefinitionBuilder<any, any>> = {
	payload: GetMessagePayloadType<
		CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
		CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
	>
	parameter: GetMessageParamsType<
		CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
		CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
	>
	sandbox?: SinonSandbox
	resources?: Partial<CommandContextMockBuilderTypes<TBuilder>['Resources']>
	message?: {
		payload: GetMessagePayloadType<
			CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
		>
		parameter: GetMessageParamsType<
			CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
		>
	}
}

export type CommandContextMockResult<TBuilder extends CommandDefinitionBuilder<any, any>> = {
	context: CommandFunctionContext<
		GetMessagePayloadType<
			CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
		>,
		GetMessageParamsType<
			CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
		>,
		CommandContextMockBuilderTypes<TBuilder>['Resources'],
		CommandContextMockBuilderTypes<TBuilder>['Invokes'],
		CommandContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		CommandContextMockBuilderTypes<TBuilder>['EmitList'],
		CommandContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		ServiceClassMetrics<CommandContextMockServiceClass<TBuilder>>
	>
	mock: CommandFunctionContext<
		GetMessagePayloadType<
			CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
		>,
		GetMessageParamsType<
			CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
		>,
		CommandContextMockBuilderTypes<TBuilder>['Resources'],
		CommandContextMockBuilderTypes<TBuilder>['Invokes'],
		CommandContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		CommandContextMockBuilderTypes<TBuilder>['EmitList'],
		CommandContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		ServiceClassMetrics<CommandContextMockServiceClass<TBuilder>>
	>
	stubs: {
		logger: Record<string, SinonStub>
		emit: FromEmitToOtherType<CommandContextMockBuilderTypes<TBuilder>['EmitList'], SinonStub>
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
		agent: Record<string, any>
		workflow: Record<string, any>
		model: Record<string, Record<string, SinonStub>>
		resources: Partial<CommandContextMockBuilderTypes<TBuilder>['Resources']>
	}
}

/**
 * Create a typed command handler context mock from a command builder.
 *
 * Use this helper when you want to test command handler logic directly without
 * booting a full service instance.
 *
 * @example
 * ```ts
 * const { context, stubs } = createCommandContextMock(signUpCommandBuilder, {
 *   payload: { email: 'user@example.com' },
 *   parameter: {},
 * })
 *
 * await signUp.call(service, context, { email: 'user@example.com' }, {})
 * expect(stubs.emit.userSignedUp.called).toBe(true)
 * ```
 *
 * @group Unit test helper
 */
export const createCommandContextMock = <TBuilder extends CommandDefinitionBuilder<any, any>>(
	builder: TBuilder,
	input: CreateCommandContextMockInput<TBuilder>,
): CommandContextMockResult<TBuilder> => {
	const internalBuilder = builder as unknown as {
		invokes: CommandContextMockBuilderTypes<TBuilder>['Invokes']
		streamInvokes: CommandContextMockBuilderTypes<TBuilder>['StreamInvokes']
		emitList: CommandContextMockBuilderTypes<TBuilder>['EmitList']
		queueInvokes: QueueInvokeList
	}

	const base = createBaseContextStubs<
		CommandContextMockBuilderTypes<TBuilder>['Resources'],
		CommandContextMockBuilderTypes<TBuilder>['EmitList']
	>(
		internalBuilder.emitList as FromEmitToOtherType<CommandContextMockBuilderTypes<TBuilder>['EmitList'], Schema>,
		input.sandbox,
	)
	const invokeProxy = createInvokeProxy<CommandContextMockBuilderTypes<TBuilder>['Invokes']>(input.sandbox)
	const streamProxy = createInvokeProxy<CommandContextMockBuilderTypes<TBuilder>['StreamInvokes']>(input.sandbox)
	const agentProxy = createHarnessInvocationMockProxy<CommandContextMockResult<TBuilder>['context']['agent']>(
		input.sandbox,
	)
	const workflowProxy = createHarnessInvocationMockProxy<CommandContextMockResult<TBuilder>['context']['workflow']>(
		input.sandbox,
	)
	const modelProxy = createHarnessModelMockProxy<CommandContextMockResult<TBuilder>['context']['model']>(
		internalBuilder.invokes,
		input.sandbox,
	)
	const resourcesProxy = createResourceProxy(input.resources, base.stubs.resources)

	const message = getCommandMessageMock({
		payload: input.message
			? input.message
			: {
					payload: input.payload as GetMessagePayloadType<
						CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
						CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
					>,
					parameter: input.parameter as GetMessageParamsType<
						CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
						CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
					>,
				},
	})

	const context: CommandFunctionContext<
		GetMessagePayloadType<
			CommandContextMockBuilderTypes<TBuilder>['PayloadSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputPayloadSchema']
		>,
		GetMessageParamsType<
			CommandContextMockBuilderTypes<TBuilder>['ParamsSchema'],
			CommandContextMockBuilderTypes<TBuilder>['TransformInputParamsSchema']
		>,
		CommandContextMockBuilderTypes<TBuilder>['Resources'],
		CommandContextMockBuilderTypes<TBuilder>['Invokes'],
		CommandContextMockBuilderTypes<TBuilder>['StreamInvokes'],
		CommandContextMockBuilderTypes<TBuilder>['EmitList'],
		CommandContextMockBuilderTypes<TBuilder>['QueueInvokes'],
		ServiceClassMetrics<CommandContextMockServiceClass<TBuilder>>
	> = {
		logger: base.logger.mock,
		metrics: createMetricContextMock<ServiceClassMetrics<CommandContextMockServiceClass<TBuilder>>>(input.sandbox),
		message,
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
		agent: agentProxy.api,
		workflow: workflowProxy.api,
		model: modelProxy.api,
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
			enqueue: createQueueEnqueueProxy(
				(async (queueName, payload, parameter, options) =>
					base.stubs.enqueue(queueName, payload, parameter, options)) as QueueInvokeFunction,
				internalBuilder.queueInvokes as any,
			),
			scheduleAt: createQueueScheduleProxy(
				(async (queueName, runAt, payload, parameter, options) =>
					base.stubs.scheduleAt(queueName, runAt, payload, parameter, options)) as QueueScheduleFunction,
				internalBuilder.queueInvokes as any,
			),
		},
		resources: resourcesProxy,
	}

	return {
		context,
		mock: context,
		stubs: {
			...base.stubs,
			service: invokeProxy.createApi<Record<string, any>>(),
			agent: agentProxy.api,
			workflow: workflowProxy.api,
			model: modelProxy.api as Record<string, Record<string, SinonStub>>,
		},
	}
}
