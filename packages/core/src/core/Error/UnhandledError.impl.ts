import { getErrorMessageForCode } from '../helper/index.js'
import type { CommandErrorResponse, ErrorResponsePayload, TraceId } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import { HandledError } from './HandledError.impl.js'

/**
 * A unhandled error will be thrown if some error response is returned during invoking a service function
 * or when the invocation timed out.
 * This error is not handled by business logic and it is maybe unwanted to expose this error outside.
 *
 * Unhandled error are automatically converted into "500 Internal Server Error" to the outside world.
 */
export class UnhandledError extends Error {
  constructor(
    public errorCode: StatusCode = StatusCode.InternalServerError,
    message?: string,
    public data?: unknown,
    public traceId?: TraceId,
  ) {
    super(message ?? getErrorMessageForCode(errorCode))
    Error.captureStackTrace(this, this.constructor)

    Object.setPrototypeOf(this, UnhandledError.prototype)

    this.name = this.constructor.name
  }

  /**
   * Create a error object from EBMessage error message
   * @param message CommandErrorResponse
   * @returns UnhandledError
   */
  static fromMessage(message: Readonly<CommandErrorResponse>): UnhandledError {
    return new UnhandledError(message.payload.status, message.payload.message, message.payload.data, message.traceId)
  }

  /**
   * Creates a UnhandledError from an input
   *
   * @param err the input
   * @param errorCode the error code
   * @param data optional data
   * @param traceId optional trace id
   * @returns UnhandledError
   */
  static fromError(err: any, errorCode?: StatusCode, data?: unknown, traceId?: TraceId): HandledError {
    let t
    if (err instanceof HandledError || err instanceof UnhandledError) {
      t = err.traceId
    }
    const error = new UnhandledError(errorCode ?? StatusCode.InternalServerError, err.message, data, traceId ?? t)
    error.stack = err.stack
    error.cause = err.cause
    return error
  }

  /**
   * Create a handled error from unhandled error
   * @returns HandledError
   */
  intoHandledError(): HandledError {
    return new HandledError(this.errorCode, this.message, this.data, this.traceId)
  }

  /**
   * Returns error response object
   * @returns ErrorResponsePayload
   */
  getErrorResponse() {
    const errorResponse: Readonly<ErrorResponsePayload> = Object.freeze({
      status: this.errorCode,
      message: this.message,
      data: this.data,
      traceId: this.traceId,
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
