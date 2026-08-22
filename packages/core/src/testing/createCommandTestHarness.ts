import type { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import { isCommandSuccessResponse } from '../core/types/commandType/isCommandSuccessResponse.impl.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import { getCommandMessageMock } from '../mocks/messages/getCommandMessage.mock.js'
import type { InstanceConfigType, ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import type { Infer, InferIn } from '../schema/index.js'

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

export type CreateCommandTestHarnessOptions<TServiceBuilder extends ServiceBuilder<any>> = InstanceConfigType<
	InferCommandHarnessServiceBuilderConfig<TServiceBuilder>
> & {
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
	TServiceBuilder extends ServiceBuilder<any>,
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
			payload: InferIn<InferCommandBuilderConfig<TCommandBuilder>['PayloadSchema']>
			parameter: InferIn<InferCommandBuilderConfig<TCommandBuilder>['ParamsSchema']>
		}): Promise<{
			message: Awaited<ReturnType<typeof service.executeCommand>>
			result: Infer<InferCommandBuilderConfig<TCommandBuilder>['OutputSchema']> | undefined
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
					? (response.payload as Infer<InferCommandBuilderConfig<TCommandBuilder>['OutputSchema']>)
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
