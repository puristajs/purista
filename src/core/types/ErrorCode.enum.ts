import { constants } from 'http2'

export enum ErrorCode {
  BadRequest = constants.HTTP_STATUS_BAD_REQUEST,
  Conflict = constants.HTTP_STATUS_CONFLICT,
  Unauthorized = constants.HTTP_STATUS_UNAUTHORIZED,
  PaymentRequired = constants.HTTP_STATUS_PAYMENT_REQUIRED,
  Forbidden = constants.HTTP_STATUS_FORBIDDEN,
  NotFound = constants.HTTP_STATUS_NOT_FOUND,
  MethodNotAllowed = constants.HTTP_STATUS_METHOD_NOT_ALLOWED,
  InternalServerError = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
  NotImplemented = constants.HTTP_STATUS_NOT_IMPLEMENTED,
  Timeout = constants.HTTP_STATUS_GATEWAY_TIMEOUT,
}
