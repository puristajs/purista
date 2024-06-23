import { getErrorMessageForCode } from '../helper/index.js'
import type { CommandErrorResponse, ErrorResponsePayload, TraceId } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import { UnhandledError } from './UnhandledError.impl.js'

/**
 * A handled error is an error which is handled or thrown by business logic.
 * It is wanted to expose it the outside world.
 * Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.
 */
export class HandledError extends Error {
	constructor(
		public errorCode: StatusCode,
		message?: string,
		public data?: unknown,
		public traceId?: TraceId,
	) {
		/* Calling the constructor of the parent class (Error) and passing the message. */
		super(message ?? getErrorMessageForCode(errorCode))
		Error.captureStackTrace(this, this.constructor)

		Object.setPrototypeOf(this, HandledError.prototype)
		this.name = this.constructor.name
	}

	/**
	 * Create a error object from EBMessage error message
	 * @param message CommandErrorResponse
	 * @returns HandledError
	 */
	static fromMessage(message: Readonly<CommandErrorResponse>): HandledError {
		return new HandledError(message.payload.status, message.payload.message, message.payload.data, message.traceId)
	}

	/**
	 * Creates a HandledError from an input.
	 * If the input error is a HandledError it will be returned without modifications.
	 *
	 * @param err the input
	 * @param errorCode the error code
	 * @param data optional data
	 * @param traceId optional trace id
	 * @returns HandledError
	 */
	static fromError(err: any, errorCode?: StatusCode, data?: unknown, traceId?: TraceId): HandledError {
		if (err instanceof HandledError) {
			return err
		}

		let t: string | undefined
		if (err instanceof HandledError || err instanceof UnhandledError) {
			t = err.traceId
		}

		const error = new HandledError(errorCode ?? StatusCode.InternalServerError, err.message, data, traceId ?? t)
		error.stack = err.stack
		error.cause = err.cause
		return error
	}

	/**
	 * Returns error response object
	 * @returns ErrorResponsePayload
	 */
	getErrorResponse(traceId?: TraceId) {
		const errorResponse: Readonly<ErrorResponsePayload> = Object.freeze({
			status: this.errorCode,
			message: this.message,
			data: this.data,
			traceId: this.traceId ?? traceId,
		})

		return errorResponse
	}

	/**
	 * Returns stringified error response object
	 * @returns ErrorResponse as string
	 */
	toString() {
		return JSON.stringify(this.getErrorResponse())
	}

	toJSON() {
		return { stack: this.stack, name: this.name, ...this.getErrorResponse() }
	}
}
