import type { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import { isCommandSuccessResponse } from '../core/types/commandType/isCommandSuccessResponse.impl.js'
import type { ServiceBuilderTypes } from '../core/types/ServiceBuilderTypes.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import type { InstanceConfigType, ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'

/**
 * Infer the instance config type from a service builder.
 *
 * @group Unit test helper
 */
export type InferCommandHarnessServiceBuilderConfig<T> = T extends ServiceBuilder<infer S> ? S : never

/**
 * Infer the definition config type from a command builder.
 *
 * @group Unit test helper
 */
export type InferCommandBuilderConfig<T> = T extends CommandDefinitionBuilder<any, infer C> ? C : never

/** Received command payload type, before an optional input transform. */
export type CommandTestHarnessPayload<T extends CommandDefinitionBuilder<any, any>> =
	Schema extends InferCommandBuilderConfig<T>['TransformInputPayloadSchema']
		? InferIn<InferCommandBuilderConfig<T>['PayloadSchema']>
		: InferIn<InferCommandBuilderConfig<T>['TransformInputPayloadSchema']>

/** Received command parameter type, before an optional input transform. */
export type CommandTestHarnessParameter<T extends CommandDefinitionBuilder<any, any>> =
	Schema extends InferCommandBuilderConfig<T>['TransformInputParamsSchema']
		? InferIn<InferCommandBuilderConfig<T>['ParamsSchema']>
		: InferIn<InferCommandBuilderConfig<T>['TransformInputParamsSchema']>

/** Successful command response type, after an optional output transform. */
export type CommandTestHarnessResult<T extends CommandDefinitionBuilder<any, any>> =
	Schema extends InferCommandBuilderConfig<T>['TransformOutputSchema']
		? Infer<InferCommandBuilderConfig<T>['OutputSchema']>
		: Infer<InferCommandBuilderConfig<T>['TransformOutputSchema']>

export type CreateCommandTestHarnessOptions<TServiceBuilder extends ServiceBuilder<ServiceBuilderTypes>> =
	InstanceConfigType<InferCommandHarnessServiceBuilderConfig<TServiceBuilder>> & {
		eventBridge?: EventBridge
		queueBridge?: QueueBridge
	}

/**
 * Boot a real service instance and execute one command through the PURISTA runtime.
 *
 * Use this helper when you want to test validation, guards, emits, and runtime
 * wiring instead of calling the command handler directly.
 *
 * @group Unit test helper
 */
export const createCommandTestHarness = async <
	TServiceBuilder extends ServiceBuilder<ServiceBuilderTypes>,
	TCommandBuilder extends CommandDefinitionBuilder<any, any>,
>(
	serviceBuilder: TServiceBuilder,
	commandBuilder: TCommandBuilder,
	options: CreateCommandTestHarnessOptions<TServiceBuilder> = {} as CreateCommandTestHarnessOptions<TServiceBuilder>,
) => {
	const eventBridgeOwner = !options.eventBridge
	const eventBridgeMock = options.eventBridge ? undefined : getEventBridgeMock()
	const eventBridge = options.eventBridge ?? eventBridgeMock?.mock
	if (!eventBridge) {
		throw new Error('createCommandTestHarness: failed to resolve event bridge')
	}
	const service = await serviceBuilder.getInstance(eventBridge, options as any)
	const definition = await commandBuilder.getDefinition()
	await service.registerCommand(definition)

	return {
		service,
		eventBridge,
		stubs: {
			eventBridge: eventBridgeMock?.stubs,
		},
		run: async (input: {
			payload: CommandTestHarnessPayload<TCommandBuilder>
			parameter: CommandTestHarnessParameter<TCommandBuilder>
		}): Promise<{
			message: Awaited<ReturnType<typeof service.executeCommand>>
			result: CommandTestHarnessResult<TCommandBuilder> | undefined
		}> => {
			const info = (service as unknown as { info?: { serviceName: string; serviceVersion: string } }).info
			const message = getCommandMessageMock({
				receiver: {
					serviceName: info?.serviceName ?? 'service',
					serviceVersion: info?.serviceVersion ?? '1',
					serviceTarget: definition.commandName,
				},
				payload: {
					payload: input.payload,
					parameter: input.parameter,
				},
			})
			const response = await service.executeCommand(message)
			return {
				message: response,
				result: isCommandSuccessResponse(response)
					? (response.payload as CommandTestHarnessResult<TCommandBuilder>)
					: undefined,
			}
		},
		destroy: async () => {
			await service.destroy()
			if (eventBridgeOwner) {
				await eventBridge.destroy()
			}
		},
	}
}
