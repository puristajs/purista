import { SpanStatusCode } from '@opentelemetry/api'
import type { Schema } from '@typeschema/main'
import { validate } from '@typeschema/main'

import type { CommandBeforeGuardHook, CommandFunction, EmptyObject, ServiceClass } from '../core/index.js'
import { HandledError, StatusCode, UnhandledError } from '../core/index.js'

export const getCommandFunctionWithValidation = function <
	ServiceClassType extends ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	MessageResultType = unknown,
	FunctionPayloadType = MessagePayloadType,
	FunctionParamsType = MessageParamsType,
	FunctionResultType = MessageResultType,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Ressources = EmptyObject,
>(
	fn: CommandFunction<
		ServiceClassType,
		MessagePayloadType,
		MessageParamsType,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionResultType,
		Invokes,
		EmitListType,
		Ressources
	>,
	inputPayloadSchema: Schema | undefined,
	inputParameterSchema: Schema | undefined,
	outputPayloadSchema: Schema | undefined,
	beforeGuards: Record<
		string,
		CommandBeforeGuardHook<
			ServiceClassType,
			MessagePayloadType,
			MessageParamsType,
			FunctionPayloadType,
			FunctionParamsType,
			Invokes,
			EmitListType,
			Ressources
		>
	> = {},
): CommandFunction<
	ServiceClassType,
	MessagePayloadType,
	MessageParamsType,
	FunctionPayloadType,
	FunctionParamsType,
	FunctionResultType,
	Invokes,
	EmitListType,
	Ressources
> {
	const wrapped: CommandFunction<
		ServiceClassType,
		MessagePayloadType,
		MessageParamsType,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionResultType,
		Invokes,
		EmitListType,
		Ressources
	> = async function (context, payload, parameter): Promise<FunctionResultType> {
		const { logger, startActiveSpan, wrapInSpan } = context
		let safePayload = payload as unknown as FunctionPayloadType
		if (inputPayloadSchema) {
			safePayload = await startActiveSpan('validatePayload', {}, undefined, async span => {
				const validationResult = await validate(inputPayloadSchema, payload)
				if (validationResult.success) {
					return validationResult.data as FunctionPayloadType
				}
				const err = new HandledError(
					StatusCode.BadRequest,
					'input validation for payload failed:',
					validationResult.issues,
				)
				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				logger.warn({ ...span.spanContext() }, 'input validation for payload failed', err.message)
				throw err
			})
		}

		let safeParams = parameter as unknown as FunctionParamsType
		if (inputParameterSchema) {
			safeParams = await startActiveSpan('validateParameter', {}, undefined, async span => {
				const validationResult = await validate(inputParameterSchema, parameter)
				if (validationResult.success) {
					return validationResult.data as FunctionParamsType
				}

				const err = new HandledError(
					StatusCode.BadRequest,
					'input validation for parameter failed:',
					validationResult.issues,
				)
				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				logger.warn({ ...span.spanContext() }, 'input validation for parameter failed', err.message)
				throw err
			})
		}

		if (Object.keys(beforeGuards).length) {
			await startActiveSpan('beforeGuardHooks', {}, undefined, async () => {
				const guards: Promise<void>[] = []

				for (const [name, hook] of Object.entries(beforeGuards)) {
					const guardPromise = wrapInSpan(`beforeGuardHook.${name}`, {}, async _subSpan => {
						return hook.bind(this, context, safePayload, safeParams)()
					})
					guards.push(guardPromise)
				}

				await Promise.all(guards)
			})
		}

		const output = await startActiveSpan('functionExecution', {}, undefined, async () => {
			const call = fn.bind(this, context, safePayload, safeParams)
			return call()
		})

		if (!outputPayloadSchema) {
			return output
		}

		return await startActiveSpan('outputValidation', {}, undefined, async span => {
			const validationResult = await validate(outputPayloadSchema, output)
			if (validationResult.success) {
				return validationResult.data as FunctionResultType
			}

			const err = new UnhandledError(StatusCode.InternalServerError, 'output validation failed')
			span.recordException(err)
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: err.message,
			})
			logger.warn({ ...span.spanContext() }, 'output validation failed', err.message)
			throw err
		})
	}
	return wrapped
}
