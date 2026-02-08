import { SpanStatusCode } from '@opentelemetry/api'
import { validate } from '../../schema/index.js'

import { HandledError } from '../Error/HandledError.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import type { Command } from '../types/commandType/Command.js'
import type { CommandDefinition } from '../types/commandType/CommandDefinition.js'
import type { Logger } from '../types/Logger.js'

import type { ServiceClass } from '../types/ServiceClass.js'
import { StatusCode } from '../types/StatusCode.enum.js'

/**
 * Applies command transform-input hook with schema validation and tracing.
 */
export const commandTransformInput = async <S extends ServiceClass>(
	serviceInstance: S,
	logger: Logger,
	command: CommandDefinition<S, any, any, any, any, any, any, any, any, any, any, any, any, any>,
	message: Readonly<Command<unknown, unknown>>,
) => {
	if (!command.hooks.transformInput) {
		return message.payload as Readonly<typeof message.payload>
	}

	const transformInput = command.hooks.transformInput
	return await serviceInstance.startActiveSpan(`${command.commandName}.inputTransformation`, {}, undefined, async _ => {
		const transform = transformInput.transformFunction.bind(serviceInstance, {
			message,
			...serviceInstance.getContextFunctions(logger),
			resources: serviceInstance.resources,
		})
		const parameterInput = await serviceInstance.wrapInSpan(
			`${command.commandName}.validateParameter`,
			{},
			async subSpan => {
				const validationResult = await validate(transformInput.transformParameterSchema, message.payload.parameter)
				if (validationResult.success) {
					return validationResult.data
				}
				const err = new HandledError(StatusCode.BadRequest, undefined, validationResult.issues)
				subSpan.recordException(err)
				logger.warn({ ...subSpan.spanContext(), err }, 'transform input validation for parameters failed:', err.message)

				subSpan.setStatus({
					code: SpanStatusCode.ERROR,
					message: 'transform input validation for parameters failed',
				})
				throw err
			},
		)

		const payloadInput = await serviceInstance.wrapInSpan(
			`${command.commandName}.validatePayload`,
			{},
			async subSpan => {
				const validationResult = await validate(transformInput.transformInputSchema, message.payload.payload)
				if (validationResult.success) {
					return validationResult.data
				}
				const err = new HandledError(StatusCode.BadRequest, undefined, validationResult.issues)
				subSpan.recordException(err)
				logger.warn({ ...subSpan.spanContext(), err }, 'transform input validation for payload failed:', err.message)

				subSpan.setStatus({
					code: SpanStatusCode.ERROR,
					message: 'transform input validation for payload failed',
				})
				throw err
			},
		)

		return await serviceInstance.wrapInSpan(`${command.commandName}.transformFunction`, {}, async subSpan => {
			try {
				return await transform(
					payloadInput as Readonly<typeof payloadInput>,
					parameterInput as Readonly<typeof parameterInput>,
				)
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error))
				subSpan.recordException(err)
				subSpan.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})

				if (error instanceof HandledError) {
					throw error
				}
				logger.error({ err, ...subSpan.spanContext() }, 'Unable to transform input:')

				throw new UnhandledError(StatusCode.InternalServerError, 'Unable to transform input')
			}
		})
	})
}
