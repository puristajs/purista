import { getErrorMessageForCode } from './helper'
import type { CommandErrorResponse, ErrorResponse, StatusCode, TraceId } from './types'

/**
 * A handled error is an error which is handled or thrown by business logic.
 * It is wanted to expose it the outside world.
 * Scenarios are input validation failures or "404 Not Found" errors which should be returned to the caller.
 */
export class HandledError extends Error {
  constructor(public errorCode: StatusCode, message?: string, public data?: unknown, public traceId?: TraceId) {
    super(message || getErrorMessageForCode(errorCode))
  }

  /**
   * Create a error object from EBMessage error message
   * @param message CommandErrorResponse
   * @returns HandledError
   */
  static fromMessage(message: Readonly<CommandErrorResponse>): HandledError {
    return new HandledError(message.response.status, message.response.message, message.response.data, message.traceId)
  }

  /**
   * Returns error response object
   * @returns ErrorResponse
   */
  getErrorResponse() {
    const errorResponse: Readonly<ErrorResponse> = Object.freeze({
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
}
