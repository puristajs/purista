import { HandledError, StatusCode } from '@purista/core'

import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { calculateInputSchema, calculateOutputSchema } from './schema.js'

const safeExpressionRegex = /^[\d+\-*/().\s]+$/

const evaluateExpression = (expression: string): number => {
	if (!safeExpressionRegex.test(expression)) {
		throw new HandledError(StatusCode.BadRequest, 'Expression contains unsupported characters')
	}
	const normalized = expression.trim()
	if (!normalized) {
		throw new HandledError(StatusCode.BadRequest, 'Expression must not be empty')
	}
	const evaluator = new Function(`return (${normalized})`)
	const value = evaluator()
	if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
		throw new HandledError(StatusCode.BadRequest, 'Expression did not produce a finite number')
	}
	return value
}

export const calculateCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('calculate', 'Evaluates a simple arithmetic expression and returns a numeric result')
	.addPayloadSchema(calculateInputSchema)
	.addOutputSchema(calculateOutputSchema)
	.setCommandFunction(async function (context, payload) {
		const result = evaluateExpression(payload.expression)
		context.logger.info({ expression: payload.expression, result }, 'Calculated expression')
		return {
			expression: payload.expression,
			result,
		}
	})
