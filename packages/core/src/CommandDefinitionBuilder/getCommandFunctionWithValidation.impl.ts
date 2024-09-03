import { SpanStatusCode } from '@opentelemetry/api'
import { type Schema, validate } from '@typeschema/main'

import type { CommandBeforeGuardHook, CommandFunction, CommandFunctionContext, Service } from '../core/index.js'
import { HandledError, StatusCode, UnhandledError } from '../core/index.js'

export const getCommandFunctionWithValidation = function <S extends Service>(
	fn: CommandFunction<S, any, any, any, any, any, any, any, any>,
	inputPayloadSchema: Schema | undefined,
	inputParameterSchema: Schema | undefined,
	outputPayloadSchema: Schema | undefined,
	beforeGuards: Record<string, CommandBeforeGuardHook<S, any, any, any, any, any, any, any>>,
) {
	const wrapped = async function (
		this: S,
		context: CommandFunctionContext<unknown, unknown>,
		payload: unknown,
		parameter: unknown,
	): Promise<unknown> {
		const { logger, startActiveSpan, wrapInSpan } = context

		const getPayloadValue = async (): Promise<any> => {
			if (!inputPayloadSchema) {
				return payload
			}

			return startActiveSpan('validatePayload', {}, undefined, async span => {
				const validationResult = await validate(inputPayloadSchema, payload)
				if (validationResult.success) {
					return validationResult.data
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

		const getParameterValue = async (): Promise<any> => {
			if (!inputParameterSchema) {
				return parameter
			}
			return startActiveSpan('validateParameter', {}, undefined, async span => {
				const validationResult = await validate(inputParameterSchema, parameter)
				if (validationResult.success) {
					return validationResult.data
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

		const [safePayload, safeParams] = await Promise.all([getPayloadValue(), getParameterValue()])

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
				return validationResult.data
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
