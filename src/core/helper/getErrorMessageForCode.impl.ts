import { ErrorCode } from '../types'

export const getErrorMessageForCode = (code: ErrorCode): string => {
  switch (code) {
    case ErrorCode.BadRequest:
      return 'Bad Request'
    case ErrorCode.Unauthorized:
      return 'Unauthorized'
    case ErrorCode.PaymentRequired:
      return 'Payment Required'
    case ErrorCode.Forbidden:
      return 'Forbidden'
    case ErrorCode.NotFound:
      return 'Not Found'
    case ErrorCode.MethodNotAllowed:
      return 'Method Not Allowed'
    case ErrorCode.InternalServerError:
      return 'Internal Server Error'
    case ErrorCode.NotImplemented:
      return 'Not Implemented'
    case ErrorCode.Timeout:
      return 'Timeout'
    default:
      return 'Unspecified Error'
  }
}
